import SittingRoom1 from "@/assets/images/1.jpg";
import SittingRoom2 from "@/assets/images/2.jpg";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailsModal from "@/components/PropertyDetailsModal";
import { Text, View } from "@/components/Themed";
import { HouseProperty } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";

const HOUSES: HouseProperty[] = [
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
        caption: "Sitting Room",
        uri: [SittingRoom1, SittingRoom2],
      },
      {
        caption: "Kitchen",
        uri: [SittingRoom1, SittingRoom2],
      },
      {
        caption: "Toilet",
        uri: [`require("@/assets/images/5.jpg")`],
      },
      {
        caption: "Bathroom",
        uri: [SittingRoom1],
      },
      {
        caption: "Front",
        uri: [SittingRoom1],
      },
      {
        caption: "Bedroom",
        uri: [SittingRoom2],
      },
      {
        caption: "Back",
        uri: [SittingRoom1],
      },
      {
        caption: "Yard",
        uri: [SittingRoom2],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Spacious 3 Bedroom House",
    noOfBedrooms: 3,
    area: "Ibex Hill",
    town: "Lusaka",
    listing: "rent",
    price: 500000,
    rate: "pm",
    type: "house",
    features: ["Tiles", "Built-In Kitchen Units", "Built-In Wardrobes", "Paved Yard"],
    photos: [
      {
        caption: "Sitting Room",
        uri: [SittingRoom1, SittingRoom2],
      },
      {
        caption: "Kitchen",
        uri: [SittingRoom1, SittingRoom2],
      },
      {
        caption: "Toilet",
        uri: [SittingRoom1],
      },
      {
        caption: "Bathroom",
        uri: ["@/assets/images/6.jpg"],
      },
      {
        caption: "Front",
        uri: ["@/assets/images/7.jpg"],
      },
      {
        caption: "Bedroom",
        uri: ["@/assets/images/8.jpg"],
      },
      {
        caption: "Back",
        uri: ["@/assets/images/9.jpg"],
      },
      {
        caption: "Yard",
        uri: ["@/assets/images/10.jpg"],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Spacious 4 bedroomed house",
    noOfBedrooms: 4,
    area: "Meanwood Chamba Valley",
    town: "Lusaka",
    listing: "sale",
    price: 140000000,
    type: "house",
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
        caption: "Sitting Room",
        uri: [SittingRoom2, SittingRoom1],
      },
      {
        caption: "Kitchen",
        uri: ["@/assets/images/3.jpg", "@/assets/images/4.jpg"],
      },
      {
        caption: "Toilet",
        uri: ["@/assets/images/5.jpg"],
      },
      {
        caption: "Bathroom",
        uri: ["@/assets/images/6.jpg"],
      },
      {
        caption: "Front",
        uri: ["@/assets/images/7.jpg"],
      },
      {
        caption: "Master Bedroom",
        uri: ["@/assets/images/8.jpg"],
      },
      {
        caption: "Bedroom",
        uri: ["@/assets/images/8.jpg"],
      },
      {
        caption: "Bedroom",
        uri: ["@/assets/images/8.jpg"],
      },
      {
        caption: "Back",
        uri: ["@/assets/images/9.jpg"],
      },
      {
        caption: "Yard",
        uri: ["@/assets/images/10.jpg"],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
        caption: "Yard",
        uri: [SittingRoom2, SittingRoom1],
      },
      {
        caption: "Entrance",
        uri: [SittingRoom2, SittingRoom1],
      },
      {
        caption: "Offices",
        uri: [SittingRoom2, SittingRoom1],
      },
      {
        caption: "Bathroom",
        uri: [SittingRoom2, SittingRoom1],
      },
    ],
  },
];

