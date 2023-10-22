import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";

const inter = Inter({ subsets: ["latin"] });

export default function Home({users}:any) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="w-50 p-10 bg-sky-600 text-white rounded-md">
        {users?.data?.items?.map((item: any) => {
          return <li>{item.email}</li>;
        })}
      </div>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // const users = await axios.get("http://localhost:8080/api/users");
  const res = await fetch('http://127.0.0.1:8080/api/users');
  const users = await res.json();
  if (!users)
    return {
      props: {},

      redirect: { destination: "/login" },
    };

  return { props: { users } };
}
