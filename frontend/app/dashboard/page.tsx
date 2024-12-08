import React from "react";
import { getCurrentUser } from "../../lib/session";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import Link from "next/link";
import { siteConfig } from "../../config/site";

export const metadata = {
  title: "Dashboard",
  description: "Show list of all users in DB",
};

async function getUsers(): Promise<any | null> {
  try {
    const response = await fetch(`${siteConfig.localApi}/users`, {
      next: {
        revalidate: 60,
      },
    });

    // if (!response?.ok) {
    //   return null;
    // }

    const json = await response.json();

    console.log(json);
    return json;
  } catch (error) {
    return null;
  }
}

export default async function DashboardPage() {
  const users = await getUsers();
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/auth/signin");
  }
  return (
    <main className={`flex min-h-screen flex-col items-center p-4`}>
      <h1 className="mb-3">All Users</h1>
      <div className="w-full">
        <Link
          className="bg-teal-500 flex text-white font-bold flex-row p-3 mt-2 mb-2 rounded-lg w-40 text-center justify-center"
          href="/auth/signup"
          passHref
        >
          Add User
        </Link>
      </div>
      <div className="w-full grid grid-cols-1 gap-2 md:grid-cols-2">
        {users?.data?.items?.map((item: any) => {
          return (
            <li
              key={item.id}
              className="w-full mx-auto p-10 bg-teal-500 text-white rounded-md"
            >
              user email : {item.email}
            </li>
          );
        })}
      </div>
    </main>
  );
}
