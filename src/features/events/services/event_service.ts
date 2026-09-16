import simpleApiClient from "@/lib/network/simpleApi";
import { ApiUrls } from "@/lib/network/api_url";
import type { EventItem } from "@/types";
import type {
  ChlpsEvent,
  EventAccess,
  EventStatus,
} from "@/features/events/events_data";
import { Assets } from "@/lib/assets";

export interface PublicEventsResponse {
  data: EventItem[];
  count?: number;
}

/**
 * Validates whether an image string is a usable remote or local URL.
 * Rejects placeholder URLs like "https://.../banner.png".
 */
export function isValidImageUrl(url?: string | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed.includes("...")) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return trimmed.startsWith("/");
  }
}

/**
 * Format start and optional end date into a readable string (e.g. "15 Sep 2026").
 */
export function formatEventDate(startDate?: string, endDate?: string): string {
  if (!startDate) return "";
  try {
    const d1 = new Date(
      startDate.includes("T") ? startDate : `${startDate}T00:00:00`,
    );
    if (isNaN(d1.getTime())) return startDate;

    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const d1Formatted = formatter.format(d1);

    if (endDate && endDate !== startDate) {
      const d2 = new Date(
        endDate.includes("T") ? endDate : `${endDate}T00:00:00`,
      );
      if (!isNaN(d2.getTime())) {
        const d2Formatted = formatter.format(d2);
        return `${d1Formatted} - ${d2Formatted}`;
      }
    }

    return d1Formatted;
  } catch {
    return startDate;
  }
}

/**
 * Format start and optional end time into 12-hour AM/PM format (e.g. "10:00 AM - 5:00 PM").
 */
