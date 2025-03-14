import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from "react";

import { Note } from "@/types";
import notesService from "@/services/notes";

type NotesContextType = {
  notes: Note[];
  isLoading: boolean;
  fetchNotes: (userId: string) => Promise<Note[] | { error: string }>;
  addNote: (
    note: Pick<Note, "title" | "content" | "userId">
  ) => Promise<Note | { error: string }>;
  updateNote: (
    id: string,
    data: Pick<Note, "title" | "content">
  ) => Promise<Note | { error: string }>;
  deleteNote: (id: string) => Promise<{ success: boolean } | { error: string }>;
};

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  isLoading: true,
  fetchNotes: async () => [],
  addNote: async () => ({ error: "Not implemented" }),
  updateNote: async () => ({ error: "Not implemented" }),
  deleteNote: async () => ({ error: "Not implemented" }),
});

type NotesAction =
  | {
      type: "SET_NOTES";
      payload: Note[];
    }
  | {
      type: "ADD_NOTE";
      payload: Note;
    }
  | {
      type: "UPDATE_NOTE";
      payload: Note;
    }
  | {
      type: "DELETE_NOTE";
      payload: string;
    };

function notesReducer(state: Note[], action: NotesAction) {
  switch (action.type) {
    case "SET_NOTES":
      return action.payload;
    case "ADD_NOTE":
      return [...state, action.payload];
    case "UPDATE_NOTE":
      const existingNote = state.find(
        (note) => note.$id === action.payload.$id
      );
      return state.map((note) =>
        note.$id === action.payload.$id
          ? { ...existingNote, ...action.payload }
          : note
      );
    case "DELETE_NOTE":
      return state.filter((note) => note.$id !== action.payload);
    default:
      return state;
  }
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, dispatch] = useReducer(notesReducer, []);

  async function fetchNotes(userId: string) {
    setIsLoading(true);

    const response = await notesService.getNotes(userId);
    if ("error" in response) {
      return response;
    }

    dispatch({ type: "SET_NOTES", payload: response.data });
    setIsLoading(false);
    return response.data;
  }

  async function addNote(note: Pick<Note, "title" | "content" | "userId">) {
    const response = await notesService.addNote({ ...note });
    if ("error" in response) {
      return response;
    }

    dispatch({ type: "ADD_NOTE", payload: response.data });
    return response.data;
  }

  async function updateNote(id: string, data: Pick<Note, "title" | "content">) {
    const response = await notesService.updateNote(id, data);
    if ("error" in response) {
      return response;
    }

    dispatch({ type: "UPDATE_NOTE", payload: response.data });
    return response.data;
  }

  async function deleteNote(id: string) {
    const response = await notesService.deleteNote(id);
    if ("error" in response) {
      return response;
    }

    dispatch({ type: "DELETE_NOTE", payload: id });
    return { success: true };
  }

  return (
    <NotesContext.Provider
      value={{ notes, isLoading, fetchNotes, addNote, updateNote, deleteNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
