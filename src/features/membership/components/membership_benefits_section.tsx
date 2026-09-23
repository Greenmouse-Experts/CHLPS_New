import type { CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  BookOpenCheckIcon,
  ChartHistogramIcon,
  HandshakeIcon,
  Megaphone01Icon,
  News01Icon,
  PresentationBarChart01Icon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";

type BenefitTone = "navy" | "white" | "gold" | "lilac";

const benefits: {
  icon: IconSvgElement;
  title: string;
  body: string;
  tone: BenefitTone;
}[] = [
  {
    icon: ChartHistogramIcon,
    title: "Career Development",
    body: "Progress through clearer professional learning, development and certification pathways.",
    tone: "navy",
  },
  {
    icon: BookOpenCheckIcon,
    title: "Accredited Learning",
    body: "Access professional programs aligned with relevant standards and applied industry knowledge.",
    tone: "white",
  },
  {
    icon: News01Icon,
    title: "Industry Insight",
    body: "Stay informed through professional content, emerging practice and current loss prevention thinking.",
    tone: "gold",
  },
  {
    icon: PresentationBarChart01Icon,
    title: "Events & Webinars",
    body: "Learn through professional sessions and events led by experienced practitioners and specialists.",
    tone: "lilac",
  },
  {
    icon: UserGroupIcon,
    title: "Professional Network",
    body: "Connect with practitioners across loss prevention, corporate security, risk and related disciplines.",
    tone: "lilac",
  },
  {
    icon: ShieldCheckIcon,
    title: "Professional Credibility",
    body: "Strengthen your standing through recognised credentials and defined professional pathways.",
    tone: "navy",
  },
  {
    icon: HandshakeIcon,
    title: "Community & Support",
    body: "Be part of a professional community built around shared learning, connection and growth.",
    tone: "white",
  },
  {
    icon: Megaphone01Icon,
    title: "Professional Voice",
    body: "Contribute to stronger standards, collaboration and the long-term development of loss prevention.",
    tone: "gold",
  },
];

const toneClass: Record<BenefitTone, string> = {
  navy: "bg-[#161058] text-white",
  white: "bg-white text-[#151515]",
  gold: "bg-[#CDA54E] text-[#161058]",
  lilac: "bg-[#EEEAF8] text-[#161058]",
};

export default function MembershipBenefitsSection() {
  return (
    <section
      id="membership-benefits"
      className="relative overflow-hidden border-t border-[#211A734D] bg-[#F5F4F1] py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-0 z-0 h-[min(92%,920px)] w-[min(72%,780px)]"
      >
        <Image
          src={Assets.images.border}
          alt=""
          fill
          className="object-contain object-right-top"
          sizes="(max-width: 1024px) 70vw, 40vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="flex w-full flex-col">
            <HeaderText left="benefits of" right="membership" />
            <HeaderSubText>
              Membership supports learning, recognition, community and
              professional growth.
            </HeaderSubText>
          </div>
        </div>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
          {benefits.map((benefit, index) => {
            const isNavy = benefit.tone === "navy";

            return (
              <article
                key={benefit.title}
                className={`reveal flex h-full flex-col rounded-tl-[1.75rem] rounded-br-[1.75rem] ring  ring-secondary p-5 sm:p-6 ${toneClass[benefit.tone]}`}
                style={revealStyle(index)}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(33,26,115,0.08)] sm:h-14 sm:w-14">
                  <HugeiconsIcon
                    icon={benefit.icon}
                    size={24}
                    color="#211A73"
                    strokeWidth={1.8}
                  />
                </span>

                <h3 className="mt-8 text-[17px] font-bold leading-tight tracking-tight sm:mt-10 sm:text-lg lg:text-[1.375rem]">
                  {benefit.title}
                </h3>

                <p
                  className={`mt-2 text-[14px] leading-relaxed sm:text-[15px] ${
                    isNavy ? "text-white/85" : "opacity-80"
                  }`}
                >
                  {benefit.body}
                </p>
              </article>
            );
          })}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
