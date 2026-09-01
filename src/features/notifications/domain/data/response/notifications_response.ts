import { ApiResponse } from "@/lib/network/entity/api_response";
import { Paged } from "@/features/courses/domain/data/response/courses_response";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdDate: string;
}

export type NotificationListResponse = ApiResponse<Paged<NotificationItem>>;
