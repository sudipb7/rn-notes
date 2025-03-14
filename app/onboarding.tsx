import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/contexts/authContext";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, loading: authLoading, onboardUser } = useAuth();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      Keyboard.dismiss();

      const response = await onboardUser(values.name);
      if ("error" in response) {
        Alert.alert("Error", response.error);
        return;
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      reset();
    }
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
    if (user?.name) {
      router.replace("/notes");
    }
  }, [user, authLoading]);

  if (authLoading) {
    return <SafeAreaView className="flex-1 bg-background" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-secondary py-12 px-6">
      <View className="w-full flex-1 items-center justify-center">
        <View className="rounded-2xl bg-brand justify-center items-center size-16">
          <Feather name="book-open" size={32} color="#fff" />
        </View>
        <Text className="text-3xl font-[Serif-Italic] text-foreground mt-4">
          Just one more step
        </Text>
        <Text className="font-[Sans-Medium] text-foreground-secondary">
          Begin by adding your name
        </Text>
        <View className="mt-12 w-full">
          <View className="w-full mb-8">
            <Text className="font-[Sans-Medium] text-foreground-secondary mb-3">
              Name
            </Text>
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  className="w-full text-lg py-3 px-5 rounded-full self-stretch border border-border bg-background focus:border-brand-strong"
                  inputMode="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  value={value}
                  style={{ lineHeight: undefined }}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  aria-disabled={isSubmitting}
                />
              )}
            />
            {errors.name?.message && (
              <Text className="font-[Sans-Medium] text-red-500 mt-2 mb-3">
                {errors.name?.message}
              </Text>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`rounded-full w-full items-center justify-center bg-brand mb-6 p-3 ${
              isSubmitting && "opacity-85"
            }`}
          >
            {isSubmitting ? (
              <Feather
                name="loader"
                size={22}
                color="#fff"
                className="animate-spin"
              />
            ) : (
              <Text className="text-white text-lg font-[Sans-Medium]">
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
