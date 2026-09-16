import type { Metadata } from "next";
import CertificationAssessmentPage from "@/features/certification/pages/certification_assessment_page";
import {
  fetchProgramById,
  fetchPublicPrograms,
} from "@/features/certification/services/certification_service";

type CertificationAssessmentPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export async function generateStaticParams() {
  const programs = await fetchPublicPrograms().catch(() => []);
  const paramsList: { id: string }[] = [];
  const seen = new Set<string>();

  for (const p of programs) {
    if (p.id && !seen.has(p.id)) {
      seen.add(p.id);
      paramsList.push({ id: p.id });
    }
    if (p.slug && !seen.has(p.slug)) {
      seen.add(p.slug);
      paramsList.push({ id: p.slug });
    }
  }

  return paramsList;
}

export async function generateMetadata({
  params,
}: CertificationAssessmentPageProps): Promise<Metadata> {
  const { id } = await params;
  const detail = await fetchProgramById(id);

  if (detail) {
    return {
      title: `Assessment – ${detail.cardTitle.replace(/\n/g, " ")} | CHLPS Canada`,
      description: `Eligibility and pre-screening assessment questionnaire for ${detail.heroTitle.replace(/\n/g, " ")}.`,
    };
  }

  return {
    title: "Program Eligibility Assessment | CHLPS Canada",
    description: "Complete pre-enrollment screening questionnaire.",
  };
}

export default async function Page({
  params,
}: CertificationAssessmentPageProps) {
  const { id } = await params;
  return <CertificationAssessmentPage id={id} />;
}
