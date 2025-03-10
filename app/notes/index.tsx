import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";

import { Note } from "@/types";
import { useAuth } from "@/contexts/authContext";
import NoteList from "@/components/NoteList";
import noteService from "@/services/noteService";
import AddNoteModal from "@/components/AddNoteModal";

export default function NotesScreen() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user?.$id) {
      fetchNotes(user?.$id);
    }
  }, [user]);

  async function fetchNotes(userId: string) {
    setLoading(true);
    const response = await noteService.getNotes(userId);
    if ("error" in response) {
      Alert.alert("Error", response.error);
      setError(response.error);
    } else {
      setNotes(response.data);
      setError(null);
    }
    setLoading(false);
  }

  async function addNote() {
    if (!newNote.trim()) {
      return;
    }

    const response = await noteService.addNote(user?.$id!, newNote);
    if ("error" in response) {
      Alert.alert("Error", response.error);
    } else {
      setNotes((prev) => [...prev, response.data]);
    }

    setNewNote("");
    setModalVisible(false);
  }

  async function editNote(id: string, newText: string) {
    if (!newText.trim()) {
      Alert.alert("Error", "Note text cannot be empty");
      return;
    }

    const response = await noteService.updateNote(id, newText);
    if ("error" in response) {
      Alert.alert("Error", response.error);
    } else {
      setNotes((prev) =>
        prev.map((note) => {
          if (note.$id === id) {
            return { ...note, text: newText };
          }
          return note;
        })
      );
    }
  }

  async function deleteNote(id: string) {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const response = await noteService.deleteNote(id);
          if ("error" in response) {
            Alert.alert("Error", response.error);
          } else {
            setNotes((prev) => prev.filter((note) => note.$id !== id));
          }
        },
      },
    ]);
  }

  return (
    <View className="flex-1 p-5 bg-white">
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          {error && (
            <Text className="text-red-500 text-center mb-2.5 text-base">
              {error}
            </Text>
          )}
          {notes.length === 0 ? (
            <Text className="text-center text-lg font-bold text-[#555] mt-4">
              You have no notes
            </Text>
          ) : (
            <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />
          )}
        </>
      )}

      <TouchableOpacity
        className="absolute inset-x-5 bottom-5 bg-[#007bff] p-4 rounded-lg items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-lg font-bold">Add a Note</Text>
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
