import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import "../global.css";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        {/* makes status bar text dark */}
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
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
