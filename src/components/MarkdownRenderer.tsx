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

// Configure marked with GitHub-flavored markdown
marked.use({
  gfm: true,
  breaks: false,
});

export function preprocessMarkdown(content?: string | null): string {
  if (!content) return "";
  let text = String(content).trim();

  // 1. Unescape literal escaped newlines if present (e.g. from JSON serialization "\\n")
  text = text.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");

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

  // If text already has block HTML elements (<p>, <div>, etc.), let marked/DOMPurify render as is
  const hasBlockHtml = /<(?:p|div|ul|ol|li|h[1-6]|table|blockquote)\b/i.test(
    text,
  );
  if (hasBlockHtml) {
    return text.trim();
  }

  // 4. Split by lines to ensure intentional paragraphs and lists are properly structured
  const rawLines = text.split(/\r?\n/);
  const formattedLines: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Preserve empty lines
    if (!trimmed) {
      if (
        formattedLines.length > 0 &&
        formattedLines[formattedLines.length - 1] !== ""
      ) {
        formattedLines.push("");
      }
      continue;
    }

    // List item (bullet or numbered)
    const bulletMatch = trimmed.match(/^([*•-]|\d+[.)])\s+(.*)$/);
    if (bulletMatch) {
      const prev = formattedLines[formattedLines.length - 1];
      // Ensure empty line before starting a list
      if (
        prev !== undefined &&
        prev !== "" &&
        !/^([*•-]|\d+[.)])\s+/.test(prev)
      ) {
        formattedLines.push("");
      }
      formattedLines.push(`* ${bulletMatch[2].trim()}`);
      continue;
    }

    // Heading or bold title line (e.g. # Title or **Title**)
    const isHeading =
      /^#{1,6}\s+/.test(trimmed) || /^\*\*[^*]+\*\*$/.test(trimmed);
    if (isHeading) {
      const prev = formattedLines[formattedLines.length - 1];
      if (prev !== undefined && prev !== "") {
        formattedLines.push("");
      }
      formattedLines.push(trimmed);
      continue;
    }

    // Regular paragraph line
    const prev = formattedLines[formattedLines.length - 1];
    if (prev !== undefined && prev !== "") {
      // If previous line was a list item or text line, separate into its own paragraph block
      formattedLines.push("");
    }
    formattedLines.push(trimmed);
  }

  return formattedLines.join("\n").trim();
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
    <div className="w-full border-none">
      <div
        className={cn(
          "prose  max-w-none text-base-content/90 font-normal leading-relaxed",
          "prose-headings:font-bold prose-headings:text-base-content prose-headings:tracking-tight",
          "prose-p:leading-relaxed prose-p:my-3",
          "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
          "prose-strong:font-semibold prose-strong:text-base-content",
          "prose-ul:my-3 prose-ol:my-3 prose-li:my-1",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default MarkdownRenderer;
