import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { fail, ok, ApiResponse } from "@/lib/network/entity/api_response";
import { unwrapList } from "@/lib/tokens";
import { Order, OrdersApiResponse } from "../data/response/orders_response";

class PurchaseHistoryRepository {
  private _api = new ApiService();

  public async getOrders(): Promise<OrdersApiResponse> {
    const res = await this._api.getData<unknown>(ApiUrls.studentTransactions);
    if (res.success) return ok(unwrapList<Order>(res.data));
    return fail(res.message || "Failed to load purchase history");
  }

  public async confirmOrder(
    thirdPartyRef: string,
  ): Promise<ApiResponse<unknown>> {
    const res = await this._api.postData<{}, unknown>(
      ApiUrls.ordersConfirm(thirdPartyRef),
      {},
    );
    if (res.success) return ok(res.data, res.message || "Payment confirmed");
    return fail(
      res.message || "Payment confirmation failed",
      res.status || 400,
    );
  }
}

export default PurchaseHistoryRepository;
