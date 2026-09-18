import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import type { CertificationDetail } from "@/features/certification/certification_details";
import HeaderText from "@/components/HeaderText";

const CARD_SHADOW =
  "0 18px 40px 0 rgba(34, 26, 122, 0.08), inset 0 4px 25px 0 rgba(34, 26, 122, 0.25)";

export default function CertificationDetailsRequirementsSection({
  detail,
}: {
  detail: CertificationDetail;
}) {
  if (!detail.requirements || detail.requirements.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <PageContainer>
        <Reveal>
          <article
            className="mx-auto max-w-[56rem] rounded-[1.75rem] bg-white px-5 py-8 sm:rounded-[2.25rem] sm:px-8 sm:py-10 lg:px-14 lg:py-12"
            style={{ boxShadow: CARD_SHADOW } as CSSProperties}
          >
            <div className="flex flex-col items-center text-center">
              <HeaderText left="entry" right="requirements" switch />

              <h2 className="mt-5 text-[1.35rem] font-medium leading-snug tracking-tight text-[#221A7A] sm:mt-6 sm:text-[1.75rem] lg:whitespace-nowrap lg:text-[1.85rem]">
                {detail.requirementsTitle}
              </h2>
            </div>

            <ul className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:gap-3">
              {detail.requirements.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-[18px] border border-[#E2C97A] bg-[#F6F4FC] px-3.5 py-3 sm:gap-3.5 sm:px-4 sm:py-3.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white sm:h-7 border border-[#CDA54E80] sm:w-7">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={14}
                      color="#6B65C4"
                      strokeWidth={2.4}
                    />
                  </span>
                  <span className="min-w-0 text-left text-[13px] leading-relaxed text-[#6D6885] sm:text-[14px] lg:text-[15px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </PageContainer>
    </section>
  );
}
