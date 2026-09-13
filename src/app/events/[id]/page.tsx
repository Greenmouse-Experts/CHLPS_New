import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventDetailPage from "@/features/events/event_detail_page";
import {
  fetchPublicEvents,
  fetchPublicEventBySlug,
} from "@/features/events/services/event_service";

type EventIdPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export async function generateStaticParams() {
  const live = await fetchPublicEvents().catch(() => []);
  return live
    .map((event) => event.id || event.raw?.id || event.raw?.slug)
    .filter(Boolean)
    .map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: EventIdPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchPublicEventBySlug(id);

  if (!event) {
    return { title: "Event | CHLPS Canada" };
  }

  return {
    title: `${event.title} | CHLPS Canada`,
    description: event.description,
    openGraph: event.image
      ? {
          images: [{ url: event.image }],
        }
      : undefined,
  };
}

export default async function EventIdPage({ params }: EventIdPageProps) {
  const { id } = await params;
  const event = await fetchPublicEventBySlug(id);

  if (!event) {
    notFound();
  }

  return <EventDetailPage event={event} />;
}
