"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  ComputerIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
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
  if (!isOpen) return null;

  const eventId = event.raw?.id || event.id;
  const isVirtual =
    event.location && event.location.trim().toLowerCase() === "online";

  const displayTicketNumber =
    ticketNumber ||
    registration?.ticketNumber ||
    `TK-${eventId.slice(0, 8).toUpperCase()}`;

  const meetingLink =
    event.raw?.meetingLink || registration?.event?.meetingLink;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8 border border-base-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#0D154B] sm:text-xl">
                Event Pass & Ticket
              </h3>
              <p className="text-xs text-base-content/60">
                Official Admission Confirmation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-base-content/60 hover:bg-base-200 hover:text-base-content transition"
            aria-label="Close dialog"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-5 space-y-5">
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
          <div className="text-xs text-base-content/70 space-y-1 bg-base-50 p-3.5 rounded-xl border border-base-200">
            <p className="font-semibold text-base-content">
              Important Event Information:
            </p>
            <p>
              Please present your ticket reference or digital confirmation email
              upon check-in. Virtual attendees will receive reminders before the session starts.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/dashboard"
              className="btn btn-primary btn-block h-12 min-h-12 rounded-xl text-sm font-bold text-white normal-case shadow-sm gap-2 flex items-center justify-center"
            >
              <span>Go to My Dashboard</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-base-content/70"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
