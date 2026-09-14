import type { CSSProperties } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Alert02Icon,
  CctvCameraIcon,
  EyeIcon,
  File02Icon,
  HandshakeIcon,
  JusticeScale01Icon,
  Search01Icon,
  Shield01Icon,
  SirenIcon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import type { CertificationDetail } from "@/features/certification/certification_details";

const moduleIcons: IconSvgElement[] = [
  Shield01Icon,
  Store01Icon,
  CctvCameraIcon,
  EyeIcon,
  HandshakeIcon,
  File02Icon,
  JusticeScale01Icon,
  SirenIcon,
  Search01Icon,
  Alert02Icon,
];

export default function CertificationDetailsStudiesSection({
  detail,
}: {
  detail: CertificationDetail;
}) {
  return (
    <section className="bg-[#F4F3F8] py-14 sm:py-16 lg:py-20">
      <PageContainer>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <span
              className="cut-tr-bl inline-block bg-[#6B65C4] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:px-3.5 sm:text-[12px]"
              style={{ "--cut": "0.55rem" } as CSSProperties}
            >
              {detail.studiesBadge}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-5 text-[1.85rem] font-medium leading-tight tracking-tight text-[#221A7A] sm:mt-6 sm:text-[2.35rem] lg:text-[2.75rem]">
              {detail.studiesTitle}
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-3.5 lg:gap-4">
          {detail.modules.map((module, index) => (
            <article
              key={module}
              className="reveal flex items-center gap-3 rounded-[1.15rem] border border-[#CDA54EA6] bg-white px-3.5 py-3.5 sm:gap-3.5 sm:rounded-[16px] sm:px-4 sm:py-4"
              style={revealStyle(index)}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#221A7A] sm:h-10 sm:w-10">
                <HugeiconsIcon
                  icon={moduleIcons[index] ?? Shield01Icon}
                  size={16}
                  color="#FFFFFF"
                  strokeWidth={1.8}
                />
              </span>
              <p className="min-w-0 text-left text-[13px] font-medium leading-snug text-[#221A7A] sm:text-[14px] lg:text-[15px]">
                {module}
              </p>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
