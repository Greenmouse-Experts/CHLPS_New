import simpleApiClient from "@/lib/network/simpleApi";
import { ApiUrls } from "@/lib/network/api_url";
import type { TestimonialItem } from "@/types";
import type { MemberTestimonial } from "@/features/testimonials/testimonials_data";

/** Extracts a testimonial list from the several shapes the API may return. */
function extractList(payload: unknown): TestimonialItem[] {
  if (Array.isArray(payload)) return payload as TestimonialItem[];

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;

    if (Array.isArray(obj.data)) return obj.data as TestimonialItem[];
    if (Array.isArray(obj.results)) return obj.results as TestimonialItem[];

    if (obj.data && typeof obj.data === "object") {
      const inner = obj.data as Record<string, unknown>;
      if (Array.isArray(inner.data)) return inner.data as TestimonialItem[];
      if (Array.isArray(inner.results)) return inner.results as TestimonialItem[];
    }
  }

  return [];
}

async function fetchByUrl(url: string): Promise<TestimonialItem[]> {
  const response = await simpleApiClient.get(url);
  return extractList(response.data).filter(
    (item) => item.isPublished === undefined || item.isPublished,
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function toMemberTestimonial(
  item: TestimonialItem,
  index: number,
): MemberTestimonial {
  const user = item.user;
  const name =
    item.name?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();

  const testimony = (item.testimony ?? "").trim();
  const quote =
    testimony && !/^[“"']/.test(testimony) ? `“${testimony}”` : testimony;

  return {
    id: String(item.id || index),
    quote,
    name,
    role: item.role?.trim() || "ChLPS Member",
    rating: item.rating && item.rating > 0 ? item.rating : 5,
    avatar: item.avatar || user?.picture || "",
    initials: getInitials(name),
  };
}

/**
 * Fetches published member testimonials for the "What Our Members Say" section.
 * Prefers the curated endpoint, falling back to the general published list.
 * Returns an empty array on failure so callers can fall back gracefully.
 */
export async function fetchMemberTestimonials(): Promise<MemberTestimonial[]> {
  try {
    let items = await fetchByUrl(ApiUrls.publicTestimonialsCurated);
    if (items.length === 0) {
      items = await fetchByUrl(ApiUrls.publicTestimonialsPublished);
    }

    return items
      .filter((item) => Boolean(item.testimony?.trim()))
      .map(toMemberTestimonial);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}
