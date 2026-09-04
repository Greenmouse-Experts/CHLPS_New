import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { BankIcon, Briefcase01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";

type StructureCard = {
  icon: IconSvgElement;
  title: string;
  body: string;
  points: string[];
  card: string;
  titleColor: string;
  bodyColor: string;
  pointColor: string;
};

const cards: StructureCard[] = [
  {
    icon: BankIcon,
    title: "Board of Directors",
    body: "The Board provides strategic leadership and governance, guiding long-term vision, policy and strategic priorities while acting in the best interests of the membership and profession.",
    points: [
      "Strategic direction",
      "Governance oversight",
      "Policy guidance",
      "Professional standards",
    ],
    card: "bg-gradient-to-br from-[#F7EBC8] to-[#FCF9EE]",
    titleColor: "text-[#151515]",
    bodyColor: "text-[#6C697B]",
    pointColor: "text-primary",
  },
  {
    icon: Briefcase01Icon,
    title: "Association Management Team",
    body: "The Management Team supports the Board and manages the Association's day-to-day operations, including member support, certification, training, administration and service delivery.",
    points: [
      "Member services",
      "Certification delivery",
      "Training coordination",
      "Administration",
    ],
    card: "bg-gradient-to-br from-[#1B165E] to-[#3D3887]",
    titleColor: "text-white",
    bodyColor: "text-white/85",
    pointColor: "text-white",
  },
];

export default function GovernanceStructureSection() {
  return (
    <section id="governance-structure" className="bg-[#F5F4F1] py-16 lg:py-20">
      <PageContainer>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Governance Structure
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 max-w-[13em] text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[2.5rem]">
                Two functions. One professional mandate.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={160} className="min-w-0 lg:max-w-[34rem] lg:shrink-0">
            <p className="text-[15px] leading-relaxed text-[#676672] sm:text-base">
              Governance and management work together to keep ChLPS Canada
              strategically focused, professionally credible and operationally
              effective.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-2 lg:gap-5">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={`reveal flex h-full flex-col rounded-3xl p-6 pb-8 sm:p-8 sm:pb-12 ${card.card}`}
              style={revealStyle(index)}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EBCD78] sm:h-14 sm:w-14">
                <HugeiconsIcon
                  icon={card.icon}
                  size={24}
                  color="#211A73"
                  strokeWidth={1.8}
                />
              </span>

              <h3
                className={`mt-8 text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:mt-10 lg:text-[1.875rem] xl:text-[2.25rem] ${card.titleColor}`}
              >
                {card.title}
              </h3>

              <p
                className={`mt-4 text-[15px] leading-relaxed sm:text-base ${card.bodyColor}`}
              >
                {card.body}
              </p>

              <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:w-fit sm:grid-cols-[max-content_max-content] sm:gap-x-6">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className={`flex items-center gap-2 text-[13px] font-semibold sm:text-sm ${card.pointColor}`}
                  >
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={16}
                      color="#D6BD80"
                      strokeWidth={2.2}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
