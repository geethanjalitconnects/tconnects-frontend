import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./InternshipsListPage.css";
import { useSavedInternships } from "../../context/SavedInternshipsContext";

export default function InternshipsListPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅

  const { savedIds, toggleSave } = useSavedInternships();

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

  // ✅ FIXED: same tab, direct id navigation
  const openDetails = (id) => {
    navigate(`/internships/${id}`);
  };

  if (loading) return <div className="jobs-loading">Loading internships…</div>;

  return (
    <div className="jobs-page">

      <div className="jobs-header">
        <h1 className="jobs-title">Risk Management Internships</h1>
        <p className="jobs-subtitle">
          Discover exciting internship opportunities in risk management
          across banking, finance, and fintech sectors in India.
        </p>
      </div>

      {internships.length === 0 && (
        <p className="jobs-empty">No internships posted yet.</p>
      )}

      {internships.map((intern) => (
        <div className="job-card" key={intern.id}>
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

          <div className="job-actions">
            <button className="view-btn" onClick={() => openDetails(intern.id)}>
              View Details
            </button>

            <button className="save-btn" onClick={() => toggleSave(intern.id)}>
              {isSaved(intern.id) ? "Saved" : "Save Internship"}
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}