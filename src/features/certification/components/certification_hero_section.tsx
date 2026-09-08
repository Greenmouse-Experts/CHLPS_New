import type { CSSProperties } from "react";
import Image from "next/image";
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
      </div>

      <PageContainer className="relative h-full">
        <div className="flex h-full items-center py-10 sm:py-12 lg:min-h-[28rem] lg:py-16 xl:min-h-[32rem] xl:py-20">
          <div className="w-full max-w-[38rem] xl:max-w-[42rem]">
            <Reveal>
              <span
                className="cut-bl-tr inline-block bg-secondary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#211A73] sm:px-4 sm:py-2 sm:text-[12px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Our Professional Certification Program
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[2rem] font-normal leading-[1.1] tracking-tight text-white sm:text-[2.75rem] lg:mt-6 lg:text-[3.25rem] xl:text-[3.5rem] xl:leading-[1.08]">
                Certification Program
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-4 space-y-4 text-[15px] font-medium leading-relaxed text-white/95 sm:text-base lg:mt-5 lg:text-[17px] xl:text-[18px]">
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
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
