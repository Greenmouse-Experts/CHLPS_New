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
    "Module 1: Introduction to Loss Prevention Processes",
    "Module 2: Understanding Retail Operations",
    "Module 3: Basics of Security Technologies",
    "Module 4: Principles of Surveillance and Monitoring",
    "Module 5: Customer Service and Conflict Resolution",
    "Module 6: Report Writing and Documentation Procedures",
    "Module 7: Legal and Ethical Considerations in Loss Prevention",
    "Module 8: Emergency Response Procedures",
    "Module 9: Introduction to Fraud Prevention",
    "Module 10: Risk Assessment and Management",
  ],
  outcomeBadge: "CLPA Professional Certification",
  outcomeTitle: "CLPA Professional\nCertification",
  outcomeBody: [
    "Upon successful completion of the CLPA Program of Studies and passing the comprehensive examination, candidates are awarded the Certified Loss Prevention Associate (CLPA™) designation.",
    "This certification validates fundamental competencies in asset protection, conflict management, and security reporting, positioning holders as qualified candidates for roles across retail, corporate, and logistics loss prevention environments.",
  ],
  outcomeImage: Assets.images.clpaCertificate,
  benefitsTitle: "Benefits of the CLPA Certification",
  benefits: [
    "Nationally and internationally recognized professional credential",
    "Enhanced employability across retail, logistics, corporate, and public sectors",
    "Comprehensive curriculum covering core loss prevention and asset protection principles",
    "Direct pathway toward advanced certifications including CLPO™ and ChLPS™",
    "Access to exclusive CHLPS professional resources, workshops, and network",
    "Digital badge and verifiable credentials for LinkedIn and professional profiles",
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
