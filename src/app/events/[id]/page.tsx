import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventDetailPage from "@/features/events/event_detail_page";
import { events, getEventById } from "@/features/events/events_data";

type EventIdPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ id: event.id }));
}

export async function generateMetadata({
  params,
}: EventIdPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    return { title: "Event" };
  }

  return {
    title: event.title,
    description: event.description,
  };
}

export default async function EventIdPage({ params }: EventIdPageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  return <EventDetailPage event={event} />;
}
