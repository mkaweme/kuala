import { supabase } from "@/assets/supabase_client";
import { useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { colors } = useColorScheme();
  const [showCreateListing, setShowCreateListing] = useState<boolean>(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase.from("profiles").select("role").eq("id", user.id);
      if (error) {
        console.error("Error fetching role:", error);
        return;
      }
      setShowCreateListing(
        data[0].role === "landlord" || data[0].role === "seller" || data[0].role === "agent",
      );
    };

    fetchUserRole();
  }, [user?.id]);

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={colors.text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="createListing"
        options={{
          title: "Create",
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          href: showCreateListing ? undefined : null, // hide if not allowed
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: "Test",
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
          href: !showCreateListing ? undefined : null, // hide if not allowed
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: "Watchlist",
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
          href: null, // Hide from tab bar, accessible via dropdown
        }}
      />
      <Tabs.Screen
        name="myBookings"
        options={{
          title: "My Bookings",
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          href: null, // Hide from tab bar, accessible via dropdown
        }}
      />
      <Tabs.Screen
        name="viewings"
        options={{
          title: "Viewings",
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          href: null, // Hide from tab bar, accessible via dropdown
        }}
      />
    </Tabs>
  );
}
