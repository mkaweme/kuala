import SittingRoom1 from "@/assets/images/1.jpg";
import SittingRoom2 from "@/assets/images/2.jpg";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import React from "react";
import { Image, StyleSheet } from "react-native";

const HOUSES = [
  {
    noOfBedrooms: 1,
    area: "Woodlands",
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
    listing: "Sale",
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

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listings</Text>
      <View>
        <Image
          source={{
            uri: "https://unsplash.com/photos/a-group-of-people-holding-bowls-of-food-GJPJB3RqeGo",
          }}
          style={{ width: 350, height: 350 }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
