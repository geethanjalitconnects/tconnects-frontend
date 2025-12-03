import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../config/api";

const SavedInternshipsContext = createContext();
export const useSavedInternships = () => useContext(SavedInternshipsContext);

export function SavedInternshipsProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      const res = await api.get("/api/applications/saved-internships/");
      setSavedIds(res.data.map((i) => i.internship.id));
    } catch (err) {
      console.error("Failed to load saved internships:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (id) => {
    try {
      if (savedIds.includes(Number(id))) {
        await api.delete(`/api/applications/saved-internships/remove/${id}/`);
        setSavedIds((prev) => prev.filter((x) => x !== Number(id)));
      } else {
        await api.post(`/api/applications/saved-internships/`, {
          internship: id,
        });
        setSavedIds((prev) => [...prev, Number(id)]);
      }
    } catch (err) {
      console.error("Save/unSave internship failed:", err);
      await loadSaved();
    }
  };

  useEffect(() => {
    loadSaved();

    const onFocus = () => loadSaved();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <SavedInternshipsContext.Provider
      value={{ savedIds, toggleSave, loading }}
    >
      {children}
    </SavedInternshipsContext.Provider>
  );
}
