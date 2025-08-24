import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import SkeletonInstagram from "@/components/skeletons";
export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return <SkeletonInstagram />;
  }
  console.log("isSignedIn", isSignedIn);
  if (!isSignedIn) {
    return <Redirect href={"/(auth)/login"} />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#ede9fe", // light violet background
          borderTopWidth: 0,
          height: 50,
          paddingTop: 6,
          position: "absolute",
          bottom: 10,
          marginHorizontal: 10,
          borderRadius: 20,
        },

        tabBarShowLabel: false,
        tabBarIconStyle: { marginTop: 0 }, // remove reserved space for label
        tabBarActiveTintColor: "#7c3aed", // rich violet for active
        tabBarInactiveTintColor: "#6b7280", // gray-500 for inactive
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Feed",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home-outline"
              size={focused ? 28 : 24}
              color={focused ? "#7c3aed" : "#6b7280"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={"bookmark-outline"}
              size={focused ? 28 : 24}
              color={focused ? "#7c3aed" : "#6b7280"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="add-circle-outline"
              size={focused ? 30 : 28}
              color={focused ? "#7c3aed" : "#6b7280"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="notifications-outline"
              size={focused ? 28 : 24}
              color={focused ? "#7c3aed" : "#6b7280"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={"person-circle-outline"}
              size={focused ? 30 : 26}
              color={focused ? "#7c3aed" : "#6b7280"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
