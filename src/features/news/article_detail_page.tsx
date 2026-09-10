"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  Clock01Icon,
  Tag01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import PageContainer from "@/features/components/page_container";
import QueryCompLayout from "@/components/QueryCompLayout";
import NewsCard from "@/features/news/components/news_card";
import {
  fetchPublishedPost,
  fetchPublishedPosts,
} from "@/features/news/services/news_service";
import { transformBlogPostToArticle } from "@/features/news/news_data";

export default function ArticleDetailPage({ id }: { id: string }) {
  const [imgError, setImgError] = useState(false);

  const postQuery = useQuery({
    queryKey: ["public-blog-post", id],
    queryFn: () => fetchPublishedPost(id),
    staleTime: 5 * 60 * 1000,
  });

  const relatedQuery = useQuery({
    queryKey: ["public-blog-posts"],
    queryFn: () => fetchPublishedPosts(),
    staleTime: 5 * 60 * 1000,
  });

  const article = useMemo(() => {
    if (!postQuery.data) return null;
    return transformBlogPostToArticle(postQuery.data);
  }, [postQuery.data]);

  // Related articles (exclude current)
  const relatedArticles = useMemo(() => {
    if (!relatedQuery.data) return [];
    return relatedQuery.data
      .filter((p) => p.id !== id && p.slug !== id)
      .slice(0, 3)
      .map((p, idx) => transformBlogPostToArticle(p, idx));
  }, [relatedQuery.data, id]);

  // Calculate reading time
  const readingTimeMinutes = useMemo(() => {
    if (!postQuery.data) return 3;
    const text = `${postQuery.data.title} ${postQuery.data.brief} ${
      postQuery.data.description || ""
    }`.replace(/<[^>]*>/g, " ");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [postQuery.data]);

  const hasCoverImage = Boolean(article?.coverImage) && !imgError;
  const isRemoteImage = Boolean(
    article?.coverImage &&
      (article.coverImage.startsWith("http://") ||
        article.coverImage.startsWith("https://")),
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header />

      <main className="pb-20 pt-8 sm:pb-24 sm:pt-10">
        <PageContainer>
          {/* Top navigation */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/news-and-blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A1542] transition-colors hover:text-primary"
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={18}
                color="currentColor"
                strokeWidth={2.2}
              />
              Back to News &amp; Blog
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-[#7B788B]">
              <Link href="/" className="hover:text-[#0A1542]">
                Home
              </Link>
              <span>/</span>
              <Link href="/news-and-blog" className="hover:text-[#0A1542]">
                News &amp; Blog
              </Link>
              <span>/</span>
              <span className="max-w-[200px] truncate text-[#0A1542] font-medium sm:max-w-xs">
                {article?.title || "Article"}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <QueryCompLayout
              query={postQuery}
              loadingText="Loading article content..."
              emptyState={
                <div className="rounded-2xl border border-dashed border-[#D2CEDF] bg-white py-20 text-center">
                  <h2 className="text-xl font-semibold text-[#0A1542]">
                    Article not found
                  </h2>
                  <p className="mt-2 text-sm text-[#6F6E7A]">
                    The requested article could not be found or has been removed.
                  </p>
                  <Link
                    href="/news-and-blog"
                    className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    View All Articles
                  </Link>
                </div>
              }
            >
              {() => {
                if (!article) return null;

                return (
                  <article className="mx-auto max-w-4xl">
                    {/* Header meta */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-secondary/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#211A73]">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#7B788B]">
                        <HugeiconsIcon
                          icon={Calendar03Icon}
                          size={15}
                          color="currentColor"
                          strokeWidth={1.8}
                        />
                        <span>{article.date}</span>
                      </div>
                      <span className="text-[#C2BFD0]">•</span>
                      <div className="flex items-center gap-1.5 text-xs text-[#7B788B]">
                        <HugeiconsIcon
                          icon={Clock01Icon}
                          size={15}
                          color="currentColor"
                          strokeWidth={1.8}
                        />
                        <span>{readingTimeMinutes} min read</span>
                      </div>
                    </div>

                    {/* Article Title */}
                    <h1 className="mt-5 text-[2rem] font-bold leading-[1.2] tracking-tight text-[#0A1542] sm:text-[2.5rem] lg:text-[3rem]">
                      {article.title}
                    </h1>

                    {/* Author Bar */}
                    <div className="mt-6 flex items-center gap-3.5 border-b border-t border-[#EAE7F2] py-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#101D63] text-white">
                        {article.author?.picture ? (
                          <Image
                            src={article.author.picture}
                            alt={article.author.name}
                            width={44}
                            height={44}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <HugeiconsIcon
                            icon={UserIcon}
                            size={20}
                            color="currentColor"
                            strokeWidth={2}
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#0A1542]">
                          {article.author?.name || "CHLPS Editorial"}
                        </span>
                        <span className="text-xs text-[#7B788B]">
                          Loss Prevention Practice &amp; Standards
                        </span>
                      </div>
                    </div>

                    {/* Cover image */}
                    {hasCoverImage ? (
                      <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-sm sm:aspect-[21/9]">
                        <Image
                          src={article.coverImage!}
                          alt={article.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 900px"
                          unoptimized={isRemoteImage}
                          onError={() => setImgError(true)}
                          className="object-cover"
                        />
                      </div>
                    ) : null}

                    {/* Executive brief callout */}
                    {article.excerpt ? (
                      <div className="mt-8 rounded-xl border-l-4 border-primary bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:p-6">
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                          Executive Summary
                        </span>
                        <p className="mt-2 text-[15px] italic leading-relaxed text-[#4A4758] sm:text-base">
                          &ldquo;{article.excerpt}&rdquo;
                        </p>
                      </div>
                    ) : null}

                    {/* Main HTML article content */}
                    {article.content ? (
                      <div
                        className="article-content mt-10 text-[16px] leading-relaxed text-[#2C2B36] sm:text-[17px] [&>h1]:mt-8 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-[#0A1542] [&>h2]:mt-8 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[#0A1542] [&>h3]:mt-6 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-[#0A1542] [&>p]:mt-4 [&>p]:leading-relaxed [&>ul]:mt-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:mt-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>li]:mt-1.5 [&>blockquote]:my-6 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>img]:my-6 [&>img]:rounded-xl [&>img]:max-w-full [&>a]:font-medium [&>a]:text-primary [&>a]:underline"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      />
                    ) : null}

                    {/* Article tags footer */}
                    {article.tags && article.tags.length > 0 ? (
                      <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-[#EAE7F2] pt-6">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#7B788B]">
                          <HugeiconsIcon
                            icon={Tag01Icon}
                            size={14}
                            color="currentColor"
                            strokeWidth={2}
                          />
                          Tags:
                        </span>
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#EEEAFB] px-3 py-1 text-xs font-medium text-[#101D63]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              }}
            </QueryCompLayout>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 ? (
            <div className="mt-20 border-t border-[#E2DFEC] pt-14">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                    Keep Reading
                  </span>
                  <h2 className="mt-1 text-2xl font-bold text-[#0A1542] sm:text-3xl">
                    Related Articles
                  </h2>
                </div>
                <Link
                  href="/news-and-blog"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((rel, idx) => (
                  <NewsCard key={rel.slug || rel.id || idx} article={rel} index={idx} />
                ))}
              </div>
            </div>
          ) : null}
        </PageContainer>
      </main>

      <Footer />
    </div>
  );
}
