"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import PageContainer from "@/features/components/page_container";
import { Reveal } from "@/features/components/reveal";
import { NewsCardGrid } from "@/features/news/components/news_card";
import QueryCompLayout from "@/components/QueryCompLayout";
import {
  fetchPublishedPosts,
  fetchPublishedTags,
} from "@/features/news/services/news_service";
import { transformBlogPostToArticle } from "@/features/news/news_data";

export default function LatestArticlesSection() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const postsQuery = useQuery({
    queryKey: ["public-blog-posts"],
    queryFn: () => fetchPublishedPosts(),
    staleTime: 5 * 60 * 1000,
  });

  const tagsQuery = useQuery({
    queryKey: ["public-blog-tags"],
    queryFn: fetchPublishedTags,
    staleTime: 10 * 60 * 1000,
  });

  // Extract all available tags from the tags endpoint + posts
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    if (tagsQuery.data) {
      for (const t of tagsQuery.data) {
        if (t.tag) set.add(t.tag);
        else if (t.name) set.add(t.name);
      }
    }
    if (postsQuery.data) {
      for (const p of postsQuery.data) {
        if (Array.isArray(p.tags)) {
          for (const t of p.tags) {
            const val = typeof t === "string" ? t : t.tag || t.name;
            if (val) set.add(val);
          }
        }
      }
    }
    return Array.from(set);
  }, [tagsQuery.data, postsQuery.data]);

  // Transform and filter articles
  const filteredArticles = useMemo(() => {
    if (!postsQuery.data) return [];

    const transformed = postsQuery.data.map((p, idx) =>
      transformBlogPostToArticle(p, idx),
    );

    return transformed.filter((article) => {
      // Tag filter
      if (selectedTag !== "all") {
        const matchesTag =
          article.category.toLowerCase() === selectedTag.toLowerCase() ||
          (article.tags &&
            article.tags.some(
              (t) => t.toLowerCase() === selectedTag.toLowerCase(),
            ));
        if (!matchesTag) return false;
      }

      // Search filter
      if (search.trim()) {
        const term = search.toLowerCase().trim();
        const inTitle = article.title.toLowerCase().includes(term);
        const inExcerpt = article.excerpt.toLowerCase().includes(term);
        const inCategory = article.category.toLowerCase().includes(term);
        const inTags =
          article.tags &&
          article.tags.some((t) => t.toLowerCase().includes(term));
        return inTitle || inExcerpt || inCategory || inTags;
      }

      return true;
    });
  }, [postsQuery.data, selectedTag, search]);

  return (
    <section
      id="latest-articles"
      className="bg-[#FAF9F6] py-14 sm:py-16 lg:py-20"
    >
      <PageContainer>
        {/* Header & Search Bar */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="min-w-0">
            <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
              Insights &amp; Analysis
            </span>
            <h2 className="mt-2 text-[1.85rem] font-medium leading-[1.1] tracking-tight text-[#0A1542] sm:text-[2.25rem] lg:text-[40px]">
              Latest Articles
            </h2>
            <p className="mt-2 text-[14px] text-[#6F6E7A] sm:text-[16px]">
              Practical guidance, industry research, and expert loss prevention
              perspectives.
            </p>
          </Reveal>

          {/* Search Bar */}
          <Reveal delay={80} className="w-full lg:w-80 shrink-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-[#D5D2E2] bg-white py-3 pl-11 pr-10 text-[14px] text-[#0A1542] placeholder-[#908DA1] shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#908DA1]">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={18}
                  color="currentColor"
                  strokeWidth={2}
                />
              </span>
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#908DA1] hover:text-[#0A1542]"
                  aria-label="Clear search"
                >
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={14}
                    color="currentColor"
                    strokeWidth={2.2}
                  />
                </button>
              ) : null}
            </div>
          </Reveal>
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-[#E7E5F0] pb-6">
            <button
              type="button"
              onClick={() => setSelectedTag("all")}
              className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all ${
                selectedTag === "all"
                  ? "bg-[#101D63] text-white shadow-sm"
                  : "bg-white text-[#4A4758] border border-[#E2DFEC] hover:bg-[#F2EFFB]"
              }`}
            >
              All Topics
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all capitalize ${
                  selectedTag === tag
                    ? "bg-[#101D63] text-white shadow-sm"
                    : "bg-white text-[#4A4758] border border-[#E2DFEC] hover:bg-[#F2EFFB]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        ) : null}

        {/* Dynamic Grid with QueryCompLayout */}
        <div className="mt-8">
          <QueryCompLayout
            query={postsQuery}
            loadingText="Loading latest articles..."
            emptyState={
              <div className="rounded-2xl border border-dashed border-[#D2CEDF] bg-white py-16 text-center">
                <p className="text-base font-semibold text-[#0A1542]">
                  No articles published yet
                </p>
                <p className="mt-1 text-sm text-[#6F6E7A]">
                  Check back soon for new insights and industry perspectives.
                </p>
              </div>
            }
          >
            {() => {
              if (filteredArticles.length === 0) {
                return (
                  <div className="rounded-2xl border border-dashed border-[#D2CEDF] bg-white py-16 text-center">
                    <p className="text-base font-semibold text-[#0A1542]">
                      No matching articles found
                    </p>
                    <p className="mt-1 text-sm text-[#6F6E7A]">
                      Try adjusting your search terms or selecting a different
                      topic.
                    </p>
                    {(search || selectedTag !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setSelectedTag("all");
                        }}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                );
              }

              return <NewsCardGrid articles={filteredArticles} />;
            }}
          </QueryCompLayout>
        </div>
      </PageContainer>
    </section>
  );
}
