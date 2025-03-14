import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "./global.css";
import { AuthProvider } from "@/contexts/auth";
import { NotesProvider } from "@/contexts/notes";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // IBM Plex Sans
    "Sans-Light": require("@/assets/fonts/IBM-Plex-Sans/IBMPlexSans-Light.ttf"),
    "Sans-Regular": require("@/assets/fonts/IBM-Plex-Sans/IBMPlexSans-Regular.ttf"),
    "Sans-Medium": require("@/assets/fonts/IBM-Plex-Sans/IBMPlexSans-Medium.ttf"),
    "Sans-SemiBold": require("@/assets/fonts/IBM-Plex-Sans/IBMPlexSans-SemiBold.ttf"),
    "Sans-Bold": require("@/assets/fonts/IBM-Plex-Sans/IBMPlexSans-Bold.ttf"),
    // IBM Plex Sans Italic
    "Sans-Italic": require("@/assets/fonts/IBM-Plex-Sans/IBMPlexSans-Italic.ttf"),
    "Sans-MediumItalic": require("@/assets/fonts/IBM-Plex-Sans/IBMPlexSans-MediumItalic.ttf"),
    // IBM Plex Serif
    "Serif-Light": require("@/assets/fonts/IBM-Plex-Serif/IBMPlexSerif-Light.ttf"),
    "Serif-Regular": require("@/assets/fonts/IBM-Plex-Serif/IBMPlexSerif-Regular.ttf"),
    "Serif-Medium": require("@/assets/fonts/IBM-Plex-Serif/IBMPlexSerif-Medium.ttf"),
    "Serif-SemiBold": require("@/assets/fonts/IBM-Plex-Serif/IBMPlexSerif-SemiBold.ttf"),
    // IBM Plex Serif Italic
    "Serif-Italic": require("@/assets/fonts/IBM-Plex-Serif/IBMPlexSerif-Italic.ttf"),
    "Serif-MediumItalic": require("@/assets/fonts/IBM-Plex-Serif/IBMPlexSerif-MediumItalic.ttf"),
    "Serif-SemiBoldItalic": require("@/assets/fonts/IBM-Plex-Serif/IBMPlexSerif-SemiBoldItalic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <NotesProvider>
        <SafeAreaProvider>
          <GestureHandlerRootView className="flex-1">
            <Stack screenOptions={{ headerShown: false }} />
          </GestureHandlerRootView>
        </SafeAreaProvider>
        <StatusBar style="dark" />
      </NotesProvider>
    </AuthProvider>
  );
}
