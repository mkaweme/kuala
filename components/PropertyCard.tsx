import { WatchlistService } from "@/services/watchlistService";
import {
  Property,
  isFarmProperty,
  isHouseProperty,
  isOfficeProperty,
  isPlotProperty,
  isWarehouseProperty,
} from "@/types/property";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PropertyCardProps {
  property: Property;
  onPress?: (property: Property) => void;
  showFavoriteButton?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  showFavoriteButton = true,
}) => {
  const [isWatched, setIsWatched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showFavoriteButton) {
      checkWatchlistStatus();
    }
  }, [property.id, showFavoriteButton]);

  const checkWatchlistStatus = async () => {
    try {
      const { isWatched: watched } = await WatchlistService.isInWatchlist(property.id);
      setIsWatched(watched);
    } catch (error) {
      console.error("Error checking watchlist status:", error);
    }
  };

  const handleFavoritePress = async (e: GestureResponderEvent) => {
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isWatched) {
        const { success, error } = await WatchlistService.removeFromWatchlist(property.id);
        if (success) {
          setIsWatched(false);
        } else {
          Alert.alert("Error", error || "Failed to remove from watchlist");
        }
      } else {
        const { success, error } = await WatchlistService.addToWatchlist(property.id);
        if (success) {
          setIsWatched(true);
        } else {
          Alert.alert("Error", error || "Failed to add to watchlist");
        }
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      Alert.alert("Error", "Failed to update watchlist");
    } finally {
      setIsLoading(false);
    }
  };
  const formatPrice = (price: number, rate?: string) => {
    const formattedPrice = `K${price / 100}`;
    return rate ? `${formattedPrice}${rate}` : formattedPrice;
  };

  const renderTypeSpecificInfo = () => {
    switch (property.type) {
      case "house":
        if (isHouseProperty(property)) {
          return (
            <Text style={styles.bedroomsText}>
              {property.noOfBedrooms} Bedroom{property.noOfBedrooms > 1 ? "s" : ""}
              {property.noOfBathrooms &&
                ` • ${property.noOfBathrooms} Bathroom${property.noOfBathrooms > 1 ? "s" : ""}`}
            </Text>
          );
        }
        break;

      case "office":
        if (isOfficeProperty(property)) {
          return (
            <Text style={styles.bedroomsText}>
              {property.squareFootage} sq ft Office
              {property.floorNumber && ` • Floor ${property.floorNumber}`}
            </Text>
          );
        }
        break;

      case "plot":
        if (isPlotProperty(property)) {
          return (
            <Text style={styles.bedroomsText}>
              {property.squareFootage} sq ft Plot
              {property.zoning && ` • ${property.zoning} Zoning`}
            </Text>
          );
        }
        break;

      case "farm":
        if (isFarmProperty(property)) {
          return (
            <Text style={styles.bedroomsText}>
              {property.acreage} Acres
              {property.soilType && ` • ${property.soilType} Soil`}
            </Text>
          );
        }
        break;

      case "warehouse":
        if (isWarehouseProperty(property)) {
          return (
            <Text style={styles.bedroomsText}>
              {property.squareFootage} sq ft Warehouse
              {property.loadingDock && " • Loading Dock"}
            </Text>
          );
        }
        break;

      default:
        return null;
    }
  };

  const getPropertyTypeIcon = () => {
    switch (property.type) {
      case "house":
        return "home-outline";
      case "office":
        return "business-outline";
      case "plot":
        return "map-outline";
      case "farm":
        return "leaf-outline";
      case "warehouse":
        return "cube-outline";
      default:
        return "home-outline";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => onPress?.(property)}
    >
      {property.photos.length > 0 && (
        <View style={styles.propertyContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={property.photos[0].src[0] as any}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Price Tag */}
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{formatPrice(property.price, property.rate)}</Text>
            </View>

            {/* Listing Type Tag */}
            <View style={styles.listingTypeTag}>
              <Text style={styles.listingTypeText}>{property.listing}</Text>
            </View>

            {/* Property Type Icon */}
            <View style={styles.propertyTypeTag}>
              <Ionicons name={getPropertyTypeIcon() as any} size={16} color="#ffffff" />
            </View>

            {/* Favorite Button */}
            {showFavoriteButton && (
              <TouchableOpacity
                style={[styles.favoriteButton, isWatched && styles.favoriteButtonActive]}
                onPress={handleFavoritePress}
                disabled={isLoading}
              >
                <Ionicons
                  name={isWatched ? "heart" : "heart-outline"}
                  size={20}
                  color={isWatched ? "#ffffff" : "#ffffff"}
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              {/* Property Title */}
              <Text style={styles.titleText} numberOfLines={1}>
                {property.title}
              </Text>

              {/* Type-specific information */}
              {renderTypeSpecificInfo()}

              {/* Location */}
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={18} color="#4CAF50" />
                <Text style={styles.locationText}>
                  {property.area}, {property.town}
                </Text>
              </View>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {property.features.slice(0, 3).map((feature, index) => (
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

export default PropertyCard;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  propertyContainer: {
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
  propertyTypeTag: {
    position: "absolute",
    top: 15,
    left: 80,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  contentContainer: {
    padding: 20,
  },
  headerRow: {
    marginBottom: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  bedroomsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
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
  favoriteButton: {
    position: "absolute",
    top: 15,
    right: 80,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteButtonActive: {
    backgroundColor: "#ff4757",
  },
});
