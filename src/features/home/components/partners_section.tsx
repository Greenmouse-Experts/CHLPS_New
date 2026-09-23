import type { CSSProperties } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";

const partners = [
  // {
  //   src: Assets.images.partnerLogos.p1,
  //   alt: "Central Board of Education Canada",
  // },
  // {
  //   src: Assets.images.partnerLogos.p2,
  //   alt: "The Security Institute",
  // },
  {
    src: Assets.images.partnerLogos.p3,
    alt: "Security Industry Standards",
  },
  {
    src: "/assets/images/guard_master_logo.png",
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
        className="h-[5.75rem] w-auto max-w-full object-contain sm:h-[6.25rem]"
      />
    </div>
  );
}

export default function PartnersSection() {
  return (
    <section
      id="partners"
      className="relative overflow-hidden bg-[#FFFFFF] py-16 "
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
        <div className="mx-auto max-w-5xl text-center">
          <HeaderText
            switch
            left={"Affiliations &"}
            right="Partnership"
          ></HeaderText>
          <HeaderSubText>
            ChLPS-Canada builds strategic affiliations and partnerships with
            professional bodies, educational institutions, industry
            organizations, and solution providers that share our commitment to
            advancing Loss Prevention and Asset Protection. These relationships
            strengthen professional development, encourage knowledge exchange,
            expand industry collaboration, and create greater opportunities for
            our members and the wider profession.
          </HeaderSubText>
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
