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
    <span className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#CDA54E] bg-white shadow-md">
      {cropLogo ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="96px"
          unoptimized={isRemote}
          onError={() => setImgSrc(Assets.icons.logo)}
          className="object-cover object-left"
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={120}
          height={124}
          unoptimized={isRemote}
          onError={() => setImgSrc(Assets.icons.logo)}
          className="h-[3.6rem] sm:h-[4.2rem] w-auto object-contain"
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
    <section id="membership" className="bg-[#F5F5F5] py-8 ">
      <PageContainer>
        <div className="flex items-center justify-center">
          <div className="max-w-5xl flex items-center justify-center flex-col">
            <HeaderText left="Membership" right="categories"></HeaderText>
            <HeaderSubText>
              Membership with ChLPS-Canada connects you to a respected
              professional community committed to advancing Loss Prevention and
              Asset Protection. Whether beginning your career or leading at a
              senior level, membership provides professional recognition,
              development opportunities, industry connections, valuable
              resources, and a platform to strengthen your expertise, influence,
              and career progression.
            </HeaderSubText>
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
                <RevealGroup className="mx-auto grid max-w-[1527px] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  {categories.map((category, index) => {
                    const { badge, cropLogo } = getBadgeDetails(category);
                    const href = `/membership/${category.slug || category.id}`;
                    const cta = `Become a ${category.name}`;

                    return (
                      <Link
                        href={href}
                        id={`membership-${category.slug || category.id}`}
                        key={category.id || category.slug || index}
                        className="reveal relative flex h-full flex-col items-center overflow-hidden rounded-[26px] bg-[#141549] px-6 py-8 text-center sm:px-8 sm:py-10 shadow-[0_12px_36px_rgba(20,21,73,0.18)]"
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
                        <div className="relative z-10 flex h-full w-full flex-col items-center">
                          <MembershipBadge
                            src={badge}
                            alt={`${category.name} badge`}
                            cropLogo={cropLogo}
                          />
                          <h3 className="mt-6 text-xl font-bold leading-snug text-white sm:text-2xl lg:text-[28px]">
                            {category.name}
                          </h3>
                          <p className="mt-3.5 max-w-sm text-[14px] font-normal leading-relaxed text-[#FFFFFFCC] sm:text-[16px] line-clamp-3">
                            {category.description}
                          </p>
                          <div className="mt-auto pt-8 w-full flex justify-center">
                            <Link
                              href={href}
                              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#CDA54E] px-6 py-3 text-[14px] font-semibold text-[#141549] shadow-md transition-all duration-200 hover:brightness-105 hover:scale-[1.02] sm:px-7 sm:py-3.5 sm:text-[15px]"
                            >
                              <span>{cta}</span>
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#141549] transition-transform duration-200 group-hover:translate-x-0.5">
                                <HugeiconsIcon
                                  icon={ArrowRight02Icon}
                                  size={14}
                                  color="currentColor"
                                  strokeWidth={2.4}
                                />
                              </span>
                            </Link>
                          </div>
                        </div>
                      </Link>
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
