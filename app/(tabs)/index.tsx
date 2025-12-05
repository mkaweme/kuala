import DropdownMenu from "@/components/DropdownMenu";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { PropertyService } from "@/services/propertyService";
import { HouseProperty, ListingType, Property, PropertyType, WarehouseProperty } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";

const propertyTypes = ["All", "House", "Office", "Plot", "Farm", "Warehouse"];

// Database property interface
interface DatabaseProperty {
  id: string;
  title: string;
  description?: string;
  price: number | string;
  location: string;
  property_type: PropertyType;
  use_type: string;
  is_for_sale: boolean;
  created_at: string;
  updated_at: string;
  area?: string;
  town?: string;
  rate?: string;
  listing?: ListingType;
  photos?: Array<{ name: string; src: string[] }>;
  features?: string[];
  no_of_bedrooms?: number;
  no_of_bathrooms?: number;
  square_meters?: number;
  has_garden?: boolean;
  has_parking?: boolean;
  floor_number?: number;
  has_reception?: boolean;
  has_meeting_rooms?: number;
  parking_spaces?: number;
  zoning?: string;
  has_utilities?: boolean;
  road_access?: boolean;
  terrain?: string;
  acreage?: number;
  has_water?: boolean;
  soil_type?: string;
  has_buildings?: boolean;
  agricultural_use?: string[];
  ceiling_height?: number;
  loading_dock?: boolean;
  has_office_space?: boolean;
  has_security?: boolean;
}

const Home = () => {
  const { colors } = useColorScheme();
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("All");
  const [selectedHouse, setSelectedHouse] = useState<HouseProperty | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Transform database property to UI Property format
  const transformProperty = (dbProperty: DatabaseProperty): Property | null => {
    try {
      const baseProperty = {
        id: dbProperty.id,
        title: dbProperty.title,
        description: dbProperty.description,
        area: dbProperty.area || "",
        town: dbProperty.town || "",
        price:
          typeof dbProperty.price === "string" ? parseFloat(dbProperty.price) : dbProperty.price,
        rate: dbProperty.rate || undefined,
        listing: (dbProperty.listing as ListingType) || ListingType.RENT,
        photos: dbProperty.photos || [],
        features: dbProperty.features || [],
        type: (dbProperty.property_type as PropertyType) || PropertyType.HOUSE,
        createdAt: dbProperty.created_at || new Date().toISOString(),
        updatedAt: dbProperty.updated_at || new Date().toISOString(),
      };

      // Add type-specific fields based on property type
      switch (dbProperty.property_type) {
        case PropertyType.HOUSE:
          return {
            ...baseProperty,
            type: PropertyType.HOUSE,
            noOfBedrooms: dbProperty.no_of_bedrooms || 0,
            noOfBathrooms: dbProperty.no_of_bathrooms,
            squareMeters: dbProperty.square_meters,
            hasGarden: dbProperty.has_garden,
            hasParking: dbProperty.has_parking,
          } as HouseProperty;

        case PropertyType.WAREHOUSE:
          return {
            ...baseProperty,
            type: PropertyType.WAREHOUSE,
            squareMeters: dbProperty.square_meters || 0,
            ceilingHeight: dbProperty.ceiling_height || 0,
            loadingDock: dbProperty.loading_dock || false,
            hasOfficeSpace: dbProperty.has_office_space,
            hasSecurity: dbProperty.has_security,
          } as WarehouseProperty;

        case PropertyType.OFFICE:
          return {
            ...baseProperty,
            type: PropertyType.OFFICE,
            squareMeters: dbProperty.square_meters || 0,
            floorNumber: dbProperty.floor_number,
            hasReception: dbProperty.has_reception,
            hasMeetingRooms: dbProperty.has_meeting_rooms,
            parkingSpaces: dbProperty.parking_spaces,
          };

        case PropertyType.PLOT:
          return {
            ...baseProperty,
            type: PropertyType.PLOT,
            squareMeters: dbProperty.square_meters || 0,
            zoning: dbProperty.zoning,
            hasUtilities: dbProperty.has_utilities,
            roadAccess: dbProperty.road_access,
            terrain: dbProperty.terrain,
          };

        case PropertyType.FARM:
          return {
            ...baseProperty,
            type: PropertyType.FARM,
            acreage: dbProperty.acreage || 0,
            hasWater: dbProperty.has_water,
            soilType: dbProperty.soil_type,
            hasBuildings: dbProperty.has_buildings,
            agriculturalUse: dbProperty.agricultural_use,
          };

        default:
          return null;
      }
    } catch (error) {
      console.error("Error transforming property:", error);
      return null;
    }
  };

  // Fetch properties from database
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const result = await PropertyService.getAllProperties();
        if (result.success && result.data) {
          const transformedProperties = result.data
            .map(transformProperty)
            .filter((p): p is Property => p !== null);
          setProperties(transformedProperties);
        } else {
          console.error("Error fetching properties:", result.error);
        }
      } catch (error) {
        console.error("Error in fetchProperties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on property type
  const filteredProperties =
    selectedPropertyType === "All"
      ? properties
      : properties.filter((property) => {
          const typeMap: { [key: string]: PropertyType } = {
            House: PropertyType.HOUSE,
            Office: PropertyType.OFFICE,
            Plot: PropertyType.PLOT,
            Farm: PropertyType.FARM,
            Warehouse: PropertyType.WAREHOUSE,
          };
          return property.type === typeMap[selectedPropertyType];
        });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerContainer, { backgroundColor: colors.primary }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={[styles.headerTitle, { color: colors.buttonText }]}>
                Find Your Dream Property
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.buttonText }]}>
                Discover the perfect place
              </Text>
            </View>
            <TouchableOpacity style={styles.menuButton} onPress={() => setDropdownVisible(true)}>
              <Ionicons name="menu" size={24} color={colors.buttonText} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={24} color={colors.primary} />
          <TextInput
            placeholder="Search by area, town, or features..."
            placeholderTextColor={colors.inputPlaceholder}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>
      </View>

      {/* Property Type Filters */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContainer}
          style={styles.filterScrollView}
        >
          {propertyTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                { backgroundColor: colors.card, borderColor: colors.border },
                selectedPropertyType === type && {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => setSelectedPropertyType(type)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: colors.textSecondary },
                  selectedPropertyType === type && { color: colors.buttonText },
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {loading
            ? "Loading..."
            : `${filteredProperties.length} ${filteredProperties.length === 1 ? "property" : "properties"} found`}
        </Text>
      </View>
      {/* Properties List */}
      <ScrollView
        style={styles.propertiesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.propertiesContent}
      >
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onPress={(property) => setSelectedHouse(property as HouseProperty)}
          />
        ))}
      </ScrollView>
      <PropertyDetailsModal
        visible={selectedHouse !== null}
        property={selectedHouse}
        onClose={() => setSelectedHouse(null)}
      />
      <DropdownMenu visible={dropdownVisible} onClose={() => setDropdownVisible(false)} />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    backgroundColor: "#4CAF50",
  },
  header: {
    padding: 20,
    backgroundColor: "#4CAF50",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerText: {
    flex: 1,
  },
  menuButton: {
    padding: 8,
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  filterSection: {
    marginTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "",
  },
  filterScrollView: {
    backgroundColor: "transparent",
  },
  filterScrollContainer: {
    paddingRight: 20,
  },
  filterChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
    backgroundColor: "",
  },
  resultsText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "700",
  },
  propertiesContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  propertiesContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});
