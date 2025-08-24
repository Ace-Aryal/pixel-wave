import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import SkeletonInstagram from "@/components/skeletons";

export default function SSOCallback() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      router.replace("/"); // go to main tabs
    }
  }, [isLoaded, isSignedIn]);

  return <SkeletonInstagram />; // show loader instead of error
}
