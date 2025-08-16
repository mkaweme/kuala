import SittingRoom1 from "@/assets/images/1.jpg";
import SittingRoom2 from "@/assets/images/2.jpg";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { House } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import HouseComponent from "./components/house";

const HOUSES: House[] = [
  {
    noOfBedrooms: 1,
    area: "Woodlands",
    town: "Lusaka",
    listing: "rent",
    price: 200000,
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
        src: ["@/assets/images/1.jpg", "@/assets/images/2.jpg"],
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
];

const TabOneScreen = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
    >
      {/*Search bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="black" />
        <TextInput
          placeholder="Search"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
          style={styles.searchInput}
        />
      </View>
      <Text style={styles.title}>Listings</Text>
      {HOUSES.map((house, index) => (
        <HouseComponent key={index} house={house} />
      ))}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </ScrollView>
  );
};

export default TabOneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    width: 300,
    flex: 1,
    flexDirection: "row",
    borderRadius: 15,
    borderColor: "#4CAF50",
    borderWidth: 2,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  searchInput: {
    paddingLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 10,
  },
  detailsRow: {
    flexDirection: "row",
    backgroundColor: "brown",
    justifyContent: "space-between",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
