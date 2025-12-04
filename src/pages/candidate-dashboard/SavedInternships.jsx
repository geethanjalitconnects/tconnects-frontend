import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";
import { useSavedInternships } from "../../context/SavedInternshipsContext";

export default function SavedInternships() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const { savedIds, toggleSave } = useSavedInternships();

  // ============================================================
  // LOAD SAVED INTERNSHIPS (Runs whenever savedIds change)
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

  // ============================================================
  // REMOVE SAVED INTERNSHIP
  // ============================================================
  const removeItem = async (internshipId) => {
    try {
      await toggleSave(internshipId);
      setItems((prev) =>
        prev.filter((entry) => entry.internship?.id !== internshipId)
      );
    } catch (err) {
      console.error("Failed to remove saved internship:", err);
    }
  };

  if (loading) return <div className="cd-loading">Loading internships…</div>;

  return (
    <div className="cd-saved">
      <h2 className="cd-section-title">Saved Internships</h2>
      <p className="cd-section-subtitle">Your saved internships are listed here.</p>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <p className="cd-empty-msg">No saved internships yet.</p>
      )}

      {/* LIST */}
      {items.map((item) => {
        const internship = item.internship;

        if (!internship) return null; // Defensive safety check

        return (
          <div key={item.id} className="cd-saved-card">

            <div className="cd-saved-info">
              <h3 className="cd-job-title">{internship.title}</h3>

              <p className="cd-job-company">
                {internship.company_name || "Company"} •{" "}
                {internship.location || "Location"}
              </p>

              <p className="cd-job-date">
                Saved on: {new Date(item.saved_on).toLocaleDateString("en-IN")}
              </p>
            </div>

            <button
              className="cd-remove-btn"
              onClick={() => removeItem(internship.id)}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}
