import type { Metadata } from "next";
import PoliciesPage from "@/features/policies/policies_page";

export const metadata: Metadata = {
  title: "Policies & Professional Standards",
  description:
    "Review ChLPS Canada's Terms & Conditions, Privacy Policy, Cookies Policy, and Practice Standards & Code of Ethics.",
};

export default function Policies() {
  return <PoliciesPage />;
}
