// InternshipsListPage.jsx — FULL BACKEND INTEGRATION
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./InternshipsListPage.css";

export default function InternshipsListPage() {
  const [internships, setInternships] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved internships
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const res = await api.get("/api/applications/saved-internships/");
        setSavedItems(res.data.map((i) => i.internship.id));
      } catch (err) {
        console.error("Failed to fetch saved internships:", err);
      }
    };
    loadSaved();
  }, []);

  // Load internships (from recruiter backend)
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

  const isSaved = (id) => savedItems.includes(id);

  const toggleSave = async (id) => {
    try {
      if (isSaved(id)) {
        await api.delete(`/api/applications/saved-internships/remove/${id}/`);
        setSavedItems(savedItems.filter((x) => x !== id));
      } else {
        await api.post("/api/applications/saved-internships/", {
          internship: id,
        });
        setSavedItems([...savedItems, id]);
      }
    } catch (err) {
      console.error("Error saving/unsaving internship:", err);
    }
  };

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
          Discover exciting internship opportunities in risk management across banking,
          finance, and fintech sectors in India
        </p>
      </div>

      {/* Empty state */}
      {internships.length === 0 && (
        <p className="jobs-empty">No internships posted yet.</p>
      )}

      {/* Dynamic list */}
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
            <span>{intern.stipend}</span> •
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

            <button
              className="save-btn"
              onClick={() => toggleSave(intern.id)}
            >
              {isSaved(intern.id) ? "Unsave" : "Save Internship"}
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}
