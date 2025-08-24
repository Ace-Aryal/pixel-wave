import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function LoginPage() {
  const { startSSOFlow } = useSSO();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const router = useRouter();
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)/index");
      }
    } catch (error) {
      console.error("error logging in", error);
    } finally {
      setIsLoggingIn(false);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <View className="mt-[15vh]">
        <Image
          className="h-20 w-20 mx-auto bg-purple-200 rounded-lg"
          source={require("@/assets/images/logo.png")}
        />
        <Text className="text-5xl font-medium text-center mt-4 text-primary">
          pixelwave
        </Text>
        <Text className="mt-2 text-center text-xl text-gray-500/80">
          don{`'`}t miss anything
        </Text>
      </View>
      <View className="mt-4 ">
        <View className="ml-10">
          <Image
            source={require("@/assets/images/auth-vector-3.jpg")}
            className="w-96 h-96 mx-auto "
          />
        </View>

        <Pressable
          disabled={isLoggingIn}
          onPress={handleGoogleLogin}
          className="flex flex-row bg-purple-200 rounded-lg mx-auto mt-8 items-center px-12 py-3"
        >
          <Ionicons name="logo-google" size={24} color="black" />
          <Text className="text-lg font-bold ml-2">Continue with Google</Text>
        </Pressable>
        <Text className="text-gray-500/80 text-center mt-4">
          By continuing, you agree to our Terms and Privacy Policy{" "}
        </Text>
      </View>
    </View>
  );
}
