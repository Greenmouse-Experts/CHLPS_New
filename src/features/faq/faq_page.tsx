import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import FaqHeroSection from "@/features/faq/components/faq_hero_section";
import FaqListSection from "@/features/faq/components/faq_list_section";

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <FaqHeroSection />
      <FaqListSection />
      <Footer />
    </div>
  );
}
