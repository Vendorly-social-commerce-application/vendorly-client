import axiosInstance from "@/lib/axios";
import {
  CustomerProfile,
  VendorProfile,
  UpdateCustomerProfileData,
  UpdateProfileData,
  ChangePasswordData,
} from "@/types/profile";

export const profileService = {
  // Get vendor profile
  getProfile: async (): Promise<VendorProfile> => {
    const response = await axiosInstance.get<VendorProfile>("/profile");
    return response.data;
  },

  getCustomerProfile: async (): Promise<CustomerProfile> => {
    const response = await axiosInstance.get<CustomerProfile>(
      "/customers/me/profile",
    );
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData): Promise<VendorProfile> => {
    const response = await axiosInstance.patch<VendorProfile>("/profile", data);
    return response.data;
  },

  updateCustomerProfile: async (
    data: UpdateCustomerProfileData,
  ): Promise<CustomerProfile> => {
    const response = await axiosInstance.patch<CustomerProfile>(
      "/customers/me/profile",
      data,
    );
    return response.data;
  },

  // Change password
changePassword: async (
  data: ChangePasswordData,
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.post("/profile/change-password", data);
    return response.data;
  } catch (error: any) {
    console.log("Change password error:", error.response?.data); // 👈 see backend error
    throw error;
  }
},

  changeCustomerPassword: async (
    data: ChangePasswordData,
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.post("/customers/me/change-password", {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (file: File): Promise<{ profileImage: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axiosInstance.post(
      "/profile/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  uploadCustomerProfileImage: async (
    file: File,
  ): Promise<{ profileImage: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axiosInstance.post(
      "/customers/me/profile/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // Get public store info by slug
  getStoreBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`/profile/store/${slug}`);
    return response.data;
  },
};
