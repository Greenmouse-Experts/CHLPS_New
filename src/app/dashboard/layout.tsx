import type { Metadata } from "next";
import AppShell from "@/lib/providers/AppShell";

export const metadata: Metadata = {
  title: "Member portal",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
