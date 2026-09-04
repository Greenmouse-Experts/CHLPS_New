import { Assets } from "@/lib/assets";

export type Leader = {
  id: string;
  name: string;
  role: string;
  photo: string;
  credentials: string[];
  summary: string;
  biography: string[];
  expertise: string[];
  profile: { title: string; body: string }[];
};

export const leaders: Leader[] = [
  {
    id: "victoria-ogbuehi",
    name: "Dr. Victoria Nkemdilim Ogbuehi",
    role: "Chairman, Board of Directors",
    photo: Assets.images.leadership.victoriaOgbuehi,
    credentials: [
      "PhD",
      "MSc",
      "BSc",
      "LLB",
      "MLC",
      "MIS",
      "CBCP",
      "RIMS-CRMP",
      "CMC",
      "PCI",
      "CPP",
    ],
    summary:
      "Corporate security, enterprise risk and resilience professional with global experience spanning investigations, crisis management and business continuity.",
    biography: [
      "Dr. Victoria Ogbuehi is a globally experienced corporate security, enterprise risk and resilience professional. Her work spans security operations, intelligence, investigations, incident and crisis management, business continuity, cross-functional leadership and financial control.",
      "Her academic background covers counter-terrorism and deradicalization, information systems, cyber security, law enforcement, criminal justice, economics and law. She also holds internationally recognised credentials in protection, investigations, continuity, risk management and management consulting.",
      "Her professional service includes standards, conference and industry leadership work with ASIS International and other security organisations. She currently works in senior risk and resilience leadership.",
    ],
    expertise: [
      "Corporate Security",
      "Enterprise Risk",
      "Investigations",
      "Business Continuity",
      "Crisis Management",
      "Security Operations",
    ],
    profile: [
      {
        title: "Board-Certified Practice",
        body: "CPP and PCI credentials with additional continuity, risk and consulting certifications.",
      },
      {
        title: "Professional Leadership",
        body: "Experience supporting industry standards, conferences and professional volunteer initiatives.",
      },
      {
        title: "Academic Breadth",
        body: "Advanced study across security, risk, law, technology and counter-terrorism.",
      },
      {
        title: "ChLPS Role",
        body: "Chairman of the Board of Directors and a Certified Member of ChLPS Canada.",
      },
    ],
  },
  {
    id: "joseph-okpotu",
    name: "Joseph Okpotu",
    role: "Member, Board of Directors",
    photo: Assets.images.leadership.josephOkpotu,
    credentials: ["MBA", "ACIPM", "ADSOM", "CPP", "PCI", "PSP", "PFSO"],
    summary:
      "Security and loss prevention specialist with more than two decades of experience across physical security, investigations, emergency management and training.",
    biography: [
      "Joseph Okpotu is an accomplished corporate security, loss prevention, safety and human resources management professional with more than two decades of experience in strategic security operations, investigations, emergency management and risk management.",
      "His specialist work includes physical security, private investigations, executive protection, journey management, guard-force management, threat and vulnerability analysis, security awareness, budgeting and service-level management.",
      "He is also active in management development and professional security training, supported by recognised ASIS credentials and postgraduate management education.",
    ],
    expertise: [
      "Physical Security",
      "Loss Prevention",
      "Investigations",
      "Executive Protection",
      "Risk Assessment",
      "Security Training",
    ],
    profile: [
      {
        title: "ASIS Credentials",
        body: "Board-certified CPP, PCI and PSP professional.",
      },
      {
        title: "Management Education",
        body: "MBA in Human Resources Management and Advanced Diploma in Security Operations & Management.",
      },
      {
        title: "Operational Scope",
        body: "Experience across guard-force management, stakeholder liaison, risk assessment and security budgeting.",
      },
      {
        title: "ChLPS Role",
        body: "Member of the Board of Directors and a Certified Member of ChLPS Canada.",
      },
    ],
  },
  {
    id: "adegbenga-koko",
    name: "Dr. Adegbenga William Koko",
    role: "Executive Director / Registrar",
    photo: Assets.images.leadership.adegbengaKoko,
    credentials: [
      "PhD",
      "MSc",
      "MBA",
      "CA",
      "CFE",
      "CFI",
      "CAMS",
      "CFCS",
      "ChLPS",
      "CBRM",
      "ABCP",
      "MSyI",
      "MCMI",
      "CMgr",
      "CPP",
    ],
    summary:
      "Multidisciplinary security, risk, resilience and compliance professional with extensive experience in auditing, investigations and professional education.",
    biography: [
      "Adegbenga William Koko is a multidisciplinary corporate security, risk, business continuity and loss prevention professional with more than 15 years of experience across security operations, auditing, regulatory compliance, financial forensics, investigations and anti-money laundering.",
      "His work combines consulting, professional training and strategic advisory. He is licensed in Ontario for security and private investigation practice and has delivered professional education in security, AML, counter-terrorist financing and regulatory compliance.",
      "His academic and professional background spans management, international security, finance, forensic accounting, corporate security, logistics, cyber security, risk, resilience and multiple ISO management systems.",
    ],
    expertise: [
      "Corporate Security",
      "Risk Management",
      "Business Continuity",
      "AML & Compliance",
      "Financial Forensics",
      "Professional Education",
    ],
    profile: [
      {
        title: "Professional Licensing",
        body: "Ontario-licensed security professional and private investigator.",
      },
      {
        title: "ISO Practice",
        body: "Lead Auditor and Lead Implementer training across security, resilience, risk and continuity standards.",
      },
      {
        title: "Chartered Standing",
        body: "Credentials spanning loss prevention, management, accounting and converged security.",
      },
      {
        title: "ChLPS Role",
        body: "Executive Director / Registrar of ChLPS Canada.",
      },
    ],
  },
];
