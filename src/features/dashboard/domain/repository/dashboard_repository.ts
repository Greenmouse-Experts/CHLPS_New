import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { fail, ok } from "@/lib/network/entity/api_response";
import { unwrapEntity, unwrapList } from "@/lib/tokens";
import {
  ActivityApiResponse,
  ActivityItem,
  AnalyticsApiResponse,
  AnalyticsData,
} from "../data/response/dashboard_response";

class DashboardRepository {
  private _api = new ApiService();

  public async getAnalytics(): Promise<AnalyticsApiResponse> {
    const res = await this._api.getData<AnalyticsData>(ApiUrls.analytics);
    if (res.success && res.data) {
      return ok(
        unwrapEntity<AnalyticsData>(res.data) ?? res.data,
        "Analytics loaded",
      );
    }
    return fail(res.message || "Failed to load analytics");
  }

  public async getActivityTimeline(): Promise<ActivityApiResponse> {
    const res = await this._api.getData<unknown>(ApiUrls.activityTimeline);
    if (res.success) {
      return ok(unwrapList<ActivityItem>(res.data), "Activity loaded");
    }
    return fail(res.message || "Failed to load activity");
  }
}

export default DashboardRepository;
