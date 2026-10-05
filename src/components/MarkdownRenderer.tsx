"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/tokens";

export interface MarkdownRendererProps {
  content?: string | null;
  children?: string | null;
  className?: string;
  fallback?: React.ReactNode;
}

export function preprocessMarkdown(content?: string | null): string {
  if (!content) return "";
  let text = content.trim();

  // 1. Unescape literal escaped newlines if present
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

  // 3. Strip metadata, style, and font tags
  text = text
    .replace(/<span[^>]*data-(?:metadata|buffer)[^>]*>[\s\S]*?<\/span>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?font[^>]*>/gi, "");

  // 4. Normalise HTML wrappers if mixed with markdown syntax
  text = text
    .replace(/<\s*p[^>]*>/gi, "\n\n")
    .replace(/<\s*\/\s*p\s*>/gi, "\n\n")
    .replace(/<\s*div[^>]*>/gi, "\n\n")
    .replace(/<\s*\/\s*div\s*>/gi, "\n\n")
    .replace(/<\s*span[^>]*>/gi, "")
    .replace(/<\s*\/\s*span\s*>/gi, "")
    .replace(/<\s*b\s*>/gi, "**")
    .replace(/<\s*\/\s*b\s*>/gi, "**")
    .replace(/<\s*strong\s*>/gi, "**")
    .replace(/<\s*\/\s*strong\s*>/gi, "**")
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/h([1-6])\s*>/gi, "\n\n")
    .replace(/<h1[^>]*>/gi, "\n\n# ")
    .replace(/<h2[^>]*>/gi, "\n\n## ")
    .replace(/<h3[^>]*>/gi, "\n\n### ")
    .replace(/<h4[^>]*>/gi, "\n\n#### ")
    .replace(/<h[56][^>]*>/gi, "\n\n##### ")
    .replace(/<\s*li[^>]*>/gi, "\n- ")
    .replace(/<\s*\/\s*li\s*>/gi, "")
    .replace(/<\s*\/?\s*(ul|ol)[^>]*>/gi, "\n\n");

  // 5. Normalise bullet items (lines starting with *, •, -, etc.)
  text = text
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();
      const bullet = trimmed.match(/^[*•-]\s+(.*)$/);
      if (bullet) return `- ${bullet[1].trim()}`;
      return line;
    })
    .join("\n");

  // 6. Ensure clean spacing around markdown headings and lists
  text = text
    .replace(/\n(\*\*[^*\n]+\*\*)\n/g, "\n\n$1\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
}

export function MarkdownRenderer({
  content,
  children,
  className,
  fallback = null,
}: MarkdownRendererProps) {
  const rawText = content ?? children ?? "";
  const text = preprocessMarkdown(rawText);

  if (!text || !text.trim()) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div className="prose">
      <ReactMarkdown
      // remarkPlugins={[remarkGfm]}
      // rehypePlugins={[rehypeRaw]}
      // components={{
      //   a: ({ node: _node, href, children: linkChildren, ...props }) => {
      //     const isExternal =
      //       href?.startsWith("http://") || href?.startsWith("https://");
      //     return (
      //       <a
      //         href={href}
      //         target={isExternal ? "_blank" : undefined}
      //         rel={isExternal ? "noopener noreferrer" : undefined}
      //         {...props}
      //       >
      //         {linkChildren}
      //       </a>
      //     );
      //   },
      // }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
