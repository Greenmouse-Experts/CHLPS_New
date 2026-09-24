"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import HeaderText from "@/components/HeaderText";
import HeaderSubText from "@/components/HeaderSubText";
import {
  FALLBACK_TESTIMONIALS,
  type MemberTestimonial,
} from "@/features/testimonials/testimonials_data";
import { fetchMemberTestimonials } from "@/features/testimonials/services/testimonial_service";

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

  if (!avatar || hasError) {
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
        unoptimized
        sizes="84px"
        className="object-cover object-center"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function WhatOurMembersSaySection({
  initialTestimonials,
}: {
  initialTestimonials?: MemberTestimonial[];
}) {
  const query = useQuery({
    queryKey: ["published-testimonials"],
    queryFn: fetchMemberTestimonials,
    initialData: initialTestimonials,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
  });

  const testimonials = query.data?.length ? query.data : FALLBACK_TESTIMONIALS;

  return (
    <section
      className="relative isolate overflow-hidden bg-[#FAF9F5] bg-cover bg-center py-8 "
      style={{ backgroundImage: "url('/assets/images/reviews_bg.png')" }}
    >
      <PageContainer className="">
        {/* Section Header */}
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <HeaderText left="WHAT OUR" right="MEMBERS SAY" />
          <div className="">
            <HeaderSubText>
              Discover how CHLPS Canada is making a real difference in the
              careers and professional journeys of Loss Prevention professionals
              across Canada
            </HeaderSubText>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <RevealGroup className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.id}
              className="reveal flex flex-col justify-between rounded-[28px] border-2 border-[#1E1758] bg-white p-7 shadow-[inset_0_4px_0_0_#1E1758,0_12px_28px_rgba(30,23,88,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[inset_0_4px_0_0_#1E1758,0_18px_36px_rgba(30,23,88,0.13)] sm:p-8"
              style={revealStyle(index)}
            >
              {/* Top: Stars + Quote Icon + Body Text */}
              <div>
                {/* Stars and Quote Mark */}
                <div className="flex items-center justify-between">
                  <StarRating count={testimonial.rating} />
                  <QuoteMarkIcon />
                </div>

                {/* Quote Text */}
                <p className="mt-5 text-sm font-normal leading-[1.68] text-[#1E1758] ">
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
                    <h3 className="truncate text-lg font-bold tracking-tight text-[#1E1758] ">
                      {testimonial.name}
                    </h3>
                    <p className="truncate text-[14.5px] font-normal text-[#1E1758] sm:text-[15px]">
                      {testimonial.role}
                    </p>

                    {/* Gold accent line */}
                    <div className="my-2 h-[2.5px] w-9 rounded-full bg-[#CDA54E]" />

                    {testimonial.organization && (
                      <p className="truncate  font-normal text-[#4A4660] text-sm">
                        {testimonial.organization}
                      </p>
                    )}
                    {testimonial.location && (
                      <p className="truncate  font-normal text-[#4A4660] text-sm">
                        {testimonial.location}
                      </p>
                    )}
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
