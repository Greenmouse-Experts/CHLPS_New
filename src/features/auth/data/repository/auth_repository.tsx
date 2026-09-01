import ApiService from "@/lib/network/api";
import { ApiUrls } from "@/lib/network/api_url";
import { unwrapEntity, unwrapMessage } from "@/lib/tokens";
import {
  LoginPayload,
  RegisterPayload,
  ResetPasswordRequestPayload,
  UpdateProfilePayload,
} from "../payload/user.login";
import {
  LoginAccountResponse,
  LoginRawResponse,
  MessageApiResponse,
  AuthUser,
} from "../entities/user.account.completed";

class AuthenticationRepository {
  private _apiService = new ApiService();

  public async loginUser(data: LoginPayload): Promise<LoginAccountResponse> {
    const response = await this._apiService.postData<
      LoginPayload,
      LoginRawResponse
    >(ApiUrls.login, data);

    if (response.success && response.data?.accessToken && response.data.data) {
      return {
        status: 200,
        success: true,
        message: response.data.message || "Login successful",
        data: {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.data,
        },
      };
    }

    return {
      status: response.status ?? 400,
      success: false,
      message: response.message || "Login failed",
      data: null,
    };
  }

  public async registerUser(data: RegisterPayload): Promise<MessageApiResponse> {
    const response = await this._apiService.postData<
      RegisterPayload,
      { message?: string }
    >(ApiUrls.signup, data);

    return {
      status: response.success ? 200 : (response.status ?? 400),
      success: response.success,
      message: unwrapMessage(
        response.data,
        response.message ||
          (response.success
            ? "Account created. Please verify your email."
            : "Registration failed"),
      ),
      data: null,
    };
  }

  public async verifyEmail(token: string): Promise<MessageApiResponse> {
    const response = await this._apiService.getData<{ message?: string }>(
      ApiUrls.verifyEmail,
      undefined,
      { Authorization: `Bearer ${token}` } as never,
    );

    return {
      status: response.success ? 200 : (response.status ?? 400),
      success: response.success,
      message: unwrapMessage(
        response.data,
        response.message ||
          (response.success ? "Email verified" : "Verification failed"),
      ),
      data: null,
    };
  }

  public async requestPasswordReset(
    data: ResetPasswordRequestPayload,
  ): Promise<MessageApiResponse> {
    const response = await this._apiService.postData<
      ResetPasswordRequestPayload,
      { message?: string }
    >(ApiUrls.resetPasswordRequest, data);

    return {
      status: response.success ? 200 : (response.status ?? 400),
      success: response.success,
      message: unwrapMessage(
        response.data,
        response.message ||
          (response.success
            ? "If that email exists, a reset link has been sent."
            : "Request failed"),
      ),
      data: null,
    };
  }

  public async getProfile() {
    const response = await this._apiService.getData<unknown>(ApiUrls.profile);
    if (response.success && response.data) {
      return {
        status: 200,
        success: true,
        message: "Profile loaded",
        data: unwrapEntity<AuthUser>(response.data),
      };
    }
    return {
      status: response.status ?? 400,
      success: false,
      message: response.message || "Failed to load profile",
      data: null,
    };
  }

  public async updateProfile(payload: UpdateProfilePayload): Promise<MessageApiResponse> {
    const response = await this._apiService.postData<
      UpdateProfilePayload,
      { message?: string }
    >(ApiUrls.updateProfile, payload);
    return {
      status: response.success ? 200 : (response.status ?? 400),
      success: response.success,
      message: unwrapMessage(
        response.data,
        response.message || (response.success ? "Profile updated." : "Failed"),
      ),
      data: null,
    };
  }

  public async uploadImage(file: File) {
    const response = await this._apiService.postUploadFile<{
      image?: string;
      message?: string;
    }>(ApiUrls.uploadImage, file, "image");
    if (response.success && response.data?.image) {
      return {
        success: true,
        message: response.data.message || "Image uploaded",
        url: response.data.image,
      };
    }
    return {
      success: false,
      message: response.message || "Upload failed",
      url: null as string | null,
    };
  }
}

export default AuthenticationRepository;
