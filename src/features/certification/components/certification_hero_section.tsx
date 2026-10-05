import type { CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import HeaderText from "@/components/HeaderText";

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
        <div className="flex h-full items-center py-12 sm:py-14 lg:min-h-[28rem] lg:py-8 xl:min-h-[32rem] xl:py-20">
          <div className="w-full">
            <HeaderText
              left="Our certification"
              right="pathways"
              notCenter
              textWhite
              notUppercase
            />
            <Reveal delay={160}>
              <div className=" max-w-[740px] space-y-4 text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5 lg:text-base xl:text-[20px]">
                <p>
                  ChLPS-Canada certifications provide structured pathways for
                  Loss Prevention professionals to develop expertise,
                  demonstrate professional competence, and earn recognized
                  credentials. From foundational practice to advanced management
                  and chartered status, our certification programs strengthen
                  professional credibility, support career progression, promote
                  ethical practice, and advance excellence across the evolving
                  Loss Prevention profession.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
