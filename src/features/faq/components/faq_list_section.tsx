"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Call02Icon,
  Globe02Icon,
  Mail01Icon,
  Remove01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Reveal, RevealGroup } from "@/features/components/reveal";
import { revealStyle } from "@/features/components/reveal_style";
import PageContainer from "@/features/components/page_container";
import { FALLBACK_FAQS, type PublicFaq } from "@/features/faq/faq_data";
import { fetchPublishedFaqs } from "@/features/faq/services/faq_service";

function FaqCard({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: PublicFaq;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const numberString = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`reveal overflow-hidden rounded-[20px] bg-white transition-all duration-200 ${
        isOpen
          ? "border border-[#1B1454]/25 shadow-[0_8px_24px_rgba(27,20,84,0.08)]"
          : "border border-[#E7E5EE] shadow-[0_4px_16px_rgba(27,20,84,0.03)] hover:border-[#1B1454]/20"
      }`}
      style={revealStyle(index)}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left sm:p-6"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-4">
          {/* Number Badge */}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#CDA54E]/40 bg-[#FFF9ED] font-bold text-[#1B1454] sm:h-10 sm:w-10">
            {numberString}
          </span>

          {/* Question Title */}
          <h3 className="text-[14.5px] font-bold leading-snug text-[#1B1454] sm:text-[16px]">
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
          <p className="leading-relaxed text-[#555268] sm:text-[14.5px]">
            {faq.answer}
          </p>
        </div>
      )}
    </article>
  );
}

export default function FaqListSection({
  initialFaqs,
}: {
  initialFaqs?: PublicFaq[];
}) {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["published-faqs"],
    queryFn: fetchPublishedFaqs,
    initialData: initialFaqs,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
  });

  const faqs = query.data?.length ? query.data : FALLBACK_FAQS;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return faqs;
    return faqs.filter(
      (item) =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term),
    );
  }, [faqs, search]);

  const midpoint = Math.ceil(filtered.length / 2);
  const left = filtered.slice(0, midpoint);
  const right = filtered.slice(midpoint);

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <section id="faq" className="bg-[#FAF9F5] py-8 sm:py-10 md:py-12">
      <PageContainer>
        {/* Top Dark Banner Matching Mockup */}
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[26px] bg-[#1B1454] px-6 py-12 text-center text-white shadow-[0_16px_40px_rgba(27,20,84,0.18)] sm:px-10 sm:py-14 md:rounded-[32px] lg:px-16">
            {/* Background faint decorative question mark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-10 select-none text-[220px] font-black leading-none text-white/[0.04] sm:right-8 sm:-top-16 sm:text-[320px] lg:right-16 lg:text-[380px]"
            >
              ?
            </div>

            <h1 className="relative z-10 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Frequently Asked <span className="text-[#CDA54E]">Questions</span>
            </h1>

            <p className="relative z-10 mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#D0CDE0] sm:text-base md:mt-4">
              Find answers to common questions about our programs,
              certifications, accreditations, and how we can help you advance
              your career.
            </p>
          </div>
        </Reveal>

        {/* Search Bar matching mockup: soft lilac background (#EFECFB) with border and search icon */}
        <Reveal delay={80}>
          <div className="relative mx-auto mt-6 w-full sm:mt-8">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#9A97A5]">
              <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                color="currentColor"
                strokeWidth={1.8}
              />
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search questions, membership, certification..."
              aria-label="Search frequently asked questions"
              className="h-12 w-full rounded-[14px] border border-[#DFDAF3] bg-[#EFECFB] py-3 pl-12 pr-5 text-[14px] text-[#0A1542] outline-none placeholder:text-[#8C91A8] transition-shadow focus:border-[#1B1454]/40 focus:ring-2 focus:ring-[#1B1454]/10 sm:h-[3.25rem]"
            />
          </div>
        </Reveal>

        {/* Empty state or 2-column Accordion Cards */}
        {query.isLoading && faqs.length === 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:mt-10 lg:grid-cols-2 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-[20px] border border-[#E7E5EE] bg-white"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 rounded-[20px] border border-dashed border-[#DFDAF3] bg-white p-10 text-center">
            <p className="text-base font-semibold text-[#1B1454]">
              {search.trim()
                ? "No matching questions found"
                : "No FAQs available yet"}
            </p>
            <p className="mt-1 text-sm text-[#686676]">
              {search.trim()
                ? "Try searching for a different keyword, or contact our support team below."
                : "Please check back soon or reach out directly to our team."}
            </p>
          </div>
        ) : (
          <RevealGroup className="mt-8 grid grid-cols-1 items-start gap-4 sm:gap-5 md:mt-10 lg:grid-cols-2 lg:gap-6">
            {/* Left Column */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {left.map((item, index) => (
                <FaqCard
                  key={item.id}
                  faq={item}
                  index={index}
                  isOpen={openId === item.id}
                  onToggle={() => toggle(item.id)}
                />
              ))}
            </div>
            {/* Right Column */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {right.map((item, index) => (
                <FaqCard
                  key={item.id}
                  faq={item}
                  index={midpoint + index}
                  isOpen={openId === item.id}
                  onToggle={() => toggle(item.id)}
                />
              ))}
            </div>
          </RevealGroup>
        )}

        {/* Still Have Questions Contact Bar matching Mockup */}
        <Reveal className="mt-8 md:mt-10">
          <div className="rounded-[22px] border border-[#CDA54E] bg-white p-5 shadow-[0_6px_24px_rgba(205,165,78,0.08)] sm:p-6 lg:p-7">
            <div className="grid grid-cols-1 items-center gap-6 divide-y divide-[#EAE8F0] md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
              {/* Col 1: Still Have Questions Title */}
              <div className="pr-0 lg:pr-6">
                <h2 className="text-[17px] font-bold leading-snug text-[#CDA54E] sm:text-[18px]">
                  Still have questions?
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-[#686676] sm:text-[13px]">
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
                    className="truncate text-sm font-bold text-[#1B1454] transition-colors hover:text-[#CDA54E]"
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
                    className="truncate text-sm font-bold text-[#1B1454] transition-colors hover:text-[#CDA54E]"
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
                    className="truncate text-sm font-bold text-[#1B1454] transition-colors hover:text-[#CDA54E]"
                  >
                    www.chlpscanada.ca
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
