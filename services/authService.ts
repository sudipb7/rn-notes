import { ID, Models } from "react-native-appwrite";

import { User } from "@/types";
import { account } from "./appwrite";

const authService = {
  async register(
    email: string,
    password: string
  ): Promise<User | { error: string }> {
    try {
      const response = await account.create(ID.unique(), email, password);
      return {
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
        email,
      };
    } catch (error: any) {
      console.error("Error registering user -", error);
      return { error: error.message || "Registration failed" };
    }
  },
  async login(
    email: string,
    password: string
  ): Promise<User | { error: string }> {
    try {
      const response = await account.createEmailPasswordSession(
        email,
        password
      );
      return {
        $id: response.$id,
        $createdAt: response.$createdAt,
        $updatedAt: response.$updatedAt,
        email,
      };
    } catch (error: any) {
      console.error("Error loging in user -", error);
      return { error: error.message || "Login failed" };
    }
  },
  async getUser(): Promise<User | null> {
    try {
      const user = await account.get();
      return {
        $id: user.$id,
        $createdAt: user.$createdAt,
        $updatedAt: user.$updatedAt,
        email: user.email,
      };
    } catch (error) {
      return null;
    }
  },
  async logOut(): Promise<{ error: string } | void> {
    try {
      await account.deleteSession("current");
    } catch (error: any) {
      console.error("Error loging out user -", error);
      return { error: error.message || "Logout failed" };
    }
  },
};

export default authService;
