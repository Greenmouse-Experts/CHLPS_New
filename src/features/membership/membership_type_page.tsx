"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { orderService } from "@/features/orders/services/order_service";
import { useAppSelector } from "@/lib/store/store";
import { PaypalPaymentModal } from "@/features/orders";

type MembershipTypePageProps = {
  membership?: MembershipType;
  slug: string;
};

export default function MembershipTypePage({
  membership,
  slug,
}: MembershipTypePageProps) {
  const router = useRouter();
  const token = useAppSelector((state) => state.user.token);

  // Payment modal and screening state
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isCheckingApplication, setIsCheckingApplication] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

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
    staleTime: 0,
    refetchOnMount: "always",
  });

  const handleApplyClick = async (current: MembershipType) => {
    if (!current) return;

    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname
        : `/membership/${slug}`;

    if (!token) {
      router.push(
        `/dashboard/sign-in?redirect=${encodeURIComponent(currentPath)}`,
      );
      return;
    }

    const targetMembershipId = current.membershipId;
    const targetSlug = current.slug || slug;
    const appQuestions = current.applicationQuestions ?? [];

    // If membership does not define questionnaire questions, proceed to payment directly
    if (appQuestions.length === 0) {
      setIsStripeModalOpen(true);
      return;
    }

    // Has questionnaire questions: check if user already submitted application
    if (targetMembershipId) {
      setIsCheckingApplication(true);
      try {
        const appRes =
          await orderService.fetchMyMembershipApplication(targetMembershipId);
        if (appRes.success && appRes.data?.id) {
          setApplicationId(appRes.data.id);
          setIsStripeModalOpen(true);
        } else {
          router.push(`/membership/${targetSlug}/questions`);
        }
      } catch {
        router.push(`/membership/${targetSlug}/questions`);
      } finally {
        setIsCheckingApplication(false);
      }
    } else {
      router.push(`/membership/${targetSlug}/questions`);
    }
  };

  const membershipsForModal = useMemo(
    () =>
      query.data?.membershipId
        ? [
            {
              id: query.data.membershipId,
              price: query.data.price ?? 0,
              applicationId: applicationId ?? undefined,
            },
          ]
        : [],
    [query.data?.membershipId, query.data?.price, applicationId],
  );

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
            <p className="mt-2  ">
              The requested membership category is currently unavailable.
            </p>
            <Link
              href="/membership"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5  font-semibold text-white hover:opacity-90"
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

          const ctaLabel = isCheckingApplication
            ? "Checking Eligibility..."
            : current.price
              ? `Become a Member — ${current.currency || "CAD"} $${current.price.toLocaleString()}`
              : "Become a Member";

          return (
            <>
              <AboutHeroSection
                badge="Membership"
                title={titleLead}
                accent={titleAccent}
                body={current.bannerText || ""}
                image={current.banner || "/assets/images/dd.png"}
                imageAlt={`${current.title} banner`}
                imageClassName="object-cover object-[right_center]"
                titleWidth="730px"
                bodyWidth="450px"
                cta={{
                  label: ctaLabel,
                  onClick: () => handleApplyClick(current),
                }}
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
                  onApply={() => handleApplyClick(current)}
                  isApplying={isCheckingApplication}
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
                  slug={current.slug || slug}
                  onApply={() => handleApplyClick(current)}
                />
              ) : null}

              {current.careerPathways && current.careerPathways.length > 0 ? (
                <MembershipCareerPathwaysSection
                  gradeTitle={current.gradeTitle}
                  items={current.careerPathways}
                />
              ) : null}

              {/* PayPal Payment Modal */}
              {isStripeModalOpen && current.membershipId && (
                <PaypalPaymentModal
                  isOpen={isStripeModalOpen}
                  onClose={() => setIsStripeModalOpen(false)}
                  title={`Join ${current.gradeTitle || current.title}`}
                  memberships={membershipsForModal}
                  estimatedAmount={current.price ?? 0}
                  onSuccess={() => {
                    setIsStripeModalOpen(false);
                    router.push("/dashboard/purchase-history?payment=success");
                  }}
                />
              )}
            </>
          );
        }}
      </QueryCompLayout>
      <Footer />
    </div>
  );
}
