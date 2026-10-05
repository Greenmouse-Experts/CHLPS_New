import Header from "@/features/components/header";
import AboutHeroSection from "@/features/about/components/about_hero_section";
import MembershipLevelsSection from "@/features/membership/components/membership_levels_section";
import MembershipBenefitsSection from "@/features/membership/components/membership_benefits_section";
import WhoShouldJoinSection from "@/features/membership/components/who_should_join_section";
import LeadershipDevelopmentSection from "@/features/membership/components/leadership_development_section";
import Footer from "@/features/components/footer";
import { Assets } from "@/lib/assets";

const MembershipPage = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <AboutHeroSection
        showDefault
        padding={true}
        badge="Membership"
        notUppercase
        title="A professional home for every stage"
        accent="of loss prevention."
        body="Membership with ChLPS-Canada connects you to a professional community committed to advancing excellence in Loss Prevention. Through professional recognition, continuous development, industry engagement, knowledge sharing, networking, and access to valuable resources, members strengthen their expertise, enhance professional credibility, expand career opportunities, build meaningful relationships, and contribute to shaping the future of the Loss Prevention profession."
        image={Assets.images.heroBg1}
        imageAlt="CHLPS Canada professionals standing together"
        imageClassName="object-cover object-[right_center]"
        titleWidth="730px"
        bodyWidth="450px"
        fixedHeight
        cta={{ label: "Become a Member", href: "/dashboard/register" }}
      />
      <MembershipLevelsSection />
      <MembershipBenefitsSection />
      <WhoShouldJoinSection />
      <LeadershipDevelopmentSection />
      <Footer />
    </div>
  );
};

export default MembershipPage;
