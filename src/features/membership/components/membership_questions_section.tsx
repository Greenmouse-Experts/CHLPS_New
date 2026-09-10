"use client";

import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import type { ApplicationQuestionItem } from "@/types";

type MembershipQuestionsSectionProps = {
  questions: (ApplicationQuestionItem | string)[];
  gradeTitle: string;
};

export default function MembershipQuestionsSection({
  questions,
  gradeTitle,
}: MembershipQuestionsSectionProps) {
  if (!questions || questions.length === 0) {
    return null;
  }

  const items = questions.map((q) => (typeof q === "string" ? q : q.question));

  return (
    <section className="bg-[#F8F7FC] py-16 md:py-20 border-t border-[#E7E4F0]">
      <PageContainer>
        <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
          <Reveal>
            <span
              className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-white sm:text-[18px]"
              style={{ "--cut": "0.55rem" } as CSSProperties}
            >
              Pre-Application Screening
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-4 text-[1.75rem] font-bold leading-tight tracking-tight text-[#221A7A] sm:text-3xl lg:text-[38px]">
              Application Questions
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-3 text-[15px] leading-relaxed text-[#676672] sm:text-base">
              Key verification criteria and eligibility questions you will be asked when enrolling for {gradeTitle}.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {items.map((question, index) => (
            <article
              key={index}
              className="reveal flex items-start gap-4 rounded-2xl border border-[#DCD6EC] bg-white p-5 shadow-xs transition-shadow hover:shadow-md sm:p-6"
              style={revealStyle(index)}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEEAF8] text-[#221A7A]">
                <HugeiconsIcon
                  icon={HelpCircleIcon}
                  size={20}
                  color="currentColor"
                  strokeWidth={2}
                />
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B65C4]">
                  Question {index + 1}
                </span>
                <p className="mt-1 text-base font-semibold leading-snug text-[#1D1658]">
                  {question}
                </p>
              </div>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#2A9D8F]">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={18}
                  color="currentColor"
                  strokeWidth={2.2}
                />
              </span>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
