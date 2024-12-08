"use client";

import { signOut } from "next-auth/react";

const SignOutButton = ({ className }: { className: string }) => (
  <button className={className} onClick={() => signOut()}>
    Sign out
  </button>
);

export default SignOutButton;
