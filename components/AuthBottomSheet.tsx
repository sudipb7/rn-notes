import {
  Text,
  View,
  Alert,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { z } from "zod";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useCallback, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Easing } from "react-native-reanimated";
import { useAuth } from "@/contexts/authContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

interface AuthBottomSheetProps {
  snapPoints: string[];
  type: "register" | "login";
  sheetRef: React.RefObject<BottomSheet>;
  handleSheetChange: (index: number) => void;
}

export default function AuthBottomSheet({
  type,
  sheetRef,
  snapPoints: initialSnapPoints,
  handleSheetChange,
}: AuthBottomSheetProps) {
  const { login, register } = useAuth();
  const [snapPoints, setSnapPoints] = useState(initialSnapPoints);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      Keyboard.dismiss();

      let response;
      if (type === "register") {
        response = await register(values.email, values.password);
      } else {
        response = await login(values.email, values.password);
      }

      if ("error" in response) {
        Alert.alert("Error", response.error);
        return;
      }

      sheetRef.current?.close();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      reset();
    }
  }

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleInputFocus = () => {
    setSnapPoints(["100%"]);
  };

  const handleInputBlur = () => {
    setSnapPoints(initialSnapPoints);
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      keyboardBehavior={Platform.OS === "ios" ? "extend" : "interactive"}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      onChange={handleSheetChange}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      animationConfigs={{
        duration: 270,
        easing: Easing.bezier(0.26, 0.08, 0.25, 1),
      }}
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      handleIndicatorStyle={{ backgroundColor: "#ccc" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} className="flex-1">
        <BottomSheetView
          className={`flex-1 px-6 pt-8 items-center ${
            snapPoints.length === 1 ? "pb-0" : "pb-6"
          }`}
        >
          <View className="w-full flex-1 items-center justify-center">
            <View className="rounded-2xl bg-brand justify-center items-center size-16">
              <Feather name="book-open" size={32} color="#fff" />
            </View>

            <Text className="text-3xl font-[Serif-Italic] text-foreground mt-4">
              {type === "register" ? "Welcome to NotesApp" : "Log in"}
            </Text>

            <Text className="font-[Sans-Medium] text-foreground-secondary">
              {type === "register"
                ? "Begin by creating an account"
                : "Log in to your account"}
            </Text>

            <View className="mt-12 w-full">
              <View className="w-full mb-6">
                <Text className="font-[Sans-Medium] text-foreground-secondary mb-3">
                  Email
                </Text>
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <BottomSheetTextInput
                      className="w-full text-lg py-3 px-5 rounded-full self-stretch border border-border bg-background focus:border-brand-strong"
                      inputMode="email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      style={{ lineHeight: undefined }}
                      onChangeText={onChange}
                      onBlur={() => {
                        onBlur();
                        handleInputBlur();
                      }}
                      onFocus={handleInputFocus}
                      aria-disabled={isSubmitting}
                    />
                  )}
                />
                {errors.email?.message && (
                  <Text className="font-[Sans-Medium] text-red-500 mt-2 mb-3">
                    {errors.email?.message}
                  </Text>
                )}
              </View>
              <View className="w-full mb-8">
                <Text className="font-[Sans-Medium] text-foreground-secondary mb-3">
                  Password
                </Text>
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <BottomSheetTextInput
                      value={value}
                      onChangeText={onChange}
                      className="w-full text-lg py-3 px-5 rounded-full self-stretch border border-border bg-background focus:border-brand-strong"
                      autoCapitalize="none"
                      style={{ lineHeight: undefined }}
                      secureTextEntry
                      textContentType="none"
                      onBlur={() => {
                        onBlur();
                        handleInputBlur();
                      }}
                      onFocus={handleInputFocus}
                      aria-disabled={isSubmitting}
                    />
                  )}
                />
                {errors.password?.message && (
                  <Text className="font-[Sans-Medium] text-red-500 mt-2 mb-3">
                    {errors.password?.message}
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
        </BottomSheetView>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
}
