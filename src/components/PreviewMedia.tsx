"use client";

import { useEffect, useRef, useState } from "react";
import {
  Maximize,
  Minimize,
  Lock,
  Play,
  FileText,
  Image as ImageIcon,
  ClipboardList,
  Clock,
  ExternalLink,
} from "lucide-react";
import PptxViewer from "@/components/PptxViewer";
import type { CourseContentSub } from "@/types/courses";

function getYouTubeEmbedUrl(url: string): string | null {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1`
    : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:vimeo)\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/,
  );
  return match && match[1]
    ? `https://player.vimeo.com/video/${match[1]}?autoplay=1`
    : null;
}

function officeEmbedUrl(src: string) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`;
}

function googleDocsEmbedUrl(src: string) {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(src)}&embedded=true`;
}

function isPptx(src: string) {
  return /\.(pptx?|ppt)($|\?)/i.test(src);
}

function isDocx(src: string) {
  return /\.docx?($|\?)/i.test(src);
}

function isPdf(src: string) {
  return /\.pdf($|\?)/i.test(src);
}

function isImage(src: string) {
  return /\.(jpe?g|png|webp|gif|svg|bmp|avif)($|\?)/i.test(src);
}

function FullscreenWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggle() {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      ref.current?.requestFullscreen?.();
    }
  }

  return (
    <div ref={ref} className={`group relative ${className ?? ""}`}>
      {children}
      <button
        type="button"
        onClick={toggle}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute bottom-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-md bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100"
      >
        {isFullscreen ? (
          <Minimize className="h-4 w-4" />
        ) : (
          <Maximize className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default function PreviewMedia({ sub }: { sub: CourseContentSub }) {
  // Check previewUrl, media, or any other link property
  const src =
    sub.previewUrl ||
    sub.media ||
    (sub as unknown as { url?: string }).url ||
    (sub as unknown as { file?: string }).file ||
    "";

  // If no preview URL exists for this lesson
  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1E1758]/10 text-[#1E1758]">
          <Lock className="h-8 w-8 text-[#1E1758]" />
        </div>
        <h4 className=" text-lg font-bold text-[#1E1758]">
          Preview Not Available
        </h4>
        <p className="mt-2 max-w-md  text-[#7A778B] leading-relaxed">
          A preview has not been made publicly available for &ldquo;{sub.title}
          &rdquo;. Enroll in this certification program to access the full
          module lessons, video lectures, and study materials.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF9F5] border border-[#CDA54E]/40 px-3.5 py-1  font-medium text-[#1E1758]">
            {sub.mediaType === "video" && <Play className="h-3 w-3" />}
            {sub.mediaType === "image" && <ImageIcon className="h-3 w-3" />}
            {sub.mediaType === "assessment" && (
              <ClipboardList className="h-3 w-3" />
            )}
            {sub.mediaType === "document" && <FileText className="h-3 w-3" />}
            <span className="capitalize">{sub.mediaType} lesson</span>
          </span>
          {sub.duration > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF9F5] border border-[#CDA54E]/40 px-3.5 py-1  font-medium text-[#7A778B]">
              <Clock className="h-3 w-3" />
              {sub.duration} mins
            </span>
          )}
        </div>
      </div>
    );
  }

  // Assessment preview placeholder
  if (sub.mediaType === "assessment") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1E1758]/10 text-[#1E1758]">
          <ClipboardList className="h-8 w-8 text-[#1E1758]" />
        </div>
        <h4 className=" text-lg font-bold text-[#1E1758]">
          Module Knowledge Assessment
        </h4>
        <p className="mt-2 max-w-md  text-[#7A778B] leading-relaxed">
          This assessment evaluates your understanding of the concepts covered
          in this module. Full access to interactive quizzes and tests is
          unlocked upon enrollment.
        </p>
      </div>
    );
  }

  // YouTube video
  const ytEmbed = getYouTubeEmbedUrl(src);
  if (ytEmbed) {
    return (
      <FullscreenWrapper className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={ytEmbed}
          title={sub.title}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </FullscreenWrapper>
    );
  }

  // Vimeo video
  const vimeoEmbed = getVimeoEmbedUrl(src);
  if (vimeoEmbed) {
    return (
      <FullscreenWrapper className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={vimeoEmbed}
          title={sub.title}
          className="h-full w-full border-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </FullscreenWrapper>
    );
  }

  // Direct video file or generic video mediaType
  if (
    sub.mediaType === "video" ||
    /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(src)
  ) {
    return (
      <div className="w-full overflow-hidden rounded-xl bg-black">
        <video
          src={src}
          controls
          controlsList="nodownload"
          autoPlay
          playsInline
          className="max-h-[70vh] w-full object-contain"
        />
      </div>
    );
  }

  // Image
  if (sub.mediaType === "image" || isImage(src)) {
    return (
      <FullscreenWrapper className="flex h-[70vh] w-full items-center justify-center overflow-hidden rounded-xl border border-base-300 bg-[#F8F8F8]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="lazy"
          src={src}
          alt={sub.title}
          className="max-h-full max-w-full object-contain"
        />
      </FullscreenWrapper>
    );
  }

  // PPTX Presentation
  if (isPptx(src)) {
    return (
      <FullscreenWrapper className="h-[70vh] w-full overflow-hidden rounded-xl border border-base-300">
        <PptxViewer src={src} title={sub.title} className="h-full w-full" />
      </FullscreenWrapper>
    );
  }

  // Word Document
  if (isDocx(src)) {
    return (
      <FullscreenWrapper className="h-[70vh] w-full overflow-hidden rounded-xl border border-base-300">
        <iframe
          src={officeEmbedUrl(src)}
          title={sub.title}
          className="h-full w-full border-0"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-white" />
      </FullscreenWrapper>
    );
  }

  // PDF Document
  if (isPdf(src)) {
    const pdfSrc = src.split("#")[0] + "#toolbar=0&navpanes=0";
    return (
      <FullscreenWrapper className="h-[70vh] w-full overflow-hidden rounded-xl border border-base-300">
        <iframe
          src={pdfSrc}
          title={sub.title}
          className="h-full w-full border-0 bg-white"
        />
      </FullscreenWrapper>
    );
  }

  // Generic document embed via Google Docs Viewer
  if (sub.mediaType === "document") {
    return (
      <FullscreenWrapper className="h-[70vh] w-full overflow-hidden rounded-xl border border-base-300">
        <iframe
          src={googleDocsEmbedUrl(src)}
          title={sub.title}
          className="h-full w-full border-0 bg-white"
        />
      </FullscreenWrapper>
    );
  }

  // Fallback for unsupported or unknown types
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-base-300 bg-base-200 p-6 text-center">
      <FileText className="h-8 w-8 text-base-content/40" />
      <p className=" text-base-content/70">
        Direct preview is not supported for this file type.
      </p>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5  font-semibold text-primary hover:underline"
      >
        <span>Open file in new tab</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
