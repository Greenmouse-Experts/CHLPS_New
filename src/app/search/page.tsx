import React, { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import SearchPageView from "@/features/search/search_page";

export const metadata: Metadata = {
  title: "Search | ChLPS Canada",
  description:
    "Search across membership grades, professional certification pathways, and upcoming loss prevention events.",
};

function SearchPageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#FBFBFE]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-medium text-text/60">Loading search results...</p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFE]">
      <Header />
      <Suspense fallback={<SearchPageFallback />}>
        <SearchPageView />
      </Suspense>
      <Footer />
    </div>
  );
}
