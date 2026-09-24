"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import QueryCompLayout from "@/components/QueryCompLayout";
import { fetchPublicMemberships } from "@/features/membership/services/membership_service";
import type { Membership } from "@/types";
import { Assets } from "@/lib/assets";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";

const badgeMap: Record<string, string> = {
  student: Assets.images.membership.student,
  affiliate: Assets.images.membership.affiliate,
  licentiate: Assets.images.membership.licentiate,
  associate: Assets.images.membership.associate,
  certified: Assets.images.membership.certified,
  corporate: Assets.icons.logo,
};

const DEFAULT_MEMBERSHIP_PRICES: Record<string, string> = {
  student: "CA$195",
  affiliate: "CA$595",
  licentiate: "CA$695",
  associate: "CA$795",
  certified: "CA$895",
  corporate: "CA$1,495",
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
    <div className="relative mx-auto flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-[#C99E4A] bg-white p-3 shadow-xs transition-transform duration-300 group-hover:scale-105 sm:h-32 sm:w-32">
      {cropLogo ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 640px) 112px, 128px"
          unoptimized={isRemote}
          onError={() => setImgSrc(Assets.icons.logo)}
          className="object-cover object-left p-2"
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 640px) 112px, 128px"
          unoptimized={isRemote}
          onError={() => setImgSrc(Assets.icons.logo)}
          className="object-contain p-2"
        />
      )}
    </div>
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
      className="relative overflow-hidden bg-[#F4F3F8] py-8 "
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
          <div className="flex w-full flex-col">
            <HeaderText left="find your membership" right="grade" />
            <HeaderSubText>
              Six membership routes for professionals and organizations at every
              stage.
            </HeaderSubText>
          </div>
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
                <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category, index) => {
                    const slug = category.slug || category.id;
                    const href = `/membership/${slug}`;
                    const badge = getBadgeSrc(category);
                    const isCorporate =
                      (category.name || "")
                        .toLowerCase()
                        .includes("corporate") ||
                      (category.slug || "").toLowerCase().includes("corporate");

                    const cleanName = (category.name || "")
                      .replace(/Member$/i, "")
                      .trim();
                    const displayName = cleanName
                      .toLowerCase()
                      .endsWith("membership")
                      ? cleanName
                      : `${cleanName} Membership`;

                    const needle =
                      `${slug} ${category.name || ""}`.toLowerCase();
                    let fallbackPrice = "CA$595";
                    for (const [key, val] of Object.entries(
                      DEFAULT_MEMBERSHIP_PRICES,
                    )) {
                      if (needle.includes(key)) {
                        fallbackPrice = val;
                        break;
                      }
                    }

                    const hasPrice =
                      category.price != null &&
                      !isNaN(Number(category.price)) &&
                      Number(category.price) > 0;
                    const currencyPrefix =
                      category.currency === "USD"
                        ? "$"
                        : category.currency === "NGN"
                          ? "₦"
                          : "CA$";
                    const priceDisplay = hasPrice
                      ? `${currencyPrefix}${Number(category.price).toLocaleString()}`
                      : fallbackPrice;

                    const description =
                      category.description ||
                      "The globally recognized IFPO certification — the gold standard for protection professionals.";

                    return (
                      <article
                        id={`membership-${slug}`}
                        key={category.id || slug}
                        style={revealStyle(index * 90)}
                        className="card group relative flex flex-col justify-between overflow-hidden rounded-[28px] border-2 border-[#C99E4A] bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                      >
                        {/* Top White Section: Circular Gold Ring Badge & Title */}
                        <div className="flex flex-1 flex-col items-center justify-between bg-white px-6 pt-9 pb-8 text-center sm:px-8 sm:pt-10 sm:pb-9">
                          <Link
                            href={href}
                            className="group/link flex flex-col items-center"
                            aria-label={`View details for ${displayName}`}
                          >
                            <MembershipBadge
                              src={badge}
                              alt={`${category.name} badge`}
                              cropLogo={isCorporate}
                            />
                            <h3 className="mt-6 text-xl font-bold leading-snug tracking-tight text-[#161058] transition-colors duration-200 group-hover/link:text-[#0A1542] sm:mt-7 sm:text-2xl">
                              {displayName}
                            </h3>
                          </Link>
                        </div>

                        {/* Bottom Dark Navy Section: Description, Price & Gold Action Button */}
                        <div className="relative flex flex-col items-center overflow-hidden bg-[#0B0E33] px-6 py-8 text-center sm:px-8 sm:py-9">
                          {/* Background Image: membership_catigory_card.png */}
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-0"
                          >
                            <Image
                              src={Assets.images.membershipCardBg}
                              alt=""
                              fill
                              className="object-cover object-center"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>

                          <div className="relative z-10 flex w-full flex-col items-center">
                            <p className="min-h-[44px] max-w-[300px] text-center text-sm leading-relaxed text-white/90 sm:text-base line-clamp-3">
                              {description}
                            </p>

                            <div className="my-6 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                              {priceDisplay}
                            </div>

                            <Link
                              href={href}
                              className="btn w-full border-none bg-[#C99E4A] text-base font-bold text-[#0B0E33] shadow-sm transition-all duration-200 hover:bg-[#d5aa50] active:scale-[0.99] rounded-xl h-12 min-h-12 normal-case flex items-center justify-center gap-1.5"
                            >
                              <span>Apply for Membership</span>
                              <HugeiconsIcon
                                icon={ArrowUpRight01Icon}
                                size={18}
                                color="#0B0E33"
                                strokeWidth={2.5}
                              />
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
