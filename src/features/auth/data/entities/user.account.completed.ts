import { ApiResponse } from "@/lib/network/entity/api_response";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  picture?: string | null;
  role: string;
  address?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  bio?: string | null;
  createdDate?: string | null;
}

export interface LoginRawResponse {
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  data?: AuthUser;
}

export interface LoginData {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export type LoginAccountResponse = ApiResponse<LoginData>;
export type MessageApiResponse = ApiResponse<null>;
