import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import CareerHeroSection from "@/features/careers/components/career_hero_section";
import CareerSearchSection from "@/features/careers/components/career_search_section";
import CareerPathsSection from "@/features/careers/components/career_paths_section";
import ProfessionalDevelopmentSection from "@/features/careers/components/professional_development_section";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CareerHeroSection />
      <CareerSearchSection />
      <CareerPathsSection />
      <ProfessionalDevelopmentSection />
      <Footer />
    </div>
  );
}
