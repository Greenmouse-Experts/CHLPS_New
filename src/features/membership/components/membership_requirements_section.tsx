import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";

export type MembershipRequirementColumn = {
  title: string;
  icon: IconSvgElement;
  items: string[];
  tone: "navy" | "gold";
};

type MembershipRequirementsSectionProps = {
  columns: MembershipRequirementColumn[];
};

const toneClass = {
  navy: {
    border: "border border-[#DFDBEA]",
    card: "bg-white",
    bar: "bg-[#221A7A]",
    iconWrap: "bg-[#EDEAF88C]",
    icon: "#6B65C4",
    row: "bg-[#EDEAF88C]",
    checkWrap: "bg-white",
    check: "#221A7A",
    iconBorder: "border border-[#CFA84E66] ",
  },
  gold: {
    border: "border border-[#ECD89F]",
    bar: "bg-[#CDA54E]",
    card: "bg-[#F7EFD9]",
    iconWrap: "bg-[#F0E6C8]",
    icon: "#CDA54E",
    row: "bg-white",
    checkWrap: "bg-[#F7EFD9]",
    check: "#CDA54E",
    iconBorder: "border border-[#F7EFD9]",
  },
} as const;

export default function MembershipRequirementsSection({
  columns,
}: MembershipRequirementsSectionProps) {
  const activeColumns = (columns || []).filter(
    (col) => col.items && col.items.length > 0,
  );

  if (activeColumns.length === 0) {
    return null;
  }

  const gridClass =
    activeColumns.length === 1
      ? "grid grid-cols-1 max-w-2xl mx-auto gap-4 sm:gap-5"
      : "grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2";

  return (
    <section className="bg-[#F7F6FB] py-16 md:py-24">
      <PageContainer>
        <RevealGroup className={gridClass}>
          {activeColumns.map((column, index) => {
            const tone = toneClass[column.tone];

            return (
              <article
                key={column.title}
                className={`reveal flex h-full flex-col overflow-hidden rounded-b-[1.75rem] shadow-[0_12px_32px_rgba(33,26,115,0.06)] ${tone.card} ${tone.border}`}
                style={revealStyle(index)}
              >
                <div aria-hidden className={`h-2.5 w-full ${tone.bar}`} />

                <div className="flex flex-1 flex-col p-5 sm:p-7 lg:p-8">
                  <header className="flex items-center gap-3.5">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.9rem] sm:h-14 sm:w-14 ${tone.iconWrap}`}
                    >
                      <HugeiconsIcon
                        icon={column.icon}
                        size={24}
                        color={tone.icon}
                        strokeWidth={1.8}
                      />
                    </span>
                    <h2 className="text-[1.25rem] font-bold leading-tight tracking-tight text-[#161058] sm:text-[1.5rem] lg:text-[1.75rem]">
                      {column.title}
                    </h2>
                  </header>

                  <ul className="mt-6 flex flex-col gap-2.5 sm:mt-7 sm:gap-3">
                    {column.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className={`flex items-start gap-3 rounded-[0.9rem] p-3 sm:gap-3.5 sm:p-3.5 ${tone.row}`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6 ${tone.checkWrap} ${tone.iconBorder}`}
                        >
                          <HugeiconsIcon
                            icon={Tick02Icon}
                            size={13}
                            color={tone.check}
                            strokeWidth={2.4}
                          />
                        </span>
                        <span className="text-[13px] leading-relaxed text-[#2B2367] sm:text-[15px]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
