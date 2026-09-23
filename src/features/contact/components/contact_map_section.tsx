"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import ContactForm from "@/features/contact/components/contact_form";

const MAP_EMBED =
  "https://maps.google.com/maps?q=Victoria%20Avenue%2C%20Windsor%20Ontario%20N9A%204N1%2C%20Canada&t=&z=15&ie=UTF8&iwloc=&output=embed";

const GOOGLE_MAPS_LINK =
  "https://www.google.com/maps/search/?api=1&query=Victoria+Avenue+Windsor+Ontario+N9A+4N1+Canada";

export default function ContactMapSection() {
  return (
    <section id="find-us" className="bg-[#FAF8F3] py-12 sm:py-8 ">
      <PageContainer>
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-8 xl:gap-10">
          {/* Left Card: Location & Interactive Map */}
          <Reveal className="h-full">
            <div className="card relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-base-200/80 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              {/* Subtle background ambient contour glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
              />

              <div className="relative z-10 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2B3582]">
                    Our Location
                  </span>
                  <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0D154B] sm:text-3xl">
                    Find Chlps Institute
                  </h2>

                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-relaxed text-base-content/70">
                      Victoria Avenue, Windsor
                      <br />
                      Ontario N9A 4N1, Canada
                    </p>

                    <a
                      href={GOOGLE_MAPS_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm h-9 gap-1.5 rounded-xl border-base-300 px-3.5 text-xs font-semibold normal-case text-base-content transition-colors hover:border-[#0D154B] hover:bg-[#0D154B] hover:text-white"
                    >
                      <span>Open in Google Maps</span>
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        size={14}
                        color="currentColor"
                        strokeWidth={2}
                      />
                    </a>
                  </div>
                </div>

                {/* Map Container with Pinned Location Overlay */}
                <div className="relative mt-6 min-h-[340px] flex-1 overflow-hidden rounded-2xl border border-base-200 shadow-xs sm:min-h-[400px]">
                  <iframe
                    src={MAP_EMBED}
                    title="Map showing the ChLPS Canada office on Victoria Avenue, Windsor, Ontario"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />

                  {/* Floating Pinned Location Card */}
                  <div className="absolute bottom-4 left-4 z-10 max-w-[240px] rounded-2xl border border-base-200/80 bg-white/95 p-4 shadow-lg backdrop-blur-md">
                    <span className="badge badge-warning border-none bg-[#FEF3C7] px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-[#B45309]">
                      Pinned Location
                    </span>
                    <h4 className="mt-2 text-sm font-bold text-[#0D154B]">
                      ChLPS Institute
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-base-content/70">
                      Victoria Avenue, Windsor
                      <br />
                      Ontario N9A 4N1, Canada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Card: Send A Message Form */}
          <Reveal delay={100} className="h-full">
            <div className="card relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-base-200/80 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="relative z-10 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2B3582]">
                    Send A Message
                  </span>
                  <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0D154B] sm:text-3xl">
                    Tell us what you need
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-base-content/70">
                    Complete the form below and our admissions or support team
                    will get back to you shortly.
                  </p>
                </div>

                <div className="mt-6 flex-1">
                  <ContactForm />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
