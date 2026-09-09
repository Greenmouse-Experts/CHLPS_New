import Link from "next/link";
import PageContainer from "@/features/components/page_container";
import { Reveal } from "@/features/components/reveal";
import { NewsCardGrid } from "@/features/news/components/news_card";
import { articles } from "@/features/news/news_data";

export default function LatestArticlesSection() {
  return (
    <section id="latest-articles" className="bg-white py-14 sm:py-16 lg:py-20">
      <PageContainer>
        <div className="flex items-end justify-between gap-4">
          <Reveal className="min-w-0">
            <h2 className="text-[1.75rem] font-light leading-[1.1] tracking-tight text-[#0A1542] sm:text-[2rem] lg:text-[40px]">
              Latest Articles
            </h2>
          </Reveal>

          <Reveal delay={80} className="shrink-0">
            <Link
              href="/news-and-blog"
              className="text-[14px] text-[#6F6E7A] transition-colors duration-200 hover:text-primary sm:text-[16px]"
            >
              News &amp; Blog
            </Link>
          </Reveal>
        </div>

        <NewsCardGrid articles={articles} />
      </PageContainer>
    </section>
  );
}
