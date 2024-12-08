import React from "react";
import { getCurrentUser } from "../../lib/session";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user?.token) {
    redirect(authOptions?.pages?.signIn || "/auth/signin");
  }
  return (
    <div>{children}</div>
  );
}
