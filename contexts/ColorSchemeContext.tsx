import { AppColors, ColorScheme, getColors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  colors: AppColors;
  deviceColorScheme: "light" | "dark";
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");
  }
  return context;
};

interface ColorSchemeProviderProps {
  children: React.ReactNode;
}

const COLOR_SCHEME_STORAGE_KEY = "@kuala_color_scheme";

export const ColorSchemeProvider: React.FC<ColorSchemeProviderProps> = ({ children }) => {
  const deviceColorScheme = useDeviceColorScheme() as "light" | "dark";
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("device");

  useEffect(() => {
    // Load saved color scheme from storage
    const loadColorScheme = async () => {
      try {
        const savedScheme = await AsyncStorage.getItem(COLOR_SCHEME_STORAGE_KEY);
        if (savedScheme && ["light", "dark", "device"].includes(savedScheme)) {
          setColorSchemeState(savedScheme as ColorScheme);
        }
      } catch (error) {
        console.error("Error loading color scheme:", error);
      }
    };

    loadColorScheme();
  }, []);

  const setColorScheme = async (scheme: ColorScheme) => {
    try {
      await AsyncStorage.setItem(COLOR_SCHEME_STORAGE_KEY, scheme);
      setColorSchemeState(scheme);
    } catch (error) {
      console.error("Error saving color scheme:", error);
    }
  };

  const colors = getColors(colorScheme, deviceColorScheme);

  const value = {
    colorScheme,
    setColorScheme,
    colors,
    deviceColorScheme,
  };

  return <ColorSchemeContext.Provider value={value}>{children}</ColorSchemeContext.Provider>;
};
