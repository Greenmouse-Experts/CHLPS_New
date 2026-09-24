import type { CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Medal01Icon,
  Share07Icon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import HeaderText from "@/components/HeaderText";

const benefits: {
  icon: IconSvgElement;
  body: string;
}[] = [
  {
    icon: Share07Icon,
    body: "Our structured learning pathways guide you toward professional certification and career progression.",
  },
  {
    icon: Briefcase01Icon,
    body: "Gain practical skills, build confidence, and strengthen your expertise to perform effectively and grow in your role.",
  },
  {
    icon: Medal01Icon,
    body: "Enhance your professional standing and unlock new opportunities for long-term career advancement.",
  },
];

export default function CertificationBenefitsSection() {
  return (
    <section
      id="program-benefits"
      className="relative overflow-hidden bg-[#F7F6FB] py-8 "
    >
      <PageContainer className="relative z-10">
        <HeaderText left="How Our Programs" right="benefits you" />

        <div className="max-w-[40rem]">
          {/*<Reveal delay={80}>
            <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px]">
              How Our Programs Benefit You
            </h2>
          </Reveal>*/}
        </div>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <article
              key={benefit.body}
              className="reveal relative flex h-full flex-col overflow-hidden rounded-[20px] border border-secondary bg-white p-6 shadow-[0_10px_28px_rgba(33,26,115,0.06)] sm:p-8"
              style={revealStyle(index)}
            >
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <Image
                  src={Assets.images.certificateCardBg}
                  alt=""
                  fill
                  className="object-cover object-bottom"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="relative z-10 flex h-full flex-col">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-white">
                  <HugeiconsIcon
                    icon={benefit.icon}
                    size={24}
                    color="#211A73"
                    strokeWidth={1.8}
                  />
                </span>
                <p className="mt-6 text-[15px] leading-relaxed text-[#5B5A66] sm:text-[17px] lg:text-[18px]">
                  {benefit.body}
                </p>
              </div>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
