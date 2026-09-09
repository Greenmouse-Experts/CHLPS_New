import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

export default function NewsHeroSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#000E21]">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        <Image
          src={Assets.images.newsHero}
          alt="Loss prevention professionals reading industry insights together"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[right_center]"
        />
      </div>

      <PageContainer className="relative h-full">
        <div className="flex h-full items-center py-10 sm:py-12 lg:min-h-[28rem] lg:py-16 xl:min-h-[30rem] xl:py-20">
          <div className="w-full">
            <Reveal>
              <span
                className="cut-bl-tr inline-block bg-secondary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#211A73] sm:px-4 sm:py-2 sm:text-[12px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Content Hub
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[2rem] font-light leading-[1.12] tracking-tight text-white sm:text-[48px] lg:mt-6 xl:leading-[1.08]">
                News &amp; Blog
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5">
                Choose content that answers your questions, learn from admired
                professionals, and gain exclusive insights to excel in your
                role.
              </p>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
