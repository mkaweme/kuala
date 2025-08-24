import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { BookingService, ViewingBooking } from "@/services/bookingService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ViewingsScreen = () => {
  const { colors } = useColorScheme();
  const [viewings, setViewings] = useState<ViewingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed" | "completed">("pending");

  const loadViewings = async () => {
    try {
      setLoading(true);
      const { data, error } = await BookingService.getPropertyOwnerViewings();

      if (error) {
        Alert.alert("Error", error);
        return;
      }

      setViewings(data);
    } catch (error) {
      console.error("Error loading viewings:", error);
      Alert.alert("Error", "Failed to load viewings");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadViewings();
    setRefreshing(false);
  };

  useEffect(() => {
    loadViewings();
  }, []);

  const filteredViewings = viewings.filter((viewing) => viewing.status === activeTab);

  const handleStatusUpdate = async (
    viewingId: string,
    newStatus: "confirmed" | "cancelled" | "completed",
  ) => {
    try {
      const { success, error } = await BookingService.updateViewingStatus(viewingId, newStatus);

      if (success) {
        setViewings((prev) =>
          prev.map((viewing) =>
            viewing.id === viewingId ? { ...viewing, status: newStatus } : viewing,
          ),
        );
        Alert.alert("Success", `Viewing ${newStatus} successfully`);
      } else {
        Alert.alert("Error", error || "Failed to update viewing status");
      }
    } catch (error) {
      console.error("Error updating viewing status:", error);
      Alert.alert("Error", "Failed to update viewing status");
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#ff9500";
      case "confirmed":
        return "#4CAF50";
      case "cancelled":
        return "#ff4757";
      case "completed":
        return "#2196F3";
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "confirmed":
        return "checkmark-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      case "completed":
        return "checkmark-done-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading viewings...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Viewing Requests</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Manage property viewing requests
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.card }]}>
        {(["pending", "confirmed", "completed"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && { backgroundColor: colors.primary }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.buttonText : colors.textSecondary },
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredViewings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No {activeTab} viewings</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {activeTab === "pending"
              ? "You don't have any pending viewing requests"
              : `You don't have any ${activeTab} viewings`}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.viewingsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.viewingsContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {filteredViewings.map((viewing) => (
            <View key={viewing.id} style={[styles.viewingCard, { backgroundColor: colors.card }]}>
              {/* Property Info */}
              <View style={styles.propertyInfo}>
                <Text style={[styles.propertyTitle, { color: colors.text }]}>
                  {viewing.property?.title || "Property"}
                </Text>
                <Text style={[styles.propertyLocation, { color: colors.textSecondary }]}>
                  {viewing.property?.location || "Location not available"}
                </Text>
              </View>

              {/* Client Info */}
              <View style={styles.clientInfo}>
                <View style={styles.clientHeader}>
                  <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.clientName, { color: colors.text }]}>
                    {viewing.client?.full_name || "Unknown Client"}
                  </Text>
                </View>
                {viewing.client?.phone && (
                  <Text style={[styles.clientPhone, { color: colors.textSecondary }]}>
                    📞 {viewing.client.phone}
                  </Text>
                )}
                {viewing.client?.email && (
                  <Text style={[styles.clientEmail, { color: colors.textSecondary }]}>
                    ✉️ {viewing.client.email}
                  </Text>
                )}
              </View>

              {/* Viewing Details */}
              <View style={styles.viewingDetails}>
                <View style={styles.viewingHeader}>
                  <Ionicons
                    name={getStatusIcon(viewing.status)}
                    size={20}
                    color={getStatusColor(viewing.status)}
                  />
                  <Text style={[styles.viewingStatus, { color: getStatusColor(viewing.status) }]}>
                    {viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)}
                  </Text>
                </View>
                <Text style={[styles.viewingDateTime, { color: colors.text }]}>
                  📅 {formatDateTime(viewing.scheduled_at)}
                </Text>
                <Text style={[styles.viewingCreated, { color: colors.textSecondary }]}>
                  Requested: {new Date(viewing.created_at).toLocaleDateString()}
                </Text>
              </View>

              {/* Action Buttons */}
              {viewing.status === "pending" && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleStatusUpdate(viewing.id, "confirmed")}
                  >
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.error }]}
                    onPress={() => handleStatusUpdate(viewing.id, "cancelled")}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}

              {viewing.status === "confirmed" && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleStatusUpdate(viewing.id, "completed")}
                  >
                    <Ionicons name="checkmark-done" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Mark Complete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ViewingsScreen;

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
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
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
  viewingsContainer: {
    flex: 1,
  },
  viewingsContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  viewingCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyInfo: {
    marginBottom: 15,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 14,
  },
  clientInfo: {
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
  },
  clientHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  clientName: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  clientPhone: {
    fontSize: 14,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
  },
  viewingDetails: {
    marginBottom: 15,
  },
  viewingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  viewingStatus: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  viewingDateTime: {
    fontSize: 16,
    marginBottom: 4,
  },
  viewingCreated: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
});
