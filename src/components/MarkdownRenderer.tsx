"use client";

import React, { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { cn } from "@/lib/tokens";

export interface MarkdownRendererProps {
  content?: string | null;
  children?: string | null;
  className?: string;
  fallback?: React.ReactNode;
}

// Configure marked with GitHub-flavored markdown and line break support
marked.use({
  gfm: true,
  breaks: true,
});

export function preprocessMarkdown(content?: string | null): string {
  if (!content) return "";
  let text = String(content).trim();

  // 1. Unescape literal escaped newlines if present (e.g. from JSON serialization "\\n")
  if (text.includes("\\n") && !text.includes("\n")) {
    text = text.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
  }

  // 2. Decode XML/HTML character entities for whitespace & newlines
  text = text
    .replace(/&#x0*A;/gi, "\n")
    .replace(/&#0*10;/g, "\n")
    .replace(/&#x0*D;/gi, "\r")
    .replace(/&#0*13;/g, "\r")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/g, " ");

  // 3. Strip metadata, style, and font tags from external paste (Figma / Word)
  text = text
    .replace(/<span[^>]*data-(?:metadata|buffer)[^>]*>[\s\S]*?<\/span>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?font[^>]*>/gi, "");

  // 4. Normalise bullet items (lines starting with *, •, -, etc.)
  text = text
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();
      const bullet = trimmed.match(/^[*•-]\s+(.*)$/);
      if (bullet) return `* ${bullet[1].trim()}`;
      return line;
    })
    .join("\n");

  return text.trim();
}

export function MarkdownRenderer({
  content,
  children,
  className,
  fallback = null,
}: MarkdownRendererProps) {
  const rawText = content ?? children ?? "";
  const cleanedText = preprocessMarkdown(rawText);

  const html = useMemo(() => {
    if (!cleanedText) return "";
    try {
      const parsed = marked.parse(cleanedText) as string;
      if (typeof window !== "undefined") {
        return DOMPurify.sanitize(parsed, {
          ADD_ATTR: ["target", "rel"],
        });
      }
      return parsed;
    } catch {
      return cleanedText;
    }
  }, [cleanedText]);

  if (!cleanedText) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none text-base-content/90 font-normal leading-relaxed",
        "prose-headings:font-bold prose-headings:text-base-content prose-headings:tracking-tight",
        "prose-p:leading-relaxed prose-p:my-2",
        "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
        "prose-strong:font-semibold prose-strong:text-base-content",
        "prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5",
        "prose-code:bg-base-200 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono",
        "prose-pre:bg-base-300 prose-pre:text-base-content prose-pre:rounded-xl",
        "prose-blockquote:border-l-primary prose-blockquote:text-base-content/70 prose-blockquote:italic",
        "prose-table:border-collapse prose-th:border prose-th:border-base-300 prose-th:p-2 prose-th:bg-base-200/50 prose-td:border prose-td:border-base-300 prose-td:p-2",
        "prose-img:rounded-xl prose-img:border prose-img:border-base-300/60",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default MarkdownRenderer;
