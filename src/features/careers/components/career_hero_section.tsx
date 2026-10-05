import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import HeaderText from "@/components/HeaderText";

export default function CareerHeroSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#000E21]">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        <Image
          src={Assets.images.newsHero}
          alt="Loss prevention professionals planning their careers together"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[right_center]"
        />
      </div>

      <PageContainer className="relative h-full">
        <div className="flex h-full items-center py-10 sm:py-12 lg:min-h-[28rem] lg:py-8 xl:min-h-[30rem] xl:py-20">
          <div className="w-full">
            <HeaderText
              left="career"
              right="center"
              notCenter
              textWhite
            ></HeaderText>

            <Reveal delay={80}>
              <h1 className="mt-5 text-[2rem]  leading-[1.12] tracking-tight text-white sm:text-[48px] lg:mt-6 xl:leading-[1.08]">
                Build Your Career
                <br />
                in Loss Prevention
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className=" max-w-[520px] text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5">
                The ChLPS-Canada Career Centre supports Loss Prevention
                professionals at every stage of their career journey. Explore
                career opportunities, professional development resources,
                industry guidance, certification pathways, and practical
                insights designed to strengthen employability, enhance
                professional competence, support career advancement, and connect
                talent with opportunities across the Loss Prevention profession.
              </p>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
