import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

export default function CertificationSupportSection() {
  return (
    <section
      id="how-we-support-you"
      className="relative overflow-hidden bg-[#130F47] py-10"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={Assets.images.supportSectionBg}
          alt=""
          fill
          className="object-cover object-right opacity-20"
          sizes="100vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14 xl:gap-20">
          <Reveal className="flex justify-center lg:justify-start">
            <Image
              src={Assets.images.checkGold}
              alt=""
              width={1254}
              height={1254}
              sizes="(max-width: 1024px) 18rem, 26rem"
              className="h-auto w-full max-w-[18rem] sm:max-w-[22rem] lg:max-w-[26rem] xl:max-w-[28rem]"
            />
          </Reveal>

          <div className="min-w-0">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-secondary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary sm:px-4 sm:py-2 sm:text-[20px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                How We Support You
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-white sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px]">
                How We Support You
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-4 max-w-[40rem] space-y-4 text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5 lg:text-[17px] xl:text-[18px]">
                <p>
                  We guide you at every stage with expert-led training,
                  practical resources, and ongoing professional support.
                </p>
                <p>
                  Our programs are designed to help you build skills, earn
                  certification, and progress with confidence—no matter where
                  you are in your career.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
