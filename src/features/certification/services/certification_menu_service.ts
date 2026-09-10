import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface ApiProgramItem {
  id: string;
  _id?: string;
  title: string;
  name?: string;
  slug?: string;
  description?: string;
  coverImage?: string;
  image?: string;
  abbr?: string;
  href?: string;
  coursesCount?: number;
  isPublished?: boolean;
}

/**
 * Fetches live programs from the backend API.
 * Contains ZERO dummy fallback data: returns live database items only.
 */
export async function fetchLivePrograms(): Promise<ApiProgramItem[]> {
  const api = new ApiService();

  try {
    // 1. Query live published programs endpoint
    const res = await api.getData<unknown>(ApiUrls.publicPrograms);
    let list: ApiProgramItem[] = [];

    if (res.success && res.data) {
      const raw = res.data;
      if (Array.isArray(raw)) {
        list = raw as ApiProgramItem[];
      } else if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (Array.isArray(obj.data)) {
          list = obj.data as ApiProgramItem[];
        } else if (
          obj.data &&
          typeof obj.data === "object" &&
          Array.isArray((obj.data as Record<string, unknown>).data)
        ) {
          list = (obj.data as Record<string, unknown>).data as ApiProgramItem[];
        } else if (
          obj.data &&
          typeof obj.data === "object" &&
          Array.isArray((obj.data as Record<string, unknown>).results)
        ) {
          list = (obj.data as Record<string, unknown>)
            .results as ApiProgramItem[];
        } else if (Array.isArray(obj.results)) {
          list = obj.results as ApiProgramItem[];
        }
      }
    }

    // 2. If /programs/public returned 0 items, check /courses/public to extract live programs associated with published courses
    if (list.length === 0) {
      const courseRes = await api.getData<unknown>(ApiUrls.publicCourses);
      if (courseRes.success && courseRes.data) {
        const cRaw = courseRes.data;
        let courses: Array<{
          shortDesc?: string;
          fullDesc?: string;
          coverImage?: string;
          program?:
            | {
                id?: string;
                _id?: string;
                title?: string;
                name?: string;
                slug?: string;
                description?: string;
              }
            | string;
        }> = [];

        if (Array.isArray(cRaw)) {
          courses = cRaw;
        } else if (cRaw && typeof cRaw === "object") {
          const cObj = cRaw as Record<string, unknown>;
          if (Array.isArray(cObj.data)) {
            courses = cObj.data as typeof courses;
          } else if (Array.isArray(cObj.results)) {
            courses = cObj.results as typeof courses;
          }
        }

        const seen = new Set<string>();
        for (const c of courses) {
          const p = c?.program;
          if (p && typeof p === "object") {
            const pId = p.id || p._id || p.slug;
            const pTitle = p.title || p.name;
            if (pId && pTitle && !seen.has(pId)) {
              seen.add(pId);
              list.push({
                id: pId,
                title: pTitle,
                slug: p.slug,
                description: p.description || c.shortDesc || "",
                coverImage: c.coverImage,
              });
            }
          } else if (p && typeof p === "string" && !seen.has(p)) {
            seen.add(p);
            list.push({
              id: p,
              title: p,
              description: c.shortDesc || "",
              coverImage: c.coverImage,
            });
          }
        }
      }
    }

    // Filter published only if flag is explicitly provided
    return list.filter(
      (item) => item.isPublished === undefined || item.isPublished === true,
    );
  } catch (error) {
    console.error("Error fetching live programs from API:", error);
    return [];
  }
}

/**
 * Maps live programs into balanced columns for the mega-menu dropdown.
 */
export async function fetchProgramsMenuFromApi(): Promise<NavLinkItem[][]> {
  const programs = await fetchLivePrograms();

  if (programs.length > 0) {
    const mapped: NavLinkItem[] = programs.map((item) => {
      const id = item.id || item._id || item.slug || "";
      const slug = item.slug || item.id || item._id || "";
      const label = item.title || item.name || "Program";

      const rawId = (slug || id).toLowerCase().replace(/[^a-z0-9-]/g, "");
      const href = item.href || `/certification#certification-${rawId}`;

      return { label, href };
    });

    const half = Math.ceil(mapped.length / 2);
    return [mapped.slice(0, half), mapped.slice(half)];
  }

  return [[], []];
}
