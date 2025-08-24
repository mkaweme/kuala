import { Property } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useMemo, useState } from "react";
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
import BookingModal from "./BookingModal";

interface PropertyDetailsModalProps {
  visible: boolean;
  property: Property | null;
  onClose: () => void;
}

const screenWidth = Dimensions.get("window").width;

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  visible,
  property,
  onClose,
}) => {
  const [bookingModalVisible, setBookingModalVisible] = useState(false);

  const imageSources = useMemo(() => {
    if (!property) return [] as any[];
    const flat = property.photos.flatMap((p: any) => p.src);
    // Only keep non-string entries to avoid dynamic require issues
    return flat.filter((s: any) => typeof s !== "string");
  }, [property]);

  if (!property) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{property.title}</Text>
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
              K{property.price / 100}
              {property.rate ? property.rate : ""}
            </Text>
            <View style={styles.listingPill}>
              <Text style={styles.listingPillText}>{property.listing}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={18} color="#4CAF50" />
            <Text style={styles.locationText}>
              {property.area}, {property.town}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresContainer}>
              {property.features.map((feature: string, index: number) => (
                <View key={index} style={styles.featureChip}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Booking Button */}
          <View style={styles.bookingSection}>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => setBookingModalVisible(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={styles.bookButtonText}>Book a Viewing</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Booking Modal */}
      <BookingModal
        visible={bookingModalVisible}
        onClose={() => setBookingModalVisible(false)}
        property={property}
        onBookingSuccess={() => {
          setBookingModalVisible(false);
          // Optionally close the property details modal as well
          // onClose();
        }}
      />
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
  bookingSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  bookButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
