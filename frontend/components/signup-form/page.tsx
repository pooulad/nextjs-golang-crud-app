"use client";

import axios from "axios";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { siteConfig } from "../../config/site";
import {
  ToastErrorMessage,
  ToastSuccessMessage,
} from "../../utils/ToastGenerator";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  type Inputs = {
    name: string;
    username: string;
    password: string;
    date: string;
    country: string;
    city: string;
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    axios
      .post(`${siteConfig.localApi}/user`, data)
      .then((res) => {
        if (res.status === 200) {
          ToastSuccessMessage(res.data.message);
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      })
      .catch((err) => {
        ToastErrorMessage(
          err + " Error happend. maybe username or email is duplicate..."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <main className={`flex min-h-screen flex-col items-center p-4 mt-40`}>
      {loading ? (
        <>
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
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
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className={`shadow appearance-none border ${
                    errors.email && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs italic">
                    Please choose a email.
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className={`shadow appearance-none border ${
                    errors.name && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  id="name"
                  type="text"
                  placeholder="Name"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic">
                    Please choose a name.
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="city"
                >
                  City
                </label>
                <input
                  className={`shadow appearance-none border ${
                    errors.city && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  id="city"
                  type="text"
                  placeholder="City"
                  {...register("city", { required: true })}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs italic">
                    Please choose a city.
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="country"
                >
                  Country
                </label>
                <input
                  className={`shadow appearance-none border ${
                    errors.country && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  id="country"
                  type="text"
                  placeholder="Country"
                  {...register("country", { required: true })}
                />
                {errors.country && (
                  <p className="text-red-500 text-xs italic">
                    Please choose a country.
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="date"
                >
                  Date
                </label>
                <input
                  className={`shadow appearance-none border ${
                    errors.date && "border-red-500"
                  } rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
                  id="date"
                  type="date"
                  placeholder="Date"
                  {...register("date", { required: true })}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs italic">
                    Please choose a date.
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
                  Sign Up
                </button>
              </div>
            </form>
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/auth/signin"
                className="hover:text-brand underline underline-offset-4"
              >
                Do you have an account? Sign In
              </Link>
            </p>
          </div>
        </>
      )}
    </main>
  );
}
