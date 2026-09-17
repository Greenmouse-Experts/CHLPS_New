"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";

export interface MemberTestimonial {
  quote: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  rating: number;
  avatar: string;
  initials: string;
}

export const MEMBER_TESTIMONIALS: MemberTestimonial[] = [
  {
    quote:
      "“Earning my CLPM designation through ChLPS Canada significantly enhanced my knowledge, credibility, and career prospects. The program is practical, relevant, and aligned with real-world Loss Prevention challenges. I highly recommend it to any professional serious about advancing in this field.”",
    name: "David O. Adeyemi",
    role: "Regional Loss Prevention Director",
    organization: "Retail & Consumer Services",
    location: "Ontario, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80",
    initials: "DA",
  },
  {
    quote:
      "“ChLPS Canada provides more than certification — it offers a supportive professional community, access to industry insights, and continuous learning opportunities. The knowledge and connections I gained have been invaluable in my career development.”",
    name: "Linda K. Tran",
    role: "Loss Prevention Manager",
    organization: "National Retailer",
    location: "British Columbia, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&h=240&q=80",
    initials: "LT",
  },
  {
    quote:
      "“Joining ChLPS Canada was one of the best decisions I have made. The certification strengthened my leadership skills, validated my expertise, and opened new career opportunities. ChLPS Canada truly sets the standard for Loss Prevention professionals in Canada.”",
    name: "Mark R. Sullivan",
    role: "Director, Asset Protection",
    organization: "Financial Services",
    location: "Toronto, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&h=240&q=80",
    initials: "MS",
  },
  {
    quote:
      "“ChLPS Canada has given me the professional recognition and confidence to take my career to the next level. The resources, events, and networking opportunities are outstanding and keep me connected with industry best practices across Canada.”",
    name: "Tanya M. Brooks",
    role: "Loss Prevention Specialist",
    organization: "Retail Operations",
    location: "Alberta, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=240&h=240&q=80",
    initials: "TB",
  },
  {
    quote:
      "“The CLPO program with ChLPS Canada provided me with the knowledge, tools, and practical skills I needed to excel in my role. The learning experience was exceptional, and the community of professionals is supportive and inspiring.”",
    name: "Jonathan P. Clarke",
    role: "Security & Loss Prevention Manager",
    organization: "Hospitality & Gaming",
    location: "Quebec, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=80",
    initials: "JC",
  },
  {
    quote:
      "“ChLPS Canada is a trusted and credible professional association. The certification programs are rigorous, relevant, and aligned with today’s industry needs. Being part of ChLPS Canada has expanded my network and created valuable career opportunities.”",
    name: "Priya S. Mehta",
    role: "Senior Loss Prevention Analyst",
    organization: "E-commerce & Logistics",
    location: "Manitoba, Canada",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&h=240&q=80",
    initials: "PM",
  },
];

function TestimonialAvatar({
  avatar,
  name,
  initials,
}: {
  avatar: string;
  name: string;
  initials: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1E1758] text-base font-bold text-white shadow-md">
        {initials}
      </div>
    );
  }

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
      <Image
        src={avatar}
        alt={name}
        fill
        sizes="56px"
        className="object-cover object-center"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function WhatOurMembersSaySection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#FAF9F5] py-16 md:py-24">
      {/* Decorative concentric rings on left side */}
      <div
        className="pointer-events-none absolute -left-48 top-1/2 -z-10 h-[640px] w-[640px] -translate-y-1/2 opacity-35"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 600 600"
          fill="none"
          className="h-full w-full stroke-[#CDA54E]"
        >
          <circle cx="200" cy="300" r="180" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="200" cy="300" r="240" strokeWidth="1.2" />
          <circle cx="200" cy="300" r="300" strokeWidth="1.5" />
          <circle cx="200" cy="300" r="360" strokeWidth="1" strokeDasharray="3 5" />
        </svg>
      </div>

      <PageContainer>
        {/* Section Header */}
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <HeaderText left="WHAT OUR" right="MEMBERS SAY" />
          <div className="mt-4">
            <HeaderSubText>
              Discover how CHLPS Canada is making a real difference in the
              careers and professional journeys of Loss Prevention professionals
              across Canada
            </HeaderSubText>
          </div>
        </div>

        {/* 6 Testimonial Cards Grid (3 columns) */}
        <RevealGroup className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {MEMBER_TESTIMONIALS.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className="reveal flex flex-col justify-between rounded-[22px] border border-[#CDA54E]/40 bg-white p-6 shadow-[0_6px_22px_rgba(205,165,78,0.08)] transition-all duration-200 hover:-translate-y-1 hover:border-[#CDA54E]/70 hover:shadow-[0_10px_28px_rgba(205,165,78,0.15)] sm:p-7"
              style={revealStyle(index)}
            >
              {/* Top Row: 5 Stars + Quote Icon */}
              <div>
                <div className="flex items-center justify-between">
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <HugeiconsIcon
                        key={i}
                        icon={StarIcon}
                        size={18}
                        className="text-[#F5A623] fill-[#F5A623]"
                      />
                    ))}
                  </div>

                  {/* Decorative Big Quote Marks */}
                  <span
                    aria-hidden="true"
                    className="font-serif text-3xl font-bold leading-none text-[#CBD5E1] sm:text-4xl"
                  >
                    ”
                  </span>
                </div>

                {/* Quote Text */}
                <p className="mt-5 text-[13px] leading-[1.68] text-[#3D3A4B] sm:text-[13.5px]">
                  {testimonial.quote}
                </p>
              </div>

              {/* Bottom Row: Avatar + Author Info */}
              <div className="mt-7 flex items-center gap-4 border-t border-[#F0EDDF] pt-5">
                <TestimonialAvatar
                  avatar={testimonial.avatar}
                  name={testimonial.name}
                  initials={testimonial.initials}
                />

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-bold text-[#1E1758] sm:text-[16px]">
                    {testimonial.name}
                  </h3>
                  <p className="truncate text-[12.5px] font-semibold text-[#CDA54E] sm:text-[13px]">
                    {testimonial.role}
                  </p>
                  <p className="truncate text-[11.5px] text-[#7A7886] sm:text-[12px]">
                    {testimonial.organization}
                  </p>
                  <p className="truncate text-[11px] text-[#8E8C98] sm:text-[11.5px]">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
