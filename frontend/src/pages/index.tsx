import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [state, setState] = useState<any>([]);
  const getData = () => {
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => {
        setState(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log("i am:", state);
  useEffect(() => {
    getData();
  }, []);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="w-50 p-10 bg-sky-600 text-white rounded-md">
        {state?.data?.items?.map((item: any) => {
          return <li>{item.email}</li>;
        })}
      </div>
    </main>
  );
}
