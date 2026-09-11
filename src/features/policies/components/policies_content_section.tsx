"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import {
  POLICY_DOCUMENTS,
  POLICY_TABS,
  parsePolicyTab,
  type PolicyTabId,
} from "@/features/policies/policies_data";

const GOLD = "#CDA54E";

export default function PoliciesContentSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = parsePolicyTab(searchParams.get("tab"));
  const document = POLICY_DOCUMENTS[tab];

  function selectTab(next: PolicyTabId) {
    router.replace(`/policies?tab=${next}`, { scroll: false });
  }

  return (
    <section className="bg-white pb-16 pt-14 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
      <PageContainer>
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-[38rem]">
            <Reveal>
              <h2 className="text-[1.75rem] font-medium leading-[1.15] tracking-tight text-[#0A1542] sm:text-[32px]">
                Everything in one place
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-2.5 text-[14px] leading-relaxed text-[#8A8796] sm:text-[15px]">
                Use the tabs below to move between ChLPS Canada&apos;s Terms
                &amp; Conditions, Privacy Policy, Cookies Policy, and Practice
                Standards &amp; Code of Ethics.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120} className="shrink-0">
            <p className="inline-flex items-center gap-2 text-[13px] text-[#9A97A5] sm:text-[14px]">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={16}
                color={GOLD}
                strokeWidth={1.8}
              />
              ChLPS Canada Policy Centre
            </p>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <div
            role="tablist"
            aria-label="Policy documents"
            className="mt-8 flex flex-wrap gap-2.5 sm:mt-10"
          >
            {POLICY_TABS.map((item) => {
              const active = item.id === tab;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectTab(item.id)}
                  className={`inline-flex h-10 cursor-pointer items-center rounded-full px-5 text-[13px] font-medium transition-colors duration-200 ${
                    active
                      ? "border border-transparent bg-[#0A1542] text-white"
                      : "border border-[#E4E2EC] bg-white text-[#0A1542] hover:border-[#C9C6D6]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <article className="mt-7 overflow-hidden rounded-[1.25rem] border border-[#EEEDF3] bg-white shadow-[0_10px_40px_rgba(33,26,115,0.05)] sm:mt-8 sm:rounded-[1.5rem]">
            <header className="bg-[#F2F0FA] px-6 py-7 sm:px-9 sm:py-8 lg:px-12 lg:py-9">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary sm:text-[12px]">
                <HugeiconsIcon
                  icon={Book02Icon}
                  size={15}
                  color={GOLD}
                  strokeWidth={1.8}
                />
                {document.badge}
              </p>
              <h3 className="mt-3 text-[1.75rem] font-medium leading-[1.15] tracking-tight text-[#0A1542] sm:mt-3.5 sm:text-[32px] lg:text-[36px]">
                {document.title}
              </h3>
              <p className="mt-2.5 max-w-[40rem] text-[14px] leading-relaxed text-[#8A8796] sm:text-[15px]">
                {document.summary}
              </p>
            </header>

            <div className="pb-5 sm:pb-6">
              {document.sections.map((section) => (
                <section
                  key={section.title}
                  className="border-b border-[#EEEEF2] px-6 py-6 sm:px-9 sm:py-7 lg:px-12"
                >
                  <h4 className="text-[1.125rem] font-semibold leading-snug text-[#0A1542] sm:text-[22px]">
                    {section.title}
                  </h4>
                  {section.body ? (
                    <p className="mt-2 text-[14px] leading-[1.7] text-[#6B6778] sm:text-[15px] sm:leading-[1.75]">
                      {section.body}
                    </p>
                  ) : null}
                  {section.items?.length ? (
                    <ul
                      className={`flex flex-col gap-2 ${section.body ? "mt-3" : "mt-2.5"}`}
                    >
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-[14px] leading-[1.65] text-[#6B6778] sm:text-[15px]"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.55rem] h-[7px] w-[7px] shrink-0 rounded-full bg-secondary"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {section.after ? (
                    <p className="mt-3 text-[14px] leading-[1.7] text-[#6B6778] sm:text-[15px] sm:leading-[1.75]">
                      {section.after}
                    </p>
                  ) : null}
                </section>
              ))}
            </div>
          </article>
        </Reveal>
      </PageContainer>
    </section>
  );
}
