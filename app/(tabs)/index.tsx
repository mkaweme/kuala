import React from "react";
import { StyleSheet, Image, Modal } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import SitingRoom1 from "@/assets/images/1.jpg";

const HOUSES = [
  {
    noOfBedrooms: 1,
    area: "Woodlands",
    listing: "rent",
    price: 200000,
    features: ["Tiles", "Built-In Kitchen Units", 
      "Built-In Wardrobe", "Road Frontage", "Paved Yard"],
    photos: [
      {
        name: "Sitting Room",
        src: [
          SitingRoom1,
          require(`../assets/images/${2}.jpg`),
        ]
      },
      {
        name: "Kitchen",
        src: [
          require("@/assets/images/3.jpg"),
          require("@/assets/images/4.jpg"),
        ]
      },
      {
        name: "Toilet",
        src: `require("@/assets/images/5.jpg")`,
        
      },
      {
        name: "Bathroom",
        src: [
          require("@/assets/images/6.jpg"),
        ]
      },
      {
        name: "Front",
        src: [
          require("@/assets/images/7.jpg"),
        ]
      },
      {
        name: "Bedroom",
        src: [
          require("@/assets/images/8.jpg"),
        ]
      },
      {
        name: "Back",
        src: [
          require("@/assets/images/9.jpg"),
        ]
      },
      {
        name: "Yard",
        src: [
          require("@/assets/images/10.jpg"),
        ]
      },

    ]
  },
  {
    noOfBedrooms: 3,
    area: "Ibex Hill",
    listing: "rent",
    price: 500000,
    features: ["Tiles", "Built-In Kitchen Units", 
      "Built-In Wardrobes", "Paved Yard"],
    photos: [
      {
        name: "Sitting Room",
        src: [
          require("@/assets/images/1.jpg"),
          require("@/assets/images/2.jpg"),
        ]
      },
      {
        name: "Kitchen",
        src: [
          require("@/assets/images/3.jpg"),
          require("@/assets/images/4.jpg"),
        ]
      },
      {
        name: "Toilet",
        src: [
          require("@/assets/images/5.jpg"),
        ]
      },
      {
        name: "Bathroom",
        src: [
          require("@/assets/images/6.jpg"),
        ]
      },
      {
        name: "Front",
        src: [
          require("@/assets/images/7.jpg"),
        ]
      },
      {
        name: "Bedroom",
        src: [
          require("@/assets/images/8.jpg"),
        ]
      },
      {
        name: "Back",
        src: [
          require("@/assets/images/9.jpg"),
        ]
      },
      {
        name: "Yard",
        src: [
          require("@/assets/images/10.jpg"),
        ]
      },

    ]
  },
  {
    noOfBedrooms: 3,
    area: "Meanwood Chamba Valley",
    listing: "Sale",
    price: 90000000,
    features: ["Tiles", "Built-In Kitchen Units", 
      "Built-In Wardrobe", "Road Frontage", "Open Plan Kitchen",
      "Paved Yard", "Master Self-contained", "3 Toilets", "2 Baths"],
    photos: [
      {
        name: "Sitting Room",
        src: [
          require("@/assets/images/1.jpg"),
          require("@/assets/images/2.jpg"),
        ]
      },
      {
        name: "Kitchen",
        src: [
          require("@/assets/images/3.jpg"),
          require("@/assets/images/4.jpg"),
        ]
      },
      {
        name: "Toilet",
        src: [
          require("@/assets/images/5.jpg"),
        ]
      },
      {
        name: "Bathroom",
        src: [
          require("@/assets/images/6.jpg"),
        ]
      },
      {
        name: "Front",
        src: [
          require("@/assets/images/7.jpg"),
        ]
      },
      {
        name: "Master Bedroom",
        src: [
          require("@/assets/images/8.jpg"),
        ]
      },
      {
        name: "Bedroom",
        src: [
          require("@/assets/images/8.jpg"),
        ]
      },
      {
        name: "Bedroom",
        src: [
          require("@/assets/images/8.jpg"),
        ]
      },
      {
        name: "Back",
        src: [
          require("@/assets/images/9.jpg"),
        ]
      },
      {
        name: "Yard",
        src: [
          require("@/assets/images/10.jpg"),
        ]
      },

    ]
  }
]

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listings</Text>
      <View>
        <Image   
          source={require("@/assets/images/1.jpg")}
          style={{ width: 350, height: 350 }} 
          resizeMode="contain" 
        />
      </View>
      <Modal />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
