"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import CertificationDetailsHeroSection from "@/features/certification/components/certification_details_hero_section";
import CertificationDetailsEnrollSection from "@/features/certification/components/certification_details_enroll_section";
import CertificationDetailsRequirementsSection from "@/features/certification/components/certification_details_requirements_section";
import CertificationDetailsStudiesSection from "@/features/certification/components/certification_details_studies_section";
import CertificationDetailsOutcomeSection from "@/features/certification/components/certification_details_outcome_section";
import CertificationDetailsBenefitsListSection from "@/features/certification/components/certification_details_benefits_list_section";
import Curriculum from "@/components/Curriculum";
import type { CertificationDetail } from "@/features/certification/certification_details";
import { fetchProgramById } from "@/features/certification/services/certification_service";
import QueryCompLayout from "@/components/QueryCompLayout";
import { useAppSelector } from "@/lib/store/store";
import { StripePaymentModal } from "@/features/orders";
import { orderService } from "@/features/orders/services/order_service";

type CertificationDetailsPageProps = {
  detail?: CertificationDetail | null;
  id?: string;
};

export default function CertificationDetailsPage({
  detail: initialDetail,
  id,
}: CertificationDetailsPageProps) {
  const router = useRouter();
  const token = useAppSelector((state) => state.user.token);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(false);
  const [applicationId, setApplicationId] = useState<string | undefined>(
    undefined,
  );

  const query = useQuery({
    queryKey: ["public-program", id],
    queryFn: async () => {
      if (!id) return initialDetail ?? null;
      const data = await fetchProgramById(id);
      return data;
    },
    initialData: initialDetail ?? undefined,
    staleTime: 0,
    refetchOnMount: "always",
    enabled: Boolean(id),
  });

  const detail = query.data ?? initialDetail;

  const handleEnrollClick = async () => {
    if (!detail) return;

    if (!token) {
      const currentPath =
        typeof window !== "undefined"
          ? window.location.pathname
          : `/certification/${id || ""}`;
      router.push(
        `/dashboard/sign-in?redirect=${encodeURIComponent(currentPath)}`,
      );
      return;
    }

    if (!detail.courseId) {
      router.push(detail.enrollHref);
      return;
    }

    const appQuestions = detail.applicationQuestions ?? [];
    // If course has no questionnaire/assessment questions, open payment modal directly
    if (appQuestions.length === 0) {
      setIsStripeModalOpen(true);
      return;
    }

    // Course has assessment questions -> check attempts
    setIsCheckingEnrollment(true);
    try {
      const appRes = await orderService.fetchMyCourseApplication(
        detail.courseId,
      );
      if (appRes.success && appRes.data?.id) {
        // Completed attempt exists -> load payment modal with applicationId
        setApplicationId(appRes.data.id);
        setIsStripeModalOpen(true);
      } else {
        // No attempts or not completed -> go to assessment page
        router.push(`/certification/${id || detail.id}/assessment`);
      }
    } catch {
      router.push(`/certification/${id || detail.id}/assessment`);
    } finally {
      setIsCheckingEnrollment(false);
    }
  };

  const coursesForModal = useMemo(
    () =>
      detail?.courseId
        ? [
            {
              id: detail.courseId,
              price: detail.price ?? 0,
              applicationId,
            },
          ]
        : [],
    [detail?.courseId, detail?.price, applicationId],
  );

  return (
    <div className="min-h-screen bg-[#EDECF2]">
      <Header />
      <QueryCompLayout
        query={query}
        loadingText="Loading certification program..."
        emptyState={
          <div className="mx-auto my-24 max-w-xl rounded-2xl border border-dashed border-[#D2CEDF] bg-white p-12 text-center">
            <h2 className="text-xl font-bold text-[#0A1542]">
              Program Not Found
            </h2>
            <p className="mt-2  text-[#6F6E7A]">
              The requested certification program could not be found or is
              currently unavailable.
            </p>
            <Link
              href="/certification"
              className="mt-6 inline-block rounded-full bg-[#0A1542] px-6 py-2.5  font-semibold text-white transition hover:bg-[#152366]"
            >
              Back to All Programs
            </Link>
          </div>
        }
      >
        {detail && (
          <>
            <CertificationDetailsHeroSection
              detail={detail}
              onEnroll={handleEnrollClick}
            />
            <CertificationDetailsEnrollSection
              detail={detail}
              onEnroll={handleEnrollClick}
            />
            <CertificationDetailsRequirementsSection detail={detail} />
            <Curriculum id={detail.courseId || id || detail.id} />
            <CertificationDetailsStudiesSection detail={detail} />
            <CertificationDetailsOutcomeSection detail={detail} />
            <CertificationDetailsBenefitsListSection detail={detail} />

            {/* Direct Stripe Enrollment Modal */}
            {isStripeModalOpen && detail.courseId && (
              <StripePaymentModal
                isOpen={isStripeModalOpen}
                onClose={() => setIsStripeModalOpen(false)}
                title={`Enroll in ${detail.heroTitle.replace(/\n/g, " ")}`}
                courses={coursesForModal}
                estimatedAmount={detail.price ?? 0}
                onSuccess={() => {
                  setIsStripeModalOpen(false);
                  router.push("/dashboard/courses?payment=success");
                }}
              />
            )}
          </>
        )}
      </QueryCompLayout>
      <Footer />
    </div>
  );
}
