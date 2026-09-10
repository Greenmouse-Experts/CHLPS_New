import type { Metadata } from "next";
import ArticleDetailPage from "@/features/news/article_detail_page";

type NewsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Article | CHLPS Canada`,
    description:
      "Explore articles and professional loss prevention perspectives from the Canadian Loss Prevention Association.",
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  return <ArticleDetailPage id={id} />;
}
