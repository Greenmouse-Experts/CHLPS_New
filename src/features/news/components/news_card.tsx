"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";
import { RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
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

export default function NewsCard({
  article,
  index = 0,
}: {
  article: NewsArticle;
  index?: number;
}) {
  const tone = tones[article.tone] || tones.navy;
  const [imgError, setImgError] = useState(false);

  const hasImage = Boolean(article.coverImage) && !imgError;
  const isRemote = Boolean(
    article.coverImage &&
    (article.coverImage.startsWith("http://") ||
      article.coverImage.startsWith("https://")),
  );

  return (
    <article
      className="reveal group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-[#E5D3AE] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(22,16,88,0.12)]"
      style={revealStyle(index)}
    >
      <div
        className={`relative aspect-[16/9] w-full shrink-0 overflow-hidden ${tone.surface}`}
      >
        {hasImage ? (
          <>
            <Image
              src={article.coverImage!}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              unoptimized={isRemote}
              onError={() => setImgError(true)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
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
            icon={article.icon || BookOpen01Icon}
            size={22}
            color="#0A1542"
            strokeWidth={1.8}
          />
        </span>

        <span
          className={`absolute bottom-4 right-4 z-10 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] sm:bottom-5 sm:right-5 ${
            hasImage ? "bg-black/60 text-white backdrop-blur-sm" : tone.label
          }`}
        >
          {article.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A8A96]">
            {article.category}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#8A8A96]">
            {article.date}
          </span>
        </div>

        <h3 className="mt-3.5 text-[1.05rem] font-semibold uppercase leading-[1.35] tracking-tight text-[#0A1542] sm:text-[1.125rem]">
          {article.title}
        </h3>

        <p className="mt-2.5 line-clamp-3 text-[14px] leading-relaxed text-[#6F6E7A]">
          {article.excerpt}
        </p>

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
        aria-label={`Read more: ${article.title}`}
      />
    </article>
  );
}

export function NewsCardGrid({ articles }: { articles: NewsArticle[] }) {
  return (
    <RevealGroup className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {articles.map((article, index) => (
        <NewsCard
          key={article.slug || article.id || index}
          article={article}
          index={index}
        />
      ))}
    </RevealGroup>
  );
}
