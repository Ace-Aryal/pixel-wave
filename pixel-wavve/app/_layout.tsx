import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import Toast from "react-native-toast-message";
import "../global.css";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);
export default function RootLayout() {
  console.log("Convex URL:", process.env.EXPO_PUBLIC_CONVEX_URL);
  console.log(
    "Clerk Key:",
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + "..."
  );
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {/* makes status bar text dark */}
        <SafeAreaProvider>
          <StatusBar style="dark" />
          {/* Full background for notch + status */}
          <SafeAreaView
            className="flex-1 bg-gray-100"
            edges={["top", "left", "right"]}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)/login" />
            </Stack>
          </SafeAreaView>
          {/* </View> */}
          <Toast position="top" />
        </SafeAreaProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
