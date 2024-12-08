"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ReactLoading from "react-loading";

export default function SignInForm() {
  const [loading, setLoading] = useState(false);

  type Inputs = {
    username: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const searchParams = useSearchParams();

  const onSubmit: SubmitHandler<Inputs> = async (data, e) => {
    e?.preventDefault();
    setLoading(true);
    const signInResult = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: true,
      callbackUrl: searchParams?.get("from") || "/dashboard",
    });
    setLoading(false);
  };
  return (
    <main className={`flex min-h-screen flex-col items-center p-4`}>
      {loading ? (
        <>
          <ReactLoading
            type={"bars"}
            color={"red"}
            height={200}
            width={200}
            className="flex flex-row min-h-screen justify-center items-center"
          />
        </>
      ) : (
        <>
          <div className="w-full max-w-xs">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className={`shadow appearance-none border ${
                    errors.username && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  id="username"
                  type="text"
                  placeholder="Username"
                  {...register("username", { required: true, min: 3 })}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs italic">
                    Please choose a username.
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className={`shadow appearance-none border ${
                    errors.password && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  id="password"
                  type="password"
                  placeholder="******************"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs italic">
                    Please choose a password.
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
            </form>
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/auth/signup"
                className="hover:text-brand underline underline-offset-4"
              >
                Don&apos;t have an account? Sign Up
              </Link>
            </p>
          </div>
        </>
      )}
    </main>
  );
}
