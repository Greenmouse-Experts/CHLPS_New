"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import QueryCompLayout from "@/components/QueryCompLayout";
import {
  fetchLivePrograms,
  type ApiProgramItem,
} from "@/features/certification/services/certification_menu_service";
import { resolveCertificationHref } from "@/features/certification/certification_details";
import { Assets } from "@/lib/assets";

const certBadgeMap: Record<string, string> = {
  clpa: Assets.images.certificates.clpa,
  clpo: Assets.images.certificates.clpo,
  clpm: Assets.images.certificates.clpm,
  chlps: Assets.images.certificates.chlps,
  aclpm: Assets.images.certificates.acipm,
  bclp: Assets.images.certificates.bclp,
};

const certLevelMap: Record<string, string> = {
  clpa: "Foundation Level",
  clpo: "Intermediate Level",
  clpm: "Advanced Level",
  chlps: "Executive Level",
  bclp: "Basic Certificate",
  aclpm: "Advanced Certificate",
};

function matchProgramKey(program: ApiProgramItem): string | null {
  const needle = `${program.slug || ""} ${program.title || ""} ${
    program.abbr || ""
  }`.toLowerCase();

  for (const key of Object.keys(certBadgeMap)) {
    if (needle.includes(key)) return key;
  }
  return null;
}

function getProgramImage(program: ApiProgramItem): string {
  const customImg = program.coverImage || program.image;
  if (
    customImg &&
    (customImg.startsWith("http") || customImg.startsWith("/"))
  ) {
    return customImg;
  }

  const key = matchProgramKey(program);
  return key ? certBadgeMap[key] : Assets.icons.logo;
}

function getProgramLevel(program: ApiProgramItem): string {
  const key = matchProgramKey(program);
  return key ? certLevelMap[key] : "Certification";
}

function ProgrammeSeal({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const isRemote =
    imgSrc.startsWith("http://") || imgSrc.startsWith("https://");

  return (
    <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-secondary bg-white">
      <Image
        src={imgSrc}
        alt={alt}
        width={320}
        height={368}
        unoptimized={isRemote}
        onError={() => setImgSrc(Assets.icons.logo)}
        className="h-[2.9rem] w-auto object-contain"
      />
    </span>
  );
}

export default function CertificationPathwaySection() {
  const query = useQuery({
    queryKey: ["public-programs-list"],
    queryFn: fetchLivePrograms,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section
      id="certification"
      className="relative overflow-hidden bg-[#F7F6FB] py-16 md:py-24"
    >
      <PageContainer className="relative z-10">
        <div className="flex justify-center">
          <Reveal>
            <span
              className="cut-tr-bl inline-block bg-secondary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary sm:px-4 sm:py-2 sm:text-[20px]"
              style={{ "--cut": "0.55rem" } as CSSProperties}
            >
              Your Career Pathway
            </span>
          </Reveal>
        </div>

        <div className="mt-10 sm:mt-12">
          <QueryCompLayout
            query={query}
            loadingText="Loading certification programmes..."
            emptyState={
              <div className="py-12 text-center text-text/60">
                No certification programmes currently available.
              </div>
            }
          >
            {(programmes) => {
              if (!programmes || programmes.length === 0) {
                return (
                  <div className="py-12 text-center text-text/60">
                    No certification programmes currently available.
                  </div>
                );
              }

              return (
                <RevealGroup className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {programmes.map((programme, index) => {
                    const image = getProgramImage(programme);
                    const level = getProgramLevel(programme);
                    const rawId = (programme.slug || programme.id || "")
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "");
                    const enrollHref = resolveCertificationHref({
                      id: programme.id,
                      slug: programme.slug,
                    });

                    return (
                      <article
                        id={`certification-${rawId}`}
                        key={programme.id || programme.slug || index}
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
                              $100
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
              );
            }}
          </QueryCompLayout>
        </div>
      </PageContainer>
    </section>
  );
}
