import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function Profile() {
  const { signOut } = useAuth();
  return (
    <View className="flex-1 justify-center items-center">
      <Text>profile</Text>
      <TouchableOpacity
        onPress={() => {
          signOut();
        }}
        className="bg-red-500 px-4 py-2 rounded-lg"
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
