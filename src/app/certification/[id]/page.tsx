import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CertificationDetailsPage from "@/features/certification/certification_details_page";
import {
  fetchProgramById,
  fetchPublicPrograms,
} from "@/features/certification/services/certification_service";

type CertificationIdPageProps = {
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
}: CertificationIdPageProps): Promise<Metadata> {
  const { id } = await params;
  const detail = await fetchProgramById(id);

  if (detail) {
    return {
      title: `${detail.cardTitle.replace(/\n/g, " ")} | CHLPS Canada`,
      description: detail.heroBody,
      openGraph: detail.badge
        ? {
            images: [{ url: detail.badge }],
          }
        : undefined,
    };
  }

  return {
    title: "Certification Details | CHLPS Canada",
    description:
      "Explore accredited educational and professional programs designed to build skills, earn credentials, and advance your career in loss prevention.",
  };
}

export default async function CertificationIdPage({
  params,
}: CertificationIdPageProps) {
  const { id } = await params;
  const detail = await fetchProgramById(id);

  if (!detail) {
    notFound();
  }

  return <CertificationDetailsPage detail={detail} id={id} />;
}
