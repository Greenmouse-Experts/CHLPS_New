import type { Metadata } from "next";
import FaqPage from "@/features/faq/faq_page";
import { fetchPublishedFaqs } from "@/features/faq/services/faq_service";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Find quick answers about ChLPS Canada membership, certification, learning, events and your account.",
};

export default async function Faqs() {
  const initialFaqs = await fetchPublishedFaqs().catch(() => []);
  return <FaqPage initialFaqs={initialFaqs} />;
}
