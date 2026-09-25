"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  ComputerIcon,
  Loading03Icon,
  UserIcon,
  Mail01Icon,
  Ticket01Icon,
} from "@hugeicons/core-free-icons";
import { useAppSelector } from "@/lib/store/store";
import { useJoinFreeEvent } from "../hooks/use_event_registration";
import type { ChlpsEvent } from "../events_data";
import type { EventRegistrationResult } from "../services/event_registration_service";

interface FreeEventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ChlpsEvent;
  onSuccess: (result: EventRegistrationResult) => void;
}

export default function FreeEventRegistrationModal({
  isOpen,
  onClose,
  event,
  onSuccess,
}: FreeEventRegistrationModalProps) {
  const user = useAppSelector((state) => state.user);
  const joinMutation = useJoinFreeEvent();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const eventId = event.raw?.id || event.id;
  const isVirtual =
    event.location && event.location.trim().toLowerCase() === "online";

  const displayName =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    "Registered Attendee";

  const displayEmail = user.email || "";

  const handleConfirm = async () => {
    setErrorMessage(null);
    try {
      const result = await joinMutation.mutateAsync(eventId);
      toast.success("Successfully registered for this free event!");
      onSuccess(result);
    } catch (err: any) {
      const msg =
        err?.message || "Failed to complete free event registration.";

      // Handle case where user is already registered
      if (
        msg.toLowerCase().includes("already registered") ||
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("exists")
      ) {
        toast.info("You are already registered for this event.");
        onSuccess({
          eventId,
          status: "Confirmed",
          ticketNumber: `TK-${eventId.slice(0, 8).toUpperCase()}`,
        });
        onClose();
        return;
      }

      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8 border border-base-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <HugeiconsIcon icon={Ticket01Icon} size={22} />
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#0D154B] sm:text-xl">
                Register for Free Event
              </h3>
              <p className="text-xs text-base-content/60">
                Association of Chartered Loss Prevention Specialists
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
        <div className="mt-5 space-y-4">
          {errorMessage && (
            <div className="alert alert-error rounded-2xl p-3 text-sm text-white">
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Event Card Summary */}
          <div className="rounded-2xl border border-base-200 bg-base-50 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="badge badge-primary badge-outline text-xs font-semibold px-2.5 py-1">
                {event.category || "Event"}
              </span>
              <span className="badge badge-success text-white text-xs font-bold px-2.5 py-1">
                Free Admission
              </span>
            </div>

            <h4 className="text-base font-bold text-[#0D154B] leading-snug">
              {event.title}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-base-200/80 text-xs text-base-content/70">
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={14}
                  className="text-primary shrink-0"
                />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={14}
                  className="text-primary shrink-0"
                />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <HugeiconsIcon
                  icon={isVirtual ? ComputerIcon : Location01Icon}
                  size={14}
                  className="text-primary shrink-0"
                />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>

          {/* Attendee Confirmation Info */}
          <div className="rounded-2xl border border-base-200 bg-[#F9F8FE] p-4 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0D154B]">
              Attendee Pass Information
            </p>
            <div className="flex items-center gap-2 text-xs text-base-content/80">
              <HugeiconsIcon
                icon={UserIcon}
                size={14}
                className="text-primary shrink-0"
              />
              <span className="font-semibold">{displayName}</span>
            </div>
            {displayEmail && (
              <div className="flex items-center gap-2 text-xs text-base-content/80">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={14}
                  className="text-primary shrink-0"
                />
                <span className="truncate">{displayEmail}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-base-content/60">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={16}
              className="text-emerald-500 shrink-0"
            />
            <span>
              Your electronic ticket pass will be generated and ready immediately.
            </span>
          </div>

          {/* CTA Actions */}
          <div className="mt-6 flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-md flex-1 rounded-2xl text-sm font-semibold"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={joinMutation.isPending}
              className="btn btn-primary btn-md flex-1 rounded-2xl text-sm font-bold text-white normal-case shadow-sm gap-2"
            >
              {joinMutation.isPending ? (
                <>
                  <HugeiconsIcon
                    icon={Loading03Icon}
                    size={18}
                    className="animate-spin"
                  />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                  <span>Confirm Free Registration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
