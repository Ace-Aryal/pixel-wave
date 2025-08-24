// SkeletonInstagram.tsx
import React, { useEffect, useRef } from "react";
import { View, FlatList, Animated } from "react-native";

type SkeletonProps = {
  className?: string;
  rounded?: string;
};

const Skeleton = ({
  className = "",
  rounded = "rounded-lg",
}: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className={`bg-gray-300 ${rounded} ${className}`}
    />
  );
};

const HeaderBarSkeleton = () => (
  <View className="flex-row items-center justify-between px-4 py-3">
    <View className="flex-row items-center gap-3">
      <Skeleton className="w-9 h-9" rounded="rounded-full" />
      <Skeleton className="w-28 h-3" />
    </View>
    <Skeleton className="w-6 h-3" />
  </View>
);

const StoriesRowSkeleton = () => (
  <View className="px-3 py-2">
    <FlatList
      data={Array.from({ length: 8 })}
      keyExtractor={(_, i) => `story-${i}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="w-3" />}
      renderItem={() => (
        <View className="items-center">
          <Skeleton className="w-16 h-16" rounded="rounded-full" />
          <Skeleton className="w-12 h-3 mt-2" />
        </View>
      )}
    />
  </View>
);

const PostCardSkeleton = () => (
  <View className="mb-6">
    <HeaderBarSkeleton />
    <Skeleton className="w-full aspect-square" rounded="rounded-none" />
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="flex-row items-center gap-3">
        <Skeleton className="w-6 h-6 rounded-md" />
        <Skeleton className="w-6 h-6 rounded-md" />
        <Skeleton className="w-6 h-6 rounded-md" />
      </View>
      <Skeleton className="w-6 h-6 rounded-md" />
    </View>
    <View className="px-4 pb-2">
      <Skeleton className="w-24 h-3 mb-2" />
      <Skeleton className="w-10/12 h-3 mb-2" />
      <Skeleton className="w-8/12 h-3" />
    </View>
  </View>
);

export default function SkeletonInstagram() {
  return (
    <View className="flex-1 bg-white">
      {/* Top nav */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Skeleton className="w-24 h-5" />
        <View className="flex-row items-center gap-3">
          <Skeleton className="w-6 h-6 rounded-md" />
          <Skeleton className="w-6 h-6 rounded-md" />
        </View>
      </View>

      <StoriesRowSkeleton />

      <FlatList
        data={Array.from({ length: 4 })}
        keyExtractor={(_, i) => `post-${i}`}
        renderItem={() => <PostCardSkeleton />}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
