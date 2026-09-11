import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

export default function PoliciesHeroSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#000B2E]">
      <div className="absolute inset-0">
        <Image
          src={Assets.images.privacyHero}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-left md:object-center"
        />
      </div>

      <PageContainer className="relative h-full">
        <div className="flex h-full items-center py-12 sm:py-14 lg:min-h-[22.5rem] lg:py-16 xl:min-h-[24.5rem] xl:py-[4.25rem]">
          <div className="w-full">
            <Reveal>
              <span
                className="cut-bl-tr inline-block bg-secondary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#211A73] sm:px-4 sm:py-2 sm:text-[12px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Policy Center
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[2rem] font-light leading-[1.12] tracking-tight text-white sm:text-[48px] lg:mt-6 xl:leading-[1.08]">
                Policies &amp; Professional
                <br />
                Standards
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 max-w-[440px] text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5">
                Review the policies, privacy practices and professional
                standards that guide how ChLPS Canada operates and supports its
                professional community.
              </p>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
