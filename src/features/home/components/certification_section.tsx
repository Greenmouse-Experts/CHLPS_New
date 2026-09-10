"use client";

import { useState, useEffect, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import QueryCompLayout from "@/components/QueryCompLayout";
import {
  fetchLivePrograms,
  type ApiProgramItem,
} from "@/features/certification/services/certification_menu_service";
import { Assets } from "@/lib/assets";

const certBadgeMap: Record<string, string> = {
  clpa: Assets.images.certificates.clpa,
  clpo: Assets.images.certificates.clpo,
  clpm: Assets.images.certificates.clpm,
  chlps: Assets.images.certificates.chlps,
  aclpm: Assets.images.certificates.acipm,
  bclp: Assets.images.certificates.bclp,
};

function getProgramImage(program: ApiProgramItem): string {
  const customImg = program.coverImage || program.image;
  if (
    customImg &&
    (customImg.startsWith("http") || customImg.startsWith("/"))
  ) {
    return customImg;
  }

  const needle = `${program.slug || ""} ${program.title || ""} ${
    program.abbr || ""
  }`.toLowerCase();

  for (const [key, asset] of Object.entries(certBadgeMap)) {
    if (needle.includes(key)) {
      return asset;
    }
  }

  return Assets.icons.logo;
}

function ProgramBadge({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const isRemote =
    imgSrc.startsWith("http://") || imgSrc.startsWith("https://");

  return (
    <div className="flex h-[7.25rem] w-[7.25rem] items-center justify-center border-[2px] rounded-[20px] border-[#CDA54E] p-2.5 overflow-hidden bg-white">
      <Image
        src={imgSrc}
        alt={alt}
        width={320}
        height={368}
        unoptimized={isRemote}
        onError={() => setImgSrc(Assets.icons.logo)}
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

export default function CertificationSection() {
  const query = useQuery({
    queryKey: ["public-programs-list"],
    queryFn: fetchLivePrograms,
    staleTime: 5 * 60 * 1000,
  });

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
          className="origin-center scale-[0.9] object-cover object-center opacity-[0.08] mix-blend-multiply invert grayscale"
          sizes="100vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="flex flex-col justify-center items-center">
          <div className="max-w-xl flex flex-col items-center">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3 py-1.5 text-[15px] sm:text-[20px] font-bold uppercase tracking-[0.14em] text-white"
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

        <div className="mt-10 sm:mt-12">
          <QueryCompLayout
            query={query}
            loadingText="Loading certification programs..."
            emptyState={
              <div className="py-12 text-center text-text/60">
                No certification programs currently available.
              </div>
            }
          >
            {(programmes) => {
              if (!programmes || programmes.length === 0) {
                return (
                  <div className="py-12 text-center text-text/60">
                    No certification programs currently available.
                  </div>
                );
              }

              return (
                <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {programmes.map((programme, index) => {
                    const image = getProgramImage(programme);
                    const rawId = (programme.slug || programme.id)
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "");
                    const href = `/certification#certification-${rawId}`;
                    const buttonText = `Enroll for ${programme.title}`;

                    return (
                      <article
                        id={`certification-${rawId}`}
                        key={programme.id || programme.slug || index}
                        className="reveal relative flex h-full flex-col items-center overflow-hidden rounded-2xl bg-white px-6 py-8 text-center shadow-[0_10px_30px_rgba(48,45,57,0.06)] sm:px-8 sm:py-10"
                        style={revealStyle(index)}
                      >
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0"
                        >
                          <Image
                            src={Assets.images.certificateCardBg}
                            alt=""
                            fill
                            className="object-cover object-bottom"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="relative z-10 flex h-full flex-col items-center">
                          <ProgramBadge src={image} alt={programme.title} />
                          <h3 className="mt-6 text-[1.05rem] font-bold leading-snug text-[#151515] sm:text-[24px]">
                            {programme.title}
                          </h3>
                          {programme.description ? (
                            <p className="mt-3 text-[13px] leading-relaxed font-semibold text-[#676672] sm:text-[18px]">
                              {programme.description}
                            </p>
                          ) : null}
                          <Link
                            href={href}
                            className="mt-auto inline-flex items-center gap-2.5 pt-8 text-[13px] font-semibold"
                          >
                            <span className="inline-flex items-center gap-2.5 rounded-full bg-[#1C1662] py-2 pl-5 pr-2 text-white transition-opacity hover:opacity-90">
                              <span className="max-w-[200px] truncate">
                                {buttonText}
                              </span>
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#111E2A]">
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
