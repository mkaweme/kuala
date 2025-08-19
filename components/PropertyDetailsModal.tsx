import { House } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useMemo } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PropertyDetailsModalProps {
  visible: boolean;
  house: House | null;
  onClose: () => void;
}

const screenWidth = Dimensions.get("window").width;

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ visible, house, onClose }) => {
  const imageSources = useMemo(() => {
    if (!house) return [] as any[];
    const flat = house.photos.flatMap((p) => p.src);
    // Only keep non-string entries to avoid dynamic require issues
    return flat.filter((s) => typeof s !== "string");
  }, [house]);

  if (!house) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {house.noOfBedrooms} Bedroom{house.noOfBedrooms > 1 ? "s" : ""} {house.type}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close details"
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {imageSources.length > 0 && (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
            >
              {imageSources.map((src, idx) => (
                <Image
                  key={idx}
                  source={src as any}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>
              K{house.price / 100}
              {house.rate ? house.rate : ""}
            </Text>
            <View style={styles.listingPill}>
              <Text style={styles.listingPillText}>{house.listing}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={18} color="#4CAF50" />
            <Text style={styles.locationText}>
              {house.area}, {house.town}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresContainer}>
              {house.features.map((feature, index) => (
                <View key={index} style={styles.featureChip}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PropertyDetailsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    paddingRight: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  carousel: {
    width: screenWidth,
    height: 260,
    backgroundColor: "#000",
  },
  carouselImage: {
    width: screenWidth,
    height: 260,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  priceText: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 22,
  },
  listingPill: {
    backgroundColor: "#333",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  listingPillText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    textTransform: "uppercase",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  locationText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
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
});
