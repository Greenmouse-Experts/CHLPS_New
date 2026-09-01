import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { fail, ok } from "@/lib/network/entity/api_response";
import { unwrapList } from "@/lib/tokens";
import { Order, OrdersApiResponse } from "../data/response/orders_response";

class PurchaseHistoryRepository {
  private _api = new ApiService();

  public async getOrders(): Promise<OrdersApiResponse> {
    const res = await this._api.getData<unknown>(ApiUrls.studentTransactions);
    if (res.success) return ok(unwrapList<Order>(res.data));
    return fail(res.message || "Failed to load purchase history");
  }
}

export default PurchaseHistoryRepository;
