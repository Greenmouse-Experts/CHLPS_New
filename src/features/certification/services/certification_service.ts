import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { Assets } from "@/lib/assets";
import type { CertificationDetail } from "@/features/certification/certification_details";

export interface ApiCourseOutcome {
  id?: string;
  description: string;
  order?: number;
}

export interface ApiCourseItem {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  shortDesc?: string;
  fullDesc?: string;
  price?: number;
  discount?: number;
  isPublished?: boolean;
  featured?: boolean;
  coverImage?: string;
  banner?: string | null;
  bannerText?: string | null;
  certificationBenefits?: string[];
  entryRequirements?: string[];
  applicationQuestions?: Array<{ id?: string; question: string }>;
  courseOutcomes?: ApiCourseOutcome[];
  program?: { id?: string; title?: string; slug?: string } | string;
}

export interface ApiProgramItem {
  id: string;
  _id?: string;
  title: string;
  name?: string;
  slug?: string;
  description?: string;
  coverImage?: string;
  coursesCount?: number;
  isPublished?: boolean;
  createdDate?: string;
  courses?: ApiCourseItem[];
}

const BADGE_MAP: Record<string, string> = {
  bclp: Assets.images.certificates.bclp,
  clpa: Assets.images.certificates.clpa,
  clpo: Assets.images.certificates.clpo,
  clpm: Assets.images.certificates.clpm,
  aclpm: Assets.images.certificates.acipm,
  acipm: Assets.images.certificates.acipm,
  chlps: Assets.images.certificates.chlps,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Extracts acronym abbreviation from title (e.g. "Certified Loss Prevention Associate (CLPA™)" -> "CLPA").
 */
export function extractProgramAbbreviation(title: string): string {
  const match = title.match(/\(([A-Za-z™]+)\)/);
  if (match && match[1]) {
    return match[1].replace(/™/g, "").trim();
  }

  const lower = title.toLowerCase();
  if (
    lower.includes("basic professional certificate") ||
    lower.includes("bclp")
  )
    return "BCLP";
  if (
    lower.includes("advanced professional certificate") ||
    lower.includes("aclpm") ||
    lower.includes("acipm")
  )
    return "ACLPM";
  if (
    lower.includes("chartered loss prevention specialist") ||
    lower.includes("chlps")
  )
    return "ChLPS";
  if (
    lower.includes("certified loss prevention manager") ||
    lower.includes("clpm")
  )
    return "CLPM";
  if (
    lower.includes("certified loss prevention officer") ||
    lower.includes("clpo")
  )
    return "CLPO";
  if (
    lower.includes("certified loss prevention associate") ||
    lower.includes("clpa")
  )
    return "CLPA";

  // Fallback to capital letters if available
  const capitals = title.replace(/[^A-Z]/g, "");
  return capitals.length >= 2 && capitals.length <= 6 ? capitals : "CHLPS";
}

/**
 * Fetches all public programs from GET /programs/public.
 */
export async function fetchPublicPrograms(): Promise<ApiProgramItem[]> {
  const api = new ApiService();
  try {
    const res = await api.getData<unknown>(ApiUrls.publicPrograms);
    if (res.success && res.data) {
      const raw = res.data;
      if (Array.isArray(raw)) {
        return raw as ApiProgramItem[];
      }
      if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (Array.isArray(obj.data)) {
          return obj.data as ApiProgramItem[];
        }
        if (Array.isArray(obj.results)) {
          return obj.results as ApiProgramItem[];
        }
      }
    }
  } catch (error) {
    console.error("Error fetching public programs:", error);
  }
  return [];
}

/**
 * Fetches all public courses from GET /courses/public.
 */
