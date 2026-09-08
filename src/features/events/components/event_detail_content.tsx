import type { ReactNode } from "react";
import Image from "next/image";
import { Reveal } from "@/features/components/reveal";
import type { ChlpsEvent } from "@/features/events/events_data";
import { getEventDetailView } from "@/features/events/event_detail_view";

type DetailRow = {
  label: string;
  value: string;
  valueClassName?: string;
};

function DetailCard({
  title,
  children,
  footer,
  accentBg,
  delay = 0,
}: {
  title: string;
  children: ReactNode;
  footer?: string;
  accentBg?: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className="overflow-hidden rounded-[14px] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <h2 className="text-[1.15rem] font-semibold tracking-tight text-[#071649] sm:text-[1.25rem]">
            {title}
          </h2>
          <div className="mt-4">{children}</div>
        </div>
        {footer ? (
          <p
            className="px-5 py-3 text-[13px] leading-relaxed text-[#6F6E7A] sm:px-6"
            style={{ backgroundColor: accentBg ?? "#F3F4F9" }}
          >
            {footer}
          </p>
        ) : null}
      </article>
    </Reveal>
  );
}

function DetailList({ rows }: { rows: DetailRow[] }) {
  return (
    <dl>
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`flex items-start justify-between gap-4 py-3 ${
            index === 0 ? "pt-0" : ""
          } ${
            index === rows.length - 1
              ? "pb-0"
              : "border-b border-[#EEEFF3]"
          }`}
        >
          <dt className="shrink-0 text-[14px] text-[#8A8A96]">{row.label}</dt>
          <dd
            className={`max-w-[65%] text-right text-[14px] font-semibold leading-snug text-[#071649] sm:text-[15px] ${
              row.valueClassName ?? ""
            }`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StatBox({
  label,
  value,
  accentBg,
}: {
  label: string;
  value: string;
  accentBg: string;
}) {
  return (
    <div
      className="rounded-[12px] px-4 py-3.5 border border-[#E4DDEE]"
      style={{ backgroundColor: accentBg }}
    >
      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#6B6980]">
        {label}
      </p>
      <p className="mt-1.5 text-[1.35rem] font-semibold leading-none text-[#071649] sm:text-[28px]">
        {value}
      </p>
    </div>
  );
}

export default function EventDetailContent({ event }: { event: ChlpsEvent }) {
  const view = getEventDetailView(event);

  return (
    <div className="mt-6 grid items-start gap-5 lg:mt-8 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)] lg:gap-6">
      <div className="flex flex-col gap-5 lg:gap-6">
        <DetailCard title="Event Description" delay={80}>
          <p className="text-[14px] leading-relaxed text-[#5B5A66] sm:text-[15px]">
            {event.description}
          </p>
        </DetailCard>

        <DetailCard title="Date and Location" delay={120}>
          <DetailList
            rows={[
              { label: "Event date", value: event.date },
              { label: "Location", value: event.location },
              { label: "Duration", value: event.duration },
              { label: "Event type", value: view.formatLabel },
            ]}
          />
        </DetailCard>

        <DetailCard
          title="Manage Registrations"
          footer={view.registrationNote}
          accentBg={view.accentBg}
          delay={160}
        >
          <div className="grid grid-cols-2 gap-3">
            <StatBox
              label="Registration status"
              value={view.registrationStatus}
              accentBg={view.accentBg}
            />
            <StatBox
              label="Capacity"
              value={view.capacity}
              accentBg={view.accentBg}
            />
            <StatBox
              label="Registered"
              value={view.registered}
              accentBg={view.accentBg}
            />
            <StatBox
              label="Check-ins"
              value={view.checkIns}
              accentBg={view.accentBg}
            />
          </div>
        </DetailCard>

        <DetailCard title="Manage Ticket Information" delay={200}>
          <DetailList
            rows={[
              { label: "Ticket type", value: view.ticketType },
              { label: "Confirmation", value: view.confirmation },
              { label: "Access", value: view.accessDetail },
              { label: "Support", value: view.support },
            ]}
          />
        </DetailCard>
      </div>

      <div className="flex flex-col gap-5 lg:gap-6">
        <DetailCard title="Event Image" delay={100}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[12px]">
            <Image
              src={event.image}
              alt={event.imageAlt}
              fill
              className={event.imageClassName ?? "object-cover"}
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </DetailCard>

        <DetailCard title="Free or Paid Status" delay={140}>
          <DetailList
            rows={[
              { label: "Status", value: view.statusLabel },
              { label: "Attendance type", value: view.attendanceType },
              { label: "Availability", value: view.availability },
            ]}
          />
        </DetailCard>

        <DetailCard title="Ticket Price" delay={180}>
          <div className="grid grid-cols-2 gap-3">
            <StatBox
              label="Ticket price"
              value={view.ticketPrice}
              accentBg={view.accentBg}
            />
            <StatBox
              label="Sales mode"
              value={view.salesMode}
              accentBg={view.accentBg}
            />
          </div>
        </DetailCard>

        <DetailCard
          title="View Payments"
          footer={view.paymentNote}
          accentBg={view.accentBg}
          delay={220}
        >
          <DetailList
            rows={[
              { label: "Payment mode", value: view.paymentMode },
              {
                label: "Collected",
                value: view.collected,
                valueClassName: view.isFree ? "text-[#2FA360]" : undefined,
              },
              { label: "Refunds", value: view.refunds },
            ]}
          />
        </DetailCard>
      </div>
    </div>
  );
}
