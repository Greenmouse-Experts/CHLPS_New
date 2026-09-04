import Header from "@/features/components/header";
import AboutHeroSection from "@/features/about/components/about_hero_section";
import OurStorySection from "@/features/about/components/our_story_section";
import MissionVisionSection from "@/features/about/components/mission_vision_section";
import WhyChooseSection from "@/features/about/components/why_choose_section";
import Footer from "@/features/components/footer";
import CoreValuesSection from "../home/components/core_values_section";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <AboutHeroSection />
      <OurStorySection />
      <MissionVisionSection />
      <CoreValuesSection />
      <WhyChooseSection />
      <Footer />
    </div>
  );
};

export default AboutPage;
