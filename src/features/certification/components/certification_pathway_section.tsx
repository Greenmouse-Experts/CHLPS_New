"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import {
  fetchProgramsMenuFromApi,
  fetchLivePrograms,
  type ApiProgramItem,
} from "@/features/certification/services/certification_menu_service";
import { resolveCertificationHref } from "@/features/certification/certification_details";

// Static level badges fallback order or mapped by title/level
const LEVEL_BADGES: Record<string, string> = {
  BCLP: "FOUNDATIONAL",
  CLPA: "ASSOCIATE",
  CLPO: "SUPERVISORY",
  CLPM: "MANAGERIAL",
  ACLPM: "ADVANCED",
  ACIPM: "ADVANCED",
  ChLPS: "EXECUTIVE",
  CHLPS: "CHARTERED",
};

const SEALS_BY_ABBR: Record<string, string> = {
  BCLP: Assets.images.certificates.bclp,
  CLPA: Assets.images.certificates.clpa,
  CLPO: Assets.images.certificates.clpo,
  CLPM: Assets.images.certificates.clpm,
  ACLPM: Assets.images.certificates.acipm,
  ACIPM: Assets.images.certificates.acipm,
  ChLPS: Assets.images.certificates.chlps,
  CHLPS: Assets.images.certificates.chlps,
};

function ProgrammeSeal({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="flex h-[3.85rem] w-[3.85rem] shrink-0 items-center justify-center overflow-hidden rounded-[1.1rem] bg-[#F2EEFA] p-2 sm:h-[4.4rem] sm:w-[4.4rem] sm:rounded-[1.25rem]">
      <Image
        src={src}
        alt={alt}
        width={320}
        height={368}
        unoptimized
        className="h-full w-auto max-w-full object-contain"
      />
    </span>
  );
}

export default function CertificationPathwaySection() {
  const { data: livePrograms, isLoading } = useQuery({
    queryKey: ["live-certification-programs"],
    queryFn: fetchLivePrograms,
    staleTime: 5 * 60 * 1000,
  });

  const programs = livePrograms || [];

  return (
    <section id="pathways" className="bg-[#FAF9FD] py-16 sm:py-20 lg:py-24">
      <PageContainer>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <span className="inline-block rounded-full bg-[#EEEAF8] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary sm:text-[12px]">
              Certification Pathways
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-4 max-w-[42rem] text-[1.85rem] font-light leading-tight tracking-tight text-[#161058] sm:mt-5 sm:text-[2.35rem] lg:text-[2.75rem]">
              From entry-level foundations to chartered executive distinction
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-4 max-w-[36rem] text-[13px] leading-relaxed text-[#554F7A] sm:text-[15px]">
              Each CHLPS certification aligns with a distinct career phase,
              equipping candidates with targeted competencies and verifiable
              professional standing.
            </p>
          </Reveal>
        </div>

        {isLoading && (
          <div className="mt-12 text-center text-[#554F7A]">
            <p>Loading certification pathways...</p>
          </div>
        )}

        {!isLoading && programs.length === 0 && (
          <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-dashed border-[#D2CEDF] bg-white p-8 text-center text-[#554F7A]">
            <p>No certification programs currently available.</p>
          </div>
        )}

        {programs.length > 0 && (
          <div className="mt-12 sm:mt-14 lg:mt-16">
            <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((programme, index) => {
                const title = programme.title || "";
                const match = title.match(/\(([A-Za-z™]+)\)/);
                const abbr = match ? match[1].replace(/™/g, "") : "CHLPS";
                const level = LEVEL_BADGES[abbr] || "PROFESSIONAL";
                const image =
                  programme.coverImage ||
                  SEALS_BY_ABBR[abbr] ||
                  Assets.images.certificates.clpa;
                const enrollHref = resolveCertificationHref({
                  id: programme.id,
                  slug: programme.slug,
                });

                const price = programme.courses?.[0]?.price;

                return (
                  <article
                    key={programme.id}
                    className="reveal flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[20px] rounded-tl-[35px] bg-secondary border border-[#CDA54EB8]"
                    style={revealStyle(index)}
                  >
                    <div className="mt-[5px] flex flex-1 flex-col overflow-hidden rounded-tl-[25px] rounded-tr-[10px] rounded-b-[20px] bg-white">
                      <div className="flex shrink-0 flex-col px-6 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
                        <div className="flex items-start justify-between gap-3">
                          <ProgrammeSeal
                            src={image}
                            alt={`${programme.title} seal`}
                          />
                          <span className="inline-flex shrink-0 rounded-full bg-[#EEEAF8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary sm:text-[11px]">
                            {level}
                          </span>
                        </div>

                        <h3 className="mt-4 min-h-[4.2rem] text-[1.15rem] font-medium leading-snug text-[#161058] sm:min-h-[5rem] sm:text-[1.35rem] lg:min-h-[6.75rem] lg:text-[27px]">
                          {programme.title}
                        </h3>
                      </div>

                      <div className="flex flex-1 flex-col bg-[#211A7A] px-6 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
                          Certification Fee
                        </p>
                        <p className="mt-1 text-[1.75rem] font-bold leading-none text-white sm:text-[2rem]">
                          {price ? `$${price}` : null}
                        </p>
                        <span
                          aria-hidden
                          className="mt-2 block h-[2px] w-10 bg-secondary"
                        />
                        <p className="mt-2.5 text-[13px] leading-relaxed text-white/90 sm:text-[14px]">
                          $100.00 now and then $100.00 after 1 Year.
                          <br />
                          Membership expires after 1 Year.
                        </p>
                        <Link
                          href={enrollHref}
                          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-white text-[15px] font-semibold text-[#211A7A] transition-opacity duration-200 hover:opacity-90"
                        >
                          Get started
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </RevealGroup>
          </div>
        )}
      </PageContainer>
    </section>
  );
}
