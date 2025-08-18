export interface Photo {
  name: string;
  src: string[];
}

export interface House {
  area: string;
  features: string[];
  listing: "rent" | "sale" | "lease";
  noOfBedrooms: number;
  photos: Photo[];
  price: number;
  rate?: string;
  town: string;
  type: string;
}

export interface HouseFilters {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  area?: string;
  listing?: "rent" | "sale" | "lease";
  features?: string[];
}
