// InternshipsListPage.jsx — GLOBAL SYNC VERSION (Using SavedInternshipsContext)
// ✔ Saves synced across all pages
// ✔ UI unchanged
// ✔ Uses global savedIds + toggleSave

import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./InternshipsListPage.css";

// ⭐ IMPORT GLOBAL CONTEXT
import { useSavedInternships } from "../../context/SavedInternshipsContext";

export default function InternshipsListPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ GLOBAL SAVED INTERNSHIPS CONTEXT
  const { savedIds, toggleSave } = useSavedInternships();

  // Load internships
  useEffect(() => {
    const loadInternships = async () => {
      try {
        const res = await api.get("/api/internships/");
        setInternships(res.data);
      } catch (err) {
        console.error("Failed to load internships:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInternships();
  }, []);

  const isSaved = (id) => savedIds.includes(id);

  const openDetails = (id) => {
    window.open(`/internships/${id}`, "_blank");
  };

  if (loading) return <div className="jobs-loading">Loading internships…</div>;

  return (
    <div className="jobs-page">

      {/* HEADER */}
      <div className="jobs-header">
        <h1 className="jobs-title">Risk Management Internships</h1>
        <p className="jobs-subtitle">
          Discover exciting internship opportunities in risk management
          across banking, finance, and fintech sectors in India.
        </p>
      </div>

      {/* EMPTY STATE */}
      {internships.length === 0 && (
        <p className="jobs-empty">No internships posted yet.</p>
      )}

      {/* LIST */}
      {internships.map((intern) => (
        <div
          className="job-card"
          key={intern.id}
          onClick={() => openDetails(intern.id)}
        >
          <h2 className="job-title">{intern.title}</h2>
          <p className="company-name">{intern.company_name}</p>

          <div className="job-info">
            <span>{intern.location}</span> •
            <span>{intern.duration}</span> •
            <span>{intern.stipend}</span> 
            <span>{intern.work_mode}</span>
          </div>

          <p className="job-desc">
            {intern.short_description || "Internship description not added"}
          </p>

          <div className="tags">
            {intern.skills?.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>

          <div className="job-actions" onClick={(e) => e.stopPropagation()}>
            <button className="view-btn" onClick={() => openDetails(intern.id)}>
              View Details
            </button>

            {/* ⭐ GLOBAL SAVE BUTTON */}
            <button
              className="save-btn"
              onClick={() => toggleSave(intern.id)}
            >
              {isSaved(intern.id) ? "Saved" : "Save Internship"}
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}
