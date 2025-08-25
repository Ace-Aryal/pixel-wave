import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function Create() {
  const router = useRouter();
  const { user } = useUser();
  const [caption, setCaption] = React.useState<string>("");
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(true);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };
  if (!selectedImage) {
    return (
      <View className="flex-1">
        <View
          id="header"
          className="flex-row items-center justify-center  mt-6 border-b border-gray-200 pb-6"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-6 bottom-6"
          >
            <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          </TouchableOpacity>
          <Text className=" text-2xl font-semibold">New Post</Text>
        </View>

        <View className="flex-1">
          <TouchableOpacity
            onPress={pickImage}
            className="top-[45%] left-1/2 absolute -translate-x-[50%] -translate-y-[50%] flex flex-col items-center"
          >
            <Ionicons size={52} name="image-outline" color={"gray"} />
            <View className="">
              <Text className="text-gray-500 text-lg">
                Tap to select a photo
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      className="flex-1 "
    >
      <View
        id="header"
        className="flex-row items-center justify-between px-6  mt-6 border-b border-gray-200 pb-6"
      >
        <TouchableOpacity onPress={() => router.back()} className="">
          <Ionicons name="close" size={20} color="gray" className="" />
        </TouchableOpacity>
        <Text className=" text-2xl font-semibold">New Post</Text>
        <View className="h-6 justify-center items-center">
          {isSharing ? (
            <ActivityIndicator
              size="small"
              color="#7c3aed"
              style={{ marginRight: 8 }}
            />
          ) : (
            <Text className="text-xl font-semibold text-primary">Post</Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
