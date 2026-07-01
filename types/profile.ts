export interface VendorProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  profileImage?: string;
  storeName: string;
  storeSlug: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
  
  // Stats
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  profileImage?: string;
  role: "CUSTOMER";
  createdAt: string;
  updatedAt: string;
}

export type Profile = VendorProfile | CustomerProfile;

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  location?: string;
  storeName?: string;
  profileImage?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolderName?: string;
}

export interface UpdateCustomerProfileData {
  fullName?: string;
  phone?: string;
  location?: string;
  profileImage?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}
