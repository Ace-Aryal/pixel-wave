import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { Image } from "expo-image";

const stories = [
  {
    id: 0,
    name: "You",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "1",
    name: "Alice",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    name: "Bob",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: "3",
    name: "Clara",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: "4",
    name: "David",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: "5",
    name: "Ella",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: "6",
    name: "Frank",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: "7",
    name: "Grace",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: "8",
    name: "Henry",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    id: "9",
    name: "Ivy",
    avatar: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    id: "10",
    name: "Jack",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

const posts = [
  { id: "1", user: "User1", photo: "https://placekitten.com/400/400" },
  { id: "2", user: "User2", photo: "https://placekitten.com/401/400" },
];
export default function HomePage() {
  const { signOut } = useAuth();
  return (
    <View className="p-1">
      <View id="" className="px-2 my-3 flex-row items-center justify-between">
        <Text className="text-3xl font-medium text-primary">PIXELWAVE</Text>
        <TouchableOpacity
          onPress={() => {
            signOut();
          }}
        >
          <Ionicons name="log-out-outline" size={28} color={"gray"} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-4 ">
            <Text style={{ fontWeight: "bold" }}>{item.user}</Text>
            <Image
              source={{ uri: item.photo }}
              style={{ width: "100%", height: 300 }}
            />
          </View>
        )}
        // 👇 Stories go here as a header
        ListHeaderComponent={() => (
          <FlatList
            data={stories}
            keyExtractor={(item) => item.avatar}
            renderItem={({ item, index }) => (
              <View style={{ alignItems: "center", marginRight: 12 }}>
                <View
                  style={{
                    borderWidth: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: index === 0 ? "gray" : "green",
                    borderRadius: 33,
                    height: 66,
                    width: 66,
                  }}
                >
                  <Image
                    source={{ uri: item.avatar }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                    }}
                  />
                </View>

                <Text>{item.name}</Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          />
        )}
      />
    </View>
  );
}
