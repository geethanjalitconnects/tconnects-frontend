// SavedInternships.jsx — GLOBAL SYNC VERSION
// ✔ Uses SavedInternshipsContext
// ✔ Removal syncs across all pages
// ✔ UI unchanged

import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";

// ⭐ GLOBAL CONTEXT
import { useSavedInternships } from "../../context/SavedInternshipsContext";

export default function SavedInternships() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ GLOBAL CONTEXT (savedIds, toggleSave)
  const { savedIds, toggleSave } = useSavedInternships();

  // ============================================================
  // 1. Load saved internships (full details)
  // ============================================================
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const res = await api.get("/api/applications/saved-internships/");
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load saved internships:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSaved();
  }, [savedIds]); 
  // ⭐ Anytime savedIds changes (global), reload our detailed list

  // ============================================================
  // 2. Remove saved internship — Use GLOBAL toggleSave()
  // ============================================================
  const removeItem = async (internshipId) => {
    await toggleSave(internshipId); // ⭐ Updates global savedIds instantly
    setItems((prev) => prev.filter((i) => i.internship.id !== internshipId)); // local UI update
  };

  if (loading) return <div className="cd-loading">Loading internships…</div>;

  return (
    <div className="cd-saved">
      <h2 className="cd-section-title">Saved Internships</h2>
      <p className="cd-section-subtitle">Your saved internships are listed here.</p>

      {/* Empty state */}
      {items.length === 0 && (
        <p className="cd-empty-msg">No saved internships yet.</p>
      )}

      {/* List */}
      {items.map((item) => (
        <div key={item.id} className="cd-saved-card">
          <div className="cd-saved-info">
            <h3 className="cd-job-title">{item.internship.title}</h3>
            <p className="cd-job-company">
              {item.internship.company_name} • {item.internship.location}
            </p>
            <p className="cd-job-date">
              Saved on: {new Date(item.saved_on).toLocaleDateString("en-IN")}
            </p>
          </div>

          <button
            className="cd-remove-btn"
            onClick={() => removeItem(item.internship.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
