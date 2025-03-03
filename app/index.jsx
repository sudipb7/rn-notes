import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

import { useAuth } from "@/contexts/authContext";
import PostItImage from "@/assets/images/post-it.png";

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/notes");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="text-center items-center justify-center">
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-5 bg-[#f8f9fa]">
      <Image
        source={PostItImage}
        className="w-[100px] h-[100px] mb-5 rounded-[10px]"
      />
      <Text className="text-3xl font-bold mb-3 text-[#333]">
        Welcome to Notes App
      </Text>
      <Text className="text-base text-[#666] mb-5 text-center">
        Capture your thoughts anytime, anywhere
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/notes")}
        className="bg-[#007bff] py-3 px-6 rounded-lg items-center"
      >
        <Text className="text-white text-lg font-bold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
