"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Navbar() {
  const router = useRouter();
  const [tokenAccess, setTokenAccess] = useState<string | null>("");
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      let token = localStorage.getItem("token");
      setTokenAccess(token);
    }
  }, []);
  const logoutHandler = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("token");
      setTokenAccess(null);
      router.push("/login");
    }
  };
  return (
    <nav className="flex flex-row items-center justify-between bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link href="/" className="font-semibold text-xl tracking-tight">
          👨‍💻 Pooulad
        </Link>
      </div>
      <div className="w-full flex items-center flex-row justify-end align-middle">
        <div>
          {tokenAccess? (
            <button
              onClick={logoutHandler}
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
