import Header from "@/features/components/header";
import HeroSection from "@/features/home/components/hero_section";
import WhyJoinChlpsSection from "@/features/home/components/why_join_chlps_section";
import NeedForLossPreventionSection from "@/features/home/components/need_for_loss_prevention_section";
import AtAGlanceSection from "@/features/home/components/at_a_glance_section";
import WhyJoinSection from "@/features/home/components/why_join_section";
import CareerPathwaysSection from "@/features/home/components/career_pathways_section";
import MembershipCategoriesSection from "@/features/home/components/membership_categories_section";
import WhatOurMembersSaySection from "@/features/home/components/what_our_members_say_section";
import CertificationSection from "@/features/home/components/certification_section";
import CoreValuesSection from "@/features/home/components/core_values_section";
import PartnersSection from "@/features/home/components/partners_section";
import UpcomingEventsSection from "@/features/home/components/upcoming_events_section";
import Footer from "@/features/components/footer";
import OurCoreValuesSection from "./components/our_core_values_section";
import HomeFaqSection from "./components/home_faq_section";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <HeroSection />
      <WhyJoinChlpsSection />
      <NeedForLossPreventionSection />
      {/*<AtAGlanceSection />*/}
      {/*<WhyJoinSection />*/}
      <CareerPathwaysSection />
      <MembershipCategoriesSection />
      <WhatOurMembersSaySection />
      <CertificationSection />
      <OurCoreValuesSection />
      <UpcomingEventsSection />
      <HomeFaqSection />
      <PartnersSection />
      <Footer />
    </div>
  );
};

export default HomePage;
