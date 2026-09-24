import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import Header from "@/features/components/header";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";

export type MembershipJobCard = {
  icon: IconSvgElement;
  title: string;
  body: string;
};

type MembershipJobsSectionProps = {
  badge: string;
  title: string;
  body: string;
  cards: MembershipJobCard[];
};

export default function MembershipJobsSection({
  badge,
  title,
  body,
  cards,
}: MembershipJobsSectionProps) {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8 ">
      <PageContainer>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="w-full">
            <HeaderText left="career" right="opportunities" />
            <HeaderSubText>{body}</HeaderSubText>
          </div>
        </div>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className="reveal flex h-full items-start gap-3.5 rounded-[1.25rem] border border-[#CDA54E] bg-white p-5 shadow-[0_10px_28px_rgba(33,26,115,0.06)] sm:gap-4 sm:p-6"
              style={revealStyle(index)}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.85rem] bg-[#EDEAF88C] sm:h-12 sm:w-12">
                <HugeiconsIcon
                  icon={card.icon}
                  size={22}
                  color="#211A73"
                  strokeWidth={1.8}
                />
              </span>
              <div className="min-w-0">
                <h3 className="text-[15px] font-bold leading-snug text-[#221A7A] sm:text-[17px]">
                  {card.title}
                </h3>
                <p className="mt-1.5  leading-relaxed text-[#676672] sm:text-[14px]">
                  {card.body}
                </p>
              </div>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
