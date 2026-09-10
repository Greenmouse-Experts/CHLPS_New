import type { IconSvgElement } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Building03Icon,
  ChartDecreaseIcon,
  ComputerActivityIcon,
  SearchCheckIcon,
  ShieldAlertIcon,
} from "@hugeicons/core-free-icons";
import type { BlogPost } from "@/types";

export type ArticleCategory = "Blog" | "News" | string;
export type ArticleTone = "navy" | "lilac" | "cream";

export type NewsArticle = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  date: string;
  tone: ArticleTone;
  icon?: IconSvgElement;
  coverImage?: string;
  featured?: boolean;
  content?: string;
  author?: {
    name: string;
    picture?: string;
  };
  tags?: string[];
};

const tones: ArticleTone[] = ["navy", "lilac", "cream"];
const defaultIcons: IconSvgElement[] = [
  SearchCheckIcon,
  ShieldAlertIcon,
  ComputerActivityIcon,
  ChartDecreaseIcon,
  Briefcase01Icon,
  Building03Icon,
];

/**
 * Transforms a backend BlogPost entity into a NewsArticle for UI display.
 */
export function transformBlogPostToArticle(
  post: BlogPost,
  index = 0,
): NewsArticle {
  const tone = tones[index % tones.length];
  const icon = defaultIcons[index % defaultIcons.length];

  let formattedDate = "";
  if (post.createdDate || post.createdAt) {
    try {
      const d = new Date(post.createdDate || post.createdAt || "");
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      }
    } catch {
      formattedDate = "";
    }
  }

  // Extract clean text excerpt
  let excerpt = post.brief || "";
  if (!excerpt && post.description) {
    excerpt =
      post.description
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180) + "...";
  }

  const tags = Array.isArray(post.tags)
    ? post.tags
        .map((t) => (typeof t === "string" ? t : t.tag || t.name || ""))
        .filter(Boolean)
    : [];

  const category = tags[0] || "Blog";

  const authorName = post.user
    ? `${post.user.firstName || ""} ${post.user.lastName || ""}`.trim()
    : "CHLPS Editorial";

  return {
    id: post.id,
    slug: post.slug || post.id,
    title: post.title,
    excerpt,
    category,
    date: formattedDate || "Recent",
    tone,
    icon,
    coverImage: post.coverImage,
    featured: index === 0,
    content: post.description,
    author: {
      name: authorName || "CHLPS Editorial",
      picture: post.user?.picture,
    },
    tags,
  };
}

export function articleHref(
  article: NewsArticle | { slug?: string; id?: string },
) {
  return `/news-and-blog/${article.slug || article.id}`;
}
