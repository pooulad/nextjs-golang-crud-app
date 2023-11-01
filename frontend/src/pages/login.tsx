"use client";
import axios from "axios";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import configJson from "../config.json";
import { ToastErrorMessage, ToastSuccessMessage } from "@/utils/ToastGenerator";
import ReactLoading from "react-loading";

function LoginPage() {
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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    axios
      .post(`${configJson.localApi}/login`, data)
      .then((res) => {
        if (res.status === 200) {
          ToastSuccessMessage("You logged in");
          localStorage.setItem("token", JSON.stringify(res.data.token));
          setTimeout(() => {
            window.location.replace("/")
          }, 3000);
        }
      })
      .catch((err) => {
        ToastErrorMessage(
          err + " Error happend. maybe username or password is incorrect..."
        );
      })
      .finally(() => {
        setLoading(false);
      });
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
            <p className="text-center text-gray-500 text-xs">
              &copy;2020 Acme Corp. All rights reserved.
            </p>
          </div>
        </>
      )}
    </main>
  );
}

export default LoginPage;
