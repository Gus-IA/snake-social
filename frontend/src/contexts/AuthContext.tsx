import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { api, type User } from "@/services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const u = await api.login(email, password);
      setUser(u);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, username: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const u = await api.signup(email, password, username);
      setUser(u);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};
