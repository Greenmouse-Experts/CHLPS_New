import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ChartColumn,
  ChartLine,
  ClipboardList,
  GraduationCap,
  Handshake,
  Scale,
  Search,
  ShieldCheck,
  ShoppingCart,
  TriangleAlert,
  Truck,
  Users,
} from "lucide-react";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";

type Career = {
  icon: LucideIcon;
  title: string;
  body: string;
  color: string;
};

const careers: Career[] = [
  {
    icon: ShieldCheck,
    title: "Loss Prevention Manager",
    body: "Lead loss prevention programs, investigate incidents, analyze data, and implement strategies to reduce shrinkage and protect assets.",
    color: "#56369B",
  },
  {
    icon: Search,
    title: "Loss Prevention Investigator",
    body: "Conduct internal investigations on theft, fraud and policy violations, gather evidence and support corrective actions.",
    color: "#157B48",
  },
  {
    icon: ShoppingCart,
    title: "Retail Loss Prevention Specialist",
    body: "Monitor store operations, identify risks, and develop solutions to prevent theft, fraud and operational losses in retail environments.",
    color: "#1257A3",
  },
  {
    icon: ChartLine,
    title: "Loss Prevention Analyst",
    body: "Analyze loss data and trends, prepare reports, and provide insights that drive decisions and improve loss prevention performance.",
    color: "#A51F2F",
  },
  {
    icon: Users,
    title: "District Loss Prevention Manager",
    body: "Oversee loss prevention initiatives across multiple locations, coach store teams, and ensure compliance with company policies and procedures.",
    color: "#B36A12",
  },
  {
    icon: Scale,
    title: "Compliance & Ethics Officer (LP)",
    body: "Ensure adherence to laws, regulations and ethical standards, promote integrity and reduce compliance-related losses.",
    color: "#166080",
  },
  {
    icon: Truck,
    title: "Supply Chain Loss Prevention Specialist",
    body: "Identify and mitigate risks in the supply chain to prevent cargo theft, fraud, diversion and inventory shortages.",
    color: "#56369B",
  },
  {
    icon: ClipboardList,
    title: "Internal Audit - Loss Prevention",
    body: "Evaluate internal controls, assess risk exposure and recommend improvements to strengthen loss prevention and governance.",
    color: "#A51F2F",
  },
  {
    icon: GraduationCap,
    title: "Loss Prevention Trainer / Educator",
    body: "Develop and deliver training programs that build awareness, skills and a proactive loss prevention culture within organizations.",
    color: "#1257A3",
  },
  {
    icon: Handshake,
    title: "Loss Prevention Consultant",
    body: "Advise organizations on risk assessments, program design, investigations and strategies to reduce losses and improve profitability.",
    color: "#B36A12",
  },
  {
    icon: ChartColumn,
    title: "Loss Prevention Technology Specialist",
    body: "Implement and manage technologies such as CCTV, EAS, analytics and AI-driven solutions to detect and deter risks.",
    color: "#157B48",
  },
  {
    icon: TriangleAlert,
    title: "Loss Prevention Risk Manager",
    body: "Identify, assess and manage enterprise risks that can lead to loss, and develop mitigation strategies to protect people, assets and business continuity.",
    color: "#166080",
  },
];

function CareerCard({ career }: { career: Career }) {
  const Icon = career.icon;

  return (
    <article className="flex h-full w-full items-start gap-3.5 rounded-lg border border-secondary bg-white/5 px-[20px] py-[18px] sm:gap-4">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: career.color }}
      >
        <Icon size={20} color="#ffffff" strokeWidth={1.8} aria-hidden />
      </span>
      <div className="min-w-0 pt-0.5">
        <h3 className=" font-bold leading-snug text-white  ">{career.title}</h3>
        <p className="mt-1  leading-relaxed text-white/80 text-sm">
          {career.body}
        </p>
      </div>
    </article>
  );
}

export default function CareerPathwaysSection() {
  return (
    <section id="careers" className="relative overflow-hidden py-8 md:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={Assets.images.careerPathwaysBg}
          alt=""
          fill
          className="object-cover object-bottom"
          sizes="100vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <HeaderText
            textWhite
            left={`Loss Prevention`}
            right={`
            Career pathways
            `}
          ></HeaderText>
          {/* <Reveal delay={160}>
            <p className="mt-5 text-[15px] leading-relaxed text-white/90 sm:text-base">
              Build a rewarding and fulfilling career protecting people, assets,
              information, profits and organizational values across every
              industry.
            </p>
          </Reveal> */}
          <HeaderSubText textWhite>
            Loss Prevention has advanced well beyond traditional retail theft
            control. Today, it encompasses asset protection, investigations,
            fraud prevention, risk management, cybersecurity, data protection,
            supply chain security, workplace safety, and business resilience.
            Modern Loss Prevention professionals protect organizational value,
            reduce preventable losses, strengthen operations, and support
            sustainable business performance across diverse industries.
          </HeaderSubText>
        </div>

        <RevealGroup className="mx-auto mt-10 grid max-w-xl auto-rows-fr grid-cols-1 gap-3 sm:mt-12 sm:max-w-none sm:grid-cols-2 sm:gap-4 lg:mt-14 lg:max-w-5xl lg:gap-x-5 lg:gap-y-4 xl:max-w-[1180px]">
          {careers.map((career, index) => (
            <div
              key={career.title}
              className="reveal h-full"
              style={revealStyle(index)}
            >
              <CareerCard career={career} />
            </div>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
