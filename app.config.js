import "dotenv/config";

export default ({ config }) => {
  return {
    ...config,
    name: "kuala",
    slug: "kuala",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.makoba.kuala",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      config: {
        googleMapsApiKey: "process.env.GOOGLE_MAPS_API_KEY", // iOS key
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.makoba.kuala",
      config: {
        googleMaps: {
          apiKey: "process.env.GOOGLE_MAPS_API_KEY", // Android key
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-font",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow Kuala to use your location.",
        },
      ],
      [
        "expo-maps",
        {
          googleMapsApiKey: "process.env.GOOGLE_MAPS_API_KEY",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "ae442ff3-77e3-496d-adfe-db1e8ad256ee",
      },
    },
  };
};
