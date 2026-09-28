"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  ComputerIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Modal, { type ModalHandle } from "@/components/DialogModal";
import type { ChlpsEvent } from "../events_data";
import type { EventRegistration } from "@/types/events";

interface EventTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ChlpsEvent;
  registration?: EventRegistration | null;
  ticketNumber?: string;
}

export default function EventTicketModal({
  isOpen,
  onClose,
  event,
  registration,
  ticketNumber,
}: EventTicketModalProps) {
  const modalRef = useRef<ModalHandle>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  const eventId = event.raw?.id || event.id;
  const isVirtual =
    event.location && event.location.trim().toLowerCase() === "online";

  const displayTicketNumber =
    ticketNumber ||
    registration?.ticketNumber ||
    `TK-${(eventId || "").slice(0, 8).toUpperCase()}`;

  const meetingLink =
    event.raw?.meetingLink || registration?.event?.meetingLink;

  const registrationId =
    (registration as any)?.registrationId ||
    registration?.id ||
    (registration as any)?._id;

  return (
    <Modal
      ref={modalRef}
      title="Event Pass & Ticket"
      maxWidth="max-w-lg"
      actions={
        <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-2">
          {registrationId ? (
            <Link
              href={`/dashboard/events/${registrationId}`}
              onClick={onClose}
              className="btn btn-outline btn-primary btn-sm rounded-xl text-xs font-bold normal-case gap-1.5 flex items-center justify-center w-full sm:w-auto"
            >
              <span>View Registration Details</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-base-content/70 w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Ticket Card Slip */}
        <div className="rounded-2xl border-2 border-[#C99E4A] bg-[#FAF8F5] p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#C99E4A]/30 pb-3">
            <div>
              <span className="badge badge-success badge-sm text-white font-semibold text-xs">
                Confirmed
              </span>
            </div>
            <div className="text-right">
              <span className="block text-xs uppercase tracking-wider text-base-content/60">
                Ticket No.
              </span>
              <span className="font-mono text-xs font-bold text-[#0D154B]">
                {displayTicketNumber}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <span className="badge badge-primary badge-outline text-xs font-semibold">
              {event.category || "Event"}
            </span>

            <h4 className="text-base font-bold text-[#0D154B] sm:text-lg leading-snug">
              {event.title}
            </h4>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2 text-xs text-base-content/80">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={16}
                  className="text-primary shrink-0"
                />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={16}
                  className="text-primary shrink-0"
                />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <HugeiconsIcon
                  icon={isVirtual ? ComputerIcon : Location01Icon}
                  size={16}
                  className="text-primary shrink-0"
                />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {meetingLink && (
              <div className="mt-3 rounded-xl bg-primary/10 p-3 text-xs text-primary">
                <p className="font-semibold">Virtual Access Link:</p>
                <a
                  href={meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline break-all hover:text-primary-focus"
                >
                  {meetingLink}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-base-content/70 space-y-1 bg-base-200/50 p-3.5 rounded-xl border border-base-200">
          <p className="font-semibold text-base-content">
            Important Event Information:
          </p>
          <p>
            Please present your ticket reference or digital confirmation email
            upon check-in. Virtual attendees will receive reminders before the
            session starts.
          </p>
        </div>
      </div>
    </Modal>
  );
}
