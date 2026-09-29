export interface MemberTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  organization?: string;
  location?: string;
  rating: number;
  avatar: string;
  initials: string;
}

/**
 * Fallback testimonials matching published member testimonies.
 */
export const FALLBACK_TESTIMONIALS: MemberTestimonial[] = [];
