export interface Photo {
  caption: string;
  uri: string;
}

export enum PropertyType {
  HOUSE = "house",
  OFFICE = "office",
  PLOT = "plot",
  FARM = "farm",
  WAREHOUSE = "warehouse",
}

export enum ListingType {
  RENT = "rent",
  SALE = "sale",
  LEASE = "lease",
}

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
  type: PropertyType.HOUSE;
  noOfBedrooms: number;
  noOfBathrooms?: number;
  squareMeters?: number;
  hasGarden?: boolean;
  hasParking?: boolean;
}

// Office-specific properties
export interface OfficeProperty extends BaseProperty {
  type: PropertyType.OFFICE;
  squareMeters: number;
  floorNumber?: number;
  hasReception?: boolean;
  hasMeetingRooms?: number;
  parkingSpaces?: number;
}

// Plot-specific properties
export interface PlotProperty extends BaseProperty {
  type: PropertyType.PLOT;
  squareMeters: number;
  zoning?: string;
  hasUtilities?: boolean;
  roadAccess?: boolean;
  terrain?: string;
}

// Farm-specific properties
export interface FarmProperty extends BaseProperty {
  type: PropertyType.FARM;
  acreage: number;
  hasWater?: boolean;
  soilType?: string;
  hasBuildings?: boolean;
  agriculturalUse?: string[];
}

// Warehouse-specific properties
export interface WarehouseProperty extends BaseProperty {
  type: PropertyType.WAREHOUSE;
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
  property.type === PropertyType.HOUSE;

export const isOfficeProperty = (property: Property): property is OfficeProperty =>
  property.type === PropertyType.OFFICE;

export const isPlotProperty = (property: Property): property is PlotProperty =>
  property.type === PropertyType.PLOT;

export const isFarmProperty = (property: Property): property is FarmProperty =>
  property.type === PropertyType.FARM;

export const isWarehouseProperty = (property: Property): property is WarehouseProperty =>
  property.type === PropertyType.WAREHOUSE;
