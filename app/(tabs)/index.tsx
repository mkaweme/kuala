import SittingRoom1 from "@/assets/images/1.jpg";
import SittingRoom2 from "@/assets/images/2.jpg";
import { Text, View } from "@/components/Themed";
import { House } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import HouseComponent from "./components/house";

const HOUSES: House[] = [
  {
    noOfBedrooms: 1,
    area: "Woodlands",
    town: "Lusaka",
    listing: "rent",
    price: 200000,
    rate: "pm",
    type: "House",
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
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("All");

  // Filter houses based on property type only
  const filteredHouses =
    selectedPropertyType === "All"
      ? HOUSES
      : HOUSES.filter((house) => selectedPropertyType === "House" && house.noOfBedrooms > 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Find Your Dream Property</Text>
          <Text style={styles.headerSubtitle}>Discover the perfect place</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#4CAF50" />
          <TextInput
            placeholder="Search by area, town, or features..."
            placeholderTextColor="#999"
            style={styles.searchInput}
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
              style={[styles.filterChip, selectedPropertyType === type && styles.filterChipActive]}
              onPress={() => setSelectedPropertyType(type)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedPropertyType === type && styles.filterChipTextActive,
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
        <Text style={styles.resultsText}>
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
          <HouseComponent key={index} house={house} />
        ))}
      </ScrollView>
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
  advancedSearchButton: {
    marginLeft: 15,
    padding: 5,
  },
  filterSection: {
    marginTop: 25,
    paddingHorizontal: 20,
    backgroundColor: "",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
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
    fontWeight: "500",
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
