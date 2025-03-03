import { FlatList, View } from "react-native";

import { Note } from "@/types";
import NoteItem from "./NoteItem";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, newText: string) => void;
}

export default function NoteList({ notes, onDelete, onEdit }: NoteListProps) {
  return (
    <View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <NoteItem note={item} onDelete={onDelete} onEdit={onEdit} />
        )}
      />
    </View>
  );
}
