import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import HeaderText from "@/components/HeaderText";
import { Check } from "lucide-react";

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
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8 md:py-24">
      <PageContainer>
        <div className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
          <HeaderText left={"How will certified"} right="membership help me?" />
        </div>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className="reveal flex h-full flex-col rounded-tl-[24px] rounded-br-[24px] border border-[#CDA54E] bg-white p-5 shadow-[0_10px_28px_rgba(33,26,115,0.06)] sm:p-6"
              style={revealStyle(index)}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center ring-secondary ring rounded-full bg-[#EEEAF8] sm:h-14 sm:w-14">
                <Check />
                {/*<HugeiconsIcon
                  icon={}
                  size={24}
                  color="#211A73"
                  strokeWidth={1.8}
                />*/}
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
