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
import HeaderText from "@/components/HeaderText";

const outcomeIcons: IconSvgElement[] = [
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
  const outcomes =
    detail.courseOutcomes && detail.courseOutcomes.length > 0
      ? detail.courseOutcomes
      : detail.modules && detail.modules.length > 0
        ? detail.modules
        : [];

  if (!outcomes || outcomes.length === 0) {
    return null;
  }

  const badge = detail.studiesBadge || "Course Outcomes";
  const title = detail.studiesTitle || "Course Outcomes";

  return (
    <section className="bg-[#F4F3F8] border-t border-b border-current/30 py-14 sm:py-16 ">
      <PageContainer>
        <div className="flex flex-col items-center text-center">
          <HeaderText left="learning" right="outcomes" switch />
          {/*<Reveal>
            <span
              className="cut-tr-bl inline-block bg-[#6B65C4] px-3 py-1.5  font-bold uppercase tracking-[0.14em] text-white sm:px-3.5 sm:"
              style={{ "--cut": "0.55rem" } as CSSProperties}
            >
              {badge}
            </span>
          </Reveal>*/}
          {/*
          <Reveal delay={80}>
            <h2 className="mt-5 text-[1.85rem] font-medium leading-tight tracking-tight text-[#221A7A] sm:mt-6 sm:text-[2.35rem] lg:text-[2.75rem]">
              {title}
            </h2>
          </Reveal>*/}
        </div>

        <RevealGroup className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-3.5 lg:gap-4">
          {outcomes.map((outcome, index) => (
            <article
              key={`${outcome}-${index}`}
              className="reveal flex items-center gap-3 rounded-[1.15rem] border border-[#CDA54EA6] bg-white px-3.5 py-3.5 sm:gap-3.5 sm:rounded-[16px] sm:px-4 sm:py-4"
              style={revealStyle(index)}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#221A7A] sm:h-10 sm:w-10">
                <HugeiconsIcon
                  icon={
                    outcomeIcons[index % outcomeIcons.length] ?? Shield01Icon
                  }
                  size={16}
                  color="#FFFFFF"
                  strokeWidth={2.2}
                />
              </span>
              <h3 className="min-w-0  font-medium leading-snug text-[#221A7A] sm:text-[14px]">
                {outcome}
              </h3>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
