// InternshipDetailsPage.jsx — FULL BACKEND INTEGRATION
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import "./InternshipDetailsPage.css";

const InternshipDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [saved, setSaved] = useState(false);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // 1. Load internship details from backend
  // =====================================================
  useEffect(() => {
    const loadInternship = async () => {
      try {
        const res = await api.get(`/api/internships/${id}/`);
        setInternship(res.data);
      } catch (err) {
        console.error("Failed to load internship:", err);
      } finally {
        setLoading(false);
      }
    };
    loadInternship();
  }, [id]);

  // =====================================================
  // 2. Load saved status
  // =====================================================
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.get("/api/applications/saved-internships/");
        const ids = res.data.map((i) => i.internship.id);
        setSaved(ids.includes(parseInt(id)));
      } catch (err) {
        console.error("Error checking saved status:", err);
      }
    };
    fetchSaved();
  }, [id]);

  // =====================================================
  // 3. Save / Unsave toggle
  // =====================================================
  const toggleSave = async () => {
    try {
      if (saved) {
        await api.delete(`/api/applications/saved-internships/remove/${id}/`);
        setSaved(false);
      } else {
        await api.post("/api/applications/saved-internships/", {
          internship: id,
        });
        setSaved(true);
      }
    } catch (err) {
      console.error("Failed to save/unsave:", err);
    }
  };

  const handleApplyNow = () => navigate(`/apply-internship/${id}`);

  if (loading) return <div className="jd-loading">Loading internship…</div>;
  if (!internship) return <div className="jd-error">Internship not found.</div>;

  return (
    <div className="jd-desktop-wrapper">
      <div className="jd-container">

        {/* ======================= HEADER ======================= */}
        <div className="jd-header-card">
          <div className="jd-header-left">
            <h1 className="jd-title">{internship.title}</h1>

            <div className="jd-meta">
              <span className="jd-badge">{internship.category || "Internship"}</span>
              <span className="jd-meta-item">{internship.company_name}</span>
              <span className="jd-meta-item">{internship.location}</span>
              <span className="jd-meta-item">{internship.duration}</span>
              <span className="jd-meta-item">Stipend: {internship.stipend}</span>
              <span className="jd-meta-item">{internship.work_mode}</span>
              {internship.deadline && (
                <span className="jd-meta-item">
                  Deadline: {new Date(internship.deadline).toLocaleDateString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="jd-header-right">
            <button className="jd-apply-btn" onClick={handleApplyNow}>
              Apply Now
            </button>

            <button className="jd-save-btn" onClick={toggleSave}>
              {saved ? "Unsave" : "Save Internship"}
            </button>
          </div>
        </div>

        {/* ======================= DESCRIPTION ======================= */}
        <div className="jd-section">
          <h2 className="jd-section-title">About the Internship</h2>
          <p className="jd-description">{internship.description}</p>
        </div>

        {/* ======================= RESPONSIBILITIES ======================= */}
        {internship.responsibilities && (
          <div className="jd-section">
            <h2 className="jd-section-title">Responsibilities</h2>
            <ul className="jd-list">
              {internship.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ======================= REQUIREMENTS ======================= */}
        {internship.requirements && (
          <div className="jd-section">
            <h2 className="jd-section-title">Requirements</h2>
            <ul className="jd-list">
              {internship.requirements.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ======================= SKILLS ======================= */}
        <div className="jd-section">
          <h2 className="jd-section-title">Skills Required</h2>
          <div className="jd-skills">
            {internship.skills?.map((skill, index) => (
              <span key={index} className="jd-skill">{skill}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InternshipDetailsPage;
