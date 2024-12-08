import { Metadata } from "next";
import Link from "next/link";
import SignInForm from "../../../components/signin-form/page";
import { getCurrentUser } from "../../../lib/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign In to your account",
};

export default async function SignIn() {
  const user = await getCurrentUser();

  console.log("user",user);
  

  if (user?.token) {
    redirect("/dashboard");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center flex-1 mx-auto">
      <Link
        href="/"
        className="absolute left-5 top-5 bg-teal-500 hover:bg-teal-700 text-white font-bold rounded-sm min-w-[70px] text-center"
      >
        <div>Back</div>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <SignInForm />
      </div>
    </div>
  );
}
