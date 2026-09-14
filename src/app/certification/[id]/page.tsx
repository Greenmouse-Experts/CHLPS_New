import type { Metadata } from "next";
import CertificationDetailsPage from "@/features/certification/certification_details_page";
import { CERTIFICATION_DETAIL } from "@/features/certification/certification_details";

type CertificationIdPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = true;

export const metadata: Metadata = {
  title: CERTIFICATION_DETAIL.cardTitle.replace(/\n/g, " "),
  description: CERTIFICATION_DETAIL.heroBody,
};

export default async function CertificationIdPage({
  params,
}: CertificationIdPageProps) {
  await params;
  return <CertificationDetailsPage detail={CERTIFICATION_DETAIL} />;
}
