import { supabase } from "@/assets/supabase_client";
import { Property } from "@/types/property";

export interface WatchlistItem {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  property?: Property;
}

export class WatchlistService {
  /**
   * Add a property to user's watchlist
   */
  static async addToWatchlist(propertyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // Check if already in watchlist
      const { data: existing } = await supabase
        .from("favourites")
        .select("id")
        .eq("user_id", user.id)
        .eq("property_id", propertyId)
        .single();

      if (existing) {
        return { success: false, error: "Property already in watchlist" };
      }

      const { error } = await supabase.from("favourites").insert({
        user_id: user.id,
        property_id: propertyId,
      });

      if (error) {
        console.error("Error adding to watchlist:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      return { success: false, error: "Failed to add to watchlist" };
    }
  }

  /**
   * Remove a property from user's watchlist
   */
  static async removeFromWatchlist(
    propertyId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const { error } = await supabase
        .from("favourites")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId);

      if (error) {
        console.error("Error removing from watchlist:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      return { success: false, error: "Failed to remove from watchlist" };
    }
  }

  /**
   * Get user's watchlist
   */
  static async getWatchlist(): Promise<{ data: WatchlistItem[]; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { data: [], error: "User not authenticated" };
      }

      const { data, error } = await supabase
        .from("favourites")
        .select(
          `
          id,
          user_id,
          property_id,
          created_at,
          properties (
            id,
            title,
            description,
            price,
            location,
            property_type,
            use_type,
            is_for_sale,
            created_at,
            updated_at,
            property_images (
              id,
              image_url
            )
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching watchlist:", error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      return { data: [], error: "Failed to fetch watchlist" };
    }
  }

  /**
   * Check if a property is in user's watchlist
   */
  static async isInWatchlist(propertyId: string): Promise<{ isWatched: boolean; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { isWatched: false, error: "User not authenticated" };
      }

      const { data, error } = await supabase
        .from("favourites")
        .select("id")
        .eq("user_id", user.id)
        .eq("property_id", propertyId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = "not found"
        console.error("Error checking watchlist status:", error);
        return { isWatched: false, error: error.message };
      }

      return { isWatched: !!data };
    } catch (error) {
      console.error("Error checking watchlist status:", error);
      return { isWatched: false, error: "Failed to check watchlist status" };
    }
  }

  /**
   * Get watchlist count for user
   */
  static async getWatchlistCount(): Promise<{ count: number; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { count: 0, error: "User not authenticated" };
      }

      const { count, error } = await supabase
        .from("favourites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching watchlist count:", error);
        return { count: 0, error: error.message };
      }

      return { count: count || 0 };
    } catch (error) {
      console.error("Error fetching watchlist count:", error);
      return { count: 0, error: "Failed to fetch watchlist count" };
    }
  }
}
