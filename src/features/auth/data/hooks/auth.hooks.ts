import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthenticationRepository from "../repository/auth_repository";
import {
  LoginPayload,
  RegisterPayload,
  ResetPasswordRequestPayload,
  UpdateProfilePayload,
} from "../payload/user.login";
import { AuthUser } from "../entities/user.account.completed";
import { updateUser, UserState } from "../../reducers/user_slice";
import { saveUserToDB } from "@/lib/storage/user_db";
import ApiService from "@/lib/network/api";
import { AppDispatch } from "@/lib/store/store";

export function useAuthHooks() {
  const authRepo = new AuthenticationRepository();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLoginUser = async (data: LoginPayload) => {
    try {
      setIsLoading(true);
      const res = await authRepo.loginUser(data);
      if (res.success && res.data) {
        const { user, accessToken, refreshToken } = res.data;

        if (user.role === "admin") {
          toast.error("Admin accounts must sign in through the admin portal.");
          return;
        }

        const userData: UserState = {
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          userRole: user.role,
          token: accessToken,
          refreshToken: refreshToken ?? "",
          phoneNumber: user.phone ?? "",
          avatar: user.picture ?? "",
          loginAt: new Date().toISOString(),
        };

        ApiService.setTokens(accessToken, refreshToken);
        dispatch(updateUser(userData));
        await saveUserToDB(userData);
        toast.success(res.message);
        router.replace("/dashboard");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Sorry, an error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterUser = async (data: RegisterPayload) => {
    try {
      setIsLoading(true);
      const res = await authRepo.registerUser(data);
      if (res.success) {
        toast.success(res.message);
        return true;
      }
      toast.error(res.message);
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Sorry, an error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (token: string) => {
    try {
      setIsLoading(true);
      const res = await authRepo.verifyEmail(token);
      if (res.success) {
        toast.success(res.message);
        return true;
      }
      toast.error(res.message);
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Sorry, an error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPasswordReset = async (
    data: ResetPasswordRequestPayload,
  ) => {
    try {
      setIsLoading(true);
      const res = await authRepo.requestPasswordReset(data);
      if (res.success) {
        toast.success(res.message);
        return true;
      }
      toast.error(res.message);
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Sorry, an error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const mapProfile = (profile: AuthUser): Partial<UserState> => ({
    userId: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    fullName: `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim(),
    userRole: profile.role,
    phoneNumber: profile.phone ?? "",
    avatar: profile.picture ?? "",
    address: profile.address ?? "",
    facebookUrl: profile.facebookUrl ?? "",
    twitterUrl: profile.twitterUrl ?? "",
    linkedinUrl: profile.linkedinUrl ?? "",
    bio: profile.bio ?? "",
    createdDate: profile.createdDate ?? "",
  });

  const handleLoadProfile = async () => {
    const res = await authRepo.getProfile();
    if (res.success && res.data) {
      const mapped = mapProfile(res.data);
      dispatch(updateUser(mapped));
      await saveUserToDB(mapped);
      return true;
    }
    return false;
  };

  const handleUpdateProfile = async (payload: UpdateProfilePayload) => {
    try {
      setIsLoading(true);
      const res = await authRepo.updateProfile(payload);
      if (res.success) {
        const mapped: Partial<UserState> = {};
        if (payload.firstName !== undefined) mapped.firstName = payload.firstName;
        if (payload.lastName !== undefined) mapped.lastName = payload.lastName;
        if (payload.firstName !== undefined || payload.lastName !== undefined) {
          mapped.fullName = `${payload.firstName ?? ""} ${payload.lastName ?? ""}`.trim();
        }
        if (payload.address !== undefined) mapped.address = payload.address;
        if (payload.facebookUrl !== undefined) mapped.facebookUrl = payload.facebookUrl;
        if (payload.twitterUrl !== undefined) mapped.twitterUrl = payload.twitterUrl;
        if (payload.linkedinUrl !== undefined) mapped.linkedinUrl = payload.linkedinUrl;
        if (payload.bio !== undefined) mapped.bio = payload.bio;
        if (payload.picture !== undefined) mapped.avatar = payload.picture;
        dispatch(updateUser(mapped));
        await saveUserToDB(mapped);
        toast.success(res.message);
        return true;
      }
      toast.error(res.message);
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Sorry, an error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async (file: File) => {
    const res = await authRepo.uploadImage(file);
    if (!res.success || !res.url) {
      toast.error(res.message);
      return null;
    }
    const updated = await handleUpdateProfile({ picture: res.url });
    return updated ? res.url : null;
  };

  return {
    handleLoginUser,
    handleRegisterUser,
    handleVerifyEmail,
    handleRequestPasswordReset,
    handleLoadProfile,
    handleUpdateProfile,
    handleUploadImage,
    isLoading,
    router,
  };
}
