import { useRouter } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import Feather from "@expo/vector-icons/Feather";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";

import { useAuth } from "@/contexts/authContext";
import AuthBottomSheet from "@/components/AuthBottomSheet";

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const [type, setType] = useState<"register" | "login">("register");

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/notes");
    }
  }, [user, loading]);

  if (loading) {
    return <SafeAreaView className="flex-1 bg-background" />;
  }

  return (
    <SafeAreaView className="flex-1 justify-between items-center py-12 px-6 bg-background">
      <View className="flex-1 w-full">
        <View className="rounded-2xl bg-brand justify-center items-center size-16">
          <Feather name="book-open" size={32} color="#fff" />
        </View>
        <Text className="text-4xl text-foreground font-[Serif-Regular] leading-snug mt-8">
          A place on the internet for
          <Text className="text-4xl font-[Serif-Italic] leading-snug">
            {" "}
            Thinkers & Creators{" "}
          </Text>
          to share their thoughts and ideas.
        </Text>
      </View>
      <View className="w-full">
        <View>
          <TouchableOpacity
            onPress={() => {
              setType("register");
              handleSnapPress(0);
            }}
            activeOpacity={0.85}
            className="rounded-3xl bg-background-secondary border border-border p-5"
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-xl font-[Sans-SemiBold] text-foreground">
                  Join NotesApp
                </Text>
                <Text className="font-[Sans-Regular] text-foreground-secondary mt-0.5">
                  Create your NotesApp account.
                </Text>
              </View>
              <View className="rounded-2xl bg-brand size-12 items-center justify-center">
                <Feather name="arrow-up-right" size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setType("login");
              handleSnapPress(0);
            }}
            activeOpacity={0.85}
            className="rounded-3xl bg-background-secondary border border-border p-5 mt-4"
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-xl font-[Sans-SemiBold] text-foreground">
                  Login
                </Text>
                <Text className="font-[Sans-Regular] text-foreground-secondary mt-0.5">
                  Already have a NotesApp account.
                </Text>
              </View>
              <View className="rounded-2xl bg-brand size-12 items-center justify-center">
                <Feather name="arrow-up-right" size={20} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View className="mt-16">
          <Text className="text-foreground-secondary text-sm font-[Sans-Regular] w-full text-center">
            @ NotesApp Inc.
          </Text>
        </View>
      </View>
      <AuthBottomSheet
        type={type}
        sheetRef={sheetRef}
        snapPoints={snapPoints}
        handleSheetChange={handleSheetChange}
      />
    </SafeAreaView>
  );
}
