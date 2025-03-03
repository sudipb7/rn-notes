import { ID } from "react-native-appwrite";

import { account } from "./appwrite";

const authService = {
  async register(email, password) {
    try {
      const response = await account.create(ID.unique(), email, password);
      return response;
    } catch (error) {
      console.error("Error registering user -", error);
      return { error: error.message || "Registration failed" };
    }
  },
  async login(email, password) {
    try {
      const response = await account.createEmailPasswordSession(email, password);
      return response;
    } catch (error) {
      console.error("Error loging in user -", error);
      return { error: error.message || "Login failed" };
    }
  },
  async getUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },
  async logOut() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Error loging out user -", error);
      return { error: error.message || "Logout failed" };
    }
  },
};

export default authService;
