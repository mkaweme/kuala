import { House } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Image mapping utility function
const getImageSource = (imageId: string) => {
  const imageMap: { [key: string]: number } = {
    "1": require("@/assets/images/1.jpg"),
    "2": require("@/assets/images/2.jpg"),
    "3": require("@/assets/images/3.jpg"),
    "4": require("@/assets/images/4.jpg"),
    "5": require("@/assets/images/5.jpg"),
    "6": require("@/assets/images/6.jpg"),
    "7": require("@/assets/images/7.jpg"),
    "8": require("@/assets/images/8.jpg"),
    "9": require("@/assets/images/9.jpg"),
    "10": require("@/assets/images/10.jpg"),
    "11": require("@/assets/images/11.jpg"),
    "12": require("@/assets/images/12.jpg"),
    "13": require("@/assets/images/13.jpg"),
    "14": require("@/assets/images/14.jpg"),
    "15": require("@/assets/images/15.jpg"),
    "16": require("@/assets/images/16.jpg"),
    "17": require("@/assets/images/17.jpg"),
    "18": require("@/assets/images/18.jpg"),
    "19": require("@/assets/images/19.jpg"),
    "20": require("@/assets/images/20.jpg"),
    "21": require("@/assets/images/21.jpg"),
    "22": require("@/assets/images/22.jpg"),
    "23": require("@/assets/images/23.jpg"),
    "24": require("@/assets/images/24.jpg"),
    "25": require("@/assets/images/25.jpg"),
    "26": require("@/assets/images/26.jpg"),
    "27": require("@/assets/images/27.jpg"),
    "28": require("@/assets/images/28.jpg"),
    "29": require("@/assets/images/29.jpg"),
    "30": require("@/assets/images/30.jpg"),
  };

  return imageMap[imageId] || require("@/assets/images/1.jpg");
};

interface HouseProps {
  house: House;
  onPress?: (house: House) => void;
}

const HouseComponent: React.FC<HouseProps> = ({ house, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={() => onPress?.(house)}>
      {house.photos.length > 0 && (
        <View style={styles.houseContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={getImageSource(house.photos[0].src[0])}
              style={styles.image}
              resizeMode="cover"
            />
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
