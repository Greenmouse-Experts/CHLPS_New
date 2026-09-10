import Header from "@/features/components/header";
import AboutHeroSection from "@/features/about/components/about_hero_section";
import MembershipGradeCard from "@/features/membership/components/membership_grade_card";
import MembershipHelpSection from "@/features/membership/components/membership_help_section";
import MembershipRequirementsSection from "@/features/membership/components/membership_requirements_section";
import MembershipJobsSection from "@/features/membership/components/membership_jobs_section";
import MembershipJoinNowSection from "@/features/membership/components/membership_join_now_section";
import MembershipCareerPathwaysSection from "@/features/membership/components/membership_career_pathways_section";
import Footer from "@/features/components/footer";
import type { MembershipType } from "@/features/membership/membership_types";

type MembershipTypePageProps = {
  membership: MembershipType;
};

export default function MembershipTypePage({
  membership,
}: MembershipTypePageProps) {
  const titleBreak = membership.title.lastIndexOf(" ");
  const titleLead =
    titleBreak === -1 ? membership.title : membership.title.slice(0, titleBreak);
  const titleAccent =
    titleBreak === -1 ? undefined : membership.title.slice(titleBreak + 1);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <AboutHeroSection
        title={titleLead}
        accent={titleAccent}
        body={membership.heroBody}
        image={"/assets/images/dd.png"}
        imageAlt="CHLPS Canada professionals standing together"
        imageClassName="object-cover object-[right_center]"
        titleWidth="730px"
        bodyWidth="450px"
        cta={{ label: "Become a Member", href: "/dashboard/register" }}
      >
        <MembershipGradeCard
          badge={membership.badge}
          badgeAlt={`${membership.gradeTitle} badge`}
          title={membership.gradeTitle}
          body={membership.gradeBody}
          cropLogo={membership.cropLogo}
          indicatorColor={membership.indicatorColor}
        />
      </AboutHeroSection>
      <MembershipHelpSection {...membership.help} />
      <MembershipRequirementsSection columns={membership.requirements} />
      <MembershipJobsSection {...membership.jobs} />
      <MembershipJoinNowSection {...membership.joinNow} />
      <MembershipCareerPathwaysSection
        gradeTitle={membership.gradeTitle}
        items={membership.careerPathways}
      />
      <Footer />
    </div>
  );
}
