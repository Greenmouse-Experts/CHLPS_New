import type { CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  BankIcon,
  CheckmarkBadge01Icon,
  GlobalIcon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const paragraphs = [
  "Founded in 2021, ChLPS Canada is a federally incorporated not-for-profit association advancing professional competence, ethics and business understanding in loss prevention.",
  "ChLPS Canada connects professionals across loss prevention, security, investigations, risk, compliance and related disciplines.",
  "ChLPS Canada focuses on professional standards, specialist education, recognition, continuous development and clear career pathways.",
];

const highlights: {
  icon: IconSvgElement;
  title: string;
  body: string;
}[] = [
  {
    icon: BankIcon,
    title: "Federal",
    body: "Incorporated in Canada as a not-for-profit professional association.",
  },
  {
    icon: CheckmarkBadge01Icon,
    title: "Professional",
    body: "Focused on competence, integrity, ethical conduct and credible recognition.",
  },
  {
    icon: GlobalIcon,
    title: "Global",
    body: "Canada-focused standards and learning with international relevance.",
  },
];

export default function OurStorySection() {
  return (
    <section
      id="our-story"
      className="relative overflow-hidden bg-white py-16 lg:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={Assets.images.ourStoryBg}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-14">
          <div className="flex min-w-0 flex-col">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Our Story
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 max-w-[490px] text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[2.5rem]">
                Built to strengthen the profession behind resilient
                organizations.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-5 flex max-w-[31rem] flex-col gap-4 lg:mt-6">
                {paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-relaxed text-[#5B5A66] sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>

            <RevealGroup className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-8">
              {highlights.map((highlight, index) => (
                <article
                  key={highlight.title}
                  className="reveal flex h-full flex-col rounded-2xl bg-[#F5F4F1] p-4 sm:p-5 border border-[#1C166214]"
                  style={revealStyle(index)}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                    <HugeiconsIcon
                      icon={highlight.icon}
                      size={20}
                      color="#211A73"
                      strokeWidth={1.8}
                    />
                  </span>
                  <h3 className="mt-4 text-base font-bold leading-tight text-primary sm:text-[18px]">
                    {highlight.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#6E6B78]">
                    {highlight.body}
                  </p>
                </article>
              ))}
            </RevealGroup>
          </div>

          <Reveal delay={120} className="min-w-0">
            <div className="relative">
              <div className="overflow-hidden rounded-[1.75rem]">
                <Image
                  src={Assets.images.ourStory}
                  alt="ChLPS Canada members in conversation outside an office building"
                  width={3064}
                  height={3540}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="h-auto w-full object-cover"
                />
              </div>

              <div className="absolute bottom-[4%] left-[7%] flex aspect-square w-[104px] flex-col items-center justify-center rounded-full bg-secondary text-center text-primary sm:w-[140px] lg:w-[150px] xl:w-[180px]">
                <span className="text-[1.5rem] font-medium leading-none sm:text-[2rem] xl:text-[2.5rem]">
                  2021
                </span>
                <span className="mt-1.5 text-[9px] font-bold uppercase leading-tight tracking-[0.08em] sm:text-[10px] xl:text-xs">
                  Founded in
                  <br />
                  Canada
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
