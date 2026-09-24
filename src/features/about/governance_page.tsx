import Header from "@/features/components/header";
import AboutHeroSection from "@/features/about/components/about_hero_section";
import HowWeAreGovernedSection from "@/features/about/components/how_we_are_governed_section";
import GovernanceStructureSection from "@/features/about/components/governance_structure_section";
import LeadershipSection from "@/features/about/components/leadership_section";
import Footer from "@/features/components/footer";
import HeaderText from "@/components/HeaderText";

const GovernancePage = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <AboutHeroSection
        fixedHeight
        padding
        image="/assets/images/gov.jpeg"
        badge="Our Governance"
        title="Leadership built on"
        accent="standards & service."
        body="ChLPS Canada is led by its Board and Management Team, providing strategic oversight and effective operations."
        bodyWidth="30rem"
      >
        <div className="space-y-2">
          <HeaderText
            smallSize
            left="our"
            right="governance"
            textWhite
            notCenter
          />
          <h2 className="text-white text-4xl font-semibold">
            Leadership built on <br />
            <span className="text-secondary">Standards & Service</span>
          </h2>
          <p className="text-white text-lg">
            ChLPS Canada is led by its Board and Management Team, providing
            strategic oversight and effective operations.
          </p>
        </div>
      </AboutHeroSection>
      <HowWeAreGovernedSection />
      <GovernanceStructureSection />
      <LeadershipSection />
      <Footer />
    </div>
  );
};

export default GovernancePage;
