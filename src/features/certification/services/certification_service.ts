import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { Assets } from "@/lib/assets";
import type {
  CertificationDetail,
  CertificationProgram,
  CertificationCourse,
} from "@/features/certification/certification_details";
import simpleApiClient from "@/lib/network/simpleApi";

export interface ApiJobOpportunity {
  id?: string;
  title: string;
  description?: string;
  body?: string;
}

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
  certificationImage?: string | null;
  certificationText?: string | null;
  entryRequirements?: string[];
  applicationQuestions?: Array<{ id?: string; question: string }>;
  courseOutcomes?: ApiCourseOutcome[];
  jobOpportunities?: ApiJobOpportunity[];
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
  jobOpportunities?: ApiJobOpportunity[];
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
 * Extracts a "who is this for" audience list from a course description.
 * Matches a bolded/detached heading such as "Who Is X For?" followed by
 * either `*`/`-` bullet lines or an HTML `<ul>` list.
 */
export function extractAudience(description?: string): {
  title?: string;
  items: string[];
} {
  if (!description) return { items: [] };

  const headingMatch = description.match(
    /(?:<b>|<strong>|<h[1-6][^>]*>)?\s*(Who\s+Is[^<\n*\-]+?For\?)\s*(?:<\/b>|<\/strong>|<\/h[1-6]>)?/i,
  );
  if (!headingMatch) return { items: [] };

  const title = headingMatch[1].trim();
  const rest = description.slice(
    (headingMatch.index ?? 0) + headingMatch[0].length,
  );

  const items: string[] = [];

  // HTML list form
  const htmlItems = rest.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
  if (htmlItems && htmlItems.length > 0) {
    for (const li of htmlItems) {
      const text = stripHtml(li);
      if (text) items.push(text);
    }
    return items.length > 0 ? { title, items } : { items: [] };
  }

  // Plain-text `*` / `-` bullet form
  for (const line of rest.split(/\r?\n/)) {
    const text = line.replace(/^\s*[*\u2022-]\s*/, "").trim();
    if (!text) continue;
    if (/^[*\u2022-]/.test(line.trim())) {
      items.push(text);
    } else if (items.length > 0) {
      // Stop once bullets end and body prose resumes
      break;
    }
  }

  return items.length > 0 ? { title, items } : { items: [] };
}

