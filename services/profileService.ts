import { supabase } from "@/assets/supabase_client";
import { ProfileType, UserPreferences, UserProfile } from "@/types/auth";

export interface ProfileData {
  id?: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone?: string;
  bio?: string;
  location?: string;
  role: ProfileType;
  preferences?: UserPreferences;
  avatar_url?: string;
}

export class ProfileService {
  /**
   * Get user profile by user ID
   */
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Transform database data to UserProfile format
      return {
        id: data.id,
        userId: data.id,
        profileType: data.role as ProfileType,
        firstName: data.first_name || "",
        middleName: data.middle_name || "",
        lastName: data.last_name || "",
        phone: data.phone || "",
        avatar: data.avatar_url || "",
        bio: data.bio || "",
        location: data.location || "",
        preferences: data.preferences || {},
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error in getProfile:", error);
      return null;
    }
  }

  /**
   * Create or update user profile
   */
  static async upsertProfile(profileData: ProfileData): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: profileData.id,
            first_name: profileData.first_name,
            middle_name: profileData.middle_name,
            last_name: profileData.last_name,
            phone: profileData.phone,
            bio: profileData.bio,
            location: profileData.location,
            role: profileData.role,
            preferences: profileData.preferences || {},
            avatar_url: profileData.avatar_url,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          },
        )
        .select()
        .single();

      if (error) {
        console.error("Error upserting profile:", error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Transform database data to UserProfile format
      return {
        id: data.id,
        userId: data.id,
        profileType: data.role as ProfileType,
        firstName: data.first_name || "",
        middleName: data.middle_name || "",
        lastName: data.last_name || "",
        phone: data.phone || "",
        avatar: data.avatar_url || "",
        bio: data.bio || "",
        location: data.location || "",
        preferences: data.preferences || {},
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error in upsertProfile:", error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(profileData: ProfileData): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: profileData.first_name,
          middle_name: profileData.middle_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          bio: profileData.bio,
          location: profileData.location,
          role: profileData.role,
          preferences: profileData.preferences || {},
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileData.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.id,
        profileType: data.role as ProfileType,
        firstName: data.first_name || "",
        middleName: data.middle_name || "",
        lastName: data.last_name || "",
        phone: data.phone || "",
        avatar: data.avatar_url || "",
        bio: data.bio || "",
        location: data.location || "",
        preferences: data.preferences || {},
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error in updateProfile:", error);
      return null;
    }
  }

  /**
   * Create initial profile for new user
   */
  static async createInitialProfile(userId: string, email: string): Promise<UserProfile | null> {
    try {
      const firstName = email.split("@")[0];

      const profileData: ProfileData = {
        id: userId,
        first_name: firstName,
        middle_name: "",
        last_name: "",
        role: "tenant",
        preferences: {},
      };

      return await this.upsertProfile(profileData);
    } catch (error) {
      console.error("Error in createInitialProfile:", error);
      return null;
    }
  }

  /**
   * Update profile preferences
   */
  static async updatePreferences(userId: string, preferences: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          preferences,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating preferences:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in updatePreferences:", error);
      return false;
    }
  }

  /**
   * Update profile avatar
   */
  static async updateAvatar(userId: string, avatarUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) {
        console.error("Error updating avatar:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in updateAvatar:", error);
      return false;
    }
  }
}
