import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import NewsHeroSection from "@/features/news/components/news_hero_section";
import LatestArticlesSection from "@/features/news/components/latest_articles_section";
import SoroBlogEmbed from "@/features/news/components/soro_blog_embed";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <NewsHeroSection />
      <LatestArticlesSection />
      <SoroBlogEmbed />
      <Footer />
    </div>
  );
}
