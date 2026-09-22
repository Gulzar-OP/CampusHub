import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null), [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/auth/me").then(r => setUser(r.data.user)).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const login = async payload => { const r = await api.post("/auth/login", payload); localStorage.setItem("campushub_token", r.data.token); setUser(r.data.user); return r.data; };
  const register = async payload => { const r = await api.post("/auth/register", payload); localStorage.setItem("campushub_token", r.data.token); setUser(r.data.user); return r.data; };
  const logout = async () => { try { await api.post("/auth/logout"); } finally { localStorage.removeItem("campushub_token"); setUser(null); } };
  return <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
