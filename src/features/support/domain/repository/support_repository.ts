import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { fail, ok } from "@/lib/network/entity/api_response";
import { unwrapList, unwrapMessage } from "@/lib/tokens";
import {
  ContactPayload,
  FaqItem,
  FaqsApiResponse,
} from "../data/response/support_response";

class SupportRepository {
  private _api = new ApiService();

  public async getFaqs(): Promise<FaqsApiResponse> {
    const res = await this._api.getData<unknown>(ApiUrls.faqsPublished);
    if (res.success) return ok(unwrapList<FaqItem>(res.data));
    return fail(res.message || "Failed to load FAQs");
  }

  public async sendMessage(payload: ContactPayload) {
    const res = await this._api.postData<ContactPayload, { message?: string }>(
      ApiUrls.contactMe,
      payload,
    );
    return {
      success: res.success,
      message: unwrapMessage(
        res.data,
        res.message || (res.success ? "Message sent. We'll be in touch soon." : "Failed"),
      ),
    };
  }
}

export default SupportRepository;
