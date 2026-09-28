"use client";

import { useRef } from "react";
import { Reveal } from "@/features/components/reveal";
import PageContainer from "@/features/components/page_container";
import Modal, { type ModalHandle } from "@/components/DialogModal";
import type { CertificationDetail } from "@/features/certification/certification_details";

export default function CertificationDetailsOutcomeSection(props: {
  detail: CertificationDetail;
  imgUrl?: string;
}) {
  const { detail, imgUrl } = props;
  const modalRef = useRef<ModalHandle>(null);

  const imgSrc =
    detail.certificationImage ||
    imgUrl ||
    detail.outcomeImage ||
    "/assets/images/cert.png";

  const textContent =
    detail.certificationText?.trim() ||
    (Array.isArray(detail.outcomeBody) && detail.outcomeBody.length > 0
      ? detail.outcomeBody.join("\n\n")
      : "");

  if (
    !textContent &&
    (!detail.outcomeBody || detail.outcomeBody.length === 0) &&
    !detail.outcomeTitle
  ) {
    return null;
  }

  const badgeParts = detail.outcomeBadge ? detail.outcomeBadge.split(" ") : [];
  const badgeFirst = badgeParts[0] || detail.abbr;
  const badgeRest =
    badgeParts.slice(1).join(" ") || "Professional Certification";
  const modalTitle = `${badgeFirst} ${badgeRest}`;

  return (
    <section className="bg-white py-14 sm:py-8">
      <PageContainer>
        <Reveal>
          <article className="overflow-hidden rounded-[1.75rem] border border-[#D4B56A] bg-[#F6F5FB] lg:rounded-[2rem]">
            <div className="grid items-center lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
              <div className="relative flex items-center justify-center p-6 sm:p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={`${detail.abbr} certificate`}
                  className="h-auto w-full max-w-xl rounded-[0.9rem] object-contain shadow-[0_16px_36px_rgba(10,21,66,0.18)] sm:rounded-[1.05rem]"
                />
              </div>

              <div className="flex flex-col justify-center bg-[#0A1542] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-12">
                <h2 className="text-3xl font-semibold uppercase text-secondary sm:text-4xl">
                  {badgeFirst} <span className="text-white">{badgeRest}</span>
                </h2>

                {textContent && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => modalRef.current?.open()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        modalRef.current?.open();
                      }
                    }}
                    className="group mt-5 max-w-[28rem] cursor-pointer text-left transition-opacity hover:opacity-95 sm:mt-6"
                    title="Click to read full details"
                  >
                    <p className="line-clamp-8 whitespace-pre-line text-sm leading-relaxed text-white/95 sm:text-base">
                      {textContent}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary group-hover:underline">
                      Read more
                    </span>
                  </div>
                )}
              </div>
            </div>
          </article>
        </Reveal>
      </PageContainer>

      {/* Full Outcome Text Modal */}
      <Modal
        ref={modalRef}
        title={modalTitle}
        maxWidth="max-w-3xl"
        actions={
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => modalRef.current?.close()}
          >
            Close
          </button>
        }
      >
        <div className="max-w-none whitespace-pre-line text-sm leading-relaxed text-base-content/90 sm:text-base">
          {textContent}
        </div>
      </Modal>
    </section>
  );
}
