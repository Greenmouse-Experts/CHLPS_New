import axios, { AxiosError, AxiosInstance, AxiosRequestHeaders } from "axios";
import { getUserFromDB, saveUserToDB, clearUserFromDB } from "../storage/user_db";
import { ApiUrls } from "./api_url";

const AUTH_PUBLIC_PATHS = [
  "/dashboard/sign-in",
  "/dashboard/register",
  "/dashboard/verify",
  "/dashboard/reset-password",
];

class ApiService {
  private axiosInstance: AxiosInstance;
  private readonly baseURL: string =
    process.env.NEXT_PUBLIC_BASE_URL ??
    "https://chlps-backend.onrender.com/api/v1";
  private static sharedToken = "";
  private static sharedRefreshToken = "";
  private static refreshing: Promise<string | null> | null = null;
  private userToken = "";

  constructor(timeout = 30000) {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout,
    });

    this.setAuthHeader();
    this.setResponseInterceptor();
    this.initialize();
  }

  public static setTokens(token: string, refreshToken?: string) {
    ApiService.sharedToken = token;
    if (refreshToken !== undefined) {
      ApiService.sharedRefreshToken = refreshToken;
    }
  }

  public static clearTokens() {
    ApiService.sharedToken = "";
    ApiService.sharedRefreshToken = "";
  }

  private async initialize() {
    if (typeof window === "undefined") return;

    try {
      const users = await getUserFromDB();
      const user = users[0] ?? null;
      this.userToken = user?.token ?? "";
      ApiService.sharedToken = user?.token ?? "";
      ApiService.sharedRefreshToken = user?.refreshToken ?? "";
    } catch (error) {
      console.error("Error fetching user token:", error);
    }
  }

  private setAuthHeader() {
    this.axiosInstance.interceptors.request.use(async (config) => {
      if (!this.userToken && typeof window !== "undefined") {
        try {
          const users = await getUserFromDB();
          this.userToken = users[0]?.token ?? "";
          ApiService.sharedToken = this.userToken;
          ApiService.sharedRefreshToken =
            users[0]?.refreshToken ?? ApiService.sharedRefreshToken;
        } catch {
          /* ignore */
        }
      }

      const token = this.userToken || ApiService.sharedToken;
      if (token && !config.headers?.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  private setResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const original = error.config as
          | (typeof error.config & { _retry?: boolean })
          | undefined;

        if (
          error.response?.status === 401 &&
          original &&
          !original._retry &&
          typeof window !== "undefined" &&
          !AUTH_PUBLIC_PATHS.some((path) =>
            window.location.pathname.startsWith(path),
          )
        ) {
          original._retry = true;
          const nextToken = await ApiService.refreshAccessToken();
          if (nextToken) {
            this.userToken = nextToken;
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${nextToken}`;
            return this.axiosInstance(original);
          }

          await clearUserFromDB();
          ApiService.clearTokens();
          window.location.href = "/dashboard/sign-in";
        }

        return Promise.reject(error);
      },
    );
  }

  private static async refreshAccessToken(): Promise<string | null> {
    if (ApiService.refreshing) return ApiService.refreshing;

    ApiService.refreshing = (async () => {
      try {
        let refreshToken = ApiService.sharedRefreshToken;
        if (!refreshToken && typeof window !== "undefined") {
          const users = await getUserFromDB();
          refreshToken = users[0]?.refreshToken ?? "";
        }
        if (!refreshToken) return null;

        const baseURL =
          process.env.NEXT_PUBLIC_BASE_URL ??
          "https://chlps-backend.onrender.com/api/v1";
        const { data } = await axios.post(`${baseURL}${ApiUrls.refresh}`, {
          refreshToken,
        });

        const payload = data?.data ?? data;
        const accessToken: string | undefined =
          payload?.accessToken ?? data?.accessToken;
        const nextRefresh: string | undefined =
          payload?.refreshToken ?? data?.refreshToken ?? refreshToken;

        if (!accessToken) return null;

        ApiService.setTokens(accessToken, nextRefresh);
        await saveUserToDB({ token: accessToken, refreshToken: nextRefresh });
        return accessToken;
      } catch {
        return null;
      } finally {
        ApiService.refreshing = null;
      }
    })();

    return ApiService.refreshing;
  }

  private handleError<T>(error: unknown): {
    success: boolean;
    data: T | null;
    message?: string;
    status?: number;
  } {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Unknown error",
      status: axiosError.response?.status,
      data: (axiosError.response?.data as T) ?? null,
    };
  }

  public async getData<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    headers?: AxiosRequestHeaders,
  ): Promise<{
    success: boolean;
    data: T | null;
    message?: string;
    status?: number;
  }> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint, {
        params,
        headers,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching data", error);
      return this.handleError<T>(error);
    }
  }

  public async postData<T, R>(
    endpoint: string,
    data?: T,
    headers?: AxiosRequestHeaders,
  ): Promise<{
    success: boolean;
    data: R | null;
    message?: string;
    status?: number;
  }> {
    try {
      const response = await this.axiosInstance.post<R>(endpoint, data, {
        headers,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error posting data", error);
      return this.handleError<R>(error);
    }
  }

  public async putData<T, R>(
    endpoint: string,
    data?: T,
    headers?: AxiosRequestHeaders,
  ): Promise<{
    success: boolean;
    data: R | null;
    message?: string;
    status?: number;
  }> {
    try {
      const response = await this.axiosInstance.put<R>(endpoint, data, {
        headers,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error updating data", error);
      return this.handleError<R>(error);
    }
  }

  public async patchData<T, R>(
    endpoint: string,
    data?: T,
    headers?: AxiosRequestHeaders,
  ): Promise<{
    success: boolean;
    data: R | null;
    message?: string;
    status?: number;
  }> {
    try {
      const response = await this.axiosInstance.patch<R>(endpoint, data, {
        headers,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error patching data", error);
      return this.handleError<R>(error);
    }
  }

  public async postUploadFile<R>(
    endpoint: string,
    file: File,
    fileName: string,
    extraData?: Record<string, unknown>,
  ): Promise<{
    success: boolean;
    data: R | null;
    message?: string;
    status?: number;
  }> {
    try {
      const formData = new FormData();
      formData.append(fileName, file);
      if (extraData) {
        Object.entries(extraData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
      }
      const response = await this.axiosInstance.post<R>(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error uploading file", error);
      return this.handleError<R>(error);
    }
  }
}

export default ApiService;
