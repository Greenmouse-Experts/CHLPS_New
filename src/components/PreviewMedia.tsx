import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import PptxViewer from "#/components/PptxViewer.tsx";
import type { CourseContentSub } from "#/types/courses.ts";

function officeEmbedUrl(src: string) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`;
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
  const src = sub.previewUrl;
  if (!src) return null;

  if (sub.mediaType === "video") {
    // Native video controls already include fullscreen.
    return (
      <video
        src={src}
        controls
        controlsList="nodownload"
        autoPlay
        className="w-full rounded"
      />
    );
  }

  if (sub.mediaType === "image") {
    return (
      <FullscreenWrapper className="h-[70vh] w-full rounded border border-base-300 overflow-hidden bg-base-200">
        <img
          loading="lazy"
          src={src}
          alt={sub.title}
          className="h-full w-full object-contain"
        />
      </FullscreenWrapper>
    );
  }

  if (isPptx(src)) {
    return (
      <FullscreenWrapper className="h-[70vh] w-full rounded border border-base-300 overflow-hidden">
        <PptxViewer src={src} title={sub.title} className="h-full w-full" />
      </FullscreenWrapper>
    );
  }

  if (isDocx(src)) {
    return (
      <FullscreenWrapper className="h-[70vh] w-full rounded border border-base-300 overflow-hidden">
        <iframe
          src={officeEmbedUrl(src)}
          title={sub.title}
          className="h-full w-full"
        />
        {/* Covers the Office Online top toolbar where the download button sits */}
        <div className="absolute inset-x-0 top-0 h-10 bg-white pointer-events-none" />
      </FullscreenWrapper>
    );
  }

  if (isPdf(src)) {
    const pdfSrc = src.split("#")[0] + "#toolbar=0&navpanes=0";
    return (
      <FullscreenWrapper className="h-[70vh] w-full rounded border border-base-300 overflow-hidden">
        <iframe src={pdfSrc} title={sub.title} className="h-full w-full" />
      </FullscreenWrapper>
    );
  }

  return (
    <FullscreenWrapper className="h-[70vh] w-full rounded border border-base-300 overflow-hidden">
      <iframe src={src} title={sub.title} className="h-full w-full" />
    </FullscreenWrapper>
  );
}
