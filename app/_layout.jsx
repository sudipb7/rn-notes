import { Stack } from "expo-router";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { AuthProvider, useAuth } from "@/contexts/authContext";

function HeaderLogOut() {
  const { user, logOut } = useAuth();

  return user ? (
    <TouchableOpacity style={styles.logOutButton} onPress={logOut}>
      <Text style={styles.logOutText}>LogOut</Text>
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

const styles = StyleSheet.create({
  logOutButton: {
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ff3b30",
    borderRadius: 8,
  },
  logOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
