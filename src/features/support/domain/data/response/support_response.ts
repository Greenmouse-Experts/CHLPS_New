import { ApiResponse } from "@/lib/network/entity/api_response";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export type FaqsApiResponse = ApiResponse<FaqItem[]>;
