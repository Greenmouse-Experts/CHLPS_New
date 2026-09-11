import type { Metadata } from "next";
import FaqPage from "@/features/faq/faq_page";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Find quick answers about ChLPS Canada membership, certification, learning, events and your account.",
};

export default function Faqs() {
  return <FaqPage />;
}
