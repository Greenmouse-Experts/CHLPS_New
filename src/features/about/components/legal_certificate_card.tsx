"use client";

import { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkBadge01Icon,
  ViewIcon,
  Cancel01Icon,
  Download01Icon,
  Award01Icon,
} from "@hugeicons/core-free-icons";
import type { LegalCertificateItem } from "@/features/about/legal_data";

interface LegalCertificateCardProps {
  item: LegalCertificateItem;
  onPreview?: (item: LegalCertificateItem) => void;
}

export default function LegalCertificateCard({
  item,
  onPreview,
}: LegalCertificateCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => {
    if (onPreview) {
      onPreview(item);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-xl">
        {/* Certificate Visual Container */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleOpen();
            }
          }}
          className="relative flex h-72 w-full cursor-pointer items-center justify-center overflow-hidden bg-[#0A1542]/5 p-4 transition-colors group-hover:bg-[#0A1542]/10 sm:h-80"
          title={`Click to inspect ${item.title}`}
        >
          {/* Framed Certificate Document */}
          <div className="relative mx-auto flex h-full max-h-64 w-auto items-center justify-center rounded-xl bg-white p-2 shadow-md ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-[1.02]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.title}
              className="max-h-full w-auto rounded-lg object-contain"
              loading="lazy"
            />
          </div>

          {/* Quick Preview Badge Overlay */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-[#0A1542]/85 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-opacity group-hover:bg-primary">
            <HugeiconsIcon icon={ViewIcon} size={14} color="currentColor" />
            <span>Click to expand</span>
          </div>

          {/* Authority Tag Overlay */}
          <div className="absolute left-3 top-3">
            <span className="badge badge-sm border border-secondary/40 bg-secondary/15 font-semibold text-secondary-content">
              {item.badge}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-content/80">
                {item.authority}
              </p>
              <h3 className="mt-1 text-lg font-bold text-[#0A1542] transition-colors group-hover:text-primary sm:text-xl">
                {item.title}
              </h3>
            </div>
          </div>

          <p className="mt-1 text-xs font-medium text-[#475569] sm:text-sm">
            {item.subtitle}
          </p>

          <p className="mt-3 text-xs leading-relaxed text-[#64748B] sm:text-sm">
            {item.summary}
          </p>

          {/* Key verification highlights */}
          {item.highlights && item.highlights.length > 0 && (
            <div className="mt-4 border-t border-[#F1F5F9] pt-4">
              <p className="text-xs font-semibold text-[#334155]">
                Key Verification Attributes:
              </p>
              <ul className="mt-2 space-y-1.5">
                {item.highlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-[#475569]"
                  >
                    <HugeiconsIcon
                      icon={CheckmarkBadge01Icon}
                      size={14}
                      color="#CDA54E"
                      className="mt-0.5 shrink-0"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Registration reference / validity details */}
          {(item.registrationNumber || item.issueDate || item.validity) && (
            <div className="mt-auto pt-5">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#475569]">
                {item.registrationNumber && (
                  <span className="font-medium">
                    Ref:{" "}
                    <strong className="font-semibold text-[#0A1542]">
                      {item.registrationNumber}
                    </strong>
                  </span>
                )}
                {item.issueDate && <span>Issued: {item.issueDate}</span>}
                {item.validity && (
                  <span className="font-medium text-emerald-700">
                    {item.validity}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="mt-5 pt-1">
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-secondary/30 bg-cream py-2.5 text-xs font-semibold text-[#0A1542] transition-colors hover:bg-secondary hover:text-[#0A1542] sm:text-sm"
            >
              <HugeiconsIcon icon={Award01Icon} size={16} color="currentColor" />
              <span>Inspect Document</span>
            </button>
          </div>
        </div>
      </article>

      {/* Standalone Modal Preview */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#0A1542] px-6 py-4 text-white">
              <div>
                <h4 className="text-base font-semibold sm:text-lg">
                  {item.title}
                </h4>
                <p className="text-xs text-white/80">{item.authority}</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close document modal"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} color="currentColor" />
              </button>
            </div>

            {/* Modal Body / Image Viewer */}
            <div className="flex flex-1 items-center justify-center overflow-auto bg-[#F8FAFC] p-4 sm:p-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="max-h-[70vh] w-auto rounded-lg object-contain shadow-lg ring-1 ring-black/10"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] bg-white px-6 py-3.5 text-xs text-[#64748B]">
              <span>
                {item.registrationNumber ? `Ref: ${item.registrationNumber}` : ""}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={item.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 font-medium text-[#0A1542] hover:bg-[#F1F5F9]"
                >
                  <HugeiconsIcon icon={Download01Icon} size={14} color="currentColor" />
                  <span>Open Raw Document</span>
                </a>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg bg-primary px-4 py-1.5 font-medium text-white hover:bg-primary/90"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
