import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import { articleHref, type ArticleTone, type NewsArticle } from "@/features/news/news_data";
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
  const tone = tones[article.tone];

  return (
    <article
      className="reveal group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-[#E5D3AE] bg-white transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(22,16,88,0.1)]"
      style={revealStyle(index)}
    >
      <div
        className={`relative aspect-[7/3] w-full shrink-0 overflow-hidden ${tone.surface}`}
      >
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

        {article.featured ? (
          <span className="absolute left-5 top-5 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#211A73] sm:left-6 sm:top-6">
            Featured Article
          </span>
        ) : null}

        <span className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-secondary bg-white sm:bottom-6 sm:left-6 sm:h-16 sm:w-16">
          <HugeiconsIcon
            icon={article.icon}
            size={26}
            color="#0A1542"
            strokeWidth={1.8}
          />
        </span>

        <span
          className={`absolute bottom-5 right-5 text-[12px] font-bold uppercase tracking-[0.18em] sm:bottom-6 sm:right-6 ${tone.label}`}
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

        <h3 className="mt-4 text-[1rem] font-semibold uppercase leading-[1.3] tracking-tight text-[#0A1542] sm:text-[1.0625rem]">
          {article.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-[#6F6E7A]">
          {article.excerpt}
        </p>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#E7E7EC] pt-4 lg:mt-auto lg:pt-5">
          <span className="text-[14px] font-bold text-[#0A1542]">Read More</span>
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
        className="absolute inset-0 rounded-[18px]"
        aria-label={`Read more: ${article.title}`}
      />
    </article>
  );
}

export function NewsCardGrid({ articles }: { articles: NewsArticle[] }) {
  return (
    <RevealGroup className="mt-7 grid grid-cols-1 items-stretch gap-5 sm:mt-8 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {articles.map((article, index) => (
        <NewsCard key={article.slug} article={article} index={index} />
      ))}
    </RevealGroup>
  );
}
