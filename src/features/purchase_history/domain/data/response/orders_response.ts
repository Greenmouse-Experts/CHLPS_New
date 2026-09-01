import { ApiResponse } from "@/lib/network/entity/api_response";
import { Course } from "@/features/courses/domain/data/response/courses_response";

export interface OrderTransaction {
  id: string;
  reference?: string;
  status: string;
  amount: number;
  createdDate?: string;
}

export interface OrderItem {
  id: string;
  price?: number;
  course: Course;
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
