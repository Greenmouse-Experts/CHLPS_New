"use client";

import { useState } from "react";
import Image from "next/image";
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
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=260&h=260&q=80",
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
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=260&h=260&q=80",
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
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=260&h=260&q=80",
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
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=260&h=260&q=80",
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
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=260&h=260&q=80",
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
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=260&h=260&q=80",
    initials: "PM",
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="h-5 w-5 fill-[#EAA812] text-[#EAA812] sm:h-6 sm:w-6"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.5l2.9 6.2 6.8.9-5 4.8 1.3 6.8-6-3.3-6 3.3 1.3-6.8-5-4.8 6.8-.9L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

function QuoteMarkIcon() {
  return (
    <svg
      width="32"
      height="26"
      viewBox="0 0 34 26"
      fill="none"
      className="text-[#C4D3E7]"
      aria-hidden="true"
    >
      <path
        d="M10.2 0C4.56 0 0 4.54 0 10.15c0 7.3 5.78 12.96 12.13 15L13.6 21.6c-4.24-1.38-7-4.28-7-7.82h3.72c2.7 0 4.88-2.3 4.88-5.12V5.12C15.2 2.3 13.02 0 10.32 0h-.12ZM28.88 0c-5.64 0-10.2 4.54-10.2 10.15 0 7.3 5.78 12.96 12.13 15l1.47-3.55c-4.24-1.38-7-4.28-7-7.82h3.72c2.7 0 4.88-2.3 4.88-5.12V5.12C33.88 2.3 31.7 0 29 0h-.12Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#1E1758] text-lg font-bold text-white shadow-sm ring-4 ring-[#EAF0F9] sm:h-[84px] sm:w-[84px]">
        {initials}
      </div>
    );
  }

  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-[#EAF0F9] shadow-sm sm:h-[84px] sm:w-[84px]">
      <Image
        src={avatar}
        alt={name}
        fill
        sizes="84px"
        className="object-cover object-center"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function WhatOurMembersSaySection() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#FAF9F5] py-16 md:py-24"
      style={{ backgroundImage: "url('/assets/images/reviews_bg.png')" }}
    >
      {/* Decorative concentric rings on left side */}

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
              className="reveal flex flex-col justify-between rounded-[28px] border-2 border-[#1E1758] bg-white p-7 shadow-none transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(30,23,88,0.08)] sm:p-8"
              style={revealStyle(index)}
            >
              {/* Top: 5 Stars + Quote Icon + Body Text */}
              <div>
                {/* Stars and Quote Mark */}
                <div className="flex items-center justify-between">
                  <StarRating count={testimonial.rating} />
                  <QuoteMarkIcon />
                </div>

                {/* Quote Text */}
                <p className="mt-5 text-[15.5px] font-normal leading-[1.68] text-[#1E1758] sm:text-[16.5px]">
                  {testimonial.quote}
                </p>
              </div>

              {/* Bottom: Horizontal Divider + Author Info */}
              <div>
                <hr className="my-6 border-t border-[#DDE5F0]" />

                <div className="flex items-center gap-4 sm:gap-5">
                  <TestimonialAvatar
                    avatar={testimonial.avatar}
                    name={testimonial.name}
                    initials={testimonial.initials}
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[19px] font-bold tracking-tight text-[#1E1758] sm:text-[21px]">
                      {testimonial.name}
                    </h3>
                    <p className="truncate text-[14.5px] font-normal text-[#1E1758] sm:text-[15px]">
                      {testimonial.role}
                    </p>

                    {/* Gold accent line */}
                    <div className="my-2 h-[2.5px] w-9 rounded-full bg-[#CDA54E]" />

                    <p className="truncate text-[13.5px] font-normal text-[#4A4660] sm:text-[14px]">
                      {testimonial.organization}
                    </p>
                    <p className="truncate text-[13.5px] font-normal text-[#4A4660] sm:text-[14px]">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </RevealGroup>
      </PageContainer>
    </section>
  );
}
