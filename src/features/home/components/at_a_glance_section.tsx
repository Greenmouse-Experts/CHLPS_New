import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

type GlanceCard = {
  value: string;
  title: string;
  body: string;
  badge: string;
  tone: "lilac" | "gold" | "primary";
};

const cards: GlanceCard[] = [
  {
    value: "6",
    title: "Membership levels",
    body: "A structured pathway from student and affiliate levels through certified and corporate membership.",
    badge: "6 pathways",
    tone: "lilac",
  },
  {
    value: "4",
    title: "Certification pathways",
    body: "Progressive credentials recognizing growing knowledge, experience and professional responsibility.",
    badge: "4 credentials",
    tone: "gold",
  },
  {
    value: "5",
    title: "Core values",
    body: "Protect assets, preserve profits, prevent losses, secure the business bottom line and support continuity.",
    badge: "5 pillars",
    tone: "primary",
  },
];

const toneClass: Record<GlanceCard["tone"], string> = {
  lilac: "bg-lilac text-primary",
  gold: "bg-secondary text-[#3D2E14]",
  primary: "bg-primary text-white",
};

function GlanceStatCard({ card }: { card: GlanceCard }) {
  const isPrimary = card.tone === "primary";

  return (
    <article
      className={`cut-br flex items-stretch gap-4 overflow-hidden px-5 py-5 sm:gap-5 sm:px-6 sm:py-6 ${toneClass[card.tone]}`}
      style={{ "--cut": "1.65rem" } as CSSProperties}
    >
      <span className="outline-stat shrink-0 self-center text-[4.25rem] font-bold leading-none sm:text-[5rem] lg:text-[5.5rem]">
        {card.value}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] sm:text-sm">
          {card.title}
        </h3>
        <p
          className={`mt-1.5 text-[13px] leading-relaxed sm:text-sm ${
            isPrimary ? "text-white/90" : "opacity-90"
          }`}
        >
          {card.body}
        </p>
        <span
          className={`mt-3 self-end rounded-full px-3 py-1 text-[11px] font-semibold sm:mt-4 ${
            isPrimary
              ? "border border-white/90 bg-transparent text-white"
              : "bg-white"
          }`}
        >
          {card.badge}
        </span>
      </div>
    </article>
  );
}

export default function AtAGlanceSection() {
  return (
    <section
      id="about"
      className="relative z-0 -mt-10 overflow-hidden bg-white pb-16 pt-20 md:pb-24 md:pt-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(34rem,75vw)] w-[min(34rem,75vw)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full opacity-[0.07] mix-blend-multiply"
      >
        <Image
          src={Assets.icons.logo}
          alt=""
          width={560}
          height={560}
          className="h-[145%] w-auto max-w-none -translate-x-[6%] -translate-y-[10%]"
        />
      </div>

      <PageContainer className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          <div className="max-w-xl">
            <Reveal>
              <span
                className="cut-tr inline-block bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                CHLPS CANADA AT A GLANCE
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-text sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[2.6rem]">
                A structured professional body built for long-term development.
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-text/70 sm:text-base lg:mt-5">
                From membership and certification to professional standards and
                business resilience, these figures highlight the framework
                behind the Association and show how professionals can progress
                within it.
              </p>
            </Reveal>
          </div>

          <RevealGroup className="flex flex-col gap-3 sm:gap-4">
            {cards.map((card, index) => (
              <div key={card.title} className="reveal" style={revealStyle(index)}>
                <GlanceStatCard card={card} />
              </div>
            ))}
          </RevealGroup>
        </div>
      </PageContainer>
    </section>
  );
}
