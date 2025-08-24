import SittingRoom1 from "@/assets/images/1.jpg";
import SittingRoom2 from "@/assets/images/2.jpg";
import DropdownMenu from "@/components/DropdownMenu";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { HouseProperty } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export const HOUSES: HouseProperty[] = [
  {
    id: "1",
    title: "Modern 1 Bedroom House",
    noOfBedrooms: 1,
    area: "Woodlands",
    town: "Lusaka",
    listing: "rent",
    price: 200000,
    rate: "pm",
    type: "house",
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
        src: [SittingRoom1, SittingRoom2],
      },
      {
        name: "Kitchen",
        src: [SittingRoom1, SittingRoom2],
      },
      {
        name: "Toilet",
        src: [`require("@/assets/images/5.jpg")`],
      },
      {
        name: "Bathroom",
        src: [SittingRoom1],
      },
      {
        name: "Front",
        src: [SittingRoom1],
      },
      {
        name: "Bedroom",
        src: [SittingRoom2],
      },
      {
        name: "Back",
        src: [SittingRoom1],
      },
      {
        name: "Yard",
        src: [SittingRoom2],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    noOfBedrooms: 3,
    area: "Ibex Hill",
    town: "Lusaka",
    listing: "rent",
    price: 500000,
    rate: "pm",
    type: "House",
    features: ["Tiles", "Built-In Kitchen Units", "Built-In Wardrobes", "Paved Yard"],
    photos: [
      {
        name: "Sitting Room",
        src: [SittingRoom1, SittingRoom2],
      },
      {
        name: "Kitchen",
        src: [SittingRoom1, SittingRoom2],
      },
      {
        name: "Toilet",
        src: [SittingRoom1],
      },
      {
        name: "Bathroom",
        src: ["@/assets/images/6.jpg"],
      },
      {
        name: "Front",
        src: ["@/assets/images/7.jpg"],
      },
      {
        name: "Bedroom",
        src: ["@/assets/images/8.jpg"],
      },
      {
        name: "Back",
        src: ["@/assets/images/9.jpg"],
      },
      {
        name: "Yard",
        src: ["@/assets/images/10.jpg"],
      },
    ],
  },
  {
    noOfBedrooms: 3,
    area: "Meanwood Chamba Valley",
    town: "Lusaka",
    listing: "sale",
    price: 90000000,
    type: "House",
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
        src: [SittingRoom2, SittingRoom1],
      },
      {
        name: "Kitchen",
        src: ["@/assets/images/3.jpg", "@/assets/images/4.jpg"],
      },
      {
        name: "Toilet",
        src: ["@/assets/images/5.jpg"],
      },
      {
        name: "Bathroom",
        src: ["@/assets/images/6.jpg"],
      },
      {
        name: "Front",
        src: ["@/assets/images/7.jpg"],
      },
      {
        name: "Master Bedroom",
        src: ["@/assets/images/8.jpg"],
      },
      {
        name: "Bedroom",
        src: ["@/assets/images/8.jpg"],
      },
      {
        name: "Bedroom",
        src: ["@/assets/images/8.jpg"],
      },
      {
        name: "Back",
        src: ["@/assets/images/9.jpg"],
      },
      {
        name: "Yard",
        src: ["@/assets/images/10.jpg"],
      },
    ],
  },
  {
    noOfBedrooms: 3,
    area: "Chinika",
    town: "Lusaka",
    listing: "lease",
    price: 150000000,
    type: "Warehouse",
    features: ["Road Frontage", "Overhead Crane"],
    photos: [
      {
        name: "Yard",
        src: [SittingRoom2, SittingRoom1],
      },
      {
        name: "Entrance",
        src: [SittingRoom2, SittingRoom1],
      },
      {
        name: "Offices",
        src: [SittingRoom2, SittingRoom1],
      },
      {
        name: "Bathroom",
        src: [SittingRoom2, SittingRoom1],
      },
    ],
  },
];

const propertyTypes = ["All", "House", "Office", "Plot", "Farm", "Warehouse"];

const Home = () => {
  const { colors } = useColorScheme();
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("All");
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
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

      {/* Properties List */}
      <ScrollView
        style={styles.propertiesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.propertiesContent}
      >
        {filteredHouses.map((house, index) => (
          <PropertyCard key={index} property={house} onPress={setSelectedHouse} />
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
