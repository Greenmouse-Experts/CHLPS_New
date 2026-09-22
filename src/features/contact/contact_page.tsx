import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import ContactHeroSection from "@/features/contact/components/contact_hero_section";
import ContactDetailsSection from "@/features/contact/components/contact_details_section";
import ContactMapSection from "@/features/contact/components/contact_map_section";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ContactHeroSection />
      <ContactDetailsSection />
      <ContactMapSection />
      <Footer />
    </div>
  );
}
