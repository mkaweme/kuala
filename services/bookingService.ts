import { supabase } from "@/assets/supabase_client";

export interface ViewingBooking {
  id: string;
  property_id: string;
  client_id: string;
  scheduled_at: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
  property?: {
    id: string;
    title: string;
    location: string;
    owner_id: string;
  };
  client?: {
    id: string;
    full_name: string;
    phone?: string;
    email?: string;
  };
}

export interface CreateViewingRequest {
  property_id: string;
  scheduled_at: string;
  client_message?: string;
}

export class BookingService {
  /**
   * Create a new viewing booking
   */
  static async createViewing(
    request: CreateViewingRequest,
  ): Promise<{ success: boolean; data?: ViewingBooking; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // Check if user already has a pending booking for this property
      const { data: existingBooking } = await supabase
        .from("viewings")
        .select("id")
        .eq("property_id", request.property_id)
        .eq("client_id", user.id)
        .eq("status", "pending")
        .single();

      if (existingBooking) {
        return {
          success: false,
          error: "You already have a pending viewing request for this property",
        };
      }

      const { data, error } = await supabase
        .from("viewings")
        .insert({
          property_id: request.property_id,
          client_id: user.id,
          scheduled_at: request.scheduled_at,
          status: "pending",
        })
        .select(
          `
          *,
          property:properties(id, title, location, owner_id),
          client:profiles!viewings_client_id_fkey(id, full_name, phone)
        `,
        )
        .single();

      if (error) {
        console.error("Error creating viewing:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error creating viewing:", error);
      return { success: false, error: "Failed to create viewing request" };
    }
  }

  /**
   * Get user's viewing bookings
   */
  static async getUserViewings(): Promise<{ data: ViewingBooking[]; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { data: [], error: "User not authenticated" };
      }

      const { data, error } = await supabase
        .from("viewings")
        .select(
          `
          *,
          property:properties(id, title, location, owner_id),
          client:profiles!viewings_client_id_fkey(id, full_name, phone)
        `,
        )
        .eq("client_id", user.id)
        .order("scheduled_at", { ascending: true });

      if (error) {
        console.error("Error fetching viewings:", error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error("Error fetching viewings:", error);
      return { data: [], error: "Failed to fetch viewings" };
    }
  }

  /**
   * Get property owner's viewing requests
   */
  static async getPropertyOwnerViewings(): Promise<{ data: ViewingBooking[]; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { data: [], error: "User not authenticated" };
      }

      const { data, error } = await supabase
        .from("viewings")
        .select(
          `
          *,
          property:properties(id, title, location, owner_id),
          client:profiles!viewings_client_id_fkey(id, full_name, phone, email)
        `,
        )
        .eq("property.owner_id", user.id)
        .order("scheduled_at", { ascending: true });

      if (error) {
        console.error("Error fetching property owner viewings:", error);
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      console.error("Error fetching property owner viewings:", error);
      return { data: [], error: "Failed to fetch viewings" };
    }
  }

  /**
   * Update viewing status (confirm/cancel/complete)
   */
  static async updateViewingStatus(
    viewingId: string,
    status: "confirmed" | "cancelled" | "completed",
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // Verify user owns the property
      const { data: viewing } = await supabase
        .from("viewings")
        .select(
          `
          *,
          property:properties(owner_id)
        `,
        )
        .eq("id", viewingId)
        .single();

      if (!viewing || viewing.property.owner_id !== user.id) {
        return { success: false, error: "Unauthorized to update this viewing" };
      }

      const { error } = await supabase
        .from("viewings")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", viewingId);

      if (error) {
        console.error("Error updating viewing status:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating viewing status:", error);
      return { success: false, error: "Failed to update viewing status" };
    }
  }

  /**
   * Cancel a viewing booking (client can cancel their own booking)
   */
  static async cancelViewing(viewingId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // Verify user owns the booking
      const { data: viewing } = await supabase
        .from("viewings")
        .select("client_id, status")
        .eq("id", viewingId)
        .single();

      if (!viewing || viewing.client_id !== user.id) {
        return { success: false, error: "Unauthorized to cancel this viewing" };
      }

      if (viewing.status === "cancelled") {
        return { success: false, error: "Viewing is already cancelled" };
      }

      const { error } = await supabase
        .from("viewings")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", viewingId);

      if (error) {
        console.error("Error cancelling viewing:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error cancelling viewing:", error);
      return { success: false, error: "Failed to cancel viewing" };
    }
  }

  /**
   * Get viewing details by ID
   */
  static async getViewingDetails(
    viewingId: string,
  ): Promise<{ data?: ViewingBooking; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { error: "User not authenticated" };
      }

      const { data, error } = await supabase
        .from("viewings")
        .select(
          `
          *,
          property:properties(id, title, location, owner_id),
          client:profiles!viewings_client_id_fkey(id, full_name, phone, email)
        `,
        )
        .eq("id", viewingId)
        .single();

      if (error) {
        console.error("Error fetching viewing details:", error);
        return { error: error.message };
      }

      // Check if user has permission to view this booking
      if (data.client_id !== user.id && data.property.owner_id !== user.id) {
        return { error: "Unauthorized to view this booking" };
      }

      return { data };
    } catch (error) {
      console.error("Error fetching viewing details:", error);
      return { error: "Failed to fetch viewing details" };
    }
  }

  /**
   * Get pending viewing count for property owner
   */
  static async getPendingViewingsCount(): Promise<{ count: number; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { count: 0, error: "User not authenticated" };
      }

      const { count, error } = await supabase
        .from("viewings")
        .select("*", { count: "exact", head: true })
        .eq("property.owner_id", user.id)
        .eq("status", "pending");

      if (error) {
        console.error("Error fetching pending viewings count:", error);
        return { count: 0, error: error.message };
      }

      return { count: count || 0 };
    } catch (error) {
      console.error("Error fetching pending viewings count:", error);
      return { count: 0, error: "Failed to fetch pending viewings count" };
    }
  }
}
