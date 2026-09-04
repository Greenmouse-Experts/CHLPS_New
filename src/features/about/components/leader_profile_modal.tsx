"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { Leader } from "@/features/about/data/leadership";

const EXIT_DURATION = 200;

type LeaderProfileModalProps = {
  leader: Leader;
  onClose: () => void;
};

export default function LeaderProfileModal({
  leader,
  onClose,
}: LeaderProfileModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<"entering" | "open" | "closing">(
    "entering",
  );

  const requestClose = useCallback(() => setPhase("closing"), []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setPhase("open"));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (phase !== "closing") return;
    const timer = window.setTimeout(onClose, EXIT_DURATION);
    return () => window.clearTimeout(timer);
  }, [phase, onClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") requestClose();
    };

    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [requestClose]);

  const isOpen = phase === "open";
  const contentIn = phase !== "entering";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${leader.id}-name`}
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-[#2A2740]/80 p-4 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none sm:p-6 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        className={`relative flex max-h-[92vh] w-full max-w-[64rem] flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-[0_40px_90px_-30px_rgba(15,12,45,0.65)] transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none lg:flex-row ${
          phase === "closing" ? "duration-200" : "duration-[340ms]"
        } ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-[0.96] opacity-0"
        }`}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={requestClose}
          aria-label="Close profile"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 ring-1 ring-[#E7E5EC] transition-colors duration-200 hover:bg-[#F4F3F8] sm:right-5 sm:top-5 sm:h-10 sm:w-10"
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={18}
            color="#211A73"
            strokeWidth={2}
          />
        </button>

        <div className="relative h-60 shrink-0 sm:h-80 lg:h-auto lg:w-[47%]">
          <Image
            src={leader.photo}
            alt={`${leader.name}, ${leader.role}`}
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className={`object-cover object-[center_18%] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              isOpen ? "scale-100" : "scale-[1.06]"
            }`}
            priority
          />

          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
          />

          <div
            className={`absolute inset-x-0 bottom-0 p-6 transition-[opacity,transform] duration-500 delay-100 ease-out motion-reduce:transition-none sm:p-8 lg:p-10 ${
              contentIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-secondary sm:text-[11px]">
              ChLPS Canada Leadership
            </p>
            <p className="mt-2 text-lg font-bold leading-tight text-white sm:text-xl lg:text-[1.5rem]">
              {leader.role}
            </p>
          </div>
        </div>

        <div
          className={`min-h-0 flex-1 overflow-y-auto p-6 transition-[opacity,transform] duration-500 delay-75 ease-out motion-reduce:transition-none sm:p-8 lg:p-10 ${
            contentIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <span
            className="cut-tr-bl inline-block bg-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-primary sm:text-[11px]"
            style={{ "--cut": "0.5rem" } as CSSProperties}
          >
            {leader.role}
          </span>

          <h3
            id={`${leader.id}-name`}
            className="mt-4 text-[1.625rem] font-bold leading-[1.1] tracking-tight text-primary sm:text-[2rem] lg:text-[2.25rem]"
          >
            {leader.name}
          </h3>

          <p className="mt-3 text-[12px] font-semibold leading-relaxed text-[#6B6785] sm:text-[13px]">
            {leader.credentials.join(" · ")}
          </p>

          <div className="mt-5 flex flex-col gap-4">
            {leader.biography.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[13px] leading-relaxed text-[#807D91] sm:text-sm"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-7 border-t border-[#EDEBF2] pt-6">
            <h4 className="text-[13px] font-bold uppercase tracking-[0.08em] text-primary sm:text-[15px]">
              Areas of Expertise
            </h4>

            <ul className="mt-4 flex flex-wrap gap-2.5">
              {leader.expertise.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[#E5E3EC] bg-[#FBFBFD] px-4 py-1.5 text-[12px] text-[#413E58] sm:text-[13px]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-7 border-t border-[#EDEBF2] pt-6">
            <h4 className="text-[13px] font-bold uppercase tracking-[0.08em] text-primary sm:text-[15px]">
              Professional Profile
            </h4>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {leader.profile.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-[#EAE8F0] bg-[#FBFBFD] p-4"
                >
                  <h5 className="text-[13px] font-bold text-primary">
                    {item.title}
                  </h5>
                  <p className="mt-2 text-[12px] leading-relaxed text-[#8A8797] sm:text-[13px]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
