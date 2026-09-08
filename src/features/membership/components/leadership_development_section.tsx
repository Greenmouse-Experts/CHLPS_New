import type { CSSProperties } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";

export default function LeadershipDevelopmentSection() {
  return (
    <section
      id="leadership-development"
      className="bg-[#EEEAF8] py-16 lg:py-20"
    >
      <PageContainer>
        <Reveal className="mx-auto max-w-[1378px]">
          <div className="rounded-tr-[1.75rem] rounded-bl-[1.75rem] bg-white px-6 py-8 shadow-[inset_0_4px_20px_0_rgba(0,0,0,0.25)] sm:rounded-tr-[2rem] sm:rounded-bl-[2rem] sm:px-8 sm:py-10 lg:px-12 lg:py-12 xl:px-14 xl:py-14">
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,0.8fr)] lg:gap-10 xl:gap-14">
              <div className="min-w-0">
                <span
                  className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-white sm:text-[20px]"
                  style={{ "--cut": "0.55rem" } as CSSProperties}
                >
                  Leadership Development
                </span>

                <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px]">
                  Build the capability to lead beyond the technical role.
                </h2>

                <p className="mt-4 max-w-[38rem] text-[15px] leading-relaxed text-[#676672] sm:text-base lg:mt-5">
                  For senior loss prevention professionals, advanced development
                  supports stronger leadership, strategic thinking, professional
                  partnerships and better decision-making in complex
                  organisational environments.
                </p>
              </div>

              <div
                aria-hidden
                className="hidden h-full min-h-[8rem] w-px self-stretch bg-[#E4E2EC] lg:block"
              />

              <div className="min-w-0 border-t border-[#E4E2EC] pt-8 lg:border-t-0 lg:pt-0">
                <h3 className="text-[1.25rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-[1.5rem] lg:text-[1.75rem] xl:text-[1.875rem]">
                  Develop your next professional advantage.
                </h3>

                <p className="mt-3 text-[15px] leading-relaxed text-[#676672] sm:text-base lg:mt-4">
                  Explore certification and advanced learning designed to
                  complement your membership journey and support progression
                  into supervisory, managerial and strategic roles.
                </p>

                <Link
                  href="/#certification"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-5 text-[13px] font-semibold text-[#111E2A] transition-all duration-200 hover:brightness-95 sm:mt-7 sm:h-12 sm:px-6 sm:text-sm"
                >
                  Explore Certification
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={2}
                  />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
