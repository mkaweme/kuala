import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from "react-native";
import { useAppInitialization } from "../hooks/useAppInitialization";

export default function LandingPage() {
  const { isLoading, isAuthenticated, error } = useAppInitialization();

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        // If there's an error, still navigate to login
        console.error("App initialization error:", error);
        router.replace("/login");
      } else if (isAuthenticated) {
        // If user is already authenticated, go directly to main app
        router.replace("/(tabs)");
      } else {
        // If not authenticated, go to login
        router.replace("/login");
      }
    }
  }, [isLoading, isAuthenticated, error]);

  return (
    <ImageBackground
      source={require("../assets/images/lusaka-cbd.jpg")}
      style={styles.backgroundImage}
      blurRadius={5}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Welcome to Kuala</Text>
            <Text style={styles.subtitle}>Your no 1 real estate experience</Text>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 15,
    opacity: 0.8,
  },
});
