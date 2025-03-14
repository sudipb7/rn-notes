import { createContext, useContext, useState, useEffect } from "react";

import { User } from "@/types";
import authService from "@/services/authService";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean } | { error: string }>;
  register: (
    email: string,
    password: string
  ) => Promise<{ success: boolean } | { error: string }>;
  onboardUser: (
    name: string
  ) => Promise<{ success: boolean } | { error: string }>;
  logOut: () => Promise<void>;
};

const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
  logOut: async () => {},
  login: async () => ({ error: "Not implemented" }),
  register: async () => ({ error: "Not implemented" }),
  onboardUser: async () => ({ error: "Not implemented" }),
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    setLoading(true);

    const user = await authService.getUser();
    setUser(user);

    setLoading(false);
  }

  async function login(email: string, password: string) {
    const response = await authService.login(email, password);
    if ("error" in response) {
      return response;
    }

    await checkUser();
    return { success: true };
  }

  async function onboardUser(name: string) {
    const response = await authService.updateName(name);
    if ("error" in response) {
      return response;
    }

    await checkUser();
    return { success: true };
  }

  async function register(email: string, password: string) {
    const response = await authService.register(email, password);
    if ("error" in response) {
      return response;
    }

    return login(email, password);
  }

  async function logOut() {
    await authService.logOut();
    setUser(null);
    await checkUser();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logOut,
        onboardUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
