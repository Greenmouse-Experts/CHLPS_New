import type { CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ClipboardCheckIcon,
  CourtHouseIcon,
  JusticeScale01Icon,
  LockIcon,
  ScanEyeIcon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

type CoreValue = {
  icon: IconSvgElement;
  title: string;
  body: string;
  tone: "cream" | "gold";
};

const values: CoreValue[] = [
  {
    icon: ShieldCheckIcon,
    title: "Integrity",
    body: "Act honestly, uphold professional standards and make decisions that strengthen trust.",
    tone: "cream",
  },
  {
    icon: LockIcon,
    title: "Confidentiality ",
    body: "Protect sensitive information and handle professional matters with care and discretion.",
    tone: "gold",
  },
  {
    icon: JusticeScale01Icon,
    title: "Fairness",
    body: "Apply professional standards consistently and treat people with impartiality and respect.",
    tone: "cream",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Accountability",
    body: "Take responsibility for professional decisions, actions and the outcomes they create.",
    tone: "gold",
  },
  {
    icon: ScanEyeIcon,
    title: "Objectivity",
    body: "Base professional judgement on facts, evidence, competence, fairness and sound assessment.",
    tone: "cream",
  },
  {
    icon: CourtHouseIcon,
    title: "Respect for the Law",
    body: "Operate within legal requirements while respecting the rights and dignity of others.",
    tone: "gold",
  },
];

function ValueCard({ value }: { value: CoreValue }) {
  const isGold = value.tone === "gold";
  const fill = isGold ? "bg-secondary" : "bg-white";

  return (
    <article className="flex w-full items-stretch">
      <div
        className={`flex min-w-0 flex-1 items-center gap-4 rounded-l-lg py-3.5 pl-4 pr-3 sm:gap-5 sm:pl-5 ${fill}`}
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-white sm:h-[3.25rem] sm:w-[3.25rem] ${
            isGold ? "border-[#111E2A]" : "border-secondary"
          }`}
        >
          <HugeiconsIcon
            icon={value.icon}
            size={22}
            color="#111E2A"
            strokeWidth={1.7}
          />
        </span>
        <div className="min-w-0">
          <h3 className="text-[20px] font-bold leading-snug text-[#111E2A] sm:text-[25px]">
            {value.title}
          </h3>
          <p
            className={`mt-0.5 text-[12px] leading-relaxed sm:text-[17px] ${
              isGold ? "text-[#111E2A]" : "text-[#111E2A]/70"
            }`}
          >
            {value.body}
          </p>
        </div>
      </div>
      <span
        aria-hidden
        className={`core-value-arrow -ml-px w-5 shrink-0 sm:w-6 ${fill}`}
      />
    </article>
  );
}

export default function CoreValuesSection() {
  return (
    <section
      id="values"
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
        <Reveal className="flex justify-center">
          <span
            className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:text-[13px]"
            style={{ "--cut": "0.55rem" } as CSSProperties}
          >
            OUR CORE VALUES
          </span>
        </Reveal>

        <div className="mt-10 grid items-start gap-12 lg:mt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.2fr)] lg:gap-12 xl:gap-16">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            <Reveal>
              <div className="flex h-[12.5rem] w-[12.5rem] items-center justify-center rounded-full bg-white sm:h-[14.5rem] sm:w-[14.5rem]">
                <div className="text-center">
                  <p className="text-[5rem] font-bold leading-none tracking-tight text-[#111E2A] sm:text-[5.75rem]">
                    6
                  </p>
                  <p className="mt-1.5 text-[11px] font-bold uppercase leading-[1.25] tracking-[0.18em] text-[#111E2A] sm:text-xs">
                    GUIDING
                    <br />
                    VALUES
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-8 max-w-[22rem] text-[14px] leading-relaxed text-white/90 sm:text-[15px]">
                Six values shape the way ChLPS Canada leads, serves members and
                upholds professional trust.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <h2 className="mt-5 max-w-md text-[1.7rem] font-bold leading-[1.15] tracking-tight text-white sm:text-[2rem] lg:text-[2.25rem]">
                The standards behind trusted loss prevention practice.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 max-w-[24rem] text-[13px] leading-relaxed text-white/80 sm:text-sm">
                ChLPS Canada is guided by six professional values that shape how
                members serve, lead, protect information, make decisions and
                uphold public trust.
              </p>
            </Reveal>
          </div>

          <RevealGroup className="flex min-w-0 flex-col gap-4 sm:gap-5">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`reveal w-full max-w-[641px] ${
                  index % 2 === 1 ? "ml-10 sm:ml-16" : ""
                }`}
                style={revealStyle(index)}
              >
                <ValueCard value={value} />
              </div>
            ))}
          </RevealGroup>
        </div>
      </PageContainer>
    </section>
  );
}