export async function fetchPublicCourses(): Promise<ApiCourseItem[]> {
  const api = new ApiService();
  try {
    const res = await api.getData<unknown>(ApiUrls.publicCourses);
    if (res.success && res.data) {
      const raw = res.data;
      if (Array.isArray(raw)) {
        return raw as ApiCourseItem[];
      }
      if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (Array.isArray(obj.data)) {
          return obj.data as ApiCourseItem[];
        }
        if (Array.isArray(obj.results)) {
          return obj.results as ApiCourseItem[];
        }
      }
    }
  } catch (error) {
    console.error("Error fetching public courses:", error);
  }
  return [];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Converts a live API Program and associated Course into CertificationDetail.
 */
export function transformProgramToCertificationDetail(
  program: ApiProgramItem,
  course?: ApiCourseItem,
): CertificationDetail {
  const cleanTitle = (program.title || program.name || "Certification Program")
    .replace(/\s+/g, " ")
    .trim();

  const abbr = extractProgramAbbreviation(
    `${cleanTitle} ${course?.title || ""}`,
  );

  const lowerAbbr = abbr.toLowerCase();
  const fallbackBadge = BADGE_MAP[lowerAbbr] || Assets.images.certificates.clpa;

  // Use valid remote coverImage or fallback to high-res badge asset
  const badge =
    program.coverImage && program.coverImage.startsWith("http")
      ? program.coverImage
      : fallbackBadge;

  // Hero title
  const heroTitle = cleanTitle.toLowerCase().includes("certification")
    ? cleanTitle
    : `${cleanTitle} Certification`;

  // Hero body
  let heroBody = "";
  if (course?.shortDesc) {
    heroBody = stripHtml(course.shortDesc);
  } else if (program.description) {
    heroBody = stripHtml(program.description);
  } else if (course?.fullDesc) {
    heroBody = stripHtml(course.fullDesc).slice(0, 320) + "...";
  }

  // Card title
  const cardTitle = `${abbr} – ${cleanTitle.replace(/\s*\([^)]*\)/g, "").trim()}`;

  // Fee & Course ID
  const effectiveCourse = course || program.courses?.[0];
  const price = effectiveCourse?.price;
  const courseId = effectiveCourse?.id;
  const programId = program.id || (program as any)._id;

  const fee =
    typeof price === "number" && price > 0
      ? `CA $${price.toLocaleString()}`
      : "";
  const feeNow =
    typeof price === "number" && price > 0
      ? `One-time enrollment fee of CA $${price.toLocaleString()}`
      : "";
  const feeExpiry = "Accredited CHLPS Canada Professional Certification.";

  const enrollHref = `/dashboard/register?program=${programId}`;

  // Entry requirements
  const rawReqs =
    course?.entryRequirements && course.entryRequirements.length > 0
      ? course.entryRequirements
      : program.courses?.[0]?.entryRequirements &&
          program.courses[0].entryRequirements.length > 0
        ? program.courses[0].entryRequirements
        : [];

  const requirements = rawReqs.filter(Boolean);

  // Course outcomes
  const rawOutcomes =
    course?.courseOutcomes ??
    (course as any)?.outcomes ??
    program.courses?.[0]?.courseOutcomes ??
    (program.courses?.[0] as any)?.outcomes ??
    [];

  const sortedOutcomes = [...rawOutcomes].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  const courseOutcomes =
    sortedOutcomes.length > 0
      ? sortedOutcomes
          .map((o) => (typeof o === "string" ? o : o.description?.trim()))
          .filter(Boolean)
      : [];

  const modules = courseOutcomes;
  const studiesBadge = `${abbr} Course Outcomes:`;
  const studiesTitle = "Course Outcomes";

  // Outcome
  const outcomeBadge = `${abbr} Professional Certification`;
  const outcomeTitle = `${abbr} Professional\nCertification`;

  const outcomeBody = [
    `Congratulations on working toward the ${cleanTitle}. This recognized achievement demonstrates professional dedication, applied risk management proficiency, and operational excellence in modern loss prevention.`,
    `${abbr} certification holders gain enhanced professional credibility, access to elite industry networks, and a structured pathway toward senior and specialized designations.`,
  ];

  const outcomeImage =
    course?.coverImage && course.coverImage.startsWith("http")
      ? course.coverImage
      : Assets.images.clpaCertificate;

  // Benefits
  const rawBenefits =
    course?.certificationBenefits && course.certificationBenefits.length > 0
      ? course.certificationBenefits
      : program.courses?.[0]?.certificationBenefits &&
          program.courses[0].certificationBenefits.length > 0
        ? program.courses[0].certificationBenefits
        : [];

  const benefits = rawBenefits.filter(Boolean);

  return {
    id: programId,
    programId,
    courseId,
    price: typeof price === "number" ? price : undefined,
    abbr,
    badge,
    coverImage:
      program.coverImage && program.coverImage.startsWith("http")
        ? program.coverImage
        : effectiveCourse?.coverImage &&
            effectiveCourse.coverImage.startsWith("http")
          ? effectiveCourse.coverImage
          : undefined,
    bannerImage:
      effectiveCourse?.banner && effectiveCourse.banner.startsWith("http")
        ? effectiveCourse.banner
        : undefined,
    heroTitle,
    heroBody,
    cardTitle,
    fee,
    feeNow,
    feeExpiry,
    enrollHref,
    requirementsTitle: `Entry Requirements for the ${abbr} Certification`,
    requirements,
    studiesBadge,
    studiesTitle,
    modules,
    courseOutcomes,
    outcomeBadge,
    outcomeTitle,
    outcomeBody,
    outcomeImage,
    benefitsTitle: `Benefits of the ${abbr} Certification`,
    benefits,
    applicationQuestions: effectiveCourse?.applicationQuestions ?? [],
  };
}

