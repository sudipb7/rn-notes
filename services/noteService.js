import { ID, Query } from "react-native-appwrite";

import { config } from "./appwrite";
import databaseService from "./databaseService";

const dbId = config.db;
const colId = config.col.notes;

const noteService = {
  async getNotes(userId) {
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
      return { data: response.data };
    } catch (error) {
      console.error("Error - noteService.getNotes:", error.message);
      return { data: [], error: error.message };
    }
  },
  async addNote(userId, text) {
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
    if (response?.error) {
      return { error: response.error };
    } else {
      return { data: response };
    }
  },
  async updateNote(id, text) {
    const response = await databaseService.updateDocument(dbId, colId, id, {
      text,
    });
    if (response?.error) {
      return { error: response.error };
    }
    return { data: response };
  },
  async deleteNote(id) {
    const response = await databaseService.deleteDocument(dbId, colId, id);
    if (response?.error) {
      return { error: response.error };
    }
    return { success: true };
  },
};

export default noteService;