const propertyTypes = ["All", "House", "Office", "Plot", "Farm", "Warehouse"];
const listingTypes = ["All", "Rent", "Sale"];
const areas = ["All", "Woodlands", "Ibex Hill", "Meanwood Chamba Valley"];
const towns = ["All", "Lusaka"];

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("All");
  const [selectedListingType, setSelectedListingType] = useState<string>("All");
  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [selectedTown, setSelectedTown] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minBedrooms, setMinBedrooms] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  // Filter houses based on all search criteria
  const filteredHouses = useMemo(() => {
    return HOUSES.filter((house) => {
      const matchesSearch =
        searchTerm === "" ||
        house.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        house.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
        house.features.some((feature) => feature.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesPropertyType =
        selectedPropertyType === "All" ||
        (selectedPropertyType === "House" && house.noOfBedrooms > 0);

      const matchesListingType =
        selectedListingType === "All" ||
        (selectedListingType === "Rent" && house.listing === "rent") ||
        (selectedListingType === "Sale" && house.listing === "sale");

      const matchesArea = selectedArea === "All" || house.area === selectedArea;
      const matchesTown = selectedTown === "All" || house.town === selectedTown;

      const matchesPrice =
        (minPrice === "" || house.price >= parseInt(minPrice) * 100) &&
        (maxPrice === "" || house.price <= parseInt(maxPrice) * 100);

      const matchesBedrooms = minBedrooms === "" || house.noOfBedrooms >= parseInt(minBedrooms);

      return (
        matchesSearch &&
        matchesPropertyType &&
        matchesListingType &&
        matchesArea &&
        matchesTown &&
        matchesPrice &&
        matchesBedrooms
      );
    });
  }, [
    searchTerm,
    selectedPropertyType,
    selectedListingType,
    selectedArea,
    selectedTown,
    minPrice,
    maxPrice,
    minBedrooms,
  ]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedPropertyType("All");
    setSelectedListingType("All");
    setSelectedArea("All");
    setSelectedTown("All");
    setMinPrice("");
    setMaxPrice("");
    setMinBedrooms("");
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedPropertyType !== "All" ||
    selectedListingType !== "All" ||
    selectedArea !== "All" ||
    selectedTown !== "All" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minBedrooms !== "";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Advanced Search</Text>
          <Text style={styles.headerSubtitle}>Find your dream property</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#4CAF50" />
          <TextInput
            placeholder="Search by area, town, or features..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
            <Ionicons name="filter" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {searchTerm !== "" && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>&apos{searchTerm}&apos</Text>
                <TouchableOpacity onPress={() => setSearchTerm("")}>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {selectedPropertyType !== "All" && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{selectedPropertyType}</Text>
                <TouchableOpacity onPress={() => setSelectedPropertyType("All")}>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {selectedListingType !== "All" && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{selectedListingType}</Text>
                <TouchableOpacity onPress={() => setSelectedListingType("All")}>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {selectedArea !== "All" && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{selectedArea}</Text>
                <TouchableOpacity onPress={() => setSelectedArea("All")}>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {minPrice !== "" && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Min: K{minPrice}</Text>
                <TouchableOpacity onPress={() => setMinPrice("")}>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {maxPrice !== "" && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Max: K{maxPrice}</Text>
                <TouchableOpacity onPress={() => setMaxPrice("")}>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {minBedrooms !== "" && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{minBedrooms}+ Beds</Text>
                <TouchableOpacity onPress={() => setMinBedrooms("")}>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.clearAllButton} onPress={clearAllFilters}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

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
        {filteredHouses.length > 0 ? (
          filteredHouses.map((house, index) => (
            <PropertyCard key={index} property={house} onPress={setSelectedHouse} />
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.noResultsText}>No properties found</Text>
            <Text style={styles.noResultsSubtext}>Try adjusting your search criteria</Text>
          </View>
        )}
      </ScrollView>

      <PropertyDetailsModal
        visible={selectedHouse !== null}
        property={selectedHouse}
        onClose={() => setSelectedHouse(null)}
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Advanced Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Property Type */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Property Type</Text>
              <View style={styles.chipContainer}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.modalChip,
                      selectedPropertyType === type && styles.modalChipActive,
                    ]}
                    onPress={() => setSelectedPropertyType(type)}
                  >
                    <Text
                      style={[
                        styles.modalChipText,
                        selectedPropertyType === type && styles.modalChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Listing Type */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Listing Type</Text>
              <View style={styles.chipContainer}>
                {listingTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.modalChip,
                      selectedListingType === type && styles.modalChipActive,
                    ]}
                    onPress={() => setSelectedListingType(type)}
                  >
                    <Text
                      style={[
                        styles.modalChipText,
                        selectedListingType === type && styles.modalChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Area */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Area</Text>
              <View style={styles.chipContainer}>
                {areas.map((area) => (
                  <TouchableOpacity
                    key={area}
                    style={[styles.modalChip, selectedArea === area && styles.modalChipActive]}
                    onPress={() => setSelectedArea(area)}
                  >
                    <Text
                      style={[
                        styles.modalChipText,
                        selectedArea === area && styles.modalChipTextActive,
                      ]}
                    >
                      {area}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Town */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Town</Text>
              <View style={styles.chipContainer}>
                {towns.map((town) => (
                  <TouchableOpacity
                    key={town}
                    style={[styles.modalChip, selectedTown === town && styles.modalChipActive]}
                    onPress={() => setSelectedTown(town)}
                  >
                    <Text
                      style={[
                        styles.modalChipText,
                        selectedTown === town && styles.modalChipTextActive,
                      ]}
                    >
                      {town}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Price Range (K)</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Min Price</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={minPrice}
                    onChangeText={setMinPrice}
                    placeholder="0"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Max Price</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    placeholder="1000000"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </View>

            {/* Bedrooms */}
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Minimum Bedrooms</Text>
              <TextInput
                style={styles.bedroomInput}
                value={minBedrooms}
                onChangeText={setMinBedrooms}
                placeholder="Any"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={clearAllFilters}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SearchScreen;

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
    paddingVertical: 5,
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
  filterButton: {
    marginLeft: 15,
    padding: 5,
  },
  activeFiltersContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  activeFilterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  clearAllButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearAllText: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "600",
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
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
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 20,
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterGroup: {
    marginBottom: 25,
  },
  filterGroupTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modalChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  modalChipActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  modalChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  modalChipTextActive: {
    color: "#fff",
  },
  inputRow: {
    flexDirection: "row",
    gap: 15,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  priceInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  bedroomInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  modalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
