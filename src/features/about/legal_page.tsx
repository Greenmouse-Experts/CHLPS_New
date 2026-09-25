"use client";

import { useState } from "react";
import Header from "@/features/components/header";
import AboutHeroSection from "@/features/about/components/about_hero_section";
import Footer from "@/features/components/footer";
import HeaderText from "@/components/HeaderText";
import PageContainer from "@/features/components/page_container";
import { Reveal } from "@/features/components/reveal";
import LegalCertificateCard from "@/features/about/components/legal_certificate_card";
import { LEGAL_CARDS } from "@/features/about/legal_data";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Download01Icon } from "@hugeicons/core-free-icons";

export default function LegalPage() {
  const [modalPreview, setModalPreview] = useState<{
    image: string;
    title: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Hero Section */}
      <AboutHeroSection
        fixedHeight
        padding
        image="/lega/banner.png"
        imageAlt="CHLPS Canada Legal and Accreditation Banner"
        imageClassName="object-cover object-[right_center]"
        badge="Legal & Institutional Standing"
        title="Institutional Standing &"
        accent="Legal Framework"
        body="The Association of Chartered Loss Prevention Specialists of Canada is a federally incorporated not-for-profit body governed by rigorous legal, ethical, and international accreditation standards."
        bodyWidth="32rem"
      >
        <div className="space-y-3">
          <HeaderText
            smallSize
            left="about"
            right="chlps canaga"
            textWhite
            notCenter
          />
          <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Our Legal Status <br />
            <span className="text-secondary"> and our Accreditations</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
            Explore the legal standing and professional recognitions of the
            Association of Chartered Loss Prevention Specialists of Canada. Our
            federal incorporation, institutional accreditation, professional
            certification organization accreditation, and continuing
            professional development provider registration reflect our
            commitment to governance, quality, and professional standards.
          </p>
        </div>
      </AboutHeroSection>

      {/* Accreditations & Charters Cards Section */}
      <section className="relative overflow-hidden bg-cream py-12 sm:py-16 lg:py-20">
        <PageContainer>
          <div className="space-y-10 sm:space-y-12 lg:space-y-14">
            {LEGAL_CARDS.map((card, index) => (
              <Reveal key={card.id} delay={index * 60}>
                <LegalCertificateCard
                  card={card}
                  onPreview={(image, title) =>
                    setModalPreview({ image, title })
                  }
                />
              </Reveal>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Interactive Lightbox / Modal */}
      {modalPreview && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setModalPreview(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#0A1542] px-6 py-4 text-white">
              <h3 className="text-base font-semibold sm:text-lg">
                {modalPreview.title}
              </h3>
              <button
                type="button"
                onClick={() => setModalPreview(null)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close document modal"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={20}
                  color="currentColor"
                />
              </button>
            </div>

            {/* Viewer */}
            <div className="flex flex-1 items-center justify-center overflow-auto bg-[#F8FAFC] p-4 sm:p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={modalPreview.image}
                alt={modalPreview.title}
                className="max-h-[70vh] w-auto rounded-lg object-contain shadow-lg ring-1 ring-black/10"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] bg-white px-6 py-3.5 text-xs text-[#64748B]">
              <a
                href={modalPreview.image}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-1.5 font-medium text-[#0A1542] hover:bg-[#F1F5F9]"
              >
                <HugeiconsIcon
                  icon={Download01Icon}
                  size={14}
                  color="currentColor"
                />
                <span>Open Raw Document</span>
              </a>
              <button
                type="button"
                onClick={() => setModalPreview(null)}
                className="rounded-lg bg-primary px-4 py-1.5 font-medium text-white hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
