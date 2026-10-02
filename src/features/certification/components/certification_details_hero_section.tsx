"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";
import type { CertificationDetail } from "@/features/certification/certification_details";
import Modal, { type ModalHandle } from "@/components/DialogModal";

function formatRichText(content?: string) {
  if (!content) return "";
  let cleaned = content.trim();

  // Strip Figma metadata and buffer junk spans
  cleaned = cleaned.replace(
    /<span[^>]*data-(?:metadata|buffer)[^>]*>[\s\S]*?<\/span>/gi,
    "",
  );

  // Strip embedded <style> tags
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  // Strip obsolete <font> tags while preserving text content
  cleaned = cleaned.replace(/<\/?font[^>]*>/gi, "");

  // Strip hardcoded typography/colour inline styles from external pastes
  // (Figma, Word, Google Docs) so the section's own typography applies.
  cleaned = cleaned.replace(
    /style=(["'])(.*?)\1/gi,
    (_match, quote, styleContent) => {
      const filtered = styleContent
        .replace(
          /(?:^|;)\s*(?:color|background-color|font-size|font-family|line-height|white-space)\s*:[^;]*/gi,
          "",
        )
        .trim();
      return filtered ? `style=${quote}${filtered}${quote}` : "";
    },
  );

  const hasHtml = /<[a-z][\s\S]*>/i.test(cleaned);
  if (hasHtml) return cleaned;
  return cleaned
    .split(/\n\n+/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export default function CertificationDetailsHeroSection({
  detail,
  onEnroll,
}: {
  detail: CertificationDetail;
  onEnroll?: () => void;
}) {
  const [bgSrc, setBgSrc] = useState(
    detail.bannerImage || Assets.images.certificateDetailsHero,
  );
  const modalRef = useRef<ModalHandle>(null);

  const formattedBody = formatRichText(detail.heroBody);
  const modalTitle = detail.heroTitle
    ? detail.heroTitle.replace(/\n/g, " ").trim()
    : "Program Overview";

  return (
    <section className="relative isolate z-10 w-full overflow-hidden bg-[#0A1140]">
      <div className="absolute inset-0">
        <Image
          src={bgSrc}
          alt=""
          fill
          priority
          unoptimized
          onError={() => setBgSrc(Assets.images.certificateDetailsHero)}
          quality={90}
          sizes="100vw"
          className="object-center object-cover"
        />
      </div>

      <PageContainer className="relative min-w-0">
        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-8 py-12 sm:gap-10 sm:py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 lg:py-8 xl:gap-10 xl:py-[4.5rem]">
          <div className="min-w-0 max-w-full pt-1 lg:max-w-[32.5rem] lg:pt-2">
            <Reveal>
              <h1 className="whitespace-pre-line text-3xl leading-[1.12] tracking-tight text-white xl:text-4xl">
                {detail.heroTitle}
              </h1>
            </Reveal>

            {formattedBody && (
              <Reveal delay={90}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => modalRef.current?.open()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      modalRef.current?.open();
                    }
                  }}
                  className="group mt-6 cursor-pointer text-left transition-opacity hover:opacity-95 sm:mt-7"
                  title="Click to read full description"
                >
                  <div
                    className="line-clamp-5 text-[14px] leading-[1.75] text-white sm:text-[15px] sm:leading-[1.7] [&_*]:!text-white [&_p]:inline [&_p]:mr-1.5 [&_li]:inline [&_li]:mr-1.5 [&_span]:!text-white [&_strong]:!text-white [&_a]:!text-white"
                    dangerouslySetInnerHTML={{ __html: formattedBody }}
                  />
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-secondary group-hover:underline">
                    Read more
                  </span>
                </div>
              </Reveal>
            )}

            <Reveal delay={160}>
              {onEnroll ? (
                <button
                  type="button"
                  onClick={onEnroll}
                  className="btn btn-secondary mt-5 rounded-full text-xs"
                >
                  <span>Enroll Now</span>
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={2.2}
                  />
                </button>
              ) : (
                <Link
                  href={detail.enrollHref}
                  className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-6 font-bold text-[#0A1542] transition-all duration-200 hover:brightness-95 sm:mt-8 sm:h-12 sm:px-7 sm:text-[14px]"
                >
                  <span>Enroll Now</span>
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={16}
                    color="currentColor"
                    strokeWidth={2.2}
                  />
                </Link>
              )}
            </Reveal>
          </div>
        </div>
      </PageContainer>

      {/* Full Rich Text Modal */}
      <Modal
        ref={modalRef}
        title={modalTitle}
        maxWidth="max-w-3xl"
        actions={
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => modalRef.current?.close()}
          >
            Close
          </button>
        }
      >
        <div
          className="prose prose-sm sm:prose max-w-none text-base-content/90 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_h4]:text-base [&_strong]:font-bold prose"
          dangerouslySetInnerHTML={{ __html: formattedBody }}
        />
      </Modal>
    </section>
  );
}
