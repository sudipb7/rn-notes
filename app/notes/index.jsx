import { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import NoteList from "@/components/NoteList";
import AddNoteModal from "@/components/AddNoteModal";

export default function NotesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState([
    {
      id: "1",
      text: "Note One",
    },
    {
      id: "2",
      text: "Note Two",
    },
    {
      id: "3",
      text: "Note Three",
    },
  ]);

  function addNote() {
    if (!newNote.trim()) {
      return;
    }
    setNotes((prev) => [...prev, { id: `${prev.length + 1}`, text: newNote }]);
    setNewNote("");
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <NoteList notes={notes} />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Note</Text>
      </TouchableOpacity>

      <AddNoteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newNote={newNote}
        setNewNote={setNewNote}
        addNote={addNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
