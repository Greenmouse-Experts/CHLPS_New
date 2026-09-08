import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";

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
  return (
    <section className="bg-white py-16 md:py-24">
      <PageContainer>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-white sm:text-[20px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                {badge}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px]">
                {title}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={160} className="min-w-0 lg:max-w-[26rem] lg:shrink-0">
            <p className="text-[15px] leading-relaxed text-[#676672] sm:text-base">
              {body}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className="reveal flex h-full items-start gap-3.5 rounded-[1.25rem] border border-[#CDA54E] bg-white p-5 shadow-[0_10px_28px_rgba(33,26,115,0.06)] sm:gap-4 sm:p-6"
              style={revealStyle(index)}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.85rem] bg-[#EEEAF8] sm:h-12 sm:w-12">
                <HugeiconsIcon
                  icon={card.icon}
                  size={22}
                  color="#211A73"
                  strokeWidth={1.8}
                />
              </span>
              <div className="min-w-0 pt-0.5">
                <h3 className="text-[16px] font-bold leading-snug tracking-tight text-[#161058] sm:text-[17px] lg:text-[1.125rem]">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#747277] sm:text-[14px]">
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
