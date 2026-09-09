import simpleApiClient from "@/lib/network/simpleApi";
import { ApiUrls } from "@/lib/network/api_url";
import type { Membership } from "@/types";

export interface PublicMembershipsResponse {
  data: Membership[];
  count?: number;
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