export function formatEventTime(startTime?: string, endTime?: string): string {
  if (!startTime) return "";

  const formatSingle = (t: string) => {
    const parts = t.split(":");
    if (parts.length >= 2) {
      let hour = parseInt(parts[0], 10);
      const min = parts[1].slice(0, 2);
      if (!isNaN(hour)) {
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${min} ${ampm}`;
      }
    }
    return t;
  };

  const startStr = formatSingle(startTime);
  if (endTime && endTime !== startTime) {
    const endStr = formatSingle(endTime);
    return `${startStr} - ${endStr}`;
  }
  return startStr;
}

/**
 * Calculate duration between start and end times/dates.
 */
export function calculateEventDuration(
  startDate?: string,
  startTime?: string,
  endDate?: string,
  endTime?: string,
): string {
  if (startDate && endDate && startDate !== endDate) {
    try {
      const d1 = new Date(startDate);
      const d2 = new Date(endDate);
      const diffDays =
        Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays > 1) return `${diffDays} Days`;
    } catch {}
  }

  if (startTime && endTime) {
    const sParts = startTime.split(":");
    const eParts = endTime.split(":");
    if (sParts.length >= 2 && eParts.length >= 2) {
      const sH = parseInt(sParts[0], 10);
      const sM = parseInt(sParts[1], 10);
      const eH = parseInt(eParts[0], 10);
      const eM = parseInt(eParts[1], 10);
      if (!isNaN(sH) && !isNaN(eH)) {
        const diffMinutes = eH * 60 + eM - (sH * 60 + sM);
        if (diffMinutes > 0) {
          const hours = Math.floor(diffMinutes / 60);
          const mins = diffMinutes % 60;
          if (hours > 0 && mins === 0) {
            return `${hours} ${hours === 1 ? "Hour" : "Hours"}`;
          }
          if (hours > 0 && mins > 0) {
            return `${hours}h ${mins}m`;
          }
          return `${mins} Minutes`;
        }
      }
    }
  }

  return "1 Day";
}

/**
 * Determine if event is currently live, upcoming, or past based on dates.
 */
export function determineEventStatus(apiEvent: EventItem): EventStatus {
  if (apiEvent.status?.toLowerCase() === "completed") {
    return "past";
  }

  const now = new Date();

  let start: Date | null = null;
  let end: Date | null = null;

  if (apiEvent.startDate) {
    const timePart = apiEvent.startTime
      ? `T${apiEvent.startTime.length === 5 ? apiEvent.startTime + ":00" : apiEvent.startTime}`
      : "T00:00:00";
    const d = new Date(`${apiEvent.startDate}${timePart}`);
    if (!isNaN(d.getTime())) start = d;
  }

  if (apiEvent.endDate) {
    const timePart = apiEvent.endTime
      ? `T${apiEvent.endTime.length === 5 ? apiEvent.endTime + ":00" : apiEvent.endTime}`
      : "T23:59:59";
    const d = new Date(`${apiEvent.endDate}${timePart}`);
    if (!isNaN(d.getTime())) end = d;
  } else if (start) {
    end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  }

  if (end && now > end) {
    return "past";
  }
  if (start && end && now >= start && now <= end) {
    return "live";
  }
  return "upcoming";
}

/**
 * Extract an array of valid image URLs from EventItem.
 * Handles coverImage, images array/string, and image fields.
 */
export function extractEventGallery(apiEvent: EventItem): string[] {
  const urls: string[] = [];

  const addIfValid = (url?: unknown) => {
    if (typeof url === "string" && isValidImageUrl(url)) {
      const trimmed = url.trim();
      if (!urls.includes(trimmed)) {
        urls.push(trimmed);
      }
    }
  };

  // 1. Check coverImage first (as primary hero)
  addIfValid(apiEvent.coverImage);

  // 2. Check images array or stringified array/urls
  if (Array.isArray(apiEvent.images)) {
    for (const item of apiEvent.images) {
      if (typeof item === "string") {
        addIfValid(item);
      } else if (item && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        addIfValid(obj.url || obj.image || obj.src || obj.path);
      }
    }
  } else if (typeof apiEvent.images === "string" && apiEvent.images.trim()) {
    try {
      const parsed = JSON.parse(apiEvent.images);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === "string") {
            addIfValid(item);
          } else if (item && typeof item === "object") {
            const obj = item as Record<string, unknown>;
            addIfValid(obj.url || obj.image || obj.src || obj.path);
          }
        }
      } else if (typeof parsed === "string") {
        addIfValid(parsed);
      }
    } catch {
      if (apiEvent.images.includes(",")) {
        apiEvent.images.split(",").forEach(addIfValid);
      } else {
        addIfValid(apiEvent.images);
      }
    }
  }

  // 3. Check legacy image field
  addIfValid(apiEvent.image);

  // 4. Default fallback if nothing was valid
  if (urls.length === 0) {
    urls.push(Assets.images.upcomingEvent);
  }

  return urls;
}

/**
 * Transforms an API EventItem to the frontend ChlpsEvent format.
 */
export function transformEventApiToChlpsEvent(apiEvent: EventItem): ChlpsEvent {
  const id = apiEvent.slug || apiEvent.id;
  const title = apiEvent.name;
  const description = apiEvent.description || "";

  let category = "Webinar";
  if (typeof apiEvent.category === "object" && apiEvent.category?.name) {
    category = apiEvent.category.name;
  } else if (
    typeof apiEvent.category === "string" &&
    apiEvent.category.trim()
  ) {
    category = apiEvent.category;
  }

  const status = determineEventStatus(apiEvent);
  const isFree = !apiEvent.price || apiEvent.price <= 0;
  const access: EventAccess = isFree ? "free" : "paid";
  const currency = apiEvent.currency || "CAD";
  const ticketPrice = isFree
    ? "Free"
    : `${currency} $${apiEvent.price.toLocaleString()}`;

  const isVirtual =
    apiEvent.format?.toLowerCase() === "virtual" || !apiEvent.location;
  const location = isVirtual ? "Online" : apiEvent.location || "Online";
  const address = isVirtual ? undefined : apiEvent.location || undefined;

  const gallery = extractEventGallery(apiEvent);
  const validImage = gallery[0] || Assets.images.upcomingEvent;

  return {
    id,
    title,
    description,
    category,
    status,
    access,
    date: formatEventDate(apiEvent.startDate, apiEvent.endDate),
    time: formatEventTime(apiEvent.startTime, apiEvent.endTime),
    duration: calculateEventDuration(
      apiEvent.startDate,
      apiEvent.startTime,
      apiEvent.endDate,
      apiEvent.endTime,
    ),
    location,
    address,
    ticketPrice,
    image: validImage,
    imageAlt: `${title} banner`,
    gallery,
    raw: apiEvent,
  };
}

/**
 * Fetches all published events from GET /events/public.
 * Live data only.
 */
export async function fetchPublicEvents(): Promise<ChlpsEvent[]> {
  try {
    const response = await simpleApiClient.get<
      PublicEventsResponse | EventItem[] | { data: { data: EventItem[] } }
    >(ApiUrls.publicEvents);

    const payload = response.data;
    let items: EventItem[] = [];

    if (Array.isArray(payload)) {
      items = payload;
    } else if (payload && typeof payload === "object") {
      if (Array.isArray((payload as PublicEventsResponse).data)) {
        items = (payload as PublicEventsResponse).data;
      } else {
        const nested = (payload as { data?: { data?: EventItem[] } }).data;
        if (nested && Array.isArray(nested.data)) {
          items = nested.data;
        }
      }
    }

    // Filter out draft/cancelled items if any leak through
    const published = items.filter((item) => {
      const s = item.status?.toLowerCase();
      return s !== "draft" && s !== "cancelled";
    });

    return published.map(transformEventApiToChlpsEvent);
  } catch (error) {
    console.error("Error fetching public events:", error);
    return [];
  }
}

/**
 * Fetches a single public event by slug or ID.
 */
export async function fetchPublicEventBySlug(
  slugOrId: string,
): Promise<ChlpsEvent | null> {
  const all = await fetchPublicEvents();
  const found = all.find(
    (e) =>
      e.id === slugOrId || e.raw?.id === slugOrId || e.raw?.slug === slugOrId,
  );
  return found || null;
}
