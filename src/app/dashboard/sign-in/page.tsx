import type { Metadata } from "next";
import SignInPage from "@/features/auth/pages/sign_in_page";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function Page() {
  return <SignInPage />;
}
