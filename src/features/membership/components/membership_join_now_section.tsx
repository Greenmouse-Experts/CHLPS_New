import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";

export type MembershipJoinNowCard = {
  title: string;
  body: string;
};

type MembershipJoinNowSectionProps = {
  title: string;
  paragraphs: string[];
  tags: string[];
  cards: MembershipJoinNowCard[];
};

export default function MembershipJoinNowSection({
  title,
  paragraphs,
  tags,
  cards,
}: MembershipJoinNowSectionProps) {
  return (
    <section className="bg-[#F8F5EC] py-16 md:py-24">
      <PageContainer>
        <Reveal>
          <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_16px_40px_rgba(33,26,115,0.06)] sm:p-10 lg:rounded-[2rem] lg:p-12 xl:p-14">
            <h2 className="text-[1.75rem] font-medium leading-tight tracking-tight text-[#221A7A] sm:text-3xl lg:text-[2.35rem] xl:text-[46px]">
              {title}
            </h2>

            <div className="mt-5 max-w-[54rem] space-y-4 sm:mt-6">
              {paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[15px] leading-relaxed text-[#6D6885] sm:text-[18px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-7">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full bg-[#EEEAF8] px-4 py-2 text-[13px] font-semibold text-[#161058] sm:px-5 sm:text-[14px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <RevealGroup className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
              {cards.map((card, index) => (
                <article
                  key={card.title}
                  className="reveal rounded-[1.15rem] border border-[#DFDBEA] bg-[#F6F5F9] p-5 sm:p-6"
                  style={revealStyle(index)}
                >
                  <h3 className="text-[16px] font-bold leading-snug text-[#221A7A] sm:text-[17px]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#676672] sm:text-[15px]">
                    {card.body}
                  </p>
                </article>
              ))}
            </RevealGroup>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
