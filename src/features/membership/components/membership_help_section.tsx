import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";

export type MembershipHelpCard = {
  icon: IconSvgElement;
  title: string;
  body: string;
};

type MembershipHelpSectionProps = {
  badge: string;
  title: string;
  body: string;
  cards: MembershipHelpCard[];
};

export default function MembershipHelpSection({
  badge,
  title,
  body,
  cards,
}: MembershipHelpSectionProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <PageContainer>
        <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
          <Reveal>
            <span
              className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-white sm:text-[20px]"
              style={{ "--cut": "0.55rem" } as CSSProperties}
            >
              {badge}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-5 sm:max-w-[590px] text-[1.75rem] font-medium leading-tight tracking-tight text-[#221A7A] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px]">
              {title}
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6D6885] sm:text-[17px] lg:mt-5">
              {body}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className="reveal flex h-full flex-col rounded-tl-[24px] rounded-br-[24px] border border-[#CDA54E] bg-white p-5 shadow-[0_10px_28px_rgba(33,26,115,0.06)] sm:p-6"
              style={revealStyle(index)}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEEAF8] sm:h-14 sm:w-14">
                <HugeiconsIcon
                  icon={card.icon}
                  size={24}
                  color="#211A73"
                  strokeWidth={1.8}
                />
              </span>
              <h3 className="mt-8 text-[17px] font-bold leading-tight tracking-tight text-[#221A7A] sm:mt-10 sm:text-[20px] lg:text-[24px]">
                {card.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6D6885] sm:text-[15px]">
                {card.body}
              </p>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
