import { ID } from "react-native-appwrite";

import { config } from "./appwrite";
import databaseService from "./databaseService";

const dbId = config.db;
const colId = config.col.notes;

const noteService = {
  async getNotes() {
    const response = await databaseService.listDocuments(dbId, colId);
    if (response.error) {
      return { error: response.error };
    }
    return { data: response };
  },
  async addNote(text) {
    if (!text) {
      return { error: "Note text cannot be empty" };
    }

    const data = { text, createdAt: new Date().toISOString() };

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
