"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Assets } from "@/lib/assets";

type EventDetailGalleryProps = {
  images: string[];
  alt: string;
};

export default function EventDetailGallery({
  images,
  alt,
}: EventDetailGalleryProps) {
  const displayImages =
    images.length > 0 ? images : [Assets.images.upcomingEvent];
  const total = displayImages.length;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: total > 1,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [fallbackUrls, setFallbackUrls] = useState<Record<number, string>>({});

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const handleImageError = (index: number) => {
    setFallbackUrls((prev) => ({
      ...prev,
      [index]: Assets.images.upcomingEvent,
    }));
  };

  return (
    <div
      className="group relative aspect-[16/9] w-full overflow-hidden bg-[#D9DEE8] sm:aspect-[2/1] lg:h-[22.5rem] lg:aspect-auto select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt} gallery slider`}
    >
      {/* Embla Viewport */}
      <div ref={emblaRef} className="h-full w-full overflow-hidden">
        <div className="flex h-full touch-pan-y touch-pinch-zoom">
          {displayImages.map((img, index) => {
            const currentSrc = fallbackUrls[index] ?? img;

            return (
              <div
                key={`${img}-${index}`}
                className="relative h-full min-w-0 flex-[0_0_100%]"
              >
                <Image
                  src={currentSrc}
                  alt={`${alt} - Image ${index + 1}`}
                  fill
                  priority={index === 0}
                  unoptimized
                  onError={() => handleImageError(index)}
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>

      {total > 1 ? (
        <>
          {/* Previous Slide Button */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev && !emblaApi?.canScrollPrev()}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#1B2A44]/80 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-[#1B2A44] disabled:pointer-events-none disabled:opacity-40 sm:left-5 sm:h-11 sm:w-11 cursor-pointer z-10"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={20}
              color="currentColor"
              strokeWidth={2}
            />
          </button>

          {/* Next Slide Button */}
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext && !emblaApi?.canScrollNext()}
            aria-label="Next image"
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#1B2A44]/80 text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-[#1B2A44] disabled:pointer-events-none disabled:opacity-40 sm:right-5 sm:h-11 sm:w-11 cursor-pointer z-10"
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={20}
              color="currentColor"
              strokeWidth={2}
            />
          </button>

          {/* Dots Pagination */}
          <div className="absolute bottom-4 left-5 flex items-center gap-1.5 sm:bottom-5 sm:left-6 z-10">
            {displayImages.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === selectedIndex
                    ? "w-6 bg-white shadow-md"
                    : "w-2 bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          {/* Slide Counter Badge */}
          <span className="absolute bottom-4 right-4 rounded-full bg-[#1B2A44]/85 px-3 py-1  font-medium text-white shadow-md backdrop-blur-sm sm:bottom-5 sm:right-5 sm:px-3.5 sm: z-10">
            {selectedIndex + 1} / {total}
          </span>
        </>
      ) : null}
    </div>
  );
}
