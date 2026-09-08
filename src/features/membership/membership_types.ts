import {
  BookOpen01Icon,
  BoxesIcon,
  Briefcase01Icon,
  Building03Icon,
  ChartHistogramIcon,
  CheckmarkBadge01Icon,
  CheckmarkCircle02Icon,
  ClipboardCheckIcon,
  Compass01Icon,
  DeliveryTruck01Icon,
  GraduationCapIcon,
  HandshakeIcon,
  Medal01Icon,
  ScanEyeIcon,
  ShieldCheckIcon,
  ShoppingBag01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Assets } from "@/lib/assets";
import type { MembershipHelpCard } from "@/features/membership/components/membership_help_section";
import type { MembershipJobCard } from "@/features/membership/components/membership_jobs_section";
import type { MembershipJoinNowCard } from "@/features/membership/components/membership_join_now_section";
import type { MembershipRequirementColumn } from "@/features/membership/components/membership_requirements_section";

export const membershipTypeIds = [
  "student",
  "affiliate",
  "licentiate",
  "associate",
  "certified",
  "corporate",
] as const;

export type MembershipTypeId = (typeof membershipTypeIds)[number];

export type MembershipType = {
  id: MembershipTypeId;
  title: string;
  gradeTitle: string;
  heroBody: string;
  gradeBody: string;
  badge: string;
  cropLogo?: boolean;
  indicatorColor: string;
  metaDescription: string;
  help: {
    badge: string;
    title: string;
    body: string;
    cards: MembershipHelpCard[];
  };
  requirements: [MembershipRequirementColumn, MembershipRequirementColumn];
  jobs: {
    badge: string;
    title: string;
    body: string;
    cards: MembershipJobCard[];
  };
  joinNow: {
    title: string;
    paragraphs: string[];
    tags: string[];
    cards: MembershipJoinNowCard[];
  };
};

export function isMembershipTypeId(id: string): id is MembershipTypeId {
  return (membershipTypeIds as readonly string[]).includes(id);
}

export function getMembershipType(id: string): MembershipType | undefined {
  if (!isMembershipTypeId(id)) return undefined;
  return membershipTypes[id];
}

const sharedRequirements: [MembershipRequirementColumn, MembershipRequirementColumn] =
  [
    {
      title: "Entry Requirements",
      icon: ClipboardCheckIcon,
      tone: "navy",
      items: [
        "Enrollment in a recognized academic or professional program.",
        "Minimum high school diploma or equivalent qualification.",
        "Demonstrated interest in loss prevention or corporate security.",
        "Basic proficiency in the English language.",
        "Ability to engage in structured learning and professional development.",
        "Willingness to follow the Association's code of conduct and pursue a career in the field.",
      ],
    },
    {
      title: "What you gain",
      icon: CheckmarkBadge01Icon,
      tone: "gold",
      items: [
        "Early access to structured knowledge in loss prevention and corporate security.",
        "Exposure to industry trends, risks and emerging security practices.",
        "Student-focused learning resources and case materials.",
        "Professional networking opportunities within the security industry.",
        "Guidance on certification pathways and career planning.",
        "Recognition as a Student Member and Certificate of Membership.",
      ],
    },
  ];

const sharedJobs: MembershipType["jobs"] = {
  badge: "Career Opportunities",
  title: "Job Opportunities",
  body: "Student Membership can support early-career exposure across security, loss prevention, risk management, logistics and compliance.",
  cards: [
    {
      icon: ShieldCheckIcon,
      title: "Security Assistant",
      body: "Entry-level security support within retail or corporate environments.",
    },
    {
      icon: ShoppingBag01Icon,
      title: "Retail Asset Protection Support",
      body: "Retail roles with exposure to loss prevention and asset protection responsibilities.",
    },
    {
      icon: BoxesIcon,
      title: "Warehouse & Inventory Support",
      body: "Operational roles with exposure to inventory control and supply chain processes.",
    },
    {
      icon: ClipboardCheckIcon,
      title: "Compliance Administration",
      body: "Junior administrative support within compliance or security departments.",
    },
    {
      icon: ChartHistogramIcon,
      title: "Risk Management Internship",
      body: "Internship exposure within corporate security, risk or related operational functions.",
    },
    {
      icon: DeliveryTruck01Icon,
      title: "Logistics Support",
      body: "Entry-level logistics and supply-chain support roles with loss prevention awareness.",
    },
  ] satisfies MembershipJobCard[],
};

