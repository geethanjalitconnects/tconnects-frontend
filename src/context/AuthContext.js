// src/context/AuthContext.js
import { createContext, useEffect, useState } from "react";
import api from "../config/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load logged-in user from backend on page load
  useEffect(() => {
    api
      .get("/api/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
