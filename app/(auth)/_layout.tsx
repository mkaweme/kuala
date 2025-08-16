import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTintColor: "#fff",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign Up",
          headerShown: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTintColor: "#fff",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="resetPassword"
        options={{
          title: "Reset Password",
          headerShown: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTintColor: "#fff",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
}
