import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Assets } from "@/lib/assets";

export default function AuthHero({
  badge,
  title,
  description,
}: {
  badge: string;
  title: ReactNode;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#111E2A]">
      <Image
        src={Assets.images.heroBg}
        alt=""
        fill
        priority
        className="object-cover object-center opacity-40"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-primary/70" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <span
          className="cut-tr inline-block bg-secondary px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#111E2A]"
          style={{ "--cut": "0.55rem" } as CSSProperties}
        >
          {badge}
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl leading-tight font-normal text-white md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
