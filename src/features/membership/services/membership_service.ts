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
  const response = await simpleApiClient.get<
    PublicMembershipsResponse | Membership[] | { data: { data: Membership[] } }
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
}

/**
 * Fetches live membership categories and splits them into 2 columns for the header mega-menu.
 */
export async function fetchMembershipMenuFromApi(): Promise<NavLinkItem[][]> {
  const list = await fetchPublicMemberships();

  if (list && list.length > 0) {
    const mapped: NavLinkItem[] = list.map((item) => {
      const slugOrId = item.slug || item.id || "";
      const rawSlug = slugOrId.toLowerCase().replace(/-membership$/, "");
      const href = `/membership/${rawSlug || slugOrId}`;
      const label = item.name || "Membership";
      return { label, href };
    });

    const half = Math.ceil(mapped.length / 2);
    return [mapped.slice(0, half), mapped.slice(half)];
  }

  return [[], []];
}
