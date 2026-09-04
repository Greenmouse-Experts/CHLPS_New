import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

type AboutHeroSectionProps = {
  badge: string;
  title: string;
  accent: string;
  body: string;
  /** Tailwind max-width class controlling where the body copy wraps. */
  bodyWidth?: string;
};

export default function AboutHeroSection({
  badge,
  title,
  accent,
  body,
  bodyWidth = "max-w-[26rem]",
}: AboutHeroSectionProps) {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#030E20] lg:h-[430px]">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        <Image
          src={Assets.images.aboutHeroBg}
          alt="CHLPS Canada professionals standing together in an office"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[right_15%]"
        />
      </div>

      <PageContainer className="relative h-full">
        <div className="flex h-full items-center py-10 sm:py-12 lg:py-8">
          <div className="w-full max-w-[640px] xl:max-w-[720px]">
            <Reveal>
              <span
                className="cut-tl-bl inline-block bg-secondary px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#111E2A] sm:text-xs"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                {badge}
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[2rem] font-normal leading-[1.1] tracking-tight text-white sm:text-4xl lg:mt-6 lg:text-[3.25rem] xl:text-[3.75rem] xl:leading-[1.08]">
                {title}
                <br />
                <span className="text-secondary">{accent}</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p
                className={`mt-4 text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5 lg:text-lg ${bodyWidth}`}
              >
                {body}
              </p>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
