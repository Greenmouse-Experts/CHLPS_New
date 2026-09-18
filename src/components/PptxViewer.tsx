import { useEffect, useRef, useState } from "react";
import { init } from "pptx-preview";
import { Loader2 } from "lucide-react";

interface PptxViewerProps {
  src: string;
  title?: string;
  className?: string;
}

/**
 * Renders a .pptx/.ppt file entirely client-side via `pptx-preview`.
 * Falls back to the Office Online viewer if the file can't be fetched
 * (e.g. CORS) or parsed.
 */
export default function PptxViewer({ src, title, className }: PptxViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let previewer: ReturnType<typeof init> | null = null;

    async function render() {
      if (!el) return;
      try {
        setStatus("loading");
        const res = await fetch(src);
        if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        el.innerHTML = "";
        const width = el.clientWidth || 960;
        previewer = init(el, {
          width,
          height: Math.round((width * 9) / 16),
          mode: "slide",
        });
        await previewer.preview(buffer);
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    render();

    return () => {
      cancelled = true;
      previewer?.destroy?.();
      el.innerHTML = "";
    };
  }, [src]);

  // Fallback to Office Online viewer when direct rendering fails.
  if (status === "error") {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(src)}`}
        title={title ?? "Presentation"}
        className={className ?? "h-full w-full"}
      />
    );
  }

  return (
    <div className={`relative ${className ?? "h-full w-full"}`}>
      {status === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-100 text-base-content/50">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <div ref={containerRef} className="h-full w-full overflow-auto" />
    </div>
  );
}
