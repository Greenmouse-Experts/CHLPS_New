import type { CSSProperties } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Briefcase, Medal, Waypoints } from "lucide-react";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

type Benefit = {
  icon: LucideIcon;
  body: string;
};

const benefits: Benefit[] = [
  {
    icon: Waypoints,
    body: "Our structured learning pathways guide you toward professional certification and career progression.",
  },
  {
    icon: Briefcase,
    body: "Gain practical skills, build confidence, and strengthen your expertise to perform effectively and grow in your role.",
  },
  {
    icon: Medal,
    body: "Enhance your professional standing and unlock new opportunities for long-term career advancement.",
  },
];

export default function ProfessionalDevelopmentSection() {
  return (
    <section className="bg-cream py-14 sm:py-16 lg:py-20">
      <PageContainer>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span
              className="cut-tr-bl inline-block bg-lilac px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B65C4] sm:text-[12px]"
              style={{ "--cut": "0.5rem" } as CSSProperties}
            >
              Professional Development
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-5 text-[1.625rem] font-normal leading-tight tracking-tight text-primary sm:text-[2rem] lg:text-[2.25rem]">
              Build Skills. Earn Recognition. Progress.
            </h2>
          </Reveal>
        </div>

        <RevealGroup className="mt-9 grid grid-cols-1 items-stretch gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.body}
                className="reveal relative flex h-full flex-col overflow-hidden rounded-[14px] border border-[#E8D9B8] bg-white px-5 pb-9 pt-7 sm:px-6 sm:pt-8"
                style={revealStyle(index)}
              >
                <Image
                  src={Assets.images.certificateCardBg}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="pointer-events-none object-cover object-bottom"
                />

                <div className="relative z-10 flex h-full flex-col">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lilac">
                    <Icon
                      size={20}
                      strokeWidth={1.8}
                      className="text-primary"
                      aria-hidden
                    />
                  </span>

                  <p className="mt-6 max-w-[320px] text-[14px] leading-relaxed text-[#6F6E7A] sm:text-[15px]">
                    {benefit.body}
                  </p>
                </div>
              </article>
            );
          })}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
