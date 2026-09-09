"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import { Assets } from "@/lib/assets";

const CAREERJET_SEARCH = "https://www.careerjet.ca/jobs";

export default function CareerSearchSection() {
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const params = new URLSearchParams();
    if (what.trim()) params.set("s", what.trim());
    if (where.trim()) params.set("l", where.trim());

    const query = params.toString();
    window.open(
      query ? `${CAREERJET_SEARCH}?${query}` : CAREERJET_SEARCH,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <section id="career-search" className="bg-white pb-4 pt-8 sm:pb-6 sm:pt-10">
      <PageContainer>
        <Reveal>
          <div className="relative overflow-hidden rounded-[18px] bg-[#161276]">
            <Image
              src={Assets.images.membershipCardBg}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="pointer-events-none object-cover object-bottom"
            />

            <div className="relative z-10 px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary sm:text-[12px]">
                <Search size={15} strokeWidth={2.2} aria-hidden />
                Career Search
              </p>

              <h2 className="mt-3 text-[1.375rem] font-medium leading-tight tracking-tight text-white sm:text-[1.625rem] lg:text-[1.75rem]">
                Find Opportunities That Match Your Path
              </h2>

              <p className="mt-3 max-w-[620px] text-[13px] leading-relaxed text-white/80 sm:text-[14px]">
                Search live opportunities across Canada by role, keyword and
                location, while using the ChLPS career pathways below to
                understand the membership or certification route that supports
                your growth.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-5"
              >
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="career-search-what"
                    className="block text-[13px] font-semibold text-white"
                  >
                    What
                  </label>
                  <div className="mt-2 flex h-12 items-center gap-2.5 rounded-[10px] bg-white px-4">
                    <Search
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-[#8A8A96]"
                      aria-hidden
                    />
                    <input
                      id="career-search-what"
                      value={what}
                      onChange={(event) => setWhat(event.target.value)}
                      placeholder="Job title, keyword or company"
                      className="min-w-0 flex-1 bg-transparent text-[14px] text-text outline-none placeholder:text-[#9B9AA5]"
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="career-search-where"
                    className="block text-[13px] font-semibold text-white"
                  >
                    Where
                  </label>
                  <div className="mt-2 flex h-12 items-center gap-2.5 rounded-[10px] bg-white px-4">
                    <MapPin
                      size={16}
                      strokeWidth={2}
                      className="shrink-0 text-[#8A8A96]"
                      aria-hidden
                    />
                    <input
                      id="career-search-where"
                      value={where}
                      onChange={(event) => setWhere(event.target.value)}
                      placeholder="City, province or territory"
                      className="min-w-0 flex-1 bg-transparent text-[14px] text-text outline-none placeholder:text-[#9B9AA5]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-secondary px-6 text-[14px] font-semibold text-[#211A73] transition-all duration-200 hover:brightness-95"
                >
                  Search Jobs
                  <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
                </button>
              </form>

              <p className="mt-5 text-[13px] text-white/80">
                Live job search opens on{" "}
                <a
                  href={CAREERJET_SEARCH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-white underline-offset-4 hover:underline"
                >
                  Careerjet Canada
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
