"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicMemberships } from "@/features/membership/services/membership_service";
import QueryCompLayout from "@/components/QueryCompLayout";
import { Assets } from "@/lib/assets";
import type { Membership } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

interface MembershipSearchSectionProps {
  searchQuery: string;
  onCountChange?: (count: number) => void;
}

const BADGE_MAP: Record<string, string> = {
  student: Assets.images.membership.student,
  affiliate: Assets.images.membership.affiliate,
  licentiate: Assets.images.membership.licentiate,
  associate: Assets.images.membership.associate,
  certified: Assets.images.membership.certified,
  corporate: Assets.icons.logo,
};

function resolveBadge(membership: Membership): string {
  if (membership.image && (membership.image.startsWith("http") || membership.image.startsWith("/"))) {
    return membership.image;
  }
  const name = membership.name?.toLowerCase() || "";
  for (const [key, badge] of Object.entries(BADGE_MAP)) {
    if (name.includes(key)) return badge;
  }
  return Assets.images.membership.certified;
}

export default function MembershipSearchSection({
  searchQuery,
  onCountChange,
}: MembershipSearchSectionProps) {
  const query = useQuery({
    queryKey: ["search-memberships", searchQuery],
    queryFn: async () => {
      const allMemberships = await fetchPublicMemberships();
      const term = searchQuery.trim().toLowerCase();
      if (!term) return allMemberships;

      return allMemberships.filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(term);
        const descMatch = item.description?.toLowerCase().includes(term);
        const benefitsMatch = item.benefits?.some((b) =>
          b.toLowerCase().includes(term),
        );
        const criteriaMatch = item.eligibilityCriteria?.some((c) =>
          c.toLowerCase().includes(term),
        );
        const typeMatch =
          typeof item.type === "string"
            ? item.type.toLowerCase().includes(term)
            : item.type?.name?.toLowerCase().includes(term);

        return Boolean(nameMatch || descMatch || benefitsMatch || criteriaMatch || typeMatch);
      });
    },
  });

  const count = query.data?.length ?? 0;

  useEffect(() => {
    if (query.data && onCountChange) {
      onCountChange(query.data.length);
    }
  }, [query.data, onCountChange]);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HugeiconsIcon icon={UserGroupIcon} size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">
              Membership Categories
            </h2>
            <p className="text-xs text-text/60">
              Professional designations and chartered membership grades
            </p>
          </div>
        </div>

        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {count} {count === 1 ? "result" : "results"} found
        </span>
      </div>

      {/* Query Layout */}
      <QueryCompLayout
        query={query}
        loadingText="Searching memberships..."
        emptyState={
          <div className="rounded-2xl border border-sand bg-white p-8 text-center text-text/60">
            No membership categories found.
          </div>
        }
      >
        {(results) => {
          if (results.length === 0) {
            return (
              <div className="rounded-2xl border border-dashed border-sand bg-white/60 p-8 text-center sm:p-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand/40 text-text/50">
                  <HugeiconsIcon icon={UserGroupIcon} size={24} />
                </div>
                <h3 className="mt-3 text-base font-bold text-text">
                  No memberships match &ldquo;{searchQuery}&rdquo;
                </h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-text/60">
                  Try searching for terms like &ldquo;Student&rdquo;, &ldquo;Associate&rdquo;, &ldquo;Certified&rdquo;, or &ldquo;Chartered&rdquo;.
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => {
                const badge = resolveBadge(item);
                const href = `/membership/${item.slug || item.id}`;
                const priceFormatted =
                  item.price && item.price > 0
                    ? `${item.currency || "CAD"} $${item.price.toLocaleString()}`
                    : "Complimentary / Free";

                return (
                  <article
                    key={item.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sand bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-lg"
                  >
                    <div>
                      {/* Top Badge & Duration */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-sand/80 bg-lilac/30 p-1">
                          <Image
                            src={badge}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                Assets.images.membership.certified;
                            }}
                          />
                        </div>
                        {item.duration && (
                          <span className="rounded-full bg-sand/30 px-3 py-1 text-[11px] font-semibold tracking-wide text-text/75">
                            {item.duration}
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="mt-4 text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-text/70 line-clamp-3">
                        {item.description}
                      </p>

                      {/* Benefits Highlights */}
                      {item.benefits && item.benefits.length > 0 && (
                        <div className="mt-4 border-t border-sand/50 pt-3">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-text/50">
                            Key Benefits
                          </p>
                          <ul className="mt-2 space-y-1.5">
                            {item.benefits.slice(0, 2).map((benefit, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs text-text/80"
                              >
                                <HugeiconsIcon
                                  icon={CheckmarkCircle02Icon}
                                  size={14}
                                  className="mt-0.5 shrink-0 text-emerald-600"
                                />
                                <span className="line-clamp-1">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Bottom Price & Link */}
                    <div className="mt-6 flex items-center justify-between border-t border-sand/60 pt-4">
                      <div>
                        <span className="text-[11px] font-medium text-text/50 block">
                          Membership Fee
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {priceFormatted}
                        </span>
                      </div>

                      <Link
                        href={href}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary transition-all group-hover:bg-primary group-hover:text-white"
                      >
                        <span>View Details</span>
                        <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          );
        }}
      </QueryCompLayout>
    </div>
  );
}
