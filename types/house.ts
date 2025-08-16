export interface Photo {
  name: string;
  src: string[];
}

export interface House {
  noOfBedrooms: number;
  area: string;
  town: string;
  listing: "rent" | "sale" | "lease";
  price: number;
  features: string[];
  photos: Photo[];
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
