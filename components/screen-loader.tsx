import { View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";

export function ScreenLoader() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center">
      <View className="rounded-2xl bg-brand justify-center items-center size-20">
        <Feather name="book-open" size={40} color="#fff" />
      </View>
    </SafeAreaView>
  );
}
