import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { id, loginId, firstName, lastName, role, email }
  const [loading, setLoading] = useState(true);  // true while checking session on mount

  // Check for an existing session (httpOnly cookie) on mount.
  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (identifier, password) => {
    const result = await api.login(identifier, password);
    // After login, fetch full user profile from /auth/me
    const me = await api.me();
    setUser(me);
    return result;
  }, []);

  const register = useCallback(async (payload) => {
    const result = await api.registerCompany(payload);
    const me = await api.me();
    setUser(me);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await api.me();
      setUser(me);
      return me;
    } catch {
      return null;
    }
  }, []);

  const updateCompanyLogo = useCallback(async (logoUrl) => {
    await api.updateCompany({ logoUrl });
    const me = await api.me();
    setUser(me);
    return me;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refreshUser, updateCompanyLogo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
