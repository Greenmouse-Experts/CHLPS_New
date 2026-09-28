"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
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
import Modal, { type ModalHandle } from "@/components/DialogModal";
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
  const modalRef = useRef<ModalHandle>(null);
  const user = useAppSelector((state) => state.user);
  const joinMutation = useJoinFreeEvent();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

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
      const msg = err?.message || "Failed to complete free event registration.";

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
    <Modal
      ref={modalRef}
      title="Register for Free Event"
      maxWidth="max-w-lg"
      actions={
        <div className="flex w-full items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost flex-1 rounded-xl text-xs sm:text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={joinMutation.isPending}
            className="btn btn-primary flex-1 rounded-xl text-xs sm:text-sm font-bold text-white normal-case shadow-sm gap-2"
          >
            {joinMutation.isPending ? (
              <>
                <HugeiconsIcon
                  icon={Loading03Icon}
                  size={16}
                  className="animate-spin"
                />
                <span>Registering...</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                <span>Confirm Registration</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {errorMessage && (
          <div className="alert alert-error rounded-2xl p-3 text-xs sm:text-sm text-white">
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
      </div>
    </Modal>
  );
}
