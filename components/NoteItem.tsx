import { Note } from "@/types";
import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, newText: string) => void;
}

export default function NoteItem({ note, onDelete, onEdit }: NoteItemProps) {
  const inputRef = useRef<TextInput>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditingText] = useState(note.text);

  async function handleSave() {
    if (editedText.trim() === "") {
      return;
    }
    onEdit(note.$id, editedText);
    setIsEditing(false);
  }

  return (
    <View className="flex-row justify-between bg-[#f5f5f5] p-4 my-2.5 rounded-md">
      {isEditing ? (
        <TextInput
          ref={inputRef}
          value={editedText}
          onChangeText={setEditingText}
          autoFocus
          onSubmitEditing={handleSave}
          returnKeyType="done"
        />
      ) : (
        <Text className="text-lg">{note.text}</Text>
      )}
      <View className="flex-row">
        {isEditing ? (
          <TouchableOpacity
            onPress={() => {
              handleSave();
              inputRef.current?.blur();
            }}
          >
            <Text className="text-lg mr-2.5 text-blue-500">💾</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text className="text-red-500 text-lg">✏️</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => onDelete(note.$id)}>
          <Text className="text-red-500 text-lg">❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
