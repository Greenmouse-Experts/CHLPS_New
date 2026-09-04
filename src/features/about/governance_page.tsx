import Header from "@/features/components/header";
import AboutHeroSection from "@/features/about/components/about_hero_section";
import HowWeAreGovernedSection from "@/features/about/components/how_we_are_governed_section";
import GovernanceStructureSection from "@/features/about/components/governance_structure_section";
import LeadershipSection from "@/features/about/components/leadership_section";
import Footer from "@/features/components/footer";

const GovernancePage = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <AboutHeroSection
        badge="Our Governance"
        title="Leadership built on"
        accent="standards & service."
        body="ChLPS Canada is led by its Board and Management Team, providing strategic oversight and effective operations."
        bodyWidth="max-w-[30rem]"
      />
      <HowWeAreGovernedSection />
      <GovernanceStructureSection />
      <LeadershipSection />
      <Footer />
    </div>
  );
};

export default GovernancePage;
