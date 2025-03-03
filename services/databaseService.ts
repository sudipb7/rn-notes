import { ID } from "react-native-appwrite";
import { database } from "./appwrite";

const databaseService = {
  async listDocuments(dbId: string, colId: string, queries: string[]) {
    try {
      const response = await database.listDocuments(dbId, colId, queries || []);
      return { data: response.documents || [] };
    } catch (error: any) {
      console.error("Error fetching documents -", error);
      return { error: error.message };
    }
  },
  async createDocument(
    dbId: string,
    colId: string,
    data: Record<string, any>,
    id: string
  ): Promise<{ error: string } | Record<string, any>> {
    try {
      return await database.createDocument(
        dbId,
        colId,
        id || ID.unique(),
        data
      );
    } catch (error: any) {
      console.error("Error creating document -", error);
      return { error: error.message };
    }
  },
  async updateDocument(
    dbId: string,
    colId: string,
    id: string,
    data: Record<string, any>
  ) {
    try {
      return await database.updateDocument(dbId, colId, id, data);
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
