import { House } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface HouseProps {
  house: House;
}

const HouseComponent: React.FC<HouseProps> = ({ house }) => {
  return (
    <View style={styles.container}>
      {house.photos.length > 0 && (
        <View style={styles.houseContainer}>
          <Image source={house.photos[0].src[0]} style={styles.image} resizeMode="cover" />
          <View style={{ ...styles.locationRow, justifyContent: "space-between" }}>
            <Text style={styles.detailsText}>{house.noOfBedrooms} Bedrommed House</Text>
            <Text style={styles.price}>K{(house.price / 100).toFixed(2)}</Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={18} color="black" />
            <Text style={styles.locationText}>
              {house.area}, {house.town}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default HouseComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  houseContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
    width: "80%",
  },
  image: {
    width: 350,
    height: 250,
    borderRadius: 15,
  },
  detailsText: {
    fontSize: 24,
    fontWeight: "600",
  },
  locationText: {
    fontSize: 16,
  },
  price: {
    backgroundColor: "green",
    color: "#ffffff",
    padding: 5,
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 18,
    top: -50,
    right: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
});
