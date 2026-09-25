"use client";

import type { LegalCardItem } from "@/features/about/legal_data";

interface LegalCertificateCardProps {
  card: LegalCardItem;
  onPreview?: (imageSrc: string, title: string) => void;
}

export default function LegalCertificateCard({
  card,
  onPreview,
}: LegalCertificateCardProps) {
  const fullTitle = `${card.titleHighlight} ${card.titleNormal}`;

  const imageElement = (
    <div className="relative flex min-h-[380px] items-center justify-center bg-white p-4 sm:min-h-[440px] sm:p-10 lg:min-h-[480px] ">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt={card.imageAlt || fullTitle}
        onClick={() => onPreview?.(card.image, fullTitle)}
        className="max-h-[520px] w-auto max-w-full cursor-pointer rounded-lg object-contain drop-shadow-sm transition-transform duration-300 hover:scale-[1.02]"
        title="Click to view document"
      />
    </div>
  );

  const textElement = (
    <div className="flex h-full flex-col justify-center bg-[#0A1542] px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
      <h2 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">
        <span className="text-secondary">{card.titleHighlight}</span>
        {card.titleBreak ? <br /> : " "}
        <span className="text-white">{card.titleNormal}</span>
      </h2>
      <p className="mt-5 text-sm leading-relaxed text-white/90 sm:mt-6 sm:text-base lg:text-lg">
        {card.description}
      </p>
    </div>
  );

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[#D4B56A] ring-1 ring-secondary bg-white shadow-[0_20px_50px_rgba(22,16,88,0.06)] lg:rounded-[2rem]">
      <div className="grid items-stretch lg:grid-cols-2">
        {card.imageOnLeft ? (
          <>
            <div className="order-1">{imageElement}</div>
            <div className="order-2">{textElement}</div>
          </>
        ) : (
          <>
            <div className="order-2 lg:order-1">{textElement}</div>
            <div className="order-1 lg:order-2">{imageElement}</div>
          </>
        )}
      </div>
    </article>
  );
}
