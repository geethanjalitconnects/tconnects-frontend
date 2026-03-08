import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useSavedJobs } from "../../context/SavedJobsContext";
import "./JobsListPage.css";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { savedIds, toggleSave } = useSavedJobs();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await api.get("/api/jobs/");
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const isSaved = (id) => savedIds.includes(id);

  // ✅ FIXED: same tab, using job id directly (no slug)
  const openDetails = (job) => {
    navigate(`/jobs/${job.id}`);
  };

  if (loading) return <div className="jobs-loading">Loading jobs…</div>;

  return (
    <div className="jobs-page">

      <div className="jobs-header">
        <h1 className="jobs-title">Risk Management Jobs</h1>
        <p className="jobs-subtitle">
          Discover exciting risk management opportunities across banking, insurance,
          and fintech sectors in India.
        </p>
      </div>

      <p className="jobs-count">Showing {jobs.length} job opportunities</p>

      {jobs.length === 0 && (
        <p className="jobs-empty">No jobs posted yet.</p>
      )}

      {jobs.map((job) => (
        <div className="job-card" key={job.id}>
          <h2 className="job-title">{job.title}</h2>
          <p className="company-name">{job.company_name}</p>

          <div className="job-info">
            <span>{job.experience_range}</span> •
            <span>{job.salary_range}</span> •
            <span>{job.employment_type}</span>
          </div>

          <p className="job-desc">
            {job.short_description || "Job description not provided."}
          </p>

          <div className="tags">
            {(job.skills || []).map((skill, idx) => (
              <span key={idx}>{skill}</span>
            ))}
          </div>

          <div className="job-actions">
            <button className="view-btn" onClick={() => openDetails(job)}>
              View Details
            </button>

            <button className="save-btn" onClick={() => toggleSave(job.id)}>
              {isSaved(job.id) ? "Saved" : "Save Job"}
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}