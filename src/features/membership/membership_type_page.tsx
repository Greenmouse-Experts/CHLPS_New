"use client";

import { useQuery } from "@tanstack/react-query";
import Header from "@/features/components/header";
import AboutHeroSection from "@/features/about/components/about_hero_section";
import MembershipGradeCard from "@/features/membership/components/membership_grade_card";
import MembershipHelpSection from "@/features/membership/components/membership_help_section";
import MembershipRequirementsSection from "@/features/membership/components/membership_requirements_section";
import MembershipJobsSection from "@/features/membership/components/membership_jobs_section";
import MembershipJoinNowSection from "@/features/membership/components/membership_join_now_section";
import MembershipQuestionsSection from "@/features/membership/components/membership_questions_section";
import MembershipCareerPathwaysSection from "@/features/membership/components/membership_career_pathways_section";
import Footer from "@/features/components/footer";
import QueryCompLayout from "@/components/QueryCompLayout";
import { fetchPublicMembershipBySlug } from "@/features/membership/services/membership_service";
import {
  transformMembershipApiToType,
  type MembershipType,
} from "@/features/membership/membership_types";
import Link from "next/link";

type MembershipTypePageProps = {
  membership?: MembershipType;
  slug: string;
};

export default function MembershipTypePage({
  membership,
  slug,
}: MembershipTypePageProps) {
  const query = useQuery({
    queryKey: ["public-membership", slug],
    queryFn: async () => {
      const liveData = await fetchPublicMembershipBySlug(slug);
      if (liveData) {
        return transformMembershipApiToType(liveData);
      }
      return null;
    },
    initialData: membership,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <QueryCompLayout
        query={query}
        loadingText="Loading membership details..."
        emptyState={
          <div className="mx-auto my-24 max-w-xl rounded-2xl border border-dashed border-[#D2CEDF] bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-[#0A1542]">
              Membership Not Found
            </h2>
            <p className="mt-2 text-sm text-[#6F6E7A]">
              The requested membership category is currently unavailable.
            </p>
            <Link
              href="/membership"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Explore All Memberships
            </Link>
          </div>
        }
      >
        {(current) => {
          if (!current) return null;

          const titleBreak = current.title.lastIndexOf(" ");
          const titleLead =
            titleBreak === -1
              ? current.title
              : current.title.slice(0, titleBreak);
          const titleAccent =
            titleBreak === -1 ? undefined : current.title.slice(titleBreak + 1);

          const ctaLabel = current.price
            ? `Become a Member — ${current.currency || "CAD"} $${current.price.toLocaleString()}`
            : "Become a Member";

          return (
            <>
              <AboutHeroSection
                title={titleLead}
                accent={titleAccent}
                body={current.heroBody}
                image={"/assets/images/dd.png"}
                imageAlt="CHLPS Canada professionals standing together"
                imageClassName="object-cover object-[right_center]"
                titleWidth="730px"
                bodyWidth="450px"
                cta={{ label: ctaLabel, href: "/dashboard/register" }}
              >
                <MembershipGradeCard
                  badge={current.badge}
                  badgeAlt={`${current.gradeTitle} badge`}
                  title={current.gradeTitle}
                  body={current.gradeBody}
                  cropLogo={current.cropLogo}
                  indicatorColor={current.indicatorColor}
                  price={current.price}
                  currency={current.currency}
                  duration={current.duration}
                  renewalPrice={current.renewalPrice}
                  renewalPeriod={current.renewalPeriod}
                />
              </AboutHeroSection>

              {current.help &&
              current.help.cards &&
              current.help.cards.length > 0 ? (
                <MembershipHelpSection {...current.help} />
              ) : null}

              {current.requirements && current.requirements.length > 0 ? (
                <MembershipRequirementsSection columns={current.requirements} />
              ) : null}

              {current.jobs &&
              current.jobs.cards &&
              current.jobs.cards.length > 0 ? (
                <MembershipJobsSection {...current.jobs} />
              ) : null}

              {current.joinNow ? (
                <MembershipJoinNowSection {...current.joinNow} />
              ) : null}

              {current.applicationQuestions &&
              current.applicationQuestions.length > 0 ? (
                <MembershipQuestionsSection
                  questions={current.applicationQuestions}
                  gradeTitle={current.gradeTitle}
                />
              ) : null}

              {current.careerPathways && current.careerPathways.length > 0 ? (
                <MembershipCareerPathwaysSection
                  gradeTitle={current.gradeTitle}
                  items={current.careerPathways}
                />
              ) : null}
            </>
          );
        }}
      </QueryCompLayout>
      <Footer />
    </div>
  );
}
