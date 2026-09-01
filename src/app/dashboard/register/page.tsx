import type { Metadata } from "next";
import RegisterPage from "@/features/auth/pages/register_page";

export const metadata: Metadata = {
  title: "Register",
};

export default function Page() {
  return <RegisterPage />;
}
