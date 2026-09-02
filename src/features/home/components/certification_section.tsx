import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const programmes = [
  {
    abbr: "CLPA",
    title: "Certified Loss Prevention Associate™",
    body: "Foundational professional recognition for practitioners developing core loss prevention knowledge and competence.",
    image: Assets.images.certificates.clpa,
  },
  {
    abbr: "CLPO",
    title: "Certified Loss Prevention Officer™",
    body: "Intermediate certification for professionals strengthening operational capability, judgement and supervisory readiness.",
    image: Assets.images.certificates.clpo,
  },
  {
    abbr: "CLPM",
    title: "Certified Loss Prevention Manager™",
    body: "Management-level recognition focused on leadership, enterprise risk, governance and strategic programme design.",
    image: Assets.images.certificates.clpm,
  },
  {
    abbr: "ChLPS",
    title: "Chartered Loss Prevention Specialist™",
    body: "The Association's highest designation for seasoned leaders operating across complex security, risk and organizational environments.",
    image: Assets.images.certificates.chlps,
  },
  {
    abbr: "ACLPM",
    title: "Advanced Professional Certificate in Loss Prevention Management",
    body: "Advanced development focused on applied knowledge, strategic thinking and decision-making in complex environments.",
    image: Assets.images.certificates.acipm,
  },
  {
    abbr: "BCLP",
    title: "Basic Professional Certificate in Loss Prevention",
    body: "A structured entry programme covering foundational loss prevention, asset protection, risk awareness and practical security principles.",
    image: Assets.images.certificates.bclp,
  },
] as const;

export default function CertificationSection() {
  return (
    <section
      id="certification"
      className="relative overflow-hidden bg-cream py-16 md:py-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={Assets.images.partners}
          alt=""
          fill
          className="object-cover object-center opacity-[0.18] mix-blend-multiply invert grayscale"
          sizes="100vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="flex flex-col justify-center items-center">
          <div className="max-w-xl flex flex-col items-center">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3 py-1.5 text-[20px] font-bold uppercase tracking-[0.14em] text-white"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                FEATURED PROGRAMMES
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px] text-center">
                A certification pathway that grows with your career.
              </h2>
            </Reveal>
          </div>
          
        </div>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {programmes.map((programme, index) => (
            <article
              id={`certification-${programme.abbr.toLowerCase()}`}
              key={programme.abbr}
              className="reveal relative flex h-full flex-col items-center overflow-hidden rounded-2xl bg-white px-6 py-8 text-center shadow-[0_10px_30px_rgba(48,45,57,0.06)] sm:px-8 sm:py-10"
              style={revealStyle(index)}
            >
              <div aria-hidden className="pointer-events-none absolute inset-0">
                <Image
                  src={Assets.images.certificateCardBg}
                  alt=""
                  fill
                  className="object-cover object-bottom"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="relative z-10 flex h-full flex-col items-center">
              <div className="flex h-[7.25rem] w-[7.25rem] items-center justify-center border-[2px] rounded-[20px] border border-[#CDA54E] p-2.5">
                <Image
                  src={programme.image}
                  alt={programme.title}
                  width={320}
                  height={368}
                  className="h-full w-auto object-contain"
                />
              </div>
              <h3 className="mt-6 text-[1.05rem] font-bold leading-snug text-[#151515] sm:text-[24px]">
                {programme.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed font-semibold text-[#676672] sm:text-[18px]">
                {programme.body}
              </p>
              <Link
                href={`#certification-${programme.abbr.toLowerCase()}`}
                className="mt-auto inline-flex items-center gap-2.5 pt-8 text-[13px] font-semibold"
              >
                <span className="inline-flex items-center gap-2.5 rounded-full bg-[#1C1662] py-2 pl-5 pr-2 text-white transition-opacity hover:opacity-90">
                  Explore certifications
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#111E2A]">
                    <HugeiconsIcon
                      icon={ArrowRight02Icon}
                      size={14}
                      color="currentColor"
                      strokeWidth={2.2}
                    />
                  </span>
                </span>
              </Link>
              </div>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
