// SavedInternships.jsx — Backend Integrated
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";

export default function SavedInternships() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // 1. Load saved internships
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
  }, []);

  // ============================================================
  // 2. Remove saved internship
  // ============================================================
  const removeItem = async (internshipId) => {
    try {
      await api.delete(
        `/api/applications/saved-internships/remove/${internshipId}/`
      );

      setItems(items.filter((i) => i.internship.id !== internshipId));
    } catch (err) {
      console.error("Failed to remove saved internship:", err);
    }
  };

  if (loading) return <div className="cd-loading">Loading internships…</div>;

  return (
    <div className="cd-saved">
      <h2 className="cd-section-title">Saved Internships</h2>
      <p className="cd-section-subtitle">
        Your saved internships are listed here.
      </p>

      {/* Empty state */}
      {items.length === 0 && (
        <p className="cd-empty-msg">No saved internships yet.</p>
      )}

      {/* List of saved internships */}
      {items.map((item) => (
        <div key={item.id} className="cd-saved-card">
          <div className="cd-saved-info">
            <h3 className="cd-job-title">{item.internship.title}</h3>
            <p className="cd-job-company">
              {item.internship.company_name} • {item.internship.location}
            </p>
            <p className="cd-job-date">
              Saved on:{" "}
              {new Date(item.saved_on).toLocaleDateString("en-IN")}
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
