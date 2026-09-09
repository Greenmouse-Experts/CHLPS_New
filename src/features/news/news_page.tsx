import Header from "@/features/components/header";
import Footer from "@/features/components/footer";
import NewsHeroSection from "@/features/news/components/news_hero_section";
import LatestArticlesSection from "@/features/news/components/latest_articles_section";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <NewsHeroSection />
      <LatestArticlesSection />
      <Footer />
    </div>
  );
}
