import { House } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HouseProps {
  house: House;
}

const HouseComponent: React.FC<HouseProps> = ({ house }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8}>
      {house.photos.length > 0 && (
        <View style={styles.houseContainer}>
          <View style={styles.imageContainer}>
            <Image source={house.photos[0].src[0]} style={styles.image} resizeMode="cover" />
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>
                K{house.price / 100}
                {house.rate ? house.rate : null}
              </Text>
            </View>
            <View style={styles.listingTypeTag}>
              <Text style={styles.listingTypeText}>{house.listing}</Text>
            </View>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.bedroomsText}>
                {house.noOfBedrooms} Bedroom{house.noOfBedrooms > 1 ? "s" : ""}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={18} color="#4CAF50" />
                <Text style={styles.locationText}>
                  {house.area}, {house.town}
                </Text>
              </View>
              <View style={styles.featuresContainer}>
                {house.features.slice(0, 3).map((feature, index) => (
                  <View key={index} style={styles.featureChip}>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default HouseComponent;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  houseContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 250,
  },
  priceTag: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  priceText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  listingTypeTag: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  listingTypeText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
  },
  contentContainer: {
    padding: 20,
  },
  headerRow: {
    marginBottom: 15,
  },
  bedroomsText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  featureChip: {
    backgroundColor: "#f0f8f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  featureText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    fontWeight: "500",
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  featureItemText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontWeight: "400",
  },
});
