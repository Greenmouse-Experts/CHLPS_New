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
    <div className="flex h-[8.75rem] w-[13.5rem] shrink-0 items-center justify-center rounded-2xl bg-white px-6 shadow-[0_10px_28px_rgba(48,45,57,0.07)] sm:h-[9.5rem] sm:w-[15.25rem] sm:px-7">
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
      className="relative overflow-hidden bg-[#F3F1EC] py-16 md:py-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={Assets.images.partners}
          alt=""
          fill
          className="object-cover object-center opacity-[0.16] mix-blend-multiply invert grayscale"
          sizes="100vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span
              className="cut-tr-bl inline-block bg-primary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
              style={{ "--cut": "0.55rem" } as CSSProperties}
            >
              AFFILIATIONS AND PARTNERSHIPS
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-text sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[2.6rem]">
              Connected to professional and education networks.
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-text/70 sm:text-base">
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
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F3F1EC] to-transparent sm:w-24 lg:w-32"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F3F1EC] to-transparent sm:w-24 lg:w-32"
        />
      </div>
    </section>
  );
}
