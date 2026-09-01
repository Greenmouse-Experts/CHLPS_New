export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface ResetPasswordRequestPayload {
  email: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  picture?: string;
  address?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  bio?: string;
}
