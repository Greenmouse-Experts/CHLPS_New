import HomePage from "@/features/home/home_page";
import { fetchPublishedFaqs } from "@/features/faq/services/faq_service";

export const revalidate = 300;

export default async function Home() {
  const faqs = await fetchPublishedFaqs().catch(() => []);
  return <HomePage faqs={faqs} />;
}
