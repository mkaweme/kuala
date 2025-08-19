export type ProfileType = "tenant" | "landlord" | "agent";

export interface UserProfile {
  id: string;
  userId: string;
  profileType: ProfileType;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  // Tenant/Buyer preferences
  budget?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  propertyType?: string[];
  bedrooms?: {
    min?: number;
    max?: number;
  };
  location?: string[];

  // Landlord/Seller preferences
  properties?: string[];

  // Agent preferences
  licenseNumber?: string;
  agency?: string;
  specializations?: string[];
  experience?: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  profile?: UserProfile;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface ResetPasswordData {
  email: string;
}
