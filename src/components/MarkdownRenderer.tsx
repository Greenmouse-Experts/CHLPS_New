"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div
      className={`markdown-body text-[16px] leading-relaxed text-[#2C2B36] sm:text-[17px] ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              className="mt-8 mb-4 text-2xl font-bold tracking-tight text-[#0A1542] sm:text-3xl"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="mt-8 mb-4 text-xl font-bold tracking-tight text-[#0A1542] sm:text-2xl"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="mt-6 mb-3 text-lg font-semibold text-[#0A1542] sm:text-xl"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="mt-5 mb-2 text-base font-semibold text-[#0A1542] sm:text-lg"
              {...props}
            >
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => (
            <p className="my-4 leading-relaxed text-[#2C2B36]" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul
              className="my-4 list-disc space-y-2 pl-6 text-[#2C2B36]"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="my-4 list-decimal space-y-2 pl-6 text-[#2C2B36]"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-6 rounded-r-xl border-l-4 border-[#1B1454] bg-[#FAF9F5] py-3.5 px-5 italic text-[#4A4758]"
              {...props}
            >
              {children}
            </blockquote>
          ),
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-medium text-[#1B1454] underline decoration-[#CDA54E] underline-offset-2 transition hover:text-[#CDA54E]"
              {...props}
            >
              {children}
            </a>
          ),
          img: ({ src, alt, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt ?? "Article illustration"}
              loading="lazy"
              className="my-6 max-w-full rounded-2xl shadow-sm object-cover"
              {...props}
            />
          ),
          hr: (props) => (
            <hr className="my-8 border-t border-[#EAE7F2]" {...props} />
          ),
          code: ({ children, className, ...props }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code
                  className={`block font-mono  ${className ?? ""}`}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded bg-[#EEEAFB] px-1.5 py-0.5 font-mono  font-medium text-[#101D63]"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre
              className="my-6 overflow-x-auto rounded-xl bg-[#1E1758] p-4 font-mono  text-white"
              {...props}
            >
              {children}
            </pre>
          ),
          table: ({ children, ...props }) => (
            <div className="my-6 overflow-x-auto">
              <table
                className="w-full border-collapse border border-[#EAE7F2] "
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-[#EAE7F2] bg-[#FAF9F5] px-4 py-2.5 text-left font-semibold text-[#0A1542]"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="border border-[#EAE7F2] px-4 py-2.5 text-[#2C2B36]"
              {...props}
            >
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
