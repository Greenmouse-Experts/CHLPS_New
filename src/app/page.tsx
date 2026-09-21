import HomePage from "@/features/home/home_page";
import { fetchPublishedFaqs } from "@/features/faq/services/faq_service";
import { fetchMemberTestimonials } from "@/features/testimonials/services/testimonial_service";

export const revalidate = 300;

export default async function Home() {
  const [faqs, testimonials] = await Promise.all([
    fetchPublishedFaqs().catch(() => []),
    fetchMemberTestimonials().catch(() => []),
  ]);

  return <HomePage faqs={faqs} testimonials={testimonials} />;
}
