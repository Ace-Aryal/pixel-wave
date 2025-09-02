import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Toast from "react-native-toast-message";

export default function Create() {
  const router = useRouter();
  const { user } = useUser();
  const [caption, setCaption] = React.useState<string>("");
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

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
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);
  const handleShare = async () => {
    if (!selectedImage) {
      return;
    }
    try {
      console.log("starting to share");
      setIsSharing(true);
      const uploadUrl = await generateUploadUrl();
      console.log("upload url", uploadUrl);
      const uploadResult = await FileSystem.uploadAsync(
        uploadUrl,
        selectedImage,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          mimeType: "image/jpeg",
        }
      );
      console.log("upload result", uploadResult);
      if (uploadResult.status !== 200) {
        throw new Error("Upload failed");
      }
      const { storageId } = JSON.parse(uploadResult.body);
      await createPost({ storageId, caption });
      Toast.show({
        type: "success",
        text1: "Post created",
        visibilityTime: 3000,
      });
      setSelectedImage(null);
      setCaption("");
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error sharing the post", error);
      Toast.show({
        type: "error",
        text1: "Error sharing the post",
        visibilityTime: 3000,
      });
    } finally {
      setIsSharing(false);
    }
  };
  if (!selectedImage) {
    return (
      <View className="flex-1">
        <View
          id="header"
          className="flex-row items-center justify-center mt-6 border-b border-gray-200 pb-6"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-6 bottom-6"
          >
            <Ionicons name="arrow-back" size={20} color="#7c3aed" />
          </TouchableOpacity>
          <Text className="text-2xl font-semibold">New Post</Text>
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
    <View className="flex-1">
      <View
        id="header"
        className="flex-row items-center justify-between px-6 mt-6 border-b border-gray-200 pb-6"
      >
        <TouchableOpacity onPress={() => router.back()} className="">
          <Ionicons name="close" size={20} color="gray" className="" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold">New Post</Text>
        <View className="h-6 justify-center items-center">
          {isSharing ? (
            <ActivityIndicator
              size="small"
              color="#7c3aed"
              style={{ marginRight: 8 }}
            />
          ) : (
            <TouchableOpacity onPress={handleShare}>
              <Text className="text-xl font-semibold text-primary">Post</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 100 : 150}
        extraHeight={Platform.OS === "ios" ? 100 : 150}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        <View className="w-full">
          <View className="w-[97%] relative mt-1 mx-auto aspect-square">
            <Image
              source={{
                uri: selectedImage,
              }}
              style={{ width: "100%", height: "100%", borderRadius: 8 }}
              contentFit="cover"
              transition={200}
            />
            <TouchableOpacity
              disabled={isSharing}
              onPress={pickImage}
              className="absolute bottom-2 right-2 bg-black/30 rounded-full p-2 flex-row"
            >
              <Ionicons name="image-outline" size={16} color="white" />
              <Text className="text-white ml-1">Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row w-full m-2.5 gap-2 items-start">
          <Image
            source={{
              uri: user?.imageUrl,
            }}
            style={{ height: 30, width: 30, borderRadius: 32 }}
          />
          <TextInput
            value={caption}
            onChangeText={setCaption}
            multiline
            editable={!isSharing}
            scrollEnabled={false}
            textAlignVertical="top"
            className="flex-1  rounded-lg"
            placeholder="Enter caption..."
            style={{
              minHeight: 120,
              paddingTop: 8,
              paddingHorizontal: 8,
            }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
