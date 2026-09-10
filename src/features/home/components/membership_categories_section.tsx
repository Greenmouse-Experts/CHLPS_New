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
import { fetchPublicMemberships } from "@/features/membership/services/membership_service";
import { Assets } from "@/lib/assets";
import type { Membership } from "@/types";

const badgeMap: Record<string, string> = {
  student: Assets.images.membership.student,
  affiliate: Assets.images.membership.affiliate,
  licentiate: Assets.images.membership.licentiate,
  associate: Assets.images.membership.associate,
  certified: Assets.images.membership.certified,
  corporate: Assets.icons.logo,
};

function getBadgeDetails(category: Membership) {
  if (
    category.image &&
    (category.image.startsWith("http") || category.image.startsWith("/"))
  ) {
    return { badge: category.image, cropLogo: false };
  }

  const needle = `${category.slug || ""} ${category.name || ""}`.toLowerCase();
  for (const [key, asset] of Object.entries(badgeMap)) {
    if (needle.includes(key)) {
      return { badge: asset, cropLogo: key === "corporate" };
    }
  }

  return { badge: Assets.icons.logo, cropLogo: true };
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

export default function MembershipCategoriesSection() {
  const query = useQuery({
    queryKey: ["public-memberships"],
    queryFn: fetchPublicMemberships,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section id="membership" className="bg-[#F5F5F5] py-16 md:py-24">
      <PageContainer>
        <div className="flex items-center justify-center">
          <div className="max-w-xl flex items-center justify-center flex-col">
            <Reveal>
              <span
                className="cut-tr-bl inline-block bg-[#6B65C4] px-3 py-1.5 text-[11px] sm:text-[20px] font-bold uppercase tracking-[0.14em] text-white"
                style={{ "--cut": "0.55rem" } as CSSProperties}
              >
                MEMBERSHIP CATEGORIES
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 max-w-[400px] text-[1.75rem] font-medium leading-tight tracking-tight text-[#151515] sm:text-3xl lg:mt-6 lg:text-[2.35rem] xl:text-[40px] text-center">
                Find the level that fits your career stage.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-10 sm:mt-12">
          <QueryCompLayout
            query={query}
            loadingText="Loading membership categories..."
            emptyState={
              <div className="py-12 text-center text-text/60">
                No membership categories currently available.
              </div>
            }
          >
            {(categories) => {
              if (!categories || categories.length === 0) {
                return (
                  <div className="py-12 text-center text-text/60">
                    No membership categories currently available.
                  </div>
                );
              }

              return (
                <RevealGroup className="mx-auto grid max-w-[1527px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {categories.map((category, index) => {
                    const { badge, cropLogo } = getBadgeDetails(category);
                    const href = `/membership/${category.slug || category.id}`;
                    const cta = `Explore ${category.name}`;

                    return (
                      <article
                        id={`membership-${category.slug || category.id}`}
                        key={category.id || category.slug || index}
                        className="reveal relative flex h-full flex-col overflow-hidden rounded-[24px] bg-[#141549] p-6 sm:p-8"
                        style={revealStyle(index)}
                      >
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0"
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
                            cropLogo={cropLogo}
                          />
                          <h3 className="mt-6 text-lg font-bold leading-snug text-white sm:text-xl lg:text-[30px]">
                            {category.name}
                          </h3>
                          <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#FFFFFFCC] sm:text-[20px]">
                            {category.description}
                          </p>
                          <Link
                            href={href}
                            className="mt-auto inline-flex min-w-0 items-center gap-1.5 pt-8 text-[13px] font-bold text-[#CDA54E] transition-opacity hover:opacity-80 sm:text-[20px]"
                          >
                            <span className="min-w-0">{cta}</span>
                            <HugeiconsIcon
                              icon={ArrowRight02Icon}
                              size={20}
                              color="currentColor"
                              strokeWidth={2}
                              className="shrink-0"
                            />
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
