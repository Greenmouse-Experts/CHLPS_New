import { ApiResponse } from "@/lib/network/entity/api_response";
import { Course } from "@/features/courses/domain/data/response/courses_response";

export interface OrderTransaction {
  id: string;
  reference?: string;
  thirdPartyRef?: string;
  status: string;
  amount: number;
  subAmount?: number;
  gateway?: string;
  sessionId?: string;
  createdDate?: string;
}

export interface OrderItem {
  id: string;
  price?: number;
  course?: Course | null;
  membership?: {
    id: string;
    name: string;
    slug?: string;
    price?: number;
  } | null;
}

export interface Order {
  id: string;
  number: string;
  status: string;
  createdDate: string;
  trx: OrderTransaction;
  orderItems: OrderItem[];
}

export type OrdersApiResponse = ApiResponse<Order[]>;
