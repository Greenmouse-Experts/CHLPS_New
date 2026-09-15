import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import CertificationDetailsHeroSection from "@/features/certification/components/certification_details_hero_section";
import CertificationDetailsEnrollSection from "@/features/certification/components/certification_details_enroll_section";
import CertificationDetailsRequirementsSection from "@/features/certification/components/certification_details_requirements_section";
import CertificationDetailsStudiesSection from "@/features/certification/components/certification_details_studies_section";
import CertificationDetailsOutcomeSection from "@/features/certification/components/certification_details_outcome_section";
import CertificationDetailsBenefitsListSection from "@/features/certification/components/certification_details_benefits_list_section";
import type { CertificationDetail } from "@/features/certification/certification_details";

export default function CertificationDetailsPage({
  detail,
}: {
  detail: CertificationDetail;
}) {
  return (
    <div className="min-h-screen bg-[#EDECF2]">
      <Header />
      <CertificationDetailsHeroSection detail={detail} />
      <CertificationDetailsEnrollSection detail={detail} />
      <CertificationDetailsRequirementsSection detail={detail} />
      <CertificationDetailsStudiesSection detail={detail} />
      <CertificationDetailsOutcomeSection detail={detail} />
      <CertificationDetailsBenefitsListSection detail={detail} />
      <Footer />
    </div>
  );
}
