import { ID, Query } from "react-native-appwrite";

import { Note } from "@/types";
import { config } from "./appwrite";
import databaseService from "./database";

const dbId = config.db;
const colId = config.col.notes;

const notesService = {
  async getNotes(
    userId: string
  ): Promise<{ data: Note[] } | { error: string }> {
    if (!userId) {
      console.error("Error - userId is required to fetch notes");
      return {
        data: [],
        error: "Error - userId is required to fetch notes",
      };
    }

    try {
      const response = await databaseService.listDocuments<Note>(dbId, colId, [
        Query.equal("userId", userId),
      ]);
      if ("error" in response) {
        return { error: response.error };
      }

      const data =
        response.data?.map((d) => ({
          $id: d.$id,
          $createdAt: d.$createdAt,
          $updatedAt: d.$updatedAt,
          title: d.title,
          content: d.content,
          userId: d.userId,
        })) || ([] as Note[]);

      return { data };
    } catch (error: any) {
      console.error("Error - noteService.getNotes:", error.message);
      return { data: [], error: error.message };
    }
  },
  async addNote(
    data: Pick<Note, "title" | "content" | "userId">
  ): Promise<{ data: Note } | { error: string }> {
    if (!data.title) {
      return { error: "Note title cannot be empty" };
    }

    const response = await databaseService.createDocument<Note>(
      dbId,
      colId,
      { ...data, createdAt: new Date().toISOString() },
      ID.unique()
    );
    if ("error" in response) {
      return { error: response.error };
    }

    return {
      data: {
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
        title: response.title,
        content: response.content,
        userId: response.userId,
      },
    };
  },
  async updateNote(
    id: string,
    data: Pick<Note, "title" | "content">
  ): Promise<{ data: Note } | { error: string }> {
    if (!data.title) {
      return { error: "Note title cannot be empty" };
    }
    const response = await databaseService.updateDocument<Note>(
      dbId,
      colId,
      id,
      {
        ...data,
      }
    );
    if ("error" in response) {
      return { error: response.error };
    }

    return {
      data: {
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
        userId: response.userId,
        title: response.title,
        content: response.content,
      },
    };
  },
  async deleteNote(id: string): Promise<{ success: true } | { error: string }> {
    const response = await databaseService.deleteDocument(dbId, colId, id);
    if ("error" in response) {
      return { error: response.error };
    }

    return { success: true };
  },
};

export default notesService;
