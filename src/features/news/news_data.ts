import type { IconSvgElement } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Building03Icon,
  ChartDecreaseIcon,
  ComputerActivityIcon,
  SearchCheckIcon,
  ShieldAlertIcon,
} from "@hugeicons/core-free-icons";

export type ArticleCategory = "Blog" | "News";
export type ArticleTone = "navy" | "lilac" | "cream";

export type NewsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  date: string;
  tone: ArticleTone;
  icon: IconSvgElement;
  featured?: boolean;
};

export const articles: NewsArticle[] = [
  {
    slug: "conducting-effective-workplace-investigations",
    title:
      "Conducting Effective Workplace Investigations: Best Practices for Loss Prevention Leaders",
    excerpt:
      "Workplace investigations are a central responsibility for loss prevention professionals. Whether the issue involves theft, policy violations, safety breaches, harassment, or misconduct, the way an investigation is handled shapes the outcome.",
    category: "Blog",
    date: "June 6, 2026",
    tone: "navy",
    icon: SearchCheckIcon,
    featured: true,
  },
  {
    slug: "internal-theft-root-causes-and-early-intervention",
    title:
      "Internal Theft: Root Causes, Risk Indicators, and Early Intervention Strategies",
    excerpt:
      "Internal theft remains one of the most challenging problems in the loss prevention field. It is uncomfortable to confront, often difficult to detect, and damaging to workplace trust long after the loss itself.",
    category: "Blog",
    date: "June 6, 2026",
    tone: "lilac",
    icon: ShieldAlertIcon,
  },
  {
    slug: "how-technology-is-transforming-loss-prevention",
    title:
      "How Technology Is Transforming Loss Prevention in Retail and Corporate Environments",
    excerpt:
      "Technology has become one of the most influential forces reshaping the practice of loss prevention across Canada. What used to depend on observation and manual reporting is now supported by data.",
    category: "Blog",
    date: "June 5, 2026",
    tone: "cream",
    icon: ComputerActivityIcon,
  },
  {
    slug: "understanding-shrink-key-drivers-and-practical-strategies",
    title:
      "Understanding Shrink: Key Drivers and Practical Strategies for Reducing Losses",
    excerpt:
      "Shrink remains one of the most persistent challenges facing organizations. Although the term is often associated with retail, shrink affects warehouses, logistics operations and corporate environments alike.",
    category: "Blog",
    date: "June 5, 2026",
    tone: "cream",
    icon: ChartDecreaseIcon,
  },
  {
    slug: "the-evolving-role-of-the-modern-loss-prevention-professional",
    title:
      "The Evolving Role of the Modern Loss Prevention Professional in Canadian Businesses",
    excerpt:
      "The landscape of corporate risk in Canada has shifted dramatically over the last decade. Loss prevention, once viewed as a purely reactive function, now sits much closer to the centre of business strategy.",
    category: "Blog",
    date: "June 5, 2026",
    tone: "navy",
    icon: Briefcase01Icon,
  },
  {
    slug: "building-an-effective-loss-prevention-program-for-smes",
    title:
      "Building an Effective Loss Prevention Program for Small and Medium Enterprises",
    excerpt:
      "Small and medium enterprises often operate with limited resources, yet they face the same risks as larger corporations. Theft, fraud, process failures and safety incidents can quickly erode thin margins.",
    category: "Blog",
    date: "June 5, 2026",
    tone: "lilac",
    icon: Building03Icon,
  },
];

export function articleHref(article: NewsArticle) {
  return `/news-and-blog/${article.slug}`;
}
