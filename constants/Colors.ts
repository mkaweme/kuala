export type ColorScheme = "light" | "dark" | "device";

export interface AppColors {
  // Background colors
  background: string;
  surface: string;
  card: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Border and divider colors
  border: string;
  divider: string;

  // Input colors
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;

  // Button colors
  buttonPrimary: string;
  buttonSecondary: string;
  buttonText: string;
  buttonTextSecondary: string;

  // Shadow colors
  shadow: string;

  // Profile type colors
  tenant: string;
  landlord: string;
  agent: string;
}

export const lightColors: AppColors = {
  // Background colors
  background: "#f8f9fa",
  surface: "#ffffff",
  card: "#ffffff",

  // Text colors
  text: "#1a1a1a",
  textSecondary: "#666666",
  textTertiary: "#999999",

  // Primary colors
  primary: "#4CAF50",
  primaryLight: "#66BB6A",
  primaryDark: "#388E3C",

  // Secondary colors
  secondary: "#2196F3",
  secondaryLight: "#42A5F5",
  secondaryDark: "#1976D2",

  // Status colors
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#f44336",
  info: "#2196F3",

  // Border and divider colors
  border: "#e0e0e0",
  divider: "#f0f0f0",

  // Input colors
  inputBackground: "#f8f9fa",
  inputBorder: "#e0e0e0",
  inputPlaceholder: "#999999",

  // Button colors
  buttonPrimary: "#4CAF50",
  buttonSecondary: "#f8f9fa",
  buttonText: "#ffffff",
  buttonTextSecondary: "#666666",

  // Shadow colors
  shadow: "#000000",

  // Profile type colors
  tenant: "#4CAF50",
  landlord: "#FF9800",
  agent: "#2196F3",
};

export const darkColors: AppColors = {
  // Background colors
  background: "#121212",
  surface: "#1e1e1e",
  card: "#2d2d2d",

  // Text colors
  text: "#ffffff",
  textSecondary: "#b0b0b0",
  textTertiary: "#808080",

  // Primary colors
  primary: "#66BB6A",
  primaryLight: "#81C784",
  primaryDark: "#4CAF50",

  // Secondary colors
  secondary: "#42A5F5",
  secondaryLight: "#64B5F6",
  secondaryDark: "#2196F3",

  // Status colors
  success: "#66BB6A",
  warning: "#FFB74D",
  error: "#EF5350",
  info: "#42A5F5",

  // Border and divider colors
  border: "#404040",
  divider: "#2d2d2d",

  // Input colors
  inputBackground: "#2d2d2d",
  inputBorder: "#404040",
  inputPlaceholder: "#808080",

  // Button colors
  buttonPrimary: "#66BB6A",
  buttonSecondary: "#2d2d2d",
  buttonText: "#ffffff",
  buttonTextSecondary: "#b0b0b0",

  // Shadow colors
  shadow: "#000000",

  // Profile type colors
  tenant: "#66BB6A",
  landlord: "#FFB74D",
  agent: "#42A5F5",
};

export const getColors = (
  colorScheme: ColorScheme,
  deviceColorScheme: "light" | "dark",
): AppColors => {
  if (colorScheme === "device") {
    return deviceColorScheme === "dark" ? darkColors : lightColors;
  }
  return colorScheme === "dark" ? darkColors : lightColors;
};
