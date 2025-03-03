import { FlatList, View } from "react-native";

import NoteItem from "./NoteItem";

export default function NoteList({ notes }) {
  return (
    <View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteItem note={item} />}
      />
    </View>
  );
}
