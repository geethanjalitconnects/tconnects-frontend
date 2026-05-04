// src/context/SavedJobsContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../config/api";

const SavedJobsContext = createContext();

export const useSavedJobs = () => useContext(SavedJobsContext);

export function SavedJobsProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      const res = await api.get("/api/applications/saved-jobs/");
      const data = res.data.results ?? res.data;
      setSavedIds(data.map((i) => i.job.id));
    } catch (err) {
      console.error("Failed to load saved jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (jobId) => {
    try {
      if (savedIds.includes(Number(jobId))) {
        await api.delete(`/api/applications/saved-jobs/remove/${jobId}/`);
        setSavedIds((prev) => prev.filter((x) => x !== Number(jobId)));
      } else {
        await api.post("/api/applications/saved-jobs/add/", { job_id: jobId });
        setSavedIds((prev) => [...prev, Number(jobId)]);
      }
    } catch (err) {
      console.error("Save/Unsave failed:", err);
      await loadSaved();
    }
  };

  const refreshSaved = async () => {
    setLoading(true);
    await loadSaved();
  };

  useEffect(() => {
    loadSaved();
    const onFocus = () => loadSaved();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <SavedJobsContext.Provider value={{ savedIds, loading, toggleSave, refreshSaved }}>
      {children}
    </SavedJobsContext.Provider>
  );
}