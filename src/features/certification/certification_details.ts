import { Assets } from "@/lib/assets";

export type CertificationDetail = {
  id?: string;
  programId?: string;
  courseId?: string;
  price?: number;
  abbr: string;
  badge: string;
  heroTitle: string;
  heroBody: string;
  cardTitle: string;
  fee: string;
  feeNow: string;
  feeExpiry: string;
  enrollHref: string;
  requirementsTitle: string;
  requirements: string[];
  studiesBadge: string;
  studiesTitle: string;
  modules: string[];
  outcomeBadge: string;
  outcomeTitle: string;
  outcomeBody: string[];
  outcomeImage: string;
  benefitsTitle: string;
  benefits: string[];
  applicationQuestions?: Array<{ id?: string; question: string }>;
};

export const CERTIFICATION_DETAIL: CertificationDetail = {
  abbr: "CLPA",
  badge: Assets.images.certificates.clpa,
  heroTitle: "Certified Loss\nPrevention Associate\n(CLPA™) Certification",
  heroBody:
    "The Certified Loss Prevention Associate certification (CLPA) is designed to build a strong foundation for individuals entering the loss prevention profession. It provides essential knowledge of core concepts, common risks, basic investigative practices, and the operational principles that guide modern loss prevention work. This entry-level credential prepares participants to perform effectively in diverse support roles, contribute to shrinkage reduction efforts, and grow confidently toward more advanced professional responsibilities.",
  cardTitle: "CLPA – Certified\nLoss Prevention\nAssociate",
  fee: "$100",
  feeNow: "$100.00 now and then $100.00 after 1 Year.",
  feeExpiry: "Membership expires after 1 Year.",
  enrollHref: "/dashboard/register",
  requirementsTitle: "Entry Requirements for the CLPA Certification",
  requirements: [
    "Successful completion of the Basic Professional Certificate in Loss Prevention or equivalent foundational training, or relevant work experience",
    "Minimum of a high school diploma or equivalent",
    "Licenced Security Guards",
    "Licenced Private Investigators",
    "Basic understanding of security, retail operations, or loss prevention principles",
    "Ability to read, interpret, and apply instructional materials and case scenarios",
    "Commitment to professional development within the loss prevention or corporate security field",
  ],
  studiesBadge: "CLPA Program of Studies:",
  studiesTitle: "What You’ll Study",
  modules: [
    "Module 1: Introduction to Loss Prevention and Asset Protection",
    "Module 2: Retail Operations, Shrinkage Concepts, and Causes of Loss",
    "Module 3: Physical Security Controls and Surveillance Systems",
    "Module 4: Shoplifting and Internal Theft Identification Techniques",
    "Module 5: Workplace Safety, Emergency Response, and Incident Awareness",
    "Module 6: Professional Ethics, Legal Boundaries, and Report Writing",
  ],
  outcomeBadge: "Career and Credential Outcomes",
  outcomeTitle: "CLPA Professional\nCertification",
  outcomeBody: [
    "The Certified Loss Prevention Associate (CLPA) credential demonstrates that you have mastered the fundamental principles, operational practices, and legal considerations essential to entry-level and support roles in loss prevention and corporate security.",
    "Holders of the CLPA designation are recognized by employers across retail, warehousing, logistics, and private security as qualified practitioners capable of contributing immediately to asset protection and risk mitigation programs.",
  ],
  outcomeImage: Assets.images.clpaCertificate,
  benefitsTitle: "Benefits of the CLPA Certification",
  benefits: [
    "Builds a recognized professional credential for individuals entering the loss prevention and security field",
    "Validates foundational competency in shrinkage control, surveillance, and basic investigative processes",
    "Enhances employment prospects in retail loss prevention, distribution security, and corporate asset protection",
    "Establishes a structured pathway toward the Certified Loss Prevention Officer (CLPO) and Specialist (ChLPS) credentials",
    "Includes access to CHLPS Canada professional resources, community forums, and continuing education opportunities",
    "Demonstrates commitment to professional standards, ethical conduct, and ongoing career development",
  ],
};

export const CERTIFICATION_SLUG_MAP: Record<string, string> = {
  bclp: "basic-professional-certificate-in-loss-prevention",
  clpa: "certified-loss-prevention-associate",
  clpo: "certified-loss-prevention-officer",
  clpm: "certified-loss-prevention-manager",
  aclpm: "advanced-professional-certificate-in-loss-prevention-management",
  acipm: "advanced-professional-certificate-in-loss-prevention-management",
  chlps: "chartered-loss-prevention-specialist",
};

export function resolveCertificationHref(item: {
  id?: string;
  slug?: string;
  title?: string;
  abbr?: string;
}): string {
  if (item.slug) {
    return `/certification/${item.slug}`;
  }

  if (item.abbr) {
    const mapped = CERTIFICATION_SLUG_MAP[item.abbr.toLowerCase()];
    if (mapped) return `/certification/${mapped}`;
  }

  if (item.title) {
    const match = item.title.match(/\(([A-Za-z™]+)\)/);
    const abbr = match ? match[1].replace(/™/g, "").toLowerCase() : "";
    if (abbr && CERTIFICATION_SLUG_MAP[abbr]) {
      return `/certification/${CERTIFICATION_SLUG_MAP[abbr]}`;
    }
  }

  return `/certification/${item.id || ""}`;
}