/**
 * Fetches a single public program by ID from GET /programs/public/:id.
 */
export async function fetchPublicProgramById(
  id: string,
): Promise<ApiProgramItem | null> {
  if (!id) return null;
  const api = new ApiService();
  try {
    const res = await api.getData<unknown>(ApiUrls.publicProgram(id));
    if (res.success && res.data) {
      const raw = res.data;
      if (raw && typeof raw === "object") {
        const obj = raw as Record<string, unknown>;
        if (
          obj.data &&
          typeof obj.data === "object" &&
          !Array.isArray(obj.data)
        ) {
          return obj.data as unknown as ApiProgramItem;
        }
        return obj as unknown as ApiProgramItem;
      }
    }
  } catch (error) {
    console.error(`Error fetching public program by id ${id}:`, error);
  }
  return null;
}

/**
 * Fetches program by ID, slug, or acronym using the GET /programs/public/:id endpoint.
 */
export async function fetchProgramById(
  idOrSlug: string,
): Promise<CertificationDetail | null> {
  if (!idOrSlug) return null;

  const trimmed = idOrSlug.trim();

  // 1. Direct fetch using GET /programs/public/:id
  const directProgram = await fetchPublicProgramById(trimmed);
  if (directProgram && (directProgram.id || directProgram.title)) {
    return transformProgramToCertificationDetail(
      directProgram,
      directProgram.courses?.[0],
    );
  }

  // 2. If direct fetch didn't return a match (e.g. identifier is a slug or abbreviation),
  // search public programs list to resolve the ID, then fetch the program by ID.
  const target = trimmed.toLowerCase();
  const programs = await fetchPublicPrograms();

  const matched = programs.find((p) => {
    if (p.id?.toLowerCase() === target) return true;
    if (p.slug && p.slug.toLowerCase() === target) return true;
    if (slugify(p.title) === target) return true;
    const abbr = extractProgramAbbreviation(p.title);
    return abbr.toLowerCase() === target;
  });

  if (matched) {
    if (matched.courses && matched.courses.length > 0) {
      return transformProgramToCertificationDetail(matched, matched.courses[0]);
    }
    const fullProgram = await fetchPublicProgramById(matched.id);
    if (fullProgram) {
      return transformProgramToCertificationDetail(
        fullProgram,
        fullProgram.courses?.[0],
      );
    }
    return transformProgramToCertificationDetail(matched);
  }

  return null;
}
