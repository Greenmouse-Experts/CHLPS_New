import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const paragraphs = [
  "ChLPS Canada operates through a governance structure in which the Board of Directors works alongside the Association Management Team. Together, they support the Association's mission, professional standards and long-term development.",
  "The Board provides strategic leadership and governance, while the Management Team supports the Association's day-to-day operations, member services, certification, training and administration.",
];

export default function HowWeAreGovernedSection() {
  return (
    <section
      id="how-we-are-governed"
      className="relative overflow-hidden bg-white py-16 lg:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={Assets.images.ourStoryBg}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex min-w-0 flex-col">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white sm:text-xs"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                How We Are Governed
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2rem] xl:text-[2.25rem]">
                Clear direction, oversight and delivery.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-5 flex max-w-[34rem] flex-col gap-4 lg:mt-6">
                {paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-relaxed text-[#5B5A66] sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="min-w-0">
            <div className="relative pb-14 sm:pb-16 lg:pb-[4.5rem]">
              <Image
                src={Assets.images.howWeAreGoverned}
                alt="A loss prevention manager and analyst reviewing operations on a tablet"
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-auto w-full object-cover"
              />

              <div className="absolute bottom-0 right-2 w-[85%] max-w-[340px] sm:right-3 lg:-right-3">
                <span
                  aria-hidden
                  className="absolute inset-0 translate-x-2 -translate-y-2 rounded-[1.25rem] bg-secondary"
                />
                <div className="relative rounded-[1.25rem] bg-primary p-5 sm:p-6">
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.06em] text-secondary sm:text-[15px] lg:text-base">
                    Governance Approach
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/85 sm:text-[13px]">
                    Strategic leadership from the Board is supported by
                    structured operational management across the Association.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
