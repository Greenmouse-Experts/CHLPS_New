"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "./ProtectedRoute";
import { DashboardShell } from "@/components/layout/DashboardLayout";

const AUTH_PATHS = [
  "/dashboard/sign-in",
  "/dashboard/register",
  "/dashboard/verify",
  "/dashboard/reset-password",
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
