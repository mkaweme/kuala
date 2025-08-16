import { supabase } from "@/assets/supabase_client";
import { useEffect, useState } from "react";

interface AppInitializationState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  userPreferences: any | null;
}

export const useAppInitialization = () => {
  const [state, setState] = useState<AppInitializationState>({
    isLoading: true,
    isAuthenticated: false,
    error: null,
    userPreferences: null,
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check authentication status
        const {
          data: { session },
          error: authError,
        } = await supabase.auth.getSession();

        if (authError) {
          console.error("Auth error:", authError);
          setState((prev) => ({ ...prev, error: authError.message, isLoading: false }));
          return;
        }

        const isAuthenticated = !!session;

        // Load user preferences if authenticated
        let userPreferences = null;
        if (isAuthenticated && session?.user) {
          try {
            // Example: Load user preferences from Supabase
            const { data: preferences, error: prefError } = await supabase
              .from("user_preferences")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            if (!prefError) {
              userPreferences = preferences;
            }
          } catch (error) {
            console.log("No user preferences found or error loading them");
          }
        }

        // Add any other initialization logic here
        // For example:
        // - Load app configuration
        // - Initialize analytics
        // - Load cached data
        // - Check for app updates

        // Simulate additional loading time (remove this in production)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setState({
          isLoading: false,
          isAuthenticated,
          error: null,
          userPreferences,
        });
      } catch (error) {
        console.error("App initialization error:", error);
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Unknown error",
          isLoading: false,
        }));
      }
    };

    initializeApp();
  }, []);

  return state;
};
