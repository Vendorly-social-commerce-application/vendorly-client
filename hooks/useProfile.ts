import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { profileService } from "@/app/services/profile.service";
import {
  clearProfile,
  setError,
  setLoading,
  setProfile,
  setUpdating,
  updateProfile,
} from "@/redux/slices/profileSlice";
import {
  ChangePasswordData,
  UpdateCustomerProfileData,
  UpdateProfileData,
} from "@/types/profile";
import { toast } from "sonner";

const getProfileErrorMessage = (error: any, fallback: string) => {
  const status = error?.response?.status;

  if (status === 401) return "Please log in to continue";
  if (status === 403) return "You do not have access to this profile";
  if (status === 404) return "Profile not found";
  if (status === 409) return "This profile update conflicts with existing data";

  return error?.response?.data?.message || fallback;
};

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { profile, isLoading, isUpdating, error } = useSelector(
    (state: RootState) => state.profile,
  );
  const { user, isLoading: isAuthLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  const isCustomer = user?.role === "CUSTOMER";

  const handleProfileError = (error: any, fallback: string) => {
    const message = getProfileErrorMessage(error, fallback);
    dispatch(setError(message));
    toast.error(message);

    if (error?.response?.status === 401) {
      router.replace("/login");
    }

    return message;
  };

  const fetchProfile = async () => {
    if (!user) return;

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = isCustomer
        ? await profileService.getCustomerProfile()
        : await profileService.getProfile();

      dispatch(setProfile(data));
    } catch (error: any) {
      handleProfileError(error, "Failed to load profile");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateVendorProfile = async (
    data: UpdateProfileData | UpdateCustomerProfileData,
  ) => {
    try {
      dispatch(setUpdating(true));
      dispatch(setError(null));

      const updatedProfile = isCustomer
        ? await profileService.updateCustomerProfile(
            data as UpdateCustomerProfileData,
          )
        : await profileService.updateProfile(data as UpdateProfileData);

      dispatch(setProfile(updatedProfile));
      toast.success("Profile updated successfully");
      return updatedProfile;
    } catch (error: any) {
      handleProfileError(error, "Failed to update profile");
      throw error;
    } finally {
      dispatch(setUpdating(false));
    }
  };

  const changePassword = async (data: ChangePasswordData) => {
    try {
      dispatch(setUpdating(true));
      dispatch(setError(null));

      if (isCustomer) {
        await profileService.changeCustomerPassword(data);
      } else {
        await profileService.changePassword(data);
      }

      toast.success("Password changed successfully");
    } catch (error: any) {
      handleProfileError(error, "Failed to change password");
      throw error;
    } finally {
      dispatch(setUpdating(false));
    }
  };

  const uploadImage = async (file: File) => {
    try {
      dispatch(setUpdating(true));
      dispatch(setError(null));

      const { profileImage } = isCustomer
        ? await profileService.uploadCustomerProfileImage(file)
        : await profileService.uploadProfileImage(file);

      dispatch(updateProfile({ profileImage }));
      toast.success("Profile image updated");
      return profileImage;
    } catch (error: any) {
      handleProfileError(error, "Failed to upload image");
      throw error;
    } finally {
      dispatch(setUpdating(false));
    }
  };

  const handleClearProfile = () => {
    dispatch(clearProfile());
  };

  useEffect(() => {
    if (!isAuthLoading && user) {
      fetchProfile();
    }
  }, [isAuthLoading, user?.id, user?.role]);

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    fetchProfile,
    updateVendorProfile,
    changePassword,
    uploadImage,
    clearProfile: handleClearProfile,
  };
};
