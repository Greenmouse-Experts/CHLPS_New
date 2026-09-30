"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import AuthenticationRepository from "../repository/auth_repository";
import {
  LoginPayload,
  RegisterPayload,
  ResetPasswordRequestPayload,
  UpdateProfilePayload,
} from "../payload/user.login";
import { updateUser, UserState } from "../../reducers/user_slice";
import { AuthUser } from "../entities/user.account.completed";
import { saveUserToDB } from "@/lib/storage/user_db";

export function useAuthHooks() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const authRepo = new AuthenticationRepository();

  const handleLoginUser = async (data: LoginPayload) => {
    try {
      setIsLoading(true);
      const res = await authRepo.loginUser(data);
      if (res.success && res.data) {
        const u = res.data.user;
        const mapped: Partial<UserState> = {
          email: u.email,
          fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
          firstName: u.firstName,
          lastName: u.lastName,
          userRole: u.role,
          token: res.data.accessToken,
          refreshToken: res.data.refreshToken,
          userId: u.id,
          phoneNumber: u.phone ?? "",
          avatar: u.picture ?? "",
          address: u.address ?? "",
          placeOfWork: u.placeOfWork ?? "",
          officialDesignation: u.officialDesignation ?? "",
          currentEducationOrProfessionalQualification:
            u.currentEducationOrProfessionalQualification ?? "",
          country: u.country ?? "",
          stateProvince: u.stateProvince ?? "",
          facebookUrl: u.facebookUrl ?? "",
          twitterUrl: u.twitterUrl ?? "",
          linkedinUrl: u.linkedinUrl ?? "",
          bio: u.bio ?? "",
          createdDate: u.createdDate ?? "",
          loginAt: new Date().toISOString(),
        };

        dispatch(updateUser(mapped));
        await saveUserToDB(mapped);
        toast.success(res.message);
        router.push("/dashboard");
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
    placeOfWork: profile.placeOfWork ?? "",
    officialDesignation: profile.officialDesignation ?? "",
    currentEducationOrProfessionalQualification:
      profile.currentEducationOrProfessionalQualification ?? "",
    country: profile.country ?? "",
    stateProvince: profile.stateProvince ?? "",
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
        if (payload.firstName !== undefined)
          mapped.firstName = payload.firstName;
        if (payload.lastName !== undefined) mapped.lastName = payload.lastName;
        if (payload.firstName !== undefined || payload.lastName !== undefined) {
          mapped.fullName =
            `${payload.firstName ?? ""} ${payload.lastName ?? ""}`.trim();
        }
        if (payload.phone !== undefined) mapped.phoneNumber = payload.phone;
        if (payload.address !== undefined) mapped.address = payload.address;
        if (payload.placeOfWork !== undefined)
          mapped.placeOfWork = payload.placeOfWork;
        if (payload.officialDesignation !== undefined)
          mapped.officialDesignation = payload.officialDesignation;
        if (payload.currentEducationOrProfessionalQualification !== undefined)
          mapped.currentEducationOrProfessionalQualification =
            payload.currentEducationOrProfessionalQualification;
        if (payload.country !== undefined) mapped.country = payload.country;
        if (payload.stateProvince !== undefined)
          mapped.stateProvince = payload.stateProvince;
        if (payload.facebookUrl !== undefined)
          mapped.facebookUrl = payload.facebookUrl;
        if (payload.twitterUrl !== undefined)
          mapped.twitterUrl = payload.twitterUrl;
        if (payload.linkedinUrl !== undefined)
          mapped.linkedinUrl = payload.linkedinUrl;
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
