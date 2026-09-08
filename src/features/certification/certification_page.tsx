import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import CertificationHeroSection from "@/features/certification/components/certification_hero_section";
import CertificationPathwaySection from "@/features/certification/components/certification_pathway_section";
import CertificationMattersSection from "@/features/certification/components/certification_matters_section";
import CertificationSupportSection from "@/features/certification/components/certification_support_section";
import CertificationBenefitsSection from "@/features/certification/components/certification_benefits_section";

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-[#F7F6FC]">
      <Header />
      <CertificationHeroSection />
      <CertificationPathwaySection />
      <CertificationMattersSection />
      <CertificationSupportSection />
      <CertificationBenefitsSection />
      <Footer />
    </div>
  );
}
