"use client";

import CertificationDetailsLearningOutcomesSection from "./certification_details_learning_outcomes_section";
import type { CertificationDetail } from "@/features/certification/certification_details";

export default function CertificationDetailsStudiesSection({
  detail,
}: {
  detail: CertificationDetail;
}) {
  return <CertificationDetailsLearningOutcomesSection detail={detail} />;
}
