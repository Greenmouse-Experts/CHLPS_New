import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  BankIcon,
  JusticeScale01Icon,
  LockIcon,
  ShieldCheckIcon,
  Target02Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";

interface CoreValueItem {
  title: string;
  description: string;
  icon: IconSvgElement;
  variant: "navy" | "gold";
}

const coreValues: CoreValueItem[] = [
  {
    title: "Integrity",
    description:
      "Act honestly, uphold professional standards and make decisions that strengthen trust.",
    icon: ShieldCheckIcon,
    variant: "navy",
  },
  {
    title: "Confidentiality",
    description:
      "Protect sensitive information and handle professional matters with care and discretion.",
    icon: LockIcon,
    variant: "gold",
  },
  {
    title: "Fairness",
    description:
      "Apply professional standards consistently and treat people with impartiality and respect.",
    icon: JusticeScale01Icon,
    variant: "navy",
  },
  {
    title: "Accountability",
    description:
      "Take responsibility for professional decisions, actions and the outcomes they create.",
    icon: UserCheck01Icon,
    variant: "gold",
  },
  {
    title: "Objectivity",
    description:
      "Base professional judgement on facts, evidence, competence, fairness and sound assessment.",
    icon: Target02Icon,
    variant: "navy",
  },
  {
    title: "Respect for the Law",
    description:
      "Operate within legal requirements while respecting the rights and dignity of others.",
    icon: BankIcon,
    variant: "gold",
  },
];

export default function OurCoreValuesSection() {
  return (
    <section id="core-values" className="bg-white py-8  derma">
      <PageContainer>
        {/* Section Header */}
        <div className="flex items-center justify-center">
          <div className="flex max-w-5xl flex-col items-center justify-center text-center">
            <HeaderText left="OUR" right="CORE VALUES" />
            <div className="">
              <HeaderSubText smallWidth>
                Six values shape the way ChLPS Canada leads, serves members and
                upholds professional trust.
              </HeaderSubText>
            </div>
          </div>
        </div>

        {/* 2-Column Content */}
        <div className=" grid items-center gap-10 lg:mt-4 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left: Image with floating "Our 6 guiding values" badge */}
          <Reveal className="relative mx-auto w-full max-w-[540px] lg:max-w-none">
            <div className="relative">
              {/* Main photo */}
              <div className="relative aspect-[1.12/1] w-full overflow-hidden rounded-[26px] shadow-[0_16px_40px_rgba(33,23,89,0.08)]">
                <Image
                  src="/assets/images/our_core_values.png"
                  alt="Loss prevention professional holding a tablet in a boardroom"
                  fill
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Floating "Our 6 guiding values" circle badge */}
              <div className="absolute -right-4 top-10 z-20 flex h-28 w-28 flex-col items-center justify-center rounded-full border-[5px] border-white bg-[#CDA54E] p-2 text-center text-[#1E1758] shadow-[0_14px_32px_rgba(205,165,78,0.38)] sm:-right-6 sm:top-14 sm:h-36 sm:w-36 sm:border-[6px] lg:-right-8 lg:top-16 lg:h-40 lg:w-40">
                <span className="text-[14px] font-bold leading-snug sm:text-[16px] lg:text-[18px]">
                  Our 6
                </span>
                <span className="text-[14px] font-bold leading-snug sm:text-[16px] lg:text-[18px]">
                  guiding
                </span>
                <span className="text-[14px] font-bold leading-snug sm:text-[16px] lg:text-[18px]">
                  values
                </span>
              </div>
            </div>
          </Reveal>

          {/* Right: 6 Core Value Cards */}
          <RevealGroup className="flex flex-col gap-3.5 sm:gap-4">
            {coreValues.map((value, index) => {
              const isNavy = value.variant === "navy";

              return (
                <article
                  key={value.title}
                  className="reveal flex items-center gap-4 rounded-[18px] border border-[#CDA54E]/40 bg-white p-4 shadow-[0_4px_18px_rgba(205,165,78,0.08)] transition-all duration-200 hover:border-[#CDA54E]/70 hover:shadow-[0_6px_24px_rgba(205,165,78,0.14)] sm:gap-5 sm:px-6 sm:py-4"
                  style={revealStyle(index)}
                >
                  {/* Icon Circle */}
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 ${
                      isNavy
                        ? "bg-[#1E1758] text-white"
                        : "bg-[#F3E6C4] text-[#8C6B1C]"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={value.icon}
                      size={18}
                      color="currentColor"
                      strokeWidth={2}
                    />
                  </span>

                  {/* Text Content */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-bold leading-snug text-[#1E1758] ">
                      {value.title}
                    </h3>
                    <p className="mt-0.5 text-[14px]">{value.description}</p>
                  </div>
                </article>
              );
            })}
          </RevealGroup>
        </div>
      </PageContainer>
    </section>
  );
}