const sharedJoinNow: MembershipType["joinNow"] = {
  title: "Why should I join now?",
  paragraphs: [
    "Student Membership recognises that you are building early knowledge, industry awareness and a clearer path into loss prevention and corporate security.",
    "It strengthens your early professional standing, expands access to learning resources and community, and supports progression toward professional practice and future certification.",
  ],
  tags: ["Demonstrate competence", "Build leadership", "Prepare for management"],
  cards: [
    {
      title: "Application fee",
      body: "One off application fee: £148",
    },
    {
      title: "Membership cycle",
      body: "Membership year is from April 1 to March 31, is VAT exempt and does not offer part year fees.",
    },
    {
      title: "If you join mid year",
      body: "Your subscription runs until the following 31 March.",
    },
    {
      title: "Good to know",
      body: "Student Membership helps create a clearer early route into the profession and related opportunities.",
    },
  ] satisfies MembershipJoinNowCard[],
};

function membershipFromLevel(config: {
  id: MembershipTypeId;
  title: string;
  gradeTitle: string;
  heroBody: string;
  gradeBody: string;
  badge: string;
  cropLogo?: boolean;
  indicatorColor: string;
  help: MembershipType["help"];
}): MembershipType {
  return {
    id: config.id,
    title: config.title,
    gradeTitle: config.gradeTitle,
    heroBody: config.heroBody,
    gradeBody: config.gradeBody,
    badge: config.badge,
    cropLogo: config.cropLogo,
    indicatorColor: config.indicatorColor,
    metaDescription: config.heroBody,
    help: config.help,
    requirements: sharedRequirements,
    jobs: sharedJobs,
    joinNow: sharedJoinNow,
  };
}

