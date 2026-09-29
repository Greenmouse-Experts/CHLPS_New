import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import FaqListSection from "@/features/faq/components/faq_list_section";
import type { PublicFaq } from "@/features/faq/faq_data";

export default function FaqPage({
  initialFaqs,
}: {
  initialFaqs?: PublicFaq[];
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <Header />
      <main className="py-6 sm:py-8">
        <FaqListSection initialFaqs={initialFaqs} />
      </main>
      <Footer />
    </div>
  );
}
