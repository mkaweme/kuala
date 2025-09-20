import DropdownMenu from "@/components/DropdownMenu";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { HouseProperty, ListingType, PropertyType, WarehouseProperty } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export const HOUSES: HouseProperty[] = [
  {
    id: "e45a2b1c-bfc9-4bfa-90f4-1d87f89c7a47",
    title: "Modern 1 Bedroom House",
    noOfBedrooms: 1,
    area: "Woodlands",
    town: "Lusaka",
    listing: ListingType.RENT,
    price: 200000,
    rate: "pm",
    type: PropertyType.HOUSE,
    features: [
      "Tiles",
      "Built-In Kitchen Units",
      "Built-In Wardrobe",
      "Road Frontage",
      "Paved Yard",
    ],
    photos: [
      {
        name: "Sitting Room",
        src: ["1", "2"],
      },
      {
        name: "Kitchen",
        src: ["1", "2"],
      },
      {
        name: "Toilet",
        src: ["5"],
      },
      {
        name: "Bathroom",
        src: ["1"],
      },
      {
        name: "Front",
        src: ["1"],
      },
      {
        name: "Bedroom",
        src: ["2"],
      },
      {
        name: "Back",
        src: ["1"],
      },
      {
        name: "Yard",
        src: ["2"],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "38a5fce3-1c07-4baf-b77c-774fda1e5d58",
    noOfBedrooms: 3,
    area: "Ibex Hill",
    title: "Spacious 3 Bedroomed House",
    town: "Lusaka",
    listing: ListingType.RENT,
    price: 500000,
    rate: "pm",
    type: PropertyType.HOUSE,
    features: ["Tiles", "Built-In Kitchen Units", "Built-In Wardrobes", "Paved Yard"],
    photos: [
      {
        name: "Sitting Room",
        src: ["1", "2"],
      },
      {
        name: "Kitchen",
        src: ["1", "2"],
      },
      {
        name: "Toilet",
        src: ["1"],
      },
      {
        name: "Bathroom",
        src: ["6"],
      },
      {
        name: "Front",
        src: ["7"],
      },
      {
        name: "Bedroom",
        src: ["8"],
      },
      {
        name: "Back",
        src: ["9"],
      },
      {
        name: "Yard",
        src: ["10"],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "71f2e27a-03a2-4491-9b39-8a882dcf2f59",
    noOfBedrooms: 3,
    area: "Meanwood Chamba Valley",
    title: "Modern 4 bedroomed House",
    town: "Lusaka",
    listing: ListingType.SALE,
    price: 90000000,
    type: PropertyType.HOUSE,
    features: [
      "Tiles",
      "Built-In Kitchen Units",
      "Built-In Wardrobe",
      "Road Frontage",
      "Open Plan Kitchen",
      "Paved Yard",
      "Master Self-contained",
      "3 Toilets",
      "2 Baths",
    ],
    photos: [
      {
        name: "Sitting Room",
        src: ["2", "1"],
      },
      {
        name: "Kitchen",
        src: ["3", "4"],
      },
      {
        name: "Toilet",
        src: ["5"],
      },
      {
        name: "Bathroom",
        src: ["6"],
      },
      {
        name: "Front",
        src: ["7"],
      },
      {
        name: "Master Bedroom",
        src: ["8"],
      },
      {
        name: "Bedroom",
        src: ["8"],
      },
      {
        name: "Bedroom",
        src: ["8"],
      },
      {
        name: "Back",
        src: ["9"],
      },
      {
        name: "Yard",
        src: ["10"],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const WAREHOUSES: WarehouseProperty[] = [
  {
    id: "dfc68b83-9d62-41ac-9fd1-6d14b1a908c7",
    title: "Large Warehouse",
    area: "Chinika",
    town: "Lusaka",
    price: 12000000,
    rate: "yr",
    listing: ListingType.LEASE,
    type: PropertyType.WAREHOUSE,
    features: ["Road Frontage", "Overhead Crane"],
    photos: [
      {
        name: "Yard",
        src: ["2", "1"],
      },
      {
        name: "Entrance",
        src: ["2", "1"],
      },
      {
        name: "Offices",
        src: ["2", "1"],
      },
      {
        name: "Bathroom",
        src: ["2", "1"],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    squareMeters: 2400,
    ceilingHeight: 12,
    loadingDock: false,
  },
];

const propertyTypes = ["All", "House", "Office", "Plot", "Farm", "Warehouse"];

const Home = () => {
  const { colors } = useColorScheme();
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("All");
  const [selectedHouse, setSelectedHouse] = useState<HouseProperty | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Filter houses based on property type only
  const filteredHouses =
    selectedPropertyType === "All"
      ? HOUSES
      : HOUSES.filter((house) => selectedPropertyType === "House" && house.noOfBedrooms > 0);

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
          {filteredHouses.length} {filteredHouses.length === 1 ? "property" : "properties"} found
        </Text>
      </View>
      {/* Sample Image elements removed; PropertyCard handles image rendering via IDs */}
      {/* Properties List */}
      <ScrollView
        style={styles.propertiesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.propertiesContent}
      >
        {filteredHouses.map((house, index) => (
          <PropertyCard
            key={index}
            property={house}
            onPress={(property) => setSelectedHouse(property as HouseProperty)}
          />
        ))}
        {WAREHOUSES.map((warehouse, index) => (
          <PropertyCard
            key={index}
            property={warehouse}
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
