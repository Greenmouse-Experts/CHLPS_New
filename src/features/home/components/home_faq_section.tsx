"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowRight01Icon,
  Call02Icon,
  Globe02Icon,
  Mail01Icon,
  Remove01Icon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { FALLBACK_FAQS, type PublicFaq } from "@/features/faq/faq_data";
import { fetchPublishedFaqs } from "@/features/faq/services/faq_service";

export default function HomeFaqSection({
  initialFaqs,
}: {
  initialFaqs?: PublicFaq[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["published-faqs"],
    queryFn: fetchPublishedFaqs,
    initialData: initialFaqs,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
  });

  // Top 4 FAQs for the homepage
  const faqs = query.data?.length ? query.data : FALLBACK_FAQS;
  const homeFaqs = faqs.slice(0, 4);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="bg-[#FAF9F5] py-8 ">
      <PageContainer>
        {/* Top Dark Banner */}
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[26px] bg-[#1B1454] px-6 py-12 text-center text-white shadow-[0_16px_40px_rgba(27,20,84,0.18)] sm:px-10 sm:py-8 md:rounded-[32px] lg:px-16 ">
            {/* Background faint decorative question mark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-10 select-none text-[220px] font-black leading-none text-white/[0.04] sm:right-8 sm:-top-16 sm:text-[320px] lg:right-16 lg:text-[380px]"
            >
              ?
            </div>

            <h2 className="relative z-10 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Frequently Asked <span className="text-[#CDA54E]">Questions</span>
            </h2>

            <p className="relative z-10 mx-auto  max-w-2xl  leading-relaxed text-[#D0CDE0] sm:text-base md:mt-5">
              Find answers to common questions about our programs,
              certifications, accreditations, and how we can help you advance
              your career.
            </p>
          </div>
        </Reveal>

        {/* 2-Column FAQ Accordion Cards */}
        <RevealGroup className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:mt-10 lg:grid-cols-2 lg:gap-6">
          {homeFaqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            const numberString = String(index + 1).padStart(2, "0");

            return (
              <article
                key={faq.id}
                className={`reveal overflow-hidden rounded-[20px] bg-white transition-all duration-200 ${
                  isOpen
                    ? "border border-[#1B1454]/25 shadow-[0_8px_24px_rgba(27,20,84,0.08)]"
                    : "border border-[#E7E5EE] shadow-[0_4px_16px_rgba(27,20,84,0.03)] hover:border-[#1B1454]/20"
                }`}
                style={revealStyle(index)}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left sm:p-6"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-4">
                    {/* Number Badge */}
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#CDA54E]/40 bg-[#FFF9ED]  font-bold text-[#1B1454] sm:h-10 sm:w-10 sm:">
                      {numberString}
                    </span>

                    {/* Question Title */}
                    <h3 className="truncate text-[14.5px] font-bold leading-snug text-[#1B1454] sm:text-[16px]">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Expand/Collapse Icon */}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F2F7] text-[#1B1454] transition-colors duration-150 hover:bg-[#E7E5EF]">
                    <HugeiconsIcon
                      icon={isOpen ? Remove01Icon : Add01Icon}
                      size={16}
                      color="currentColor"
                      strokeWidth={2.2}
                    />
                  </span>
                </button>

                {/* Collapsible Answer */}
                {isOpen && (
                  <div className="border-t border-[#F1EFF7] px-5 pb-5 pt-3 sm:px-6 sm:pb-6">
                    <p className=" leading-relaxed text-[#555268] sm:text-[14.5px]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </RevealGroup>

        {/* Still Have Questions Contact Bar */}
        <Reveal className="mt-8 md:mt-10">
          <div className="rounded-[22px] border border-[#CDA54E] bg-white p-5 shadow-[0_6px_24px_rgba(205,165,78,0.08)] sm:p-6 lg:p-7">
            <div className="grid grid-cols-1 items-center gap-6 divide-y divide-[#EAE8F0] md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
              {/* Col 1: Still Have Questions Title */}
              <div className="pr-0 lg:pr-6">
                <h4 className="text-[17px] font-bold leading-snug text-[#CDA54E] sm:text-[18px]">
                  Still have questions?
                </h4>
                <p className="mt-1  leading-relaxed text-[#686676] sm:">
                  Our Team is here to help you choose the right membership or
                  certification level.
                </p>
              </div>

              {/* Col 2: Call Us */}
              <div className="flex items-center gap-3.5 pt-5 md:pt-0 lg:pl-6 lg:pt-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1B1454] text-white shadow-sm">
                  <HugeiconsIcon
                    icon={Call02Icon}
                    size={20}
                    color="currentColor"
                    strokeWidth={1.8}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-medium text-[#7D7A8C]">
                    Call Us
                  </p>
                  <a
                    href="tel:+19054522470"
                    className="truncate  font-bold text-[#1B1454] transition-colors hover:text-[#CDA54E] sm:text-[14px]"
                  >
                    +1 905-452-2470
                  </a>
                </div>
              </div>

              {/* Col 3: Email Us */}
              <div className="flex items-center gap-3.5 pt-5 md:pt-0 lg:pl-6 lg:pt-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1B1454] text-white shadow-sm">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    size={20}
                    color="currentColor"
                    strokeWidth={1.8}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-medium text-[#7D7A8C]">
                    Email Us
                  </p>
                  <a
                    href="mailto:info@chlpscanada.ca"
                    className="truncate  font-bold text-[#1B1454] transition-colors hover:text-[#CDA54E] sm:text-[14px]"
                  >
                    info@chlpscanada.ca
                  </a>
                </div>
              </div>

              {/* Col 4: Visit Website */}
              <div className="flex items-center gap-3.5 pt-5 md:pt-0 lg:pl-6 lg:pt-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1B1454] text-white shadow-sm">
                  <HugeiconsIcon
                    icon={Globe02Icon}
                    size={20}
                    color="currentColor"
                    strokeWidth={1.8}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-medium text-[#7D7A8C]">
                    Visit Our Website
                  </p>
                  <a
                    href="https://www.chlpscanada.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate  font-bold text-[#1B1454] transition-colors hover:text-[#CDA54E] sm:text-[14px]"
                  >
                    www.chlpscanada.ca
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* View All FAQs Pill Button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/faq"
            className="group inline-flex items-center gap-3 rounded-full bg-[#1B1454] px-7 py-3.5 text-[14.5px] font-bold text-white shadow-[0_8px_22px_rgba(27,20,84,0.22)] transition-all duration-200 hover:scale-[1.03] hover:bg-[#251C6E] hover:shadow-[0_12px_28px_rgba(27,20,84,0.3)] sm:px-8 sm:py-4 sm:text-[15px]"
          >
            <span>View all FAQs</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#1B1454] transition-transform duration-200 group-hover:translate-x-0.5">
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                color="currentColor"
                strokeWidth={2.4}
              />
            </span>
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
