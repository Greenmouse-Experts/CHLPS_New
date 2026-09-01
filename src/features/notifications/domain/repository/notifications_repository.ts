import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { fail, ok } from "@/lib/network/entity/api_response";
import { unwrapMessage, unwrapPaged } from "@/lib/tokens";
import {
  NotificationItem,
  NotificationListResponse,
} from "../data/response/notifications_response";

class NotificationsRepository {
  private _api = new ApiService();

  public async getNotifications(
    tab: "read" | "unread",
    page = 1,
  ): Promise<NotificationListResponse> {
    const endpoint =
      tab === "unread" ? ApiUrls.notificationsUnread : ApiUrls.notificationsRead;
    const res = await this._api.getData<unknown>(endpoint, { page });
    if (res.success) return ok(unwrapPaged<NotificationItem>(res.data));
    return fail(res.message || "Failed to load notifications");
  }

  public async markAllRead() {
    const res = await this._api.patchData<undefined, { message?: string }>(
      ApiUrls.markAllNotificationsRead,
    );
    return {
      success: res.success,
      message: unwrapMessage(
        res.data,
        res.message || (res.success ? "All notifications marked as read" : "Failed"),
      ),
    };
  }

  public async markRead(id: string) {
    const res = await this._api.patchData<undefined, { message?: string }>(
      ApiUrls.markNotificationRead(id),
    );
    return { success: res.success, message: unwrapMessage(res.data, res.message || "") };
  }
}

export default NotificationsRepository;
