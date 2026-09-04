import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Target01Icon, Telescope01Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";

type StatementCard = {
  icon: IconSvgElement;
  label: string;
  title: string;
  body: string;
  card: string;
  border: string;
  /** Sized in em so the two-line balance of the statement holds at every breakpoint. */
  titleWidth: string;
  labelColor: string;
  iconBg: string;
  blob: string;
};

const cards: StatementCard[] = [
  {
    icon: Target01Icon,
    label: "Our Mission",
    title: "Advance the art and science of loss prevention.",
    body: "Promote professional competence, ethical practice, education, research and industry recognition while strengthening standards, organizational resilience, business continuity and sustainable corporate performance.",
    card: "bg-gradient-to-b from-white to-[#F8F7FF]",
    border: "border-[#211A73]/30 border-t-primary",
    titleWidth: "max-w-[12em]",
    labelColor: "text-primary",
    iconBg: "bg-[#ECECF4]",
    blob: "bg-[#EEECF7]",
  },
  {
    icon: Telescope01Icon,
    label: "Our Vision",
    title: "Shape the future of modern loss prevention practice.",
    body: "Build a respected, modern and strategically important profession in Canada and across the international business environment through credible standards, education, certification and a strong professional community.",
    card: "bg-gradient-to-b from-[#FFFAF4] to-white",
    border: "border-[#CDA54E]/60 border-t-secondary",
    titleWidth: "max-w-[13.5em]",
    labelColor: "text-[#151515]",
    iconBg: "bg-[#ECEAEB]",
    blob: "bg-[#F4F3F8]",
  },
];

export default function MissionVisionSection() {
  return (
    <section id="mission-vision" className="bg-[#F5F4F0] py-16 lg:py-20">
      <PageContainer>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Mission and Vision
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[2.5rem]">
                A clear direction for a stronger profession.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={160} className="min-w-0 lg:max-w-[21rem] lg:shrink-0">
            <p className="text-[15px] leading-relaxed text-[#676672] sm:text-base">
              Strengthening loss prevention through standards, education, ethics
              and recognition.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-6 grid gap-4 lg:mt-7 lg:grid-cols-2 lg:gap-5">
          {cards.map((card, index) => (
            <article
              key={card.label}
              className={`reveal relative overflow-hidden rounded-[1.25rem] border border-t-[3px] p-6 sm:p-8 lg:p-9 ${card.border} ${card.card}`}
              style={revealStyle(index)}
            >
              <span
                aria-hidden
                className={`pointer-events-none absolute -bottom-20 -right-14 h-56 w-56 rounded-full ${card.blob}`}
              />

              <div className="relative flex items-center gap-4 sm:gap-5">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 lg:h-16 lg:w-16 ${card.iconBg}`}
                >
                  <HugeiconsIcon
                    icon={card.icon}
                    size={30}
                    color="#211A73"
                    strokeWidth={1.8}
                  />
                </span>
                <h3
                  className={`text-[15px] font-bold uppercase tracking-[0.06em] sm:text-[18px] lg:text-[19px] ${card.labelColor}`}
                >
                  {card.label}
                </h3>
              </div>

              <p
                className={`relative mt-6 text-[1.5rem] font-medium leading-[1.18] tracking-tight text-[#151515] sm:text-[1.75rem] lg:text-[2.25rem] lg:leading-[1.15] xl:text-[2.5rem] ${card.titleWidth}`}
              >
                {card.title}
              </p>

              <p className="relative mt-4 text-[15px] leading-relaxed text-[#676672] sm:text-base">
                {card.body}
              </p>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
