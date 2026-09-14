import { Assets } from "@/lib/assets";

export type CertificationDetail = {
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
    "Congratulations on earning the Certified Loss Prevention Associate (CLPA) professional certification. This achievement reflects your dedication to professional growth and readiness to contribute confidently to modern loss prevention work. The certification enhances your credibility, strengthens your operational skills, and positions you for roles in retail security.",
    "CLPA certification holders gain improved employability, access to industry networks, and a solid foundation for advanced certifications. It is a meaningful step toward a rewarding career in loss prevention and corporate security.",
  ],
  outcomeImage: Assets.images.clpaCertificate,
  benefitsTitle: "Benefits of the CLPA Certification",
  benefits: [
    "Establishes professional credibility in the loss prevention field",
    "Strengthens operational competence in retail and logistics environments",
    "Enhances understanding of fraud prevention and risk management",
    "Prepares candidates for supervisory and operational roles",
    "Provides a clear pathway to CLPO™ certification",
  ],
};

export function resolveCertificationHref(input: {
  id?: string;
  slug?: string;
}): string {
  const id = input.id || input.slug || "";
  return id ? `/certification/${id}` : "/certification";
}
