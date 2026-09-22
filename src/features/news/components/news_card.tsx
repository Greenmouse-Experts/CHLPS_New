"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/tokens";
import {
  articleHref,
  type ArticleTone,
  type NewsArticle,
} from "@/features/news/news_data";
import { Assets } from "@/lib/assets";

const tones: Record<ArticleTone, { surface: string; label: string }> = {
  navy: { surface: "bg-[#101D63]", label: "text-white" },
  lilac: { surface: "bg-[#EEEAFB]", label: "text-[#0A1542]" },
  cream: { surface: "bg-[#F4ECD7]", label: "text-[#0A1542]" },
};

function isValidImageUrl(src?: string | null): boolean {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  if (
    !trimmed ||
    trimmed === "string" ||
    trimmed === "null" ||
    trimmed === "undefined"
  ) {
    return false;
  }
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:")
  );
}

export default function NewsCard({
  article,
  index = 0,
  className,
}: {
  article: NewsArticle;
  index?: number;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  if (!article) return null;

  const tone =
    article.tone && tones[article.tone] ? tones[article.tone] : tones.navy;

  const rawCover = article.coverImage?.trim();
  const hasValidImage = isValidImageUrl(rawCover) && !imgError;
  const isRemote = Boolean(
    rawCover &&
    (rawCover.startsWith("http://") || rawCover.startsWith("https://")),
  );

  const iconToRender =
    article.icon &&
    (typeof article.icon === "object" || typeof article.icon === "function")
      ? article.icon
      : BookOpen01Icon;

  const title = article.title || "Untitled Article";
  const excerpt = article.excerpt || "";
  const category = article.category || "News";
  const date = article.date || "";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-[#E5D3AE] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(22,16,88,0.12)]",
        className,
      )}
    >
      <div
        className={`relative aspect-[16/9] w-full shrink-0 overflow-hidden ${tone.surface}`}
      >
        {hasValidImage ? (
          <>
            <Image
              src={rawCover!}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              unoptimized={isRemote}
              onError={() => setImgError(true)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </>
        ) : (
          <>
            <Image
              src={Assets.images.cardPatternRight}
              alt=""
              aria-hidden
              width={899}
              height={756}
              sizes="(max-width: 640px) 45vw, (max-width: 1280px) 25vw, 15vw"
              className="pointer-events-none absolute right-0 top-0 h-auto w-[44%] select-none"
            />
            <Image
              src={Assets.images.cardPatternLeft}
              alt=""
              aria-hidden
              width={688}
              height={608}
              sizes="(max-width: 640px) 35vw, (max-width: 1280px) 20vw, 12vw"
              className="pointer-events-none absolute bottom-0 left-0 h-auto w-[35%] select-none"
            />
          </>
        )}

        {article.featured ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#211A73] shadow-sm sm:left-5 sm:top-5">
            Featured Article
          </span>
        ) : null}

        <span className="absolute bottom-4 left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-secondary bg-white shadow-md sm:bottom-5 sm:left-5 sm:h-14 sm:w-14">
          <HugeiconsIcon
            icon={iconToRender}
            size={22}
            color="#0A1542"
            strokeWidth={1.8}
          />
        </span>

        <span
          className={`absolute bottom-4 right-4 z-10 rounded-md px-2.5 py-1  font-bold uppercase tracking-[0.16em] sm:bottom-5 sm:right-5 ${
            hasValidImage
              ? "bg-black/60 text-white backdrop-blur-sm"
              : tone.label
          }`}
        >
          {category}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <span className=" font-semibold uppercase tracking-[0.14em] text-[#8A8A96]">
            {category}
          </span>
          {date ? (
            <span className=" font-medium uppercase tracking-[0.1em] text-[#8A8A96]">
              {date}
            </span>
          ) : null}
        </div>

        <h3 className="mt-3.5 text-[1.05rem] font-semibold uppercase leading-[1.35] tracking-tight text-[#0A1542] sm:text-[1.125rem]">
          {title}
        </h3>

        {excerpt ? (
          <p className="mt-2.5 line-clamp-3  leading-relaxed ">{excerpt}</p>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#E7E7EC] pt-4 lg:mt-auto lg:pt-5">
          <span className="text-[14px] font-bold text-[#0A1542]">
            Read More
          </span>
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={20}
            color="#0A1542"
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>

      <Link
        href={articleHref(article)}
        className="absolute inset-0 z-20 rounded-[18px]"
        aria-label={`Read more: ${title}`}
      />
    </article>
  );
}

export function NewsCardGrid({
  articles,
  className,
}: {
  articles: NewsArticle[];
  className?: string;
}) {
  if (!articles || articles.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3",
        className,
      )}
    >
      {articles.map((article, index) => (
        <NewsCard
          key={article.slug || article.id || index}
          article={article}
          index={index}
        />
      ))}
    </div>
  );
}
