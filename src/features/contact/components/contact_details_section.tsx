"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CallIcon,
  Location01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";

const contactCards = [
  {
    icon: Location01Icon,
    title: "Address",
    lines: ["Victoria Avenue, Windsor", "Ontario N9A 4N1, Canada"],
    href: "https://www.google.com/maps/search/?api=1&query=Victoria+Avenue+Windsor+Ontario+N9A+4N1+Canada",
    isExternal: true,
  },
  {
    icon: CallIcon,
    title: "Phone",
    lines: ["+1 905 452 2470"],
    href: "tel:+19054522470",
    isExternal: false,
  },
  {
    icon: Mail01Icon,
    title: "Email",
    lines: ["info@chlpscanada.ca"],
    href: "mailto:info@chlpscanada.ca",
    isExternal: false,
  },
];

export default function ContactDetailsSection() {
  return (
    <section className="relative bg-white pt-14 pb-8 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-14">
      <PageContainer>
        <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {contactCards.map((card, index) => {
            const cardContent = (
              <div
                style={revealStyle(index * 90)}
                className="card relative flex-1 rounded-2xl border border-base-200/80 bg-gradient-to-b from-[#F7F9FD] to-white p-6 pt-9 text-center shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Floating Circular Dark Navy Icon */}
                <div className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-[#0D154B] text-white shadow-md">
                  <HugeiconsIcon
                    icon={card.icon}
                    size={22}
                    color="currentColor"
                    strokeWidth={1.8}
                  />
                </div>

                <h3 className="mt-2 text-lg font-bold text-[#0D154B] sm:text-xl">
                  {card.title}
                </h3>
                <div className="mt-1 text-sm leading-relaxed text-base-content/80">
                  {card.lines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            );

            return card.isExternal ? (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                {cardContent}
              </a>
            ) : (
              <a key={card.title} href={card.href} className="group block">
                {cardContent}
              </a>
            );
          })}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
