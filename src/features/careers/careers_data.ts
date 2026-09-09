import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  ChartNoAxesCombined,
  ClipboardCheck,
  GraduationCap,
  MapPinned,
  MonitorCog,
  Scale,
  Search,
  ShieldCheck,
  Store,
  TriangleAlert,
  Truck,
} from "lucide-react";

export type CareerAction = "certification" | "membership";

export type CareerPath = {
  icon: LucideIcon;
  title: string;
  body: string;
  action: CareerAction;
};

export const careerActions: Record<
  CareerAction,
  { label: string; href: string }
> = {
  certification: { label: "View Certification Path", href: "/certification" },
  membership: { label: "Explore Membership", href: "/membership" },
};

export const careerPaths: CareerPath[] = [
  {
    icon: ShieldCheck,
    title: "Loss Prevention Manager",
    body: "Lead loss prevention programs, investigate incidents, analyze data, and implement strategies to reduce shrinkage and protect assets.",
    action: "certification",
  },
  {
    icon: Search,
    title: "Loss Prevention Investigator",
    body: "Conduct internal investigations on theft, fraud and policy violations, gather evidence and support corrective actions.",
    action: "membership",
  },
  {
    icon: Store,
    title: "Retail Loss Prevention Specialist",
    body: "Monitor store operations, identify risks, and develop solutions to prevent theft, fraud and operational losses in retail environments.",
    action: "membership",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Loss Prevention Analyst",
    body: "Analyze loss data and trends, prepare reports, and provide insights that drive decisions and improve loss prevention performance.",
    action: "certification",
  },
  {
    icon: MapPinned,
    title: "District Loss Prevention Manager",
    body: "Oversee loss prevention initiatives across multiple locations, coach store teams, and ensure compliance with company policies and procedures.",
    action: "certification",
  },
  {
    icon: Scale,
    title: "Compliance & Ethics Officer (LP)",
    body: "Ensure adherence to laws, regulations and ethical standards, promote integrity and reduce compliance-related losses.",
    action: "membership",
  },
  {
    icon: Truck,
    title: "Supply Chain Loss Prevention Specialist",
    body: "Identify and mitigate risks in the supply chain to prevent cargo theft, fraud, diversion and inventory shortages.",
    action: "membership",
  },
  {
    icon: ClipboardCheck,
    title: "Internal Audit – Loss Prevention",
    body: "Evaluate internal controls, assess risk exposure and recommend improvements to strengthen loss prevention and governance.",
    action: "membership",
  },
  {
    icon: GraduationCap,
    title: "Loss Prevention Trainer / Educator",
    body: "Develop and deliver training programs that build awareness, skills and a proactive loss prevention culture within organizations.",
    action: "certification",
  },
  {
    icon: Briefcase,
    title: "Loss Prevention Consultant",
    body: "Advise organizations on risk assessments, program design, investigations and strategies to reduce losses and improve profitability.",
    action: "membership",
  },
  {
    icon: MonitorCog,
    title: "Loss Prevention Technology Specialist",
    body: "Implement and manage technologies such as CCTV, EAS, analytics and AI-driven solutions to detect and deter risks.",
    action: "certification",
  },
  {
    icon: TriangleAlert,
    title: "Loss Prevention Risk Manager",
    body: "Identify, assess and manage enterprise risks that can lead to loss, and develop mitigation strategies to protect people, assets and business continuity.",
    action: "certification",
  },
];
