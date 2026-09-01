import { ApiResponse } from "@/lib/network/entity/api_response";

export interface AnalyticsData {
  subscribedPrograms?: number;
  totalCourses?: number;
  completedCourses?: number;
}

export type AnalyticsApiResponse = ApiResponse<AnalyticsData>;

export type ActivityType =
  | "payment"
  | "assessment"
  | "order_confirmed"
  | "order_created"
  | "certificate"
  | string;

export interface ActivityItem {
  type: ActivityType;
  title: string;
  description?: string;
  amount?: number;
  timestamp: string;
}

export type ActivityApiResponse = ApiResponse<ActivityItem[]>;
