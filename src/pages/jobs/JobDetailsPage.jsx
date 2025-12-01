// JobDetailsPage.jsx — FULL BACKEND INTEGRATION
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import "./JobDetailsPage.css";

const JobDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // job ID from URL

  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // 1. Fetch job details
  // ==========================================================
  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}/`);
        setJob(res.data);
      } catch (err) {
        console.error("Failed to load job:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  // ==========================================================
  // 2. Check if job is saved
  // ==========================================================
  useEffect(() => {
    const loadSavedStatus = async () => {
      try {
        const res = await api.get("/api/applications/saved-jobs/");
        const savedIds = res.data.map((i) => i.job.id);
        setSaved(savedIds.includes(parseInt(id)));
      } catch (err) {
        console.error("Failed to check saved:", err);
      }
    };
    loadSavedStatus();
  }, [id]);

  // ==========================================================
  // 3. Save / Unsave Job
  // ==========================================================
  const toggleSave = async () => {
    try {
      if (saved) {
        await api.delete(`/api/applications/saved-jobs/remove/${id}/`);
        setSaved(false);
      } else {
        await api.post("/api/applications/saved-jobs/", { job: id });
        setSaved(true);
      }
    } catch (err) {
      console.error("Error saving/unsaving:", err);
    }
  };

  const handleApplyNow = () => navigate(`/apply-job/${id}`);

  if (loading) return <div className="jd-loading">Loading job…</div>;
  if (!job) return <div className="jd-error">Job not found.</div>;

  return (
    <div className="jd-desktop-wrapper">
      <div className="jd-container">

        {/* ======================= JOB HEADER ======================= */}
        <div className="jd-header-card">
          <div className="jd-header-left">
            <h1 className="jd-title">{job.title}</h1>

            <div className="jd-meta">
              <span className="jd-badge">{job.category || "Risk Management"}</span>
              <span className="jd-meta-item">{job.company_name}</span>
              <span className="jd-meta-item">{job.location}</span>
              <span className="jd-meta-item">{job.experience}</span>
              <span className="jd-meta-item">{job.salary}</span>
              <span className="jd-meta-item">{job.job_type}</span>

              {job.deadline && (
                <span className="jd-meta-item">
                  Deadline: {new Date(job.deadline).toLocaleDateString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="jd-header-right">
            <button className="jd-apply-btn" onClick={handleApplyNow}>
              Apply Now
            </button>

            <button className="jd-save-btn" onClick={toggleSave}>
              {saved ? "Unsave" : "Save Job"}
            </button>
          </div>
        </div>

        {/* ======================= COMPANY OVERVIEW ======================= */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Company Overview</h2>

          <div className="jd-company-grid">
            <div className="jd-company-item">
              <strong>Company Size:</strong>{" "}
              {job.company_size || "Not provided"}
            </div>

            <div className="jd-company-item">
              <strong>Industry:</strong>{" "}
              {job.company_industry || "Not specified"}
            </div>

            {job.company_website && (
              <div className="jd-company-item">
                <strong>Website:</strong>{" "}
                <a href={job.company_website} target="_blank" rel="noopener noreferrer">
                  {job.company_website}
                </a>
              </div>
            )}
          </div>

          {job.company_about && (
            <p className="jd-company-about">{job.company_about}</p>
          )}
        </div>

        {/* ======================= JOB DESCRIPTION ======================= */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Job Description</h2>
          <p className="jd-description">
            {job.description || "No description provided."}
          </p>
        </div>

        {/* ======================= RESPONSIBILITIES ======================= */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="jd-section-card">
            <h2 className="jd-section-title">Job Responsibilities</h2>

            <ul className="jd-list">
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ======================= SKILLS ======================= */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Required Skills</h2>

          <div className="jd-tags">
            {job.skills?.map((skill, index) => (
              <span key={index} className="jd-tag">
                {skill}
              </span>
            ))}
          </div>

          {job.eligible_degrees && (
            <div className="jd-education">
              <strong>Eligible Degrees:</strong> {job.eligible_degrees}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobDetailsPage;
