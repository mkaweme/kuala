export interface Photo {
  name: string;
  src: string[];
}

export type PropertyType = "house" | "office" | "plot" | "farm" | "warehouse";
export type ListingType = "rent" | "sale" | "lease";

// Base property interface with common fields
export interface BaseProperty {
  id: string;
  title: string;
  description?: string;
  area: string;
  town: string;
  price: number;
  rate?: string;
  listing: ListingType;
  photos: Photo[];
  features: string[];
  type: PropertyType;
  createdAt: string;
  updatedAt: string;
}

// House-specific properties
export interface HouseProperty extends BaseProperty {
  type: "house";
  noOfBedrooms: number;
  noOfBathrooms?: number;
  squareFootage?: number;
  hasGarden?: boolean;
  hasParking?: boolean;
}

// Office-specific properties
export interface OfficeProperty extends BaseProperty {
  type: "office";
  squareFootage: number;
  floorNumber?: number;
  hasReception?: boolean;
  hasMeetingRooms?: number;
  parkingSpaces?: number;
}

// Plot-specific properties
export interface PlotProperty extends BaseProperty {
  type: "plot";
  squareFootage: number;
  zoning?: string;
  hasUtilities?: boolean;
  roadAccess?: boolean;
  terrain?: string;
}

// Farm-specific properties
export interface FarmProperty extends BaseProperty {
  type: "farm";
  acreage: number;
  hasWater?: boolean;
  soilType?: string;
  hasBuildings?: boolean;
  agriculturalUse?: string[];
}

// Warehouse-specific properties
export interface WarehouseProperty extends BaseProperty {
  type: "warehouse";
  squareMeters: number;
  ceilingHeight: number;
  loadingDock: boolean;
  hasOfficeSpace?: boolean;
  hasSecurity?: boolean;
}

// Union type for all properties
export type Property =
  | HouseProperty
  | OfficeProperty
  | PlotProperty
  | FarmProperty
  | WarehouseProperty;

// Property filters
export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  area?: string;
  listing?: ListingType;
  features?: string[];
  propertyType?: PropertyType;
  minSquareFootage?: number;
  maxSquareFootage?: number;
}

// Helper type guards
export const isHouseProperty = (property: Property): property is HouseProperty =>
  property.type === "house";

export const isOfficeProperty = (property: Property): property is OfficeProperty =>
  property.type === "office";

export const isPlotProperty = (property: Property): property is PlotProperty =>
  property.type === "plot";

export const isFarmProperty = (property: Property): property is FarmProperty =>
  property.type === "farm";

export const isWarehouseProperty = (property: Property): property is WarehouseProperty =>
  property.type === "warehouse";
