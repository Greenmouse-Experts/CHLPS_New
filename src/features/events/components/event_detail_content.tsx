import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Calendar03Icon,
  Clock01Icon,
  ComputerIcon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import EventDetailGallery from "@/features/events/components/event_detail_gallery";
import type { ChlpsEvent } from "@/features/events/events_data";
import { getEventDetailView } from "@/features/events/event_detail_view";

function DetailMetaRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: IconSvgElement;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3.5 ${
        last ? "" : "border-b border-[#EEEAF4] pb-4"
      }`}
    >
      <HugeiconsIcon
        icon={icon}
        size={18}
        color="#161058"
        strokeWidth={1.8}
        className="mt-0.5 shrink-0"
      />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#938C94]">
          {label}
        </p>
        <p className="mt-1 whitespace-pre-line text-[14px] font-bold leading-snug text-[#071649] sm:text-[17px]">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function EventDetailContent({ event }: { event: ChlpsEvent }) {
  const view = getEventDetailView(event);

  return (
    <div className="mt-6 grid items-start gap-5 lg:mt-7 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_40px_rgba(22,16,88,0.06)] lg:rounded-[2rem]">
        <EventDetailGallery images={event.gallery} alt={event.imageAlt} />

        <div className="px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary sm:text-[20px]">
            {view.typeLabel}
          </p>
          <h1 className="mt-2.5 text-[1.85rem] font-medium leading-[1.12] tracking-tight text-[#161058] sm:text-[50px] xl:text-[70px]">
            {event.title}
          </h1>
          <p className="mt-3 text-[20px] leading-relaxed text-[#333041] sm:mt-4 sm:text-[24px]">
            {event.description}
          </p>
        </div>
      </article>

      <aside className="rounded-[1.5rem] bg-[#EFECFB] p-4 sm:p-5 lg:rounded-[30px] lg:p-6 border border-[#E0DAF1]">
        <h2 className="text-[1.25rem] font-bold tracking-tight text-[#071649] sm:text-[26px]">
          Event details
        </h2>

        <div className="mt-4 rounded-[28px] bg-white px-5 py-5 sm:px-6 sm:py-6 border border-[#E8E2F0]">
          <div className="flex flex-col gap-4">
            <DetailMetaRow
              icon={Calendar03Icon}
              label="Date"
              value={event.date}
            />
            <DetailMetaRow icon={Clock01Icon} label="Time" value={event.time} />
            <DetailMetaRow
              icon={view.isVirtual ? ComputerIcon : Location01Icon}
              label={view.placeLabel}
              value={view.placeValue}
              last
            />
          </div>
        </div>

        <div className="mt-3 rounded-[1.15rem] bg-white px-5 py-5 sm:mt-4 sm:px-6 sm:py-6 border border-[#E0DAF1]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9A97A8]">
            Ticket
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-[1.65rem] font-semibold leading-none text-[#161058] sm:text-[1.85rem]">
              {view.ticketPrice}
            </p>
            {view.isLive ? (
              <span className="text-[14px] font-medium text-[#2FA360]">
                Live
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-[13px] text-[#8A8898]">{view.ticketNote}</p>
          <Link
            href={view.ctaHref}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#071649] text-[14px] font-semibold text-white transition-opacity duration-200 hover:opacity-90"
          >
            {view.ctaLabel}
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              color="currentColor"
              strokeWidth={2}
            />
          </Link>
        </div>
      </aside>
    </div>
  );
}
