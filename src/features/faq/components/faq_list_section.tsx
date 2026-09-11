"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { FAQ_ITEMS, type FaqItem } from "@/features/faq/faq_data";

function FaqCard({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const number = String(item.id).padStart(2, "0");

  return (
    <div
      className={`rounded-[1.25rem] transition-colors duration-200 ${
        open
          ? "bg-[#FAF9FF] border border-[#D9D2F4]"
          : "bg-white border border-[#E3E6EF] shadow-[0_8px_24px_rgba(33,26,115,0.05)]"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-start gap-3 px-4 py-4 text-left sm:gap-3.5 sm:px-5 sm:py-[1.125rem]"
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF8E8] text-[11px] font-semibold border border-[#CDA54E8C] text-[#0A1542] sm:h-9 sm:w-9 sm:text-[12px]">
          {number}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-3">
            <span className="text-[13.5px] font-semibold leading-snug text-[#0A1542] sm:text-[15px]">
              {item.question}
            </span>
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={16}
              color="#0A1542"
              strokeWidth={1.8}
              className={`mt-0.5 shrink-0 transition-transform duration-200 ${
                open ? "rotate-45" : ""
              }`}
            />
          </span>
          {open ? (
            <span className="mt-2.5 block text-[13px] leading-relaxed text-[#6B6778] sm:mt-3 sm:text-[14px] sm:leading-[1.7]">
              {item.answer}
            </span>
          ) : null}
        </span>
      </button>
    </div>
  );
}

export default function FaqListSection() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(FAQ_ITEMS[0].id);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (item) =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term),
    );
  }, [search]);

  const midpoint = Math.ceil(filtered.length / 2);
  const left = filtered.slice(0, midpoint);
  const right = filtered.slice(midpoint);

  function toggle(id: number) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <section
      id="faq"
      className="bg-white pb-16 pt-12 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16"
    >
      <PageContainer>
        <Reveal>
          <p className="text-center text-[13px] font-semibold uppercase tracking-[0.18em] text-[#CDA54E] sm:text-[30px]">
            Frequently Asked Questions
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative mx-auto mt-6 max-w-full sm:mt-8">
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
              className="border border-[#DFDAF3] h-12 w-full rounded-full bg-[#EFECFB] py-3 pl-12 pr-5 text-[14px] text-[#0A1542] outline-none placeholder:text-[#8C91A8] transition-shadow focus:ring-2 focus:ring-primary/15 sm:h-[3.25rem]"
            />
          </div>
        </Reveal>

        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-[14px] text-[#8A8796]">
            No matching questions. Try a different search, or contact ChLPS
            below.
          </p>
        ) : (
          <div className="mt-7 grid grid-cols-1 items-start gap-3.5 sm:mt-8 lg:grid-cols-2 lg:gap-5">
            <div className="flex flex-col gap-3.5">
              {left.map((item, index) => (
                <Reveal key={item.id} delay={Math.min(index * 40, 200)}>
                  <FaqCard
                    item={item}
                    open={openId === item.id}
                    onToggle={() => toggle(item.id)}
                  />
                </Reveal>
              ))}
            </div>
            <div className="flex flex-col gap-3.5">
              {right.map((item, index) => (
                <Reveal key={item.id} delay={Math.min(index * 40, 200)}>
                  <FaqCard
                    item={item}
                    open={openId === item.id}
                    onToggle={() => toggle(item.id)}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <Reveal delay={160}>
          <div className="mt-10 flex flex-col gap-4 rounded-[1.75rem] bg-[#0A1542] px-6 py-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-8 sm:py-5 lg:px-10">
            <div>
              <p className="text-[1.35rem] font-light italic leading-tight text-white sm:text-[1.5rem]">
                Still have a question?
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/80 sm:text-[13px]">
                Our team can help with membership, certification, events and
                account enquiries.
              </p>
            </div>
            <Link
              href="/contact-us"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-secondary px-5 text-[13px] font-semibold text-[#0A1542] transition-all duration-200 hover:brightness-95 sm:h-12 sm:px-6"
            >
              Contact ChLPS
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={16}
                color="currentColor"
                strokeWidth={2}
              />
            </Link>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
