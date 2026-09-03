import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ChartHistogramIcon,
  ClipboardListIcon,
  ComputerChartUpIcon,
  DeliveryTruck01Icon,
  GraduationCapIcon,
  HandshakeIcon,
  JusticeScale01Icon,
  Search01Icon,
  ShieldCheckIcon,
  ShoppingCart01Icon,
  TriangleAlertIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

type Career = {
  icon: IconSvgElement;
  title: string;
  body: string;
  color: string;
};

const careers: Career[] = [
  {
    icon: ShieldCheckIcon,
    title: "Loss Prevention Manager",
    body: "Lead loss prevention programs, investigate incidents, analyze data, and implement strategies to reduce shrinkage and protect assets.",
    color: "#6B5AED",
  },
  {
    icon: Search01Icon,
    title: "Loss Prevention Investigator",
    body: "Conduct internal investigations on theft, fraud and policy violations, gather evidence and support corrective actions.",
    color: "#22A45A",
  },
  {
    icon: ShoppingCart01Icon,
    title: "Retail Loss Prevention Specialist",
    body: "Monitor store operations, identify risks, and develop solutions to prevent theft, fraud and operational losses in retail environments.",
    color: "#3B82F6",
  },
  {
    icon: ChartHistogramIcon,
    title: "Loss Prevention Analyst",
    body: "Analyze loss data and trends, prepare reports, and provide insights that drive decisions and improve loss prevention performance.",
    color: "#E24B4B",
  },
  {
    icon: UserGroupIcon,
    title: "District Loss Prevention Manager",
    body: "Oversee loss prevention initiatives across multiple locations, coach store teams, and ensure compliance with company policies and procedures.",
    color: "#E8892A",
  },
  {
    icon: JusticeScale01Icon,
    title: "Compliance & Ethics Officer (LP)",
    body: "Ensure adherence to laws, regulations and ethical standards, promote integrity and reduce compliance-related losses.",
    color: "#1F9A9A",
  },
  {
    icon: DeliveryTruck01Icon,
    title: "Supply Chain Loss Prevention Specialist",
    body: "Identify and mitigate risks in the supply chain to prevent cargo theft, fraud, diversion and inventory shortages.",
    color: "#7C4DFF",
  },
  {
    icon: ClipboardListIcon,
    title: "Internal Audit - Loss Prevention",
    body: "Evaluate internal controls, assess risk exposure and recommend improvements to strengthen loss prevention and governance.",
    color: "#C43C3C",
  },
  {
    icon: GraduationCapIcon,
    title: "Loss Prevention Trainer / Educator",
    body: "Develop and deliver training programs that build awareness, skills and a proactive loss prevention culture within organizations.",
    color: "#4BA3E3",
  },
  {
    icon: HandshakeIcon,
    title: "Loss Prevention Consultant",
    body: "Advise organizations on risk assessments, program design, investigations and strategies to reduce losses and improve profitability.",
    color: "#CDA54E",
  },
  {
    icon: ComputerChartUpIcon,
    title: "Loss Prevention Technology Specialist",
    body: "Implement and manage technologies such as CCTV, EAS, analytics and AI-driven solutions to detect and deter risks.",
    color: "#22A45A",
  },
  {
    icon: TriangleAlertIcon,
    title: "Loss Prevention Risk Manager",
    body: "Identify, assess and manage enterprise risks that can lead to loss, and develop mitigation strategies to protect people, assets and business continuity.",
    color: "#2A7A8A",
  },
];

function CareerCard({ career }: { career: Career }) {
  return (
    <article className="flex h-full w-full items-start gap-3.5 rounded-lg border border-secondary bg-white/5 px-4 py-4 sm:gap-4 sm:px-5 sm:py-[1.15rem]">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: career.color }}
      >
        <HugeiconsIcon
          icon={career.icon}
          size={20}
          color="#ffffff"
          strokeWidth={1.8}
        />
      </span>
      <div className="min-w-0 pt-0.5">
        <h3 className="text-[15px] font-bold leading-snug text-white sm:text-base">
          {career.title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-white/80 sm:text-[13.5px]">
          {career.body}
        </p>
      </div>
    </article>
  );
}

export default function CareerPathwaysSection() {
  return (
    <section
      id="careers"
      className="relative overflow-hidden bg-[#161058] py-16 md:py-24"
    >
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
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="cut-tr-bl inline-block bg-secondary px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-primary">
              CAREER PATHWAYS
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 text-[1.75rem] font-normal leading-[1.15] tracking-tight text-white sm:text-3xl lg:mt-6 lg:text-[2.5rem] xl:text-[3rem]">
              Career Opportunities in
              <br />
              <span className="text-secondary">Loss Prevention</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 text-[15px] leading-relaxed text-white/90 sm:text-base">
              Build a rewarding and fulfilling career protecting people, assets,
              information, profits and organizational values across every
              industry.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-4 text-[15px] leading-relaxed text-white/90 sm:text-base">
              Loss Prevention has advanced well beyond traditional retail theft
              control. Today, it spans asset protection, investigations, fraud
              prevention, risk management, cybersecurity, data protection and
              business resilience.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mx-auto mt-10 grid max-w-xl auto-rows-fr grid-cols-1 gap-3 sm:mt-12 sm:max-w-none sm:grid-cols-2 sm:gap-4 lg:mt-14 lg:max-w-5xl lg:gap-x-5 lg:gap-y-4 xl:max-w-6xl">
          {careers.map((career, index) => (
            <div key={career.title} className="reveal h-full" style={revealStyle(index)}>
              <CareerCard career={career} />
            </div>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
