import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import type { ChlpsEvent, EventAccess } from "@/features/events/events_data";
import { Assets } from "@/lib/assets";

export function EventCardBackdrop({
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 42vw",
}: {
  sizes?: string;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Image
        src={Assets.images.certificateCardBg}
        alt=""
        fill
        className="object-cover object-bottom"
        sizes={sizes}
      />
    </div>
  );
}

const META_ICON_COLOR = "#8B8B96";

export function AccessBadge({
  access,
  className = "",
}: {
  access: EventAccess;
  className?: string;
}) {
  if (access === "free") {
    return (
      <span
        className={`inline-flex rounded-full border border-[#2FA360] bg-[#F3FBF6] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2FA360] ${className}`}
      >
        Free
      </span>
    );
  }

  return (
    <span
      className={`inline-flex rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white ${className}`}
    >
      Paid
    </span>
  );
}

export function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-[#E23B3B] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white ${className}`}
    >
      Live
    </span>
  );
}

export function ImageOverlayBadge({
  event,
}: {
  event: ChlpsEvent;
}) {
  if (event.status === "live") {
    return <LiveBadge />;
  }

  if (event.status === "past") {
    return (
      <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
        {event.category}
      </span>
    );
  }

  return <AccessBadge access={event.access} />;
}

function MetaItem({
  icon,
  label,
}: {
  icon: IconSvgElement;
  label: string;
}) {
  return (
    <li className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium text-[#6F6E7A] sm:text-[13px]">
      <HugeiconsIcon
        icon={icon}
        size={16}
        color={META_ICON_COLOR}
        strokeWidth={1.8}
        className="shrink-0"
      />
      <span>{label}</span>
    </li>
  );
}

export function EventMeta({
  event,
  className = "",
}: {
  event: ChlpsEvent;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
      <MetaItem icon={Calendar03Icon} label={event.date} />
      <MetaItem icon={Clock01Icon} label={event.duration} />
      <MetaItem icon={Location01Icon} label={event.location} />
    </ul>
  );
}

export function ViewDetailsButton({
  href,
  fullWidth = false,
}: {
  href: string;
  fullWidth?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-[13px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 sm:text-sm ${
        fullWidth ? "w-full" : ""
      }`}
    >
      View Event Details
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        color="currentColor"
        strokeWidth={2}
      />
    </Link>
  );
}

export function eventHref(event: ChlpsEvent) {
  return `/events/${event.id}`;
}
