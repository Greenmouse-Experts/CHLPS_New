import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "sub-admin" | "instructor" | "student" | string;

export interface UserState {
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  userRole?: UserRole | null;
  token?: string;
  refreshToken?: string;
  userId?: string;
  loginAt?: string | null;
  phoneNumber?: string | null;
  avatar?: string | null;
  address?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  bio?: string | null;
  createdDate?: string | null;
}

const initialState: UserState = {
  fullName: "",
  firstName: "",
  lastName: "",
  email: "",
  userId: "",
  userRole: "",
  token: "",
  refreshToken: "",
  phoneNumber: "",
  avatar: "",
  loginAt: null,
  address: "",
  facebookUrl: "",
  twitterUrl: "",
  linkedinUrl: "",
  bio: "",
  createdDate: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    resetUser: () => initialState,
  },
});

export const { updateUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
