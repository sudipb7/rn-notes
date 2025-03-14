import { useEffect } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/contexts/auth";
import { useNotes } from "@/contexts/notes";
import { ScreenLoader } from "@/components/screen-loader";

export default function NotesScreen() {
  const router = useRouter();
  const { logOut, isLoading, user } = useAuth();
  const { notes, fetchNotes, isLoading: isNotesLoading } = useNotes();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace("/");
    }

    if (user && !user.name) {
      router.replace("/onboarding");
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (user) {
      fetchNotes(user.$id);
    }
  }, [user]);

  if (isLoading || isNotesLoading) {
    return <ScreenLoader />;
  }

  console.log(user);

  console.log(notes);

  return (
    <SafeAreaView className="flex-1 bg-background py-12 px-6">
      <Button title="Log Out" onPress={logOut} />
      <Text>Notes</Text>
      <FlatList
        data={notes}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={(item) => item.$id}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={() => <Text>No notes</Text>}
        ListHeaderComponent={() => <View className="h-4" />}
        ListFooterComponent={() => <View className="h-4" />}
      />
    </SafeAreaView>
  );
}
