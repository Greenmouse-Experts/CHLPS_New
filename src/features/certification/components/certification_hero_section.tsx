import type { CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

export default function CertificationHeroSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#000E21]">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        <Image
          src={Assets.images.certificationHero}
          alt="CHLPS Canada professionals standing together"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[right_center]"
        />
        <div className="absolute inset-0 bg-[#000E21]/75" />
      </div>

      <PageContainer className="relative h-full">
        <div className="flex h-full items-center py-12 sm:py-14 lg:min-h-[28rem] lg:py-16 xl:min-h-[32rem] xl:py-20">
          <div className="w-full">
            <Reveal>
              <span
                className="cut-bl-tr inline-block bg-secondary px-3.5 py-1.5  font-bold uppercase tracking-[0.14em] text-[#211A73] sm:px-4 sm:py-2 sm:"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Our Professional Certification Program
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[2rem]  leading-[1.12] tracking-tight text-white sm:text-[48px] lg:mt-6 xl:leading-[1.08]">
                Certification Program
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-4 max-w-[740px] space-y-4 text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5 lg:text-base xl:text-[20px]">
                <p>
                  The Association of Chartered Loss Prevention Specialists of
                  Canada provides professional certification and skill
                  development programs through which you can become a Certified
                  Professional, earning the prestigious CLPO, CLPA, or ChLPS
                  certifications.
                </p>
                <p>
                  Our commitment to professional development is reflected in
                  these certifications – Certified Loss Prevention Officer
                  (CLPO™), Certified Loss Prevention Associate (CLPA™), and
                  Chartered Loss Prevention Specialist (ChLPS™).
                </p>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#pathways"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-secondary px-7  font-bold text-[#111E2A] shadow-sm transition-all hover:brightness-95 active:scale-[0.99]"
                >
                  <span>Enroll Now</span>
                  <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
                </a>
                <a
                  href="#program-benefits"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6  font-medium text-white backdrop-blur-xs transition-colors hover:bg-white/20"
                >
                  Program Benefits
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
