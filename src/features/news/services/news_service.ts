import simpleApiClient from "@/lib/network/simpleApi";
import { ApiUrls } from "@/lib/network/api_url";
import type { BlogPost, BlogTag } from "@/types";

export interface PublicPostsResponse {
  data: BlogPost[];
  count?: number;
}

export interface PublicTagsResponse {
  data: BlogTag[];
  count?: number;
}

/**
 * Fetches published blog posts from /api/v1/blog/view-posts
 */
export async function fetchPublishedPosts(params?: {
  tag?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<BlogPost[]> {
  try {
    const query = new URLSearchParams();
    if (params?.tag) query.set("tag", params.tag);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const qs = query.toString();
    const url = `${ApiUrls.viewPosts}${qs ? `?${qs}` : ""}`;
    const response = await simpleApiClient.get<
      PublicPostsResponse | BlogPost[] | { data: { data: BlogPost[] } }
    >(url);

    const payload = response.data;
    if (Array.isArray(payload)) {
      return payload;
    }
    if (payload && typeof payload === "object") {
      if (Array.isArray((payload as PublicPostsResponse).data)) {
        return (payload as PublicPostsResponse).data;
      }
      const nested = (payload as { data?: { data?: BlogPost[] } }).data;
      if (nested && Array.isArray(nested.data)) {
        return nested.data;
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching published blog posts:", error);
    return [];
  }
}

/**
 * Fetches a single published post by ID from /api/v1/blog/view-post/:id
 */
export async function fetchPublishedPost(id: string): Promise<BlogPost | null> {
  try {
    const response = await simpleApiClient.get<BlogPost | { data: BlogPost }>(
      ApiUrls.viewPost(id),
    );
    const payload = response.data;
    if (payload && typeof payload === "object") {
      if ("data" in payload && (payload as { data: BlogPost }).data) {
        return (payload as { data: BlogPost }).data;
      }
      return payload as BlogPost;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    return null;
  }
}

/**
 * Fetches published blog tags from /api/v1/blog/view-tags
 */
export async function fetchPublishedTags(): Promise<BlogTag[]> {
  try {
    const response = await simpleApiClient.get<
      PublicTagsResponse | BlogTag[] | { data: { data: BlogTag[] } }
    >(ApiUrls.viewTags);

    const payload = response.data;
    if (Array.isArray(payload)) {
      return payload;
    }
    if (payload && typeof payload === "object") {
      if (Array.isArray((payload as PublicTagsResponse).data)) {
        return (payload as PublicTagsResponse).data;
      }
      const nested = (payload as { data?: { data?: BlogTag[] } }).data;
      if (nested && Array.isArray(nested.data)) {
        return nested.data;
      }
    }
    return [];
  } catch (error) {
    console.error("Error fetching published tags:", error);
    return [];
  }
}
