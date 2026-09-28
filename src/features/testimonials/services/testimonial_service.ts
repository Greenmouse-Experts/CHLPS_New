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
      if (Array.isArray(inner.results))
        return inner.results as TestimonialItem[];
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
  const rawItem = item as Record<string, any>;

  const name =
    rawItem.displayName?.trim() ||
    rawItem.name?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    "ChLPS Member";

  const testimony = (rawItem.testimony ?? "").trim();
  const quote =
    testimony && !/^[“"']/.test(testimony) ? `“${testimony}”` : testimony;

  const role =
    rawItem.jobTitle?.trim() ||
    rawItem.role?.trim() ||
    rawItem.title?.trim() ||
    "ChLPS Member";

  const rawOrg = (rawItem.organization ?? "").trim();
  const rawLoc = (rawItem.location ?? "").trim();
  const cleanOrg = rawOrg.replace(/,\s*$/, "");
  const cleanLoc = rawLoc.replace(/,\s*$/, "");

  return {
    id: String(rawItem.id || index),
    quote,
    name,
    role,
    organization: cleanOrg || undefined,
    location: cleanLoc || undefined,
    rating:
      typeof rawItem.rating === "number" && rawItem.rating > 0
        ? rawItem.rating
        : 5,
    avatar:
      rawItem.photoUrl?.trim() ||
      rawItem.avatar?.trim() ||
      user?.picture?.trim() ||
      "",
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
