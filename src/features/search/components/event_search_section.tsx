"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicEvents } from "@/features/events/services/event_service";
import EventCard from "@/features/events/components/event_card";
import QueryCompLayout from "@/components/QueryCompLayout";
import type { ChlpsEvent } from "@/features/events/events_data";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon } from "@hugeicons/core-free-icons";

interface EventSearchSectionProps {
  searchQuery: string;
  onCountChange?: (count: number) => void;
}

export default function EventSearchSection({
  searchQuery,
  onCountChange,
}: EventSearchSectionProps) {
  const query = useQuery({
    queryKey: ["search-events", searchQuery],
    queryFn: async () => {
      const allEvents = await fetchPublicEvents();
      const term = searchQuery.trim().toLowerCase();
      if (!term) return allEvents;

      return allEvents.filter((evt: ChlpsEvent) => {
        const titleMatch = evt.title?.toLowerCase().includes(term);
        const descMatch = evt.description?.toLowerCase().includes(term);
        const catMatch = evt.category?.toLowerCase().includes(term);
        const locMatch = evt.location?.toLowerCase().includes(term);
        const dateMatch = evt.date?.toLowerCase().includes(term);

        return Boolean(
          titleMatch || descMatch || catMatch || locMatch || dateMatch,
        );
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
            <HugeiconsIcon icon={Calendar01Icon} size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">
              Events & Webinars
            </h2>
            <p className="text-xs text-text/60">
              Upcoming symposiums, roundtables, workshops, and CPD webinars
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
        loadingText="Searching events & webinars..."
        emptyState={
          <div className="rounded-2xl border border-sand bg-white p-8 text-center text-text/60">
            No events found.
          </div>
        }
      >
        {(results) => {
          if (results.length === 0) {
            return (
              <div className="rounded-2xl border border-dashed border-sand bg-white/60 p-8 text-center sm:p-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand/40 text-text/50">
                  <HugeiconsIcon icon={Calendar01Icon} size={24} />
                </div>
                <h3 className="mt-3 text-base font-bold text-text">
                  No events match &ldquo;{searchQuery}&rdquo;
                </h3>
                <p className="mx-auto mt-1 max-w-md text-xs text-text/60">
                  Try searching for terms like &ldquo;Webinar&rdquo;,
                  &ldquo;Conference&rdquo;, &ldquo;Workshop&rdquo;, or
                  &ldquo;Loss Prevention&rdquo;.
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((evt, idx) => (
                <EventCard key={evt.id} event={evt} index={idx} />
              ))}
            </div>
          );
        }}
      </QueryCompLayout>
    </div>
  );
}
