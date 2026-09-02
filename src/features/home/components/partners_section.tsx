import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const partners = [
  {
    src: Assets.images.partnerLogos.p1,
    alt: "Central Board of Education Canada",
  },
  {
    src: Assets.images.partnerLogos.p2,
    alt: "The Security Institute",
  },
  {
    src: Assets.images.partnerLogos.p3,
    alt: "Security Industry Standards",
  },
  {
    src: Assets.images.partnerLogos.p4,
    alt: "Guardmaster Institute",
  },
  {
    src: Assets.images.partnerLogos.p5,
    alt: "American Council of Training and Development",
  },
  {
    src: Assets.images.partnerLogos.p6,
    alt: "QAHE Association Accredited",
  },
] as const;

const marqueePartners = [...partners, ...partners];

function PartnerCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-[8.75rem] w-[13.5rem] shrink-0 items-center justify-center border border-[#CDA54E] rounded-2xl bg-white px-6 sm:h-[9.5rem] sm:w-[15.25rem] sm:px-7">
      <Image
        src={src}
        alt={alt}
        width={645}
        height={150}
        className="h-[3.75rem] w-auto max-w-full object-contain sm:h-[4.25rem]"
      />
    </div>
  );
}

export default function PartnersSection() {
  return (
    <section
      id="partners"
      className="relative overflow-hidden bg-[#FFFFFF] py-16 md:py-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={Assets.images.partnersBg}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span
              className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-1.5 text-[20px] font-bold uppercase tracking-[0.14em] text-white"
              style={{ "--cut": "0.55rem" } as CSSProperties}
            >
              AFFILIATIONS AND PARTNERSHIPS
            </span>
          </Reveal>

          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-xl text-[18px] leading-relaxed text-[#383740] sm:text-[20px]">
              Professional affiliations and education partnerships that support
              the wider ChLPS Canada ecosystem.
            </p>
          </Reveal>
        </div>
      </PageContainer>

      <div className="partners-marquee relative z-10 mt-12 overflow-hidden sm:mt-16">
        <div className="partners-marquee-track flex items-center gap-3 sm:gap-4 lg:gap-5">
          {marqueePartners.map((partner, index) => (
            <PartnerCard
              key={`${partner.alt}-${index}`}
              src={partner.src}
              alt={index < partners.length ? partner.alt : ""}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24 lg:w-32"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24 lg:w-32"
        />
      </div>
    </section>
  );
}
