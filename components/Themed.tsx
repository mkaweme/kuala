/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import { useColorScheme } from "@/contexts/ColorSchemeContext";
import {
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView,
} from "react-native";
import React from "react";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ReturnType<typeof useColorScheme>["colors"],
) {
  const { colors } = useColorScheme();
  return colors[colorName];
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "inputBackground");
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, "inputBorder");

  return (
    <DefaultTextInput
      style={[
        {
          color,
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          fontSize: 16,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