export const membershipTypes: Record<MembershipTypeId, MembershipType> = {
  student: membershipFromLevel({
    id: "student",
    title: "Student Membership",
    gradeTitle: "Student Member",
    heroBody:
      "For students building early knowledge, industry awareness and a clear path into loss prevention.",
    gradeBody:
      "Begin developing industry awareness, professional knowledge and a clearer understanding of career pathways during your training.",
    badge: Assets.images.membership.student,
    indicatorColor: "#E84028",
    help: {
      badge: "Student Membership",
      title: "How will Student Membership help me?",
      body: "Student Membership gives you an early professional foundation, practical exposure and a clearer understanding of where your career in loss prevention can grow next.",
      cards: [
        {
          icon: Compass01Icon,
          title: "Career Direction",
          body: "Understand the profession and explore routes from study into credible professional practice.",
        },
        {
          icon: ChartHistogramIcon,
          title: "Professional Growth",
          body: "Build confidence through learning resources, industry insight and professional standards.",
        },
        {
          icon: UserGroupIcon,
          title: "Community Access",
          body: "Connect with practitioners and become part of the wider loss prevention community early.",
        },
        {
          icon: Medal01Icon,
          title: "Member Recognition",
          body: "Gain recognition as a Student Member and begin building long-term professional standing.",
        },
      ],
    },
  }),
  affiliate: membershipFromLevel({
    id: "affiliate",
    title: "Affiliate Membership",
    gradeTitle: "Affiliate Member",
    heroBody:
      "For individuals gaining industry exposure and building a foundation for professional certification.",
    gradeBody:
      "An accessible entry point for individuals exploring loss prevention, corporate security and asset protection.",
    badge: Assets.images.membership.affiliate,
    indicatorColor: "#CDA54E",
    help: {
      badge: "Affiliate Membership",
      title: "How will Affiliate Membership help me?",
      body: "Affiliate Membership gives you structured industry exposure, foundational professional knowledge and a clearer route into certification within the loss prevention community.",
      cards: [
        {
          icon: ScanEyeIcon,
          title: "Industry Exposure",
          body: "Learn how modern loss prevention and corporate security operate in structured professional environments.",
        },
        {
          icon: BookOpen01Icon,
          title: "Foundational Knowledge",
          body: "Build familiarity with professional standards, ethical practice and the frameworks that underpin effective loss prevention.",
        },
        {
          icon: UserGroupIcon,
          title: "Professional Network",
          body: "Connect with experienced practitioners through learning activities, events and the wider CHLPS community.",
        },
        {
          icon: GraduationCapIcon,
          title: "Certification Pathway",
          body: "Prepare for introductory certification pathways and future progression as your competence and experience grow.",
        },
      ],
    },
  }),
  licentiate: membershipFromLevel({
    id: "licentiate",
    title: "Licentiate Membership",
    gradeTitle: "Licentiate Member",
    heroBody:
      "For practitioners formalising practical experience and strengthening their professional standing.",
    gradeBody:
      "For practitioners with foundational knowledge and practical exposure who are establishing formal professional standing.",
    badge: Assets.images.membership.licentiate,
    indicatorColor: "#60B0F0",
    help: {
      badge: "Licentiate Membership",
      title: "How will Licentiate Membership help me?",
      body: "Licentiate Membership recognises your move into applied practice and helps align your experience with recognised loss prevention standards.",
      cards: [
        {
          icon: CheckmarkBadge01Icon,
          title: "Professional Credibility",
          body: "Gain formal recognition for foundational professional competence and practical industry exposure.",
        },
        {
          icon: Briefcase01Icon,
          title: "Applied Competence",
          body: "Strengthen the link between day-to-day operational experience and recognised professional frameworks.",
        },
        {
          icon: HandshakeIcon,
          title: "Mentorship & Guidance",
          body: "Access intermediate resources, structured development and professional guidance.",
        },
        {
          icon: ChartHistogramIcon,
          title: "Career Progression",
          body: "Prepare for advanced certification, supervisory responsibility and broader security roles.",
        },
      ],
    },
  }),
  associate: membershipFromLevel({
    id: "associate",
    title: "Associate Membership",
    gradeTitle: "Associate Member",
    heroBody:
      "For experienced practitioners advancing credibility, competence and professional responsibility.",
    gradeBody:
      "For experienced practitioners who can operate independently and contribute meaningfully to organisational loss reduction.",
    badge: Assets.images.membership.associate,
    indicatorColor: "#7858F0",
    help: {
      badge: "Associate Membership",
      title: "How will Associate Membership help me?",
      body: "Associate Membership recognises independent professional practice and supports continued development toward leadership, advanced certification and stronger employer standing.",
      cards: [
        {
          icon: CheckmarkCircle02Icon,
          title: "Professional Recognition",
          body: "Be recognised as a practising professional with demonstrated competence and practical experience.",
        },
        {
          icon: Building03Icon,
          title: "Employer Credibility",
          body: "Strengthen professional standing with employers through recognised membership and continued development.",
        },
        {
          icon: BookOpen01Icon,
          title: "Advanced Resources",
          body: "Access advanced resources, research, professional forums and continuous professional development.",
        },
        {
          icon: ChartHistogramIcon,
          title: "Leadership Development",
          body: "Prepare for supervisory, managerial and advanced certification pathways.",
        },
      ],
    },
  }),
  certified: membershipFromLevel({
    id: "certified",
    title: "Certified Membership",
    gradeTitle: "Certified Member",
    heroBody:
      "For accomplished professionals demonstrating advanced competence, leadership and professional credibility.",
    gradeBody:
      "A high-level membership grade for experienced professionals managing complex operational and security responsibilities.",
    badge: Assets.images.membership.certified,
    indicatorColor: "#4818D8",
    help: {
      badge: "Certified Membership",
      title: "How will Certified Membership help me?",
      body: "Certified Membership recognises professional maturity, technical expertise and leadership capability while positioning you for senior, advisory and strategic responsibilities.",
      cards: [
        {
          icon: CheckmarkCircle02Icon,
          title: "Certified Recognition",
          body: "Gain recognition as a certified professional with demonstrated competence and professional judgement.",
        },
        {
          icon: BookOpen01Icon,
          title: "Advanced Frameworks",
          body: "Access advanced tools, frameworks and high-level development resources for complex environments.",
        },
        {
          icon: Briefcase01Icon,
          title: "Leadership Opportunity",
          body: "Strengthen readiness for management, advisory, governance and large-scale security leadership roles.",
        },
        {
          icon: Medal01Icon,
          title: "Chartered Pathway",
          body: "Build toward Chartered Loss Prevention Specialist (ChLPS™) certification and executive responsibility.",
        },
      ],
    },
  }),
  corporate: membershipFromLevel({
    id: "corporate",
    title: "Corporate Membership",
    gradeTitle: "Corporate Member",
    heroBody:
      "For organisations strengthening professional standards, workforce capability and loss prevention practice.",
    gradeBody:
      "For organisations committed to stronger loss prevention, corporate security, risk management and workforce capability.",
    badge: Assets.icons.logo,
    cropLogo: true,
    indicatorColor: "#211A73",
    help: {
      badge: "Corporate Membership",
      title: "How will Corporate Membership help me?",
      body: "Corporate Membership helps organisations align with recognised standards, strengthen workforce capability and demonstrate commitment to professional loss prevention practice.",
      cards: [
        {
          icon: UserGroupIcon,
          title: "Workforce Capability",
          body: "Develop internal loss prevention and security competence through professional learning and certification pathways.",
        },
        {
          icon: ShieldCheckIcon,
          title: "Industry Standards",
          body: "Align organisational practice with recognised loss prevention, security and risk management standards.",
        },
        {
          icon: GraduationCapIcon,
          title: "Training & Certification",
          body: "Support staff training, structured development and professional certification opportunities.",
        },
        {
          icon: Building03Icon,
          title: "Organisational Credibility",
          body: "Demonstrate commitment to best practice, ethical standards and continuous improvement.",
        },
      ],
    },
  }),
};
