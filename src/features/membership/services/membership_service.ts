import simpleApiClient from "@/lib/network/simpleApi";
import { ApiUrls } from "@/lib/network/api_url";
import type { Membership } from "@/types";

export interface PublicMembershipsResponse {
  data: Membership[];
  count?: number;
}

export interface NavLinkItem {
  label: string;
  href: string;
}

/**
 * Fetches live membership categories from the backend API.
 * Live data only - no dummy fallbacks.
 */
export async function fetchPublicMemberships(): Promise<Membership[]> {
  try {
    const response = await simpleApiClient.get<
      | PublicMembershipsResponse
      | Membership[]
      | { data: { data: Membership[] } }
    >(ApiUrls.publicMemberships);

    const payload = response.data;

    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && typeof payload === "object") {
      if (Array.isArray((payload as PublicMembershipsResponse).data)) {
        return (payload as PublicMembershipsResponse).data;
      }
      const nested = (payload as { data?: { data?: Membership[] } }).data;
      if (nested && Array.isArray(nested.data)) {
        return nested.data;
      }
    }

    return [];
  } catch (error) {
    console.error("Error fetching public memberships:", error);
    return [];
  }
}

async function tryFetchMembership(slug: string): Promise<Membership | null> {
  try {
    const response = await simpleApiClient.get<
      Membership | { data: Membership }
    >(ApiUrls.publicMembership(slug), {
      validateStatus: (status) => status < 500,
    });

    if (response.status === 200 && response.data) {
      const payload = response.data;
      if (typeof payload === "object") {
        if ("data" in payload && (payload as { data: Membership }).data) {
          return (payload as { data: Membership }).data;
        }
        return payload as Membership;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetches a single public membership by slug from GET /memberships/public/{slug}
 */
export async function fetchPublicMembershipBySlug(
  slug: string,
): Promise<Membership | null> {
  if (!slug) return null;

  // Try exact slug first
  const match = await tryFetchMembership(slug);
  if (match) return match;

  // If slug doesn't end with -membership, try with suffix
  if (!slug.endsWith("-membership")) {
    const withSuffix = await tryFetchMembership(`${slug}-membership`);
    if (withSuffix) return withSuffix;
  }

  // If slug ends with -membership, try without suffix
  if (slug.endsWith("-membership")) {
    const withoutSuffix = await tryFetchMembership(
      slug.replace(/-membership$/, ""),
    );
    if (withoutSuffix) return withoutSuffix;
  }

  return null;
}

/**
 * Fetches live membership categories and splits them into 2 columns for the header mega-menu.
 */
export async function fetchMembershipMenuFromApi(): Promise<NavLinkItem[][]> {
  const list = await fetchPublicMemberships();

  if (list && list.length > 0) {
    const mapped: NavLinkItem[] = list.map((item) => {
      const slug = item.slug || item.id || "";
      const href = `/membership/${slug}`;
      const label = item.name || "Membership";
      return { label, href };
    });

    const half = Math.ceil(mapped.length / 2);
    return [mapped.slice(0, half), mapped.slice(half)];
  }

  return [[], []];
}
