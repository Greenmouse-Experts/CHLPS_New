"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

type EventDetailGalleryProps = {
  images: string[];
  alt: string;
};

export default function EventDetailGallery({
  images,
  alt,
}: EventDetailGalleryProps) {
  const [active, setActive] = useState(0);
  const total = images.length;
  const current = images[active] ?? images[0];

  const goTo = (next: number) => {
    setActive((next + total) % total);
  };

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#D9DEE8] sm:aspect-[2/1] lg:h-[22.5rem] lg:aspect-auto">
      <Image
        src={current}
        alt={alt}
        fill
        priority
        quality={90}
        sizes="(max-width: 1024px) 100vw, 70vw"
        className="object-cover"
      />

      {total > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#1B2A44]/80 text-white transition-opacity hover:bg-[#1B2A44] sm:left-5 sm:h-11 sm:w-11"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={18}
              color="currentColor"
              strokeWidth={2}
            />
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next image"
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#1B2A44]/80 text-white transition-opacity hover:bg-[#1B2A44] sm:right-5 sm:h-11 sm:w-11"
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={18}
              color="currentColor"
              strokeWidth={2}
            />
          </button>

          <div className="absolute bottom-4 left-5 flex items-center gap-1.5 sm:bottom-5 sm:left-6">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                  index === active ? "bg-white" : "bg-white/45"
                }`}
              />
            ))}
          </div>

          <span className="absolute bottom-4 right-4 rounded-full bg-[#1B2A44]/85 px-3 py-1 text-[11px] font-medium text-white sm:bottom-5 sm:right-5 sm:px-3.5 sm:text-[12px]">
            {active + 1} / {total}
          </span>
        </>
      ) : null}
    </div>
  );
}
