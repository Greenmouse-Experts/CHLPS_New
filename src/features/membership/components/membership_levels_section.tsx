"use client";

import { useState, useEffect, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import QueryCompLayout from "@/components/QueryCompLayout";
import { fetchPublicMemberships } from "@/features/membership/services/membership_service";
import type { Membership } from "@/types";
import { Assets } from "@/lib/assets";

const badgeMap: Record<string, string> = {
  student: Assets.images.membership.student,
  affiliate: Assets.images.membership.affiliate,
  licentiate: Assets.images.membership.licentiate,
  associate: Assets.images.membership.associate,
  certified: Assets.images.membership.certified,
  corporate: Assets.icons.logo,
};

function getBadgeSrc(category: Membership): string {
  if (
    category.image &&
    (category.image.startsWith("http") || category.image.startsWith("/"))
  ) {
    return category.image;
  }

  const needle = `${category.slug || ""} ${category.name || ""}`.toLowerCase();
  for (const [key, asset] of Object.entries(badgeMap)) {
    if (needle.includes(key)) {
      return asset;
    }
  }

  return Assets.icons.logo;
}

function MembershipBadge({
  src,
  alt,
  cropLogo = false,
}: {
  src: string;
  alt: string;
  cropLogo?: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const isRemote =
    imgSrc.startsWith("http://") || imgSrc.startsWith("https://");

  return (
    <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-secondary bg-white">
      {cropLogo ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="64px"
          unoptimized={isRemote}
          onError={() => setImgSrc(Assets.icons.logo)}
          className="object-cover object-left"
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={100}
          height={104}
          unoptimized={isRemote}
          onError={() => setImgSrc(Assets.icons.logo)}
          className="h-[2.7rem] w-auto object-contain"
        />
      )}
    </span>
  );
}

export default function MembershipLevelsSection() {
  const query = useQuery({
    queryKey: ["public-memberships-levels"],
    queryFn: fetchPublicMemberships,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section
      id="membership-levels"
      className="relative overflow-hidden bg-[#F4F3F8] py-16 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 top-0 z-0 h-[min(92%,920px)] w-[min(72%,780px)]"
      >
        <Image
          src={Assets.images.border}
          alt=""
          fill
          className="object-contain object-right-top"
          sizes="(max-width: 1024px) 70vw, 40vw"
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3.5 py-2 text-[15px] font-bold uppercase tracking-[0.14em] text-white sm:text-[20px]"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                Membership Levels
              </span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-5 text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px]">
                Find your membership level.
              </h2>
            </Reveal>
          </div>

          <Reveal delay={160} className="min-w-0 lg:max-w-[22rem] lg:shrink-0">
            <p className="text-[15px] leading-relaxed text-[#676672] sm:text-base">
              Membership routes for professionals and organisations across every
              stage of loss prevention.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 sm:mt-12">
          <QueryCompLayout
            query={query}
            loadingText="Loading membership levels..."
            emptyState={
              <div className="py-12 text-center text-text/60">
                No membership levels currently available.
              </div>
            }
          >
            {(categories) => {
              if (!categories || categories.length === 0) {
                return (
                  <div className="py-12 text-center text-text/60">
                    No membership levels currently available.
                  </div>
                );
              }

              return (
                <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {categories.map((category, index) => {
                    const slug = category.slug || category.id;
                    const href = `/membership/${slug}`;
                    const badge = getBadgeSrc(category);
                    const isCorporate =
                      (category.name || "")
                        .toLowerCase()
                        .includes("corporate") ||
                      (category.slug || "").toLowerCase().includes("corporate");

                    return (
                      <article
                        id={`membership-${slug}`}
                        key={category.id || slug}
                        className="group reveal relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[24px] border border-[#CDA54E] bg-white p-6 transition-all duration-300 hover:shadow-lg sm:p-8"
                        style={revealStyle(index)}
                      >
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0"
                        >
                          <Image
                            src={Assets.images.certificateCardBg}
                            alt=""
                            fill
                            className="object-cover object-bottom"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 bg-[#141549] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
                        >
                          <Image
                            src={Assets.images.membershipCardBg}
                            alt=""
                            fill
                            className="object-cover object-bottom"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>

                        <div className="relative z-10 flex h-full flex-col">
                          <MembershipBadge
                            src={badge}
                            alt={`${category.name} badge`}
                            cropLogo={isCorporate}
                          />
                          <h3 className="mt-6 text-lg font-bold leading-snug text-[#151515] transition-colors duration-300 group-hover:text-white group-focus-within:text-white sm:text-xl lg:text-[30px]">
                            {category.name}
                          </h3>
                          <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#676672] transition-colors duration-300 group-hover:text-white/90 group-focus-within:text-white/90 sm:text-[20px]">
                            {category.description}
                          </p>
                          <div className="mt-auto flex min-w-0 items-center justify-between gap-3 pt-8">
                            <span className="min-w-0 text-[13px] font-bold text-[#151515] transition-colors duration-300 group-hover:text-white group-focus-within:text-white sm:text-[18px]">
                              Explore {category.name}
                            </span>
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-[#111E2A] sm:h-11 sm:w-11">
                              <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                size={18}
                                color="currentColor"
                                strokeWidth={2.2}
                              />
                            </span>
                          </div>
                        </div>

                        {/* Full card click navigating by slug */}
                        <Link
                          href={href}
                          className="absolute inset-0 z-20 rounded-[24px]"
                          aria-label={`Explore ${category.name}`}
                        />
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
