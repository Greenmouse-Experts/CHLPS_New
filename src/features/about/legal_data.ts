export interface LegalCertificateItem {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  authority: string;
  registrationNumber?: string;
  issueDate?: string;
  validity?: string;
  image: string;
  summary: string;
  highlights: string[];
}

export const LEGAL_CERTIFICATES: LegalCertificateItem[] = [
  {
    id: "incorporation",
    title: "Certificate of Incorporation",
    badge: "Federal Not-for-Profit",
    subtitle: "Canada Not-for-profit Corporations Act",
    authority: "Corporations Canada / Industry Canada",
    registrationNumber: "1352698-4",
    image: "/lega/cert_1.png",
    summary:
      "Official Certificate of Incorporation issued under the Canada Not-for-profit Corporations Act (Loi canadienne sur les organisations à but non lucratif), formally establishing the Association of Chartered Loss Prevention Specialists of Canada as a recognized national legal entity.",
    highlights: [
      "Federal Canadian Corporate Charter",
      "Official Corporate Dénomination: Association of Chartered Loss Prevention Specialists of Canada",
      "Statutory Governance & Compliance Framework",
    ],
  },
  {
    id: "cpd-provider",
    title: "Approved CPD Provider Certificate",
    badge: "CPD Standards Office",
    subtitle: "Continuing Professional Development Accreditation",
    authority: "The CPD Standards Office (UK / International)",
    registrationNumber: "#788789",
    issueDate: "14/11/2025",
    image: "/lega/cert_2.png",
    summary:
      "Global accreditation by the CPD Standards Office recognizing CHLPS Canada as an Approved CPD Provider. This certification confirms our professional learning activities, assessments, and certifications adhere to rigorous international continuous learning criteria.",
    highlights: [
      "CPD Approved Provider #788789",
      "Recognized Continuing Professional Development credits",
      "Quality-assured instructional delivery and evaluation",
    ],
  },
  {
    id: "actd-accreditation",
    title: "ACTD Certificate of Accreditation",
    badge: "International Accreditation",
    subtitle: "American Council of Training and Development",
    authority: "American Council of Training and Development (ACTD)",
    registrationNumber: "Reg No. 1352698-4",
    image: "/lega/cert_3.png",
    summary:
      "Accreditation as a Professional Certification Organization in Canada granted by the American Council of Training and Development (ACTD), confirming compliance with international standards for training curriculum and professional designation award.",
    highlights: [
      "International Recognition for Professional Certifications",
      "Adherence to Global Curriculum Benchmarks",
      "Standardized Assessment & Evaluation Integrity",
    ],
  },
  {
    id: "quality-assurance",
    title: "Institutional Quality Assurance Accreditation",
    badge: "Higher Education Quality",
    subtitle: "Pre-Tertiary and Higher Education Quality Assurance",
    authority: "Quality Assurance Accreditation Committee",
    registrationNumber: "Institution ID: 120938",
    validity: "Valid until 20 September 2027",
    image: "/lega/cert_4.png",
    summary:
      "Institutional accreditation certifying that CHLPS Canada has met all prescribed quality assurance standards concerning educational quality, curriculum depth, institutional integrity, and public accountability.",
    highlights: [
      "Institution ID: 120938",
      "Comprehensive Institutional Integrity Verification",
      "Standards-backed Curriculum & Competency Pathways",
    ],
  },
];
