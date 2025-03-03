import { ID, Query } from "react-native-appwrite";

import { Note } from "@/types";
import { config } from "./appwrite";
import databaseService from "./databaseService";

const dbId = config.db;
const colId = config.col.notes;

const noteService = {
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
      const response = await databaseService.listDocuments(dbId, colId, [
        Query.equal("userId", userId),
      ]);
      if (response.error) {
        return { error: response.error };
      }

      const data =
        response.data?.map((d) => ({
          $id: d.$id,
          $createdAt: d.$createdAt,
          $updatedAt: d.$updatedAt,
          text: d.text,
          userId: d.userId,
        })) || ([] as Note[]);

      return { data };
    } catch (error: any) {
      console.error("Error - noteService.getNotes:", error.message);
      return { data: [], error: error.message };
    }
  },
  async addNote(
    userId: string,
    text: string
  ): Promise<{ data: Note } | { error: string }> {
    if (!text) {
      return { error: "Note text cannot be empty" };
    }

    const data = { text, userId, createdAt: new Date().toISOString() };

    const response = await databaseService.createDocument(
      dbId,
      colId,
      data,
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
        text,
        userId,
      },
    };
  },
  async updateNote(
    id: string,
    text: string
  ): Promise<{ data: Note } | { error: string }> {
    const response = await databaseService.updateDocument(dbId, colId, id, {
      text,
    });
    if ("error" in response) {
      return { error: response.error };
    }

    return {
      data: {
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
        userId: response.userId,
        text,
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

export default noteService;
