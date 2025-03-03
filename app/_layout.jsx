import "./global.css";
import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

import { AuthProvider, useAuth } from "@/contexts/authContext";

function HeaderLogOut() {
  const { user, logOut } = useAuth();

  return user ? (
    <TouchableOpacity
      className="mr-4 py-1.5 px-3 bg-[#ff3b30] rounded-lg"
      onPress={logOut}
    >
      <Text className="text-white text-base font-bold">LogOut</Text>
    </TouchableOpacity>
  ) : null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ff8c00",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
          contentStyle: {
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: "#fff",
          },
          headerRight: () => <HeaderLogOut />,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="notes" options={{ headerTitle: "Notes" }} />
        <Stack.Screen name="auth" options={{ headerTitle: "Login" }} />
      </Stack>
    </AuthProvider>
  );
}
