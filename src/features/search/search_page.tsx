"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageContainer from "@/features/components/page_container";
import MembershipSearchSection from "./components/membership_search_section";
import CertificationSearchSection from "./components/certification_search_section";
import EventSearchSection from "./components/event_search_section";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Search01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

type SearchCategory = "all" | "memberships" | "certifications" | "events";

const POPULAR_SEARCH_TERMS = [
  "CLPA",
  "BCLP",
  "CLPM",
  "Chartered",
  "Student",
  "Associate",
  "Webinar",
  "Loss Prevention",
  "Security",
];

export default function SearchPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [inputVal, setInputVal] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const [, startTransition] = useTransition();

  // Section item counts for tabs
  const [membershipCount, setMembershipCount] = useState<number | null>(null);
  const [certificationCount, setCertificationCount] = useState<number | null>(
    null,
  );
  const [eventCount, setEventCount] = useState<number | null>(null);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setInputVal(q);
    setActiveQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    setActiveQuery(trimmed);

    startTransition(() => {
      if (trimmed) {
        router.replace(`/search?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.replace("/search");
      }
    });
  };

  const handleClear = () => {
    setInputVal("");
    setActiveQuery("");
    startTransition(() => {
      router.replace("/search");
    });
  };

  const handleSelectTerm = (term: string) => {
    setInputVal(term);
    setActiveQuery(term);
    startTransition(() => {
      router.replace(`/search?q=${encodeURIComponent(term)}`);
    });
  };

  const totalResults = useMemo(() => {
    const m = membershipCount ?? 0;
    const c = certificationCount ?? 0;
    const e = eventCount ?? 0;
    return m + c + e;
  }, [membershipCount, certificationCount, eventCount]);

  return (
    <main className="min-h-screen bg-[#FBFBFE] pb-24">
      {/* Search Header Banner */}
      <section className="relative overflow-hidden bg-primary px-4 py-16 text-white sm:py-20 md:px-8">
        {/* Subtle patterned gold glow backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/15 blur-3xl"
        />

        <PageContainer>
          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Search <span className="text-secondary">ChLPS Canada</span>
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm text-white/75 sm:text-base">
              Find memberships, professional certifications, training programs,
              and industry events in one place.
            </p>

            {/* Main Search Input Form */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 flex w-full items-center overflow-hidden rounded-2xl border-2 border-white/20 bg-white p-1.5 shadow-2xl transition-all focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center text-primary/60">
                <HugeiconsIcon icon={Search01Icon} size={22} />
              </div>

              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search memberships, certifications (e.g. CLPA), events..."
                className="w-full min-w-0 bg-transparent px-2 text-sm font-medium text-text placeholder:text-text/40 focus:outline-none sm:text-base"
              />

              {inputVal && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear search input"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-text/40 transition-colors hover:bg-sand/30 hover:text-text"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} />
                </button>
              )}

              <button
                type="submit"
                className="ml-1 inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-secondary px-6 text-sm font-bold text-primary transition-all duration-200 hover:brightness-105 active:scale-95"
              >
                Search
              </button>
            </form>

            {/* Popular Search Suggestions */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-white/60 font-medium">Popular:</span>
              {POPULAR_SEARCH_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSelectTerm(term)}
                  className="rounded-full bg-white/10 px-3 py-1 font-medium text-white/90 transition-all hover:bg-secondary hover:text-primary"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Results Content Area */}
      <PageContainer className="mt-8 space-y-8">
        {/* Status & Filter Pill Navigation */}
        <div className="flex flex-col gap-4 border-b border-sand pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-text/80">
              {activeQuery ? (
                <>
                  Results for &ldquo;
                  <span className="font-bold text-primary">{activeQuery}</span>
                  &rdquo;
                  {membershipCount !== null && (
                    <span className="ml-2 text-xs font-normal text-text/50">
                      ({totalResults} total{" "}
                      {totalResults === 1 ? "match" : "matches"})
                    </span>
                  )}
                </>
              ) : (
                <>
                  Browse All Categories
                  {membershipCount !== null && (
                    <span className="ml-2 text-xs font-normal text-text/50">
                      ({totalResults} items available)
                    </span>
                  )}
                </>
              )}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-text/70 border border-sand hover:bg-sand/20"
              }`}
            >
              All {totalResults > 0 && `(${totalResults})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("memberships")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === "memberships"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-text/70 border border-sand hover:bg-sand/20"
              }`}
            >
              Memberships {membershipCount !== null && `(${membershipCount})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("certifications")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === "certifications"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-text/70 border border-sand hover:bg-sand/20"
              }`}
            >
              Certifications{" "}
              {certificationCount !== null && `(${certificationCount})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("events")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === "events"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-text/70 border border-sand hover:bg-sand/20"
              }`}
            >
              Events {eventCount !== null && `(${eventCount})`}
            </button>
          </div>
        </div>

        {/* 3 Results Components */}
        <div className="space-y-12">
          {/* Section 1: Memberships */}
          {(activeCategory === "all" || activeCategory === "memberships") && (
            <MembershipSearchSection
              searchQuery={activeQuery}
              onCountChange={setMembershipCount}
            />
          )}

          {/* Section 2: Certifications / Programs */}
          {(activeCategory === "all" ||
            activeCategory === "certifications") && (
            <CertificationSearchSection
              searchQuery={activeQuery}
              onCountChange={setCertificationCount}
            />
          )}

          {/* Section 3: Events */}
          {(activeCategory === "all" || activeCategory === "events") && (
            <EventSearchSection
              searchQuery={activeQuery}
              onCountChange={setEventCount}
            />
          )}
        </div>
      </PageContainer>
    </main>
  );
}
