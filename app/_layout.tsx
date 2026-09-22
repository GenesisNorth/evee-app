import "../global.css";
import "@/lib/css-interop";
import { useEffect, useCallback } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  useFonts,
  Exo2_800ExtraBold_Italic,
  Exo2_900Black_Italic,
} from "@expo-google-fonts/exo-2";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useSession } from "@/hooks/use-session";
import { useProfile } from "@/hooks/use-profile";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Exo2_800ExtraBold_Italic,
    Exo2_900Black_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <RootLayoutNav />
          <Toast />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// useProfile() needs react-query context, so it can only run inside
// QueryClientProvider — not in the same component that creates it.
function RootLayoutNav() {
  const { session, loading: sessionLoading } = useSession();
  const { data: profile, isPending: profilePending } = useProfile();

  const stateReady = !sessionLoading && (!session || !profilePending);
  if (!stateReady) return null;

  const isOnboarded = !!profile?.onboarded;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#040404" } }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="vehicle/[id]" />
      <Stack.Screen name="compare" />
      <Stack.Screen name="charge" />
      <Stack.Screen name="service" />
      <Stack.Screen name="learn" />
      <Stack.Screen name="connect" />
      <Stack.Screen name="finance-portal" />
      <Stack.Screen name="finance/apply" />
      <Stack.Screen name="insure-portal" />
      <Stack.Screen name="insure/quote" />
      <Stack.Screen name="finance/[vehicleId]" />
      <Stack.Screen name="insure/[vehicleId]" />
      <Stack.Screen name="activity" />
    </Stack>
  );
}
