import type { CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import HeaderText from "@/components/HeaderText";

export default function CertificationSupportSection() {
  return (
    <section
      id="how-we-support-you"
      className="relative overflow-hidden bg-[#130F47] p-4"
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
            <img src={"/assets/images/fade_logo.png"} alt="" />
          </Reveal>

          <div className="min-w-0">
            <HeaderText left="How We" right="Support You" notCenter textWhite />

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
            {/*
            <Reveal delay={220}>
              <div className="mt-7">
                <a
                  href="#pathways"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-secondary px-7  font-bold text-[#111E2A] shadow-sm transition-all hover:brightness-95 active:scale-[0.99]"
                >
                  <span>Enroll Today</span>
                  <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
                </a>
              </div>
            </Reveal>*/}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
