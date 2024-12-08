import { Metadata } from "next";
import Link from "next/link";
import SignUpForm from "../../../components/signup-form/page";

export const metadata: Metadata = {
  title: "SignUp",
  description: "Create new account",
};

export default function SignUp() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center flex-1 mx-auto">
      <Link href="/" className="absolute left-5 top-5 bg-teal-500 hover:bg-teal-700 text-white font-bold rounded-sm min-w-[70px] text-center">
        <div>Back</div>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <SignUpForm />
      </div>
    </div>
  );
}
