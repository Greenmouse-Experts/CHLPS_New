"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  fetchLivePrograms,
  type ApiProgramItem,
} from "@/features/certification/services/certification_menu_service";
import { resolveCertificationHref } from "@/features/certification/certification_details";
import QueryCompLayout from "@/components/QueryCompLayout";
import { Assets } from "@/lib/assets";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  Certificate01Icon,
} from "@hugeicons/core-free-icons";

interface CertificationSearchSectionProps {
  searchQuery: string;
  onCountChange?: (count: number) => void;
}

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

function extractAbbr(title: string): string {
  const match = title.match(/\(([A-Za-z™]+)\)/);
  if (match && match[1]) {
    return match[1].replace(/™/g, "").trim();
  }
  const clean = title.toUpperCase();
  if (clean.includes("BCLP")) return "BCLP";
  if (clean.includes("CLPA")) return "CLPA";
  if (clean.includes("CLPO")) return "CLPO";
  if (clean.includes("CLPM")) return "CLPM";
  if (clean.includes("ACLPM") || clean.includes("ACIPM")) return "ACLPM";
  if (clean.includes("CHLPS")) return "ChLPS";
  return "CHLPS";
}

export default function CertificationSearchSection({
  searchQuery,
  onCountChange,
}: CertificationSearchSectionProps) {
  const query = useQuery({
    queryKey: ["search-certifications", searchQuery],
    queryFn: async () => {
      const allPrograms = await fetchLivePrograms();
      const term = searchQuery.trim().toLowerCase();
      if (!term) return allPrograms;

      return allPrograms.filter((program: ApiProgramItem) => {
        const titleMatch = (program.title || program.name || "")
          .toLowerCase()
          .includes(term);
        const descMatch = (program.description || "")
          .toLowerCase()
          .includes(term);
        const abbrMatch = (program.abbr || extractAbbr(program.title || ""))
          .toLowerCase()
          .includes(term);
        const coursesMatch = program.courses?.some((c) => {
          const cTitle = (c.title || "").toLowerCase();
          const cDesc = (c.shortDesc || c.fullDesc || "").toLowerCase();
          return cTitle.includes(term) || cDesc.includes(term);
        });

        return Boolean(titleMatch || descMatch || abbrMatch || coursesMatch);
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
            <HugeiconsIcon icon={Certificate01Icon} size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">
              Certifications & Programs
            </h2>
            <p className="text-xs text-text/60">
              Accredited qualifications, training courses, and professional credentials
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
        loadingText="Searching certifications & programs..."
        emptyState={
          <div className="rounded-2xl border border-sand bg-white p-8 text-center text-text/60">
            No certification programs found.
          </div>
        }
      >
        {(results) => {
          if (results.length === 0) {
            return (
              <div className="rounded-2xl border border-dashed border-sand bg-white/60 p-8 text-center sm:p-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand/40 text-text/50">
                  <HugeiconsIcon icon={Certificate01Icon} size={24} />
                </div>
                <h3 className="mt-3 text-base font-bold text-text">
                  No certifications match &ldquo;{searchQuery}&rdquo;
                </h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-text/60">
                  Try searching by abbreviation such as &ldquo;CLPA&rdquo;, &ldquo;BCLP&rdquo;, &ldquo;CLPM&rdquo;, or &ldquo;Loss Prevention&rdquo;.
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((program) => {
                const title = program.title || program.name || "Certification Program";
                const abbr = program.abbr || extractAbbr(title);
                const sealImg =
                  SEALS_BY_ABBR[abbr] ||
                  program.coverImage ||
                  program.image ||
                  Assets.images.certificates.chlps;
                const href = resolveCertificationHref({
                  id: program.id || program._id,
                  slug: program.slug,
                  title: title,
                  abbr: abbr,
                });
                const coursesCount =
                  program.coursesCount ?? program.courses?.length ?? 0;

                return (
                  <article
                    key={program.id || program._id || title}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sand bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-lg"
                  >
                    <div>
                      {/* Top Seal & Abbr Badge */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[#C99E4A]/40 bg-white p-1 shadow-xs">
                          <Image
                            src={sealImg}
                            alt={title}
                            fill
                            className="object-contain p-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                Assets.images.certificates.chlps;
                            }}
                          />
                        </div>
                        <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
                          {abbr}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="mt-4 text-lg font-bold text-primary group-hover:text-secondary transition-colors">
                        {title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-text/70 line-clamp-3">
                        {program.description ||
                          "Comprehensive professional qualification designed to equip industry specialists with loss prevention and asset protection competence."}
                      </p>

                      {/* Included Courses Count */}
                      <div className="mt-4 flex items-center gap-2 text-xs text-text/60">
                        <HugeiconsIcon
                          icon={BookOpen01Icon}
                          size={14}
                          className="text-secondary"
                        />
                        <span>
                          {coursesCount > 0
                            ? `${coursesCount} accredited ${coursesCount === 1 ? "course" : "courses"} included`
                            : "Standard certification curriculum"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Link */}
                    <div className="mt-6 flex items-center justify-between border-t border-sand/60 pt-4">
                      <span className="text-xs font-medium text-text/60">
                        Accredited Pathway
                      </span>
                      <Link
                        href={href}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary transition-all group-hover:bg-primary group-hover:text-white"
                      >
                        <span>Explore Program</span>
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
