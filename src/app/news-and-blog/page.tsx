import type { Metadata } from "next";
import NewsPage from "@/features/news/news_page";

export const metadata: Metadata = {
  title: "News & Blog",
  description:
    "Loss prevention insights from CHLPS Canada — practical guidance, industry analysis and professional perspectives for members and practitioners.",
};

export default function NewsAndBlog() {
  return <NewsPage />;
}
