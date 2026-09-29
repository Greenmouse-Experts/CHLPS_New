export type PublicFaq = {
  id: string;
  question: string;
  answer: string;
  order?: number;
};

/**
 * Fallback FAQs empty array. Live FAQs are populated dynamically from GET /faqs/published.
 */
export const FALLBACK_FAQS: PublicFaq[] = [];
