import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";

type MembershipCareerPathwaysSectionProps = {
  gradeTitle: string;
  items: string[];
};

export default function MembershipCareerPathwaysSection({
  gradeTitle,
  items,
}: MembershipCareerPathwaysSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F4F3F9] py-16 md:py-24">
      <PageContainer>
        <Reveal>
          <div className="rounded-[1.75rem] bg-white p-6 shadow-[0_16px_40px_rgba(33,26,115,0.06)] sm:p-10 lg:rounded-[2rem] lg:p-12 xl:p-14">
            <h2 className="text-[1.75rem] font-medium leading-tight tracking-tight text-[#221A7A] sm:text-3xl lg:text-[2.35rem] xl:text-[40px]">
              Career Pathways for {gradeTitle}s
            </h2>

            <RevealGroup className="mt-6 sm:mt-8">
              <ul className="flex flex-col gap-2.5 sm:gap-3">
                {items.map((item, index) => (
                  <li
                    key={item}
                    className="reveal flex items-center gap-3 rounded-full bg-[#F8F3E3] px-3.5 py-3.5 sm:gap-3.5 sm:px-5 sm:py-4"
                    style={revealStyle(index)}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#CFA84E66] bg-white sm:h-8 sm:w-8">
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        size={14}
                        color="#221A7A"
                        strokeWidth={2.4}
                      />
                    </span>
                    <span className="text-[13px] leading-snug text-[#4A4954] sm:text-[15px] sm:leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealGroup>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
