import { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          // اگر ورودی خالی است خطا می‌دهیم
          throw new Error("Username and password are required");
        }

        try {
          const res = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          // اگر درخواست ناموفق بود، خطا می‌دهیم
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData?.message || "Invalid credentials");
          }

          const user = await res.json();
          if (user && user.token) {
            return user; // برگشت دادن یوزر به NextAuth
          }

          // در صورتی که توکن نداشته باشد، null برمی‌گرداند
          return null;
        } catch (error) {
          console.error("Authorization error:", error);
          // در صورتی که خطا داشتیم، null برگشت داده می‌شود که باعث جلوگیری از هدایت به صفحه خطا می‌شود
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user }; // اطلاعات کاربر به توکن اضافه می‌شود
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any; // اطلاعات توکن به سشن اضافه می‌شود
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // صفحه لاگین به صورت اختصاصی
    // این بخش را برای جلوگیری از هدایت به صفحه خطا خالی نگه داریم
    error: "/auth/signin",  // به این صورت، در صورت خطا به صفحه لاگین هدایت می‌شود
  },
  debug: true,
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
