"use client";

import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type RefObject,
} from "react";
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
import { Reveal } from "@/features/components/reveal";
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

const DESKTOP_MQ = "(min-width: 1024px)";
const HEADER_FALLBACK = 104;

function headerHeight() {
  const header = document.querySelector("header");
  return header ? Math.round(header.getBoundingClientRect().height) : HEADER_FALLBACK;
}

function usePinnedValuesScroll(
  sectionRef: RefObject<HTMLElement | null>,
  leftRef: RefObject<HTMLDivElement | null>,
) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    if (!section || !left) return;

    const mq = window.matchMedia(DESKTOP_MQ);

    const pinLeft = () => {
      const offset = headerHeight();
      section.style.setProperty("--header-offset", `${offset}px`);

      if (!mq.matches) {
        left.style.top = "";
        return;
      }

      const available = window.innerHeight - offset;
      const top = offset + Math.max(16, (available - left.offsetHeight) / 2);
      left.style.top = `${Math.round(top)}px`;
    };

    pinLeft();

    const ro = new ResizeObserver(pinLeft);
    ro.observe(left);
    const header = document.querySelector("header");
    if (header) ro.observe(header);

    window.addEventListener("resize", pinLeft);
    mq.addEventListener("change", pinLeft);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", pinLeft);
      mq.removeEventListener("change", pinLeft);
    };
  }, [leftRef, sectionRef]);
}

function ValueCard({ value }: { value: CoreValue }) {
  const isGold = value.tone === "gold";
  const fill = isGold ? "bg-secondary" : "bg-white";

  return (
    <article className="flex w-full items-stretch">
      <div
        className={`flex min-w-0 flex-1 items-center gap-4 rounded-l-lg py-3.5 pl-4 pr-3 sm:gap-5 sm:pl-5 ${fill}`}
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-white sm:h-[94px] sm:w-[94px] ${
            isGold ? "border-[#111E2A]" : "border-secondary"
          }`}
        >
          <HugeiconsIcon
            icon={value.icon}
            size={45}
            color="#111E2A"
            strokeWidth={1.7}
          />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold leading-snug text-[#151515] sm:text-[20px] lg:text-[25px]">
            {value.title}
          </h3>
          <p
            className={`mt-0.5 text-[14px] leading-relaxed sm:text-[16px] lg:text-[18px] ${
              isGold ? "text-[#1C1662]" : "text-[#676672]"
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
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  usePinnedValuesScroll(sectionRef, leftRef);

  return (
    <section
      id="values"
      ref={sectionRef}
      className="relative bg-[#161058] scroll-mt-[var(--header-offset,6.5rem)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="sticky top-0 h-dvh overflow-hidden">
          <Image
            src={Assets.images.careerPathwaysBg}
            alt=""
            fill
            className="object-cover object-bottom"
            sizes="100vw"
          />
        </div>
      </div>

      <PageContainer className="relative z-10 py-16 md:py-24">
        <Reveal className="flex justify-center">
          <span
            className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-1.5 text-[15px] font-bold uppercase tracking-[0.14em] text-white sm:text-[20px]"
            style={{ "--cut": "0.55rem" } as CSSProperties}
          >
            OUR CORE VALUES
          </span>
        </Reveal>

        <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12 lg:mt-12 xl:gap-16">
          <div
            ref={leftRef}
            className="lg:sticky lg:top-[6.5rem] lg:z-10 lg:self-start"
          >
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
                <p className="mt-8 max-w-[22rem] text-[14px] leading-relaxed text-[#FFFFFFCC] sm:text-[20px]">
                  Six values shape the way ChLPS Canada leads, serves members and
                  upholds professional trust.
                </p>
              </Reveal>
              <Reveal delay={140}>
                <h2 className="mt-5 max-w-md text-[1.7rem] font-medium leading-[1.15] tracking-tight text-white lg:text-[40px]">
                  The standards behind trusted loss prevention practice.
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-5 max-w-[24rem] text-[13px] leading-relaxed text-[#FFFFFFCC] sm:text-[20px]">
                  ChLPS Canada is guided by six professional values that shape how
                  members serve, lead, protect information, make decisions and
                  uphold public trust.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="mt-10 flex min-w-0 flex-col items-start gap-4 sm:gap-5 lg:mt-0 lg:min-h-[calc(100dvh-var(--header-offset,6.5rem))] lg:pb-[calc((100dvh-var(--header-offset,6.5rem)-7rem)/2)]">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`w-full max-w-[641px] ${
                  index % 2 === 1 ? "ml-4 sm:ml-10 lg:ml-16" : ""
                }`}
              >
                <ValueCard value={value} />
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
