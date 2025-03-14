import { ID } from "react-native-appwrite";
import { database } from "./appwrite";

const databaseService = {
  async listDocuments<T>(
    dbId: string,
    colId: string,
    queries: string[]
  ): Promise<{ data: T[] } | { error: string }> {
    try {
      const response = await database.listDocuments(dbId, colId, queries || []);
      return { data: (response.documents as T[]) || [] };
    } catch (error: any) {
      console.error("Error fetching documents -", error);
      return { error: error.message };
    }
  },
  async createDocument<T>(
    dbId: string,
    colId: string,
    data: Record<string, any>,
    id: string
  ): Promise<{ error: string } | T> {
    try {
      return (await database.createDocument(
        dbId,
        colId,
        id || ID.unique(),
        data
      )) as T;
    } catch (error: any) {
      console.error("Error creating document -", error);
      return { error: error.message };
    }
  },
  async updateDocument<T>(
    dbId: string,
    colId: string,
    id: string,
    data: Record<string, any>
  ): Promise<{ error: string } | T> {
    try {
      return (await database.updateDocument(dbId, colId, id, data)) as T;
    } catch (error: any) {
      console.error("Error updating document -", error);
      return { error: error.message };
    }
  },
  async deleteDocument(dbId: string, colId: string, id: string) {
    try {
      await database.deleteDocument(dbId, colId, id);
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting document -", error);
      return { error: error.message };
    }
  },
};

export default databaseService;
