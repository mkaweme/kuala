import PropertyCard from "@/components/PropertyCard";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { WatchlistService } from "@/services/watchlistService";
import { Property } from "@/types/property";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const WatchlistScreen = () => {
  const { colors } = useColorScheme();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const loadWatchlist = async () => {
    try {
      setLoading(true);
      const { data, error } = await WatchlistService.getWatchlist();

      if (error) {
        Alert.alert("Error", error);
        return;
      }

      // Transform the data to match the Property interface
      const transformedData = data
        .map((item: any) => {
          if (item.properties) {
            const property = item.properties;
            const locationParts = property.location?.split(",") || ["", ""];

            return {
              id: property.id,
              title: property.title || "Property",
              description: property.description,
              price: parseFloat(property.price) || 0,
              area: locationParts[0]?.trim() || "",
              town: locationParts[1]?.trim() || "",
              listing: property.is_for_sale ? "sale" : "rent",
              features: [],
              photos:
                property.property_images?.map((img: any) => ({
                  name: "Property Image",
                  src: [img.image_url],
                })) || [],
              type: property.property_type?.toLowerCase() || "house",
              rate: "pm",
              createdAt: property.created_at,
              updatedAt: property.updated_at,
            };
          }
          return null;
        })
        .filter(Boolean);

      setWatchlist(transformedData);
    } catch (error) {
      console.error("Error loading watchlist:", error);
      Alert.alert("Error", "Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWatchlist();
    setRefreshing(false);
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const removeFromWatchlist = async (propertyId: string) => {
    try {
      const { success, error } = await WatchlistService.removeFromWatchlist(propertyId);

      if (success) {
        setWatchlist((prev) => prev.filter((item) => item.id !== propertyId));
        Alert.alert("Success", "Property removed from watchlist");
      } else {
        Alert.alert("Error", error || "Failed to remove from watchlist");
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      Alert.alert("Error", "Failed to remove from watchlist");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading your watchlist...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Watchlist</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {watchlist.length} {watchlist.length === 1 ? "property" : "properties"} saved
        </Text>
      </View>

      {watchlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Your watchlist is empty</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Start exploring properties and add them to your watchlist to see them here
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.propertiesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.propertiesContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {watchlist.map((property, index) => (
            <View key={property.id || index} style={styles.propertyWrapper}>
              <PropertyCard
                property={property}
                onPress={setSelectedProperty}
                showFavoriteButton={false}
              />
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: colors.error }]}
                onPress={() => removeFromWatchlist(property.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default WatchlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  propertiesContainer: {
    flex: 1,
  },
  propertiesContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  propertyWrapper: {
    marginBottom: 20,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    marginHorizontal: 20,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
});
