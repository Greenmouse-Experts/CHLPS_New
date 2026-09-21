import SupportRepository from "@/features/support/domain/repository/support_repository";
import type { PublicFaq } from "@/features/faq/faq_data";

/**
 * Fetches published FAQs from GET /faqs/published, ordered for display.
 * Returns an empty array on failure so callers can fall back gracefully.
 */
export async function fetchPublishedFaqs(): Promise<PublicFaq[]> {
  try {
    const res = await new SupportRepository().getFaqs();
    const items = res.data ?? [];

    return items
      .filter((item) => Boolean(item.question && item.answer))
      .map((item, index) => ({
        id: String(item.id || index),
        question: item.question,
        answer: item.answer,
        order: item.order ?? index,
      }))
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error fetching published FAQs from API:", error);
    return [];
  }
}
