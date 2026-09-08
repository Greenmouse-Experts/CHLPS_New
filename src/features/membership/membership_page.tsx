import Header from "@/features/components/header";
import AboutHeroSection from "@/features/about/components/about_hero_section";
import MembershipGlanceSection from "@/features/membership/components/membership_glance_section";
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
        badge="Membership"
        title="A professional home for every stage"
        accent="of loss prevention."
        body="Build professional standing through membership, certification and continuous learning."
        image={Assets.images.heroBg1}
        imageAlt="CHLPS Canada professionals standing together"
        imageClassName="object-cover object-[right_center]"
        cta={{ label: "Become a Member", href: "/dashboard/register" }}
      />
      <MembershipGlanceSection />
      <MembershipLevelsSection />
      <MembershipBenefitsSection />
      <WhoShouldJoinSection />
      <LeadershipDevelopmentSection />
      <Footer />
    </div>
  );
};

export default MembershipPage;
