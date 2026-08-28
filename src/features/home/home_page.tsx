import Header from "@/features/components/header";
import HeroSection from "@/features/home/components/hero_section";
import AtAGlanceSection from "@/features/home/components/at_a_glance_section";
import WhyJoinSection from "@/features/home/components/why_join_section";
import CareerPathwaysSection from "@/features/home/components/career_pathways_section";
import MembershipCategoriesSection from "@/features/home/components/membership_categories_section";
import CertificationSection from "@/features/home/components/certification_section";
import Footer from "@/features/components/footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <HeroSection />
      <AtAGlanceSection />
      <WhyJoinSection />
      <CareerPathwaysSection />
      <MembershipCategoriesSection />
      <CertificationSection />
      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
