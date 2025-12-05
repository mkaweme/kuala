import { CreateListingForm } from "@/app/(tabs)/createListing";
import { supabase } from "@/assets/supabase_client";
import { ListingType, PropertyType } from "@/types";

export interface CreatePropertyData {
  title: string;
  description?: string;
  price: number;
  location: string;
  property_type: PropertyType;
  use_type: "residential" | "commercial";
  is_for_sale: boolean;
  // Additional fields that might be stored as JSON or in separate tables
  area?: string;
  town?: string;
  rate?: string;
  listing?: ListingType;
  features?: string[];
  // Property type specific fields (can be stored as JSON)
  property_details?: Record<string, string>;
}

export interface UpdatePropertyData {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  property_type?: PropertyType;
  use_type?: "residential" | "commercial";
  is_for_sale?: boolean;
  area?: string;
  town?: string;
  rate?: string;
  listing?: ListingType;
  features?: string[];
  property_details?: Record<string, any>;
}

export interface Property {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  property_type: PropertyType;
  use_type: "residential" | "commercial";
  is_for_sale: boolean;
  created_at: string;
  updated_at: string;
}

export class PropertyService {
  /**
   * Add a new property
   * Sets the owner_id to the current authenticated user
   */
  static async addProperty(
    propertyData: CreateListingForm,
  ): Promise<{ success: boolean; data?: Property; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // Check if user has landlord or agent role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || (profile.role !== "landlord" && profile.role !== "agent")) {
        return {
          success: false,
          error: "Only landlords and agents can create properties",
        };
      }

      const { data, error } = await supabase
        .from("properties")
        .insert({
          owner_id: user.id,
          title: propertyData.title,
          description: propertyData.description || null,
          area: propertyData.area,
          town: propertyData.town,
          price: propertyData.price,
          rate: propertyData.rate,
          listing: propertyData.listing,
          property_type: propertyData.propertyType,
          photos: propertyData.photos,
          features: propertyData.features,
          no_of_bedrooms: propertyData.noOfBedrooms,
          no_of_bathrooms: propertyData.noOfBathrooms,
          square_meters: propertyData.squareMeters,
          has_garden: propertyData.hasGarden,
          has_parking: propertyData.hasParking,
          floor_number: propertyData.floorNumber,
          has_reception: propertyData.hasReception,
          has_meeting_rooms: propertyData.hasMeetingRooms,
          parking_spaces: propertyData.parkingSpaces,
          zoning: propertyData.zoning,
          has_utilities: propertyData.hasUtilities,
          road_access: propertyData.roadAccess,
          terrain: propertyData.terrain,
          acreage: propertyData.acreage,
          has_water: propertyData.hasWater,
          soil_type: propertyData.soilType,
          has_buildings: propertyData.hasBuildings,
          agricultural_use: propertyData.agriculturalUse,
          ceiling_height: propertyData.ceilingHeight,
          loading_dock: propertyData.loadingDock,
          has_office_space: propertyData.hasOfficeSpace,
          has_security: propertyData.hasSecurity,
          location: propertyData.location,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating property:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error in addProperty:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create property",
      };
    }
  }

  /**
   * Update an existing property
   * Only the creator (owner) can update the property
   */
  static async updateProperty(
    propertyId: string,
    propertyData: UpdatePropertyData,
  ): Promise<{ success: boolean; data?: Property; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // First, verify the property exists and get its owner_id
      const { data: existingProperty, error: fetchError } = await supabase
        .from("properties")
        .select("owner_id")
        .eq("id", propertyId)
        .single();

      if (fetchError || !existingProperty) {
        return { success: false, error: "Property not found" };
      }

      // Check if the current user is the owner
      if (existingProperty.owner_id !== user.id) {
        return {
          success: false,
          error: "You can only update properties that you created",
        };
      }

      // Build update object with only provided fields
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (propertyData.title !== undefined) updateData.title = propertyData.title;
      if (propertyData.description !== undefined)
        updateData.description = propertyData.description || null;
      if (propertyData.price !== undefined) updateData.price = propertyData.price;
      if (propertyData.location !== undefined) updateData.location = propertyData.location;
      if (propertyData.property_type !== undefined)
        updateData.property_type = propertyData.property_type;
      if (propertyData.use_type !== undefined) updateData.use_type = propertyData.use_type;
      if (propertyData.is_for_sale !== undefined) updateData.is_for_sale = propertyData.is_for_sale;

      const { data, error } = await supabase
        .from("properties")
        .update(updateData)
        .eq("id", propertyId)
        .eq("owner_id", user.id) // Double-check ownership in the query
        .select()
        .single();

      if (error) {
        console.error("Error updating property:", error);
        return { success: false, error: error.message };
      }

      if (!data) {
        return {
          success: false,
          error: "Property not found or you don't have permission to update it",
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error in updateProperty:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update property",
      };
    }
  }

  /**
   * Delete a property
   * Only the creator (owner) can delete the property
   */
  static async deleteProperty(propertyId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      // First, verify the property exists and get its owner_id
      const { data: existingProperty, error: fetchError } = await supabase
        .from("properties")
        .select("owner_id")
        .eq("id", propertyId)
        .single();

      if (fetchError || !existingProperty) {
        return { success: false, error: "Property not found" };
      }

      // Check if the current user is the owner
      if (existingProperty.owner_id !== user.id) {
        return {
          success: false,
          error: "You can only delete properties that you created",
        };
      }

      // Delete the property (cascade will handle related records like images)
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId)
        .eq("owner_id", user.id); // Double-check ownership in the query

      if (error) {
        console.error("Error deleting property:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Error in deleteProperty:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete property",
      };
    }
  }

  /**
   * Get a property by ID
   * Public method - anyone can view properties
   */
  static async getProperty(
    propertyId: string,
  ): Promise<{ success: boolean; data?: Property; error?: string }> {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        return { success: false, error: error.message };
      }

      if (!data) {
        return { success: false, error: "Property not found" };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Error in getProperty:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch property",
      };
    }
  }

  /**
   * Get all properties owned by the current user
   */
  static async getMyProperties(): Promise<{ success: boolean; data?: Property[]; error?: string }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching user properties:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error in getMyProperties:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch properties",
      };
    }
  }

  /**
   * Get all properties
   * Public method - anyone can view all properties
   */
  static async getAllProperties(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error("Error in getAllProperties:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch properties",
      };
    }
  }
}
