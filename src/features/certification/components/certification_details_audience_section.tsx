import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserCheck01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import HeaderText from "@/components/HeaderText";
import type { CertificationDetail } from "@/features/certification/certification_details";

const CARD_SHADOW =
  "0 18px 40px 0 rgba(34, 26, 122, 0.08), inset 0 4px 25px 0 rgba(34, 26, 122, 0.25)";

export default function CertificationDetailsAudienceSection({
  detail,
}: {
  detail: CertificationDetail;
}) {
  const items = detail.audience ?? [];

  if (items.length === 0) {
    return null;
  }

  return null;
  return (
    <section className="bg-white py-14 sm:py-8">
      <PageContainer>
        <Reveal>
          <article
            className="mx-auto max-w-[56rem] rounded-[1.75rem] bg-white px-5 py-8 sm:rounded-[2.25rem] sm:px-8 sm:py-10 lg:px-14 lg:py-12"
            style={{ boxShadow: CARD_SHADOW } as CSSProperties}
          >
            <div className="flex flex-col items-center text-center">
              <HeaderText left="who" right="is it for" switch />
            </div>

            {detail.audienceTitle && (
              <p className="mt-2 text-center text-sm leading-relaxed text-[#6D6885] sm:text-[15px]">
                {detail.audienceTitle}
              </p>
            )}

            <ul className="mt-6 flex flex-col gap-2.5 sm:gap-3">
              {items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-[18px] border border-[#E2C97A] bg-[#F6F4FC] px-3.5 py-3 sm:gap-3.5 sm:px-4 sm:py-3.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#CDA54E80] bg-white sm:h-7 sm:w-7">
                    <HugeiconsIcon
                      icon={UserCheck01Icon}
                      size={14}
                      color="#6B65C4"
                      strokeWidth={2.4}
                    />
                  </span>
                  <span className="min-w-0 text-left leading-relaxed text-[#6D6885] sm:text-[14px] lg:text-[15px]">
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
