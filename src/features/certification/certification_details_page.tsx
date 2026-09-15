"use client";

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
import type { CertificationDetail } from "@/features/certification/certification_details";
import { fetchProgramById } from "@/features/certification/services/certification_service";
import QueryCompLayout from "@/components/QueryCompLayout";

type CertificationDetailsPageProps = {
  detail?: CertificationDetail | null;
  id?: string;
};

export default function CertificationDetailsPage({
  detail: initialDetail,
  id,
}: CertificationDetailsPageProps) {
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
            <p className="mt-2 text-sm text-[#6F6E7A]">
              The requested certification program could not be found or is
              currently unavailable.
            </p>
            <Link
              href="/certification"
              className="mt-6 inline-block rounded-full bg-[#0A1542] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#152366]"
            >
              Back to All Programs
            </Link>
          </div>
        }
      >
        {detail && (
          <>
            <CertificationDetailsHeroSection detail={detail} />
            <CertificationDetailsEnrollSection detail={detail} />
            <CertificationDetailsRequirementsSection detail={detail} />
            <CertificationDetailsStudiesSection detail={detail} />
            <CertificationDetailsOutcomeSection detail={detail} />
            <CertificationDetailsBenefitsListSection detail={detail} />
          </>
        )}
      </QueryCompLayout>
      <Footer />
    </div>
  );
}
