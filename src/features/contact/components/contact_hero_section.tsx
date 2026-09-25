import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import Header from "@/features/components/header";
import HeaderText from "@/components/HeaderText";

export default function ContactHeroSection() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-[#000E21]">
      <div className="relative h-56 w-full sm:h-72 lg:absolute lg:inset-0 lg:h-full">
        <Image
          src={"/assets/images/contact_us.png"}
          alt="CHLPS Canada team members ready to answer your enquiries"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[right_center]"
        />
      </div>

      <PageContainer className="relative h-full">
        <div className="flex h-full items-center py-10 sm:py-12 lg:min-h-[24rem] lg:py-14 xl:min-h-[26rem] xl:py-8">
          <div className="w-full">
            <HeaderText
              left="How may we"
              textWhite
              notUppercase
              notCenter
              right="help you?"
            />

            <Reveal delay={160}>
              <p className=" max-w-[460px] text-[15px] leading-relaxed text-white/95 sm:text-base lg:mt-5">
                Connect with ChLPS Canada for membership, certification, events
                and general enquiries.
              </p>
            </Reveal>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
