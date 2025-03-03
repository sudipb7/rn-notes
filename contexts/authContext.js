import { createContext, useContext, useState, useEffect } from "react";

import authService from "@/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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

  async function login(email, password) {
    const response = await authService.login(email, password);
    if (response?.error) {
      return response;
    }

    await checkUser();
    return { success: true };
  }

  async function register(email, password) {
    const response = await authService.register(email, password);
    if (response?.error) {
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
    <AuthContext.Provider value={{ login, register, logOut, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
