import React from "react";
import { getCurrentUser } from "../../lib/session";
import { redirect } from "next/navigation";
import { authOptions, getSession } from "../../lib/auth";
import Link from "next/link";
import { siteConfig } from "../../config/site";
import SignOutButton from "../../components/signout-button/page";

export const metadata = {
  title: "Dashboard",
  description: "Show list of all users in DB",
};

async function getUsers(): Promise<any | null> {
  const session = await getSession();
  console.log("session", session);

  try {
    const response = await fetch(`${siteConfig.localApi}/users`, {
      next: {
        revalidate: 60,
      },
      headers: {
        Authorization: `Bearer ${session?.user?.token}`,
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
  const user = await getCurrentUser();
  const users = await getUsers();

  return (
    <main className={`flex min-h-screen flex-col items-center p-4`}>
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <nav>
            <SignOutButton
              className={`absolute left-5 top-5 bg-teal-500 hover:bg-teal-700 text-white font-bold rounded-sm min-w-[70px] text-center`}
            />
          </nav>
        </div>
      </header>
      <h1 className="mb-3">All Users</h1>
      <div className="w-full flex flex-row gap-5">
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