export function cleanRichText(content?: string): string {
  if (!content) return "";
  let cleaned = content.trim();

  // Strip Figma metadata and buffer junk spans
  cleaned = cleaned.replace(
    /<span[^>]*data-(?:metadata|buffer)[^>]*>[\s\S]*?<\/span>/gi,
    "",
  );

  // Strip embedded <style> tags
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  // Strip obsolete <font> tags while preserving text content
  cleaned = cleaned.replace(/<\/?font[^>]*>/gi, "");

  // Strip hardcoded typography/colour inline styles from external pastes
  // (Figma, Word, Google Docs) so the page's own typography applies.
  cleaned = cleaned.replace(
    /style=(["'])(.*?)\1/gi,
    (_match, quote, styleContent) => {
      const filtered = styleContent
        .replace(
          /(?:^|;)\s*(?:color|background-color|font-size|font-family|line-height|white-space)\s*:[^;]*/gi,
          "",
        )
        .trim();
      return filtered ? `style=${quote}${filtered}${quote}` : "";
    },
  );

  return cleaned.trim();
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

  // Hero body (preserves rich text for modal view and clamped hero preview)
  const rawBody =
    course?.fullDesc?.trim() ||
    program.description?.trim() ||
    course?.shortDesc?.trim() ||
    "";
  const heroBody = cleanRichText(rawBody);

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

  const certificationImage =
    effectiveCourse?.certificationImage &&
    typeof effectiveCourse.certificationImage === "string" &&
    effectiveCourse.certificationImage.startsWith("http")
      ? effectiveCourse.certificationImage
      : undefined;

  const certificationText =
    typeof effectiveCourse?.certificationText === "string"
      ? effectiveCourse.certificationText
      : undefined;

  const outcomeImage =
    certificationImage ||
    (course?.coverImage && course.coverImage.startsWith("http")
      ? course.coverImage
      : Assets.images.clpaCertificate);

  // Benefits
  const rawBenefits =
    course?.certificationBenefits && course.certificationBenefits.length > 0
      ? course.certificationBenefits
      : program.courses?.[0]?.certificationBenefits &&
          program.courses[0].certificationBenefits.length > 0
        ? program.courses[0].certificationBenefits
        : [];

  const benefits = rawBenefits.filter(Boolean);

  // Career / Job Opportunities
  const rawJobs =
    course?.jobOpportunities && course.jobOpportunities.length > 0
      ? course.jobOpportunities
      : program.courses?.[0]?.jobOpportunities &&
          program.courses[0].jobOpportunities.length > 0
        ? program.courses[0].jobOpportunities
        : ((program as any)?.jobOpportunities ?? []);

  const jobOpportunities = Array.isArray(rawJobs)
    ? rawJobs
        .map((j: any) => ({
          id: j.id,
          title: (j.title || "").trim(),
          description: (j.description || j.body || "").trim(),
          body: (j.description || j.body || "").trim(),
        }))
        .filter((j: any) => Boolean(j.title))
    : [];

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
    certificationImage,
    certificationText,
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
    jobOpportunities,
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

export async function fetchCertificationBySlug(
  idOrSlug: string,
): Promise<CertificationDetail | null> {
  try {
    const resp = await simpleApiClient.get<CertificationProgram>(
      `/programs/public/slug/${idOrSlug}`,
    );
    const program = resp.data as unknown as CertificationProgram;
    if (!program || !program.id) return null;
    return transformProgramResponseToCertificationDetail(program);
  } catch (error) {
    console.error(`Error fetching certification by slug ${idOrSlug}:`, error);
    return null;
  }
}

/**
 * Maps a live public program response (GET /programs/public/slug/:slug) to the
 * flat CertificationDetail shape the certification details UI consumes.
 *
 * Unlike transformProgramToCertificationDetail, the raw response already nests
 * course-level fields directly under its single `courses[]` entry and exposes
 * no `courseOutcomes` array, so learning outcomes fall back to the section's
 * programme-specific defaults.
 */
export function transformProgramResponseToCertificationDetail(
  program: CertificationProgram,
): CertificationDetail {
  const course: CertificationCourse | undefined = program.courses?.[0];

  const cleanTitle = (program.title || course?.title || "Certification Program")
    .replace(/\s+/g, " ")
    .trim();

  const abbr = extractProgramAbbreviation(
    `${cleanTitle} ${course?.title || ""}`,
  );
  const lowerAbbr = abbr.toLowerCase();
  const fallbackBadge = BADGE_MAP[lowerAbbr] || Assets.images.certificates.clpa;

  const coverImage =
    program.coverImage && program.coverImage.startsWith("http")
      ? program.coverImage
      : course?.coverImage && course.coverImage.startsWith("http")
        ? course.coverImage
        : undefined;

  const badge = coverImage || fallbackBadge;

  const heroTitle = course?.title?.trim() || cleanTitle;

  const rawBody =
    course?.fullDesc?.trim() ||
    course?.shortDesc?.trim() ||
    program.description?.trim() ||
    "";
  const heroBody = cleanRichText(rawBody);

  const audience = extractAudience(course?.shortDesc);

  const cardTitle = `${abbr} – ${cleanTitle.replace(/\s*\([^)]*\)/g, "").trim()}`;

  const price = course?.price;
  const programId = program.id;
  const courseId = course?.id;

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

  const requirements = (course?.entryRequirements ?? []).filter(Boolean);

  const benefits = (course?.certificationBenefits ?? []).filter(Boolean);

  const certificationImage =
    course?.certificationImage &&
    typeof course.certificationImage === "string" &&
    course.certificationImage.startsWith("http")
      ? course.certificationImage
      : undefined;

  const certificationText =
    typeof course?.certificationText === "string"
      ? course.certificationText
      : undefined;

  const outcomeImage =
    certificationImage ||
    (course?.coverImage && course.coverImage.startsWith("http")
      ? course.coverImage
      : Assets.images.clpaCertificate);

  const jobOpportunities = (course?.jobOpportunities ?? [])
    .map((job) => ({
      id: job.id,
      title: (job.title || "").trim(),
      description: (job.description || job.body || "").trim(),
      body: (job.description || job.body || "").trim(),
    }))
    .filter((job) => Boolean(job.title));

  return {
    id: programId,
    programId,
    courseId,
    slug: program.slug,
    price: typeof price === "number" ? price : undefined,
    discount:
      typeof course?.discount === "number" ? course.discount : undefined,
    abbr,
    badge,
    coverImage,
    bannerImage:
      course?.banner && course.banner.startsWith("http")
        ? course.banner
        : undefined,
    certificationImage,
    certificationText,
    heroTitle,
    heroBody,
    cardTitle,
    fee,
    feeNow,
    feeExpiry,
    enrollHref,
    requirementsTitle: `Entry Requirements for the ${abbr} Certification`,
    requirements,
    audienceTitle: audience.title,
    audience: audience.items,
    studiesBadge: `${abbr} Course Outcomes:`,
    studiesTitle: "Course Outcomes",
    courseOutcomes: [],
    modules: [],
    outcomeBadge: `${abbr} Professional Certification`,
    outcomeTitle: `${abbr} Professional\nCertification`,
    outcomeBody: [],
    outcomeImage,
    benefitsTitle: `Benefits of the ${abbr} Certification`,
    benefits,
    jobOpportunities,
    applicationQuestions: course?.applicationQuestions ?? [],
  };
}
