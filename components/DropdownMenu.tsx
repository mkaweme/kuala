import { useColorScheme } from "@/contexts/ColorSchemeContext";
import { WatchlistService } from "@/services/watchlistService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DropdownMenuProps {
  visible: boolean;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ visible, onClose }) => {
  const { colors } = useColorScheme();
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    if (visible) {
      loadWatchlistCount();
    }
  }, [visible]);

  const loadWatchlistCount = async () => {
    try {
      const { count } = await WatchlistService.getWatchlistCount();
      setWatchlistCount(count);
    } catch (error) {
      console.error("Error loading watchlist count:", error);
    }
  };

  const handleWatchlistPress = () => {
    onClose();
    router.push("/(tabs)/watchlist");
  };

  const menuItems = [
    {
      id: "watchlist",
      title: "Watchlist",
      icon: "heart-outline",
      onPress: handleWatchlistPress,
      badge: watchlistCount > 0 ? watchlistCount : undefined,
    },
    {
      id: "myBookings",
      title: "My Bookings",
      icon: "calendar-outline",
      onPress: () => {
        onClose();
        router.push("/(tabs)/myBookings");
      },
    },
    {
      id: "viewings",
      title: "Viewing Requests",
      icon: "people-outline",
      onPress: () => {
        onClose();
        router.push("/(tabs)/viewings");
      },
    },
    {
      id: "settings",
      title: "Settings",
      icon: "settings-outline",
      onPress: () => {
        onClose();
        // Navigate to settings when implemented
        console.log("Settings pressed");
      },
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => {
        onClose();
        // Navigate to help when implemented
        console.log("Help pressed");
      },
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemContent}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={colors.text}
                  style={styles.menuIcon}
                />
                <Text style={[styles.menuText, { color: colors.text }]}>{item.title}</Text>
                {item.badge && (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.badgeText, { color: colors.buttonText }]}>
                      {item.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

export default DropdownMenu;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 100,
    paddingRight: 20,
  },
  menuContainer: {
    width: 250,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
