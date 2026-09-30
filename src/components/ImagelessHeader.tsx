import type { ReactNode } from "react";

interface ImagelessHeaderProps {
  badge: string;
  title: ReactNode;
  description: string;
  fade?: boolean;
}

export default function ImagelessHeader({
  badge,
  title,
  description,
  fade = true,
}: ImagelessHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-black px-6 pt-32 pb-16 md:px-16 md:pt-40 md:pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-size-[28px_28px]" />
      <div
        className={`absolute inset-0 ${fade ? "from-accent via-accent/80 to-transparent" : ""}`}
      />

      <div className="relative container mx-auto">
        <span className="mb-6 inline-block rounded-full border border-white/20 px-4 py-1.5 font-medium tracking-[0.18em] text-white/60 uppercase bg-white/20 ">
          {badge}
        </span>
        <h1 className="max-w-3xl font-pop text-4xl leading-tight font-light text-white md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/50">
          {description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-full bg-info" />
    </section>
  );
}
