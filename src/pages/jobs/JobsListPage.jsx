// JobsListPage.jsx — FULL BACKEND INTEGRATION (UI unchanged)
// Fixed: POST URL for saving a job -> /api/applications/saved-jobs/add/
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./JobsListPage.css";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved jobs first
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const res = await api.get("/api/applications/saved-jobs/");
        setSavedItems(res.data.map((i) => i.job.id));
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
      }
    };
    loadSaved();
  }, []);

  // Load jobs from backend
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

  const isSaved = (id) => savedItems.includes(id);

  const toggleSave = async (id) => {
    try {
      if (isSaved(id)) {
        // Unsave
        await api.delete(`/api/applications/saved-jobs/remove/${id}/`);
        setSavedItems((prev) => prev.filter((x) => x !== id));
      } else {
        // Save — NOTE: correct backend endpoint is ".../add/"
        await api.post("/api/applications/saved-jobs/add/", { job: id });
        setSavedItems((prev) => [...prev, id]);
      }
    } catch (err) {
      console.error("Save/Unsave failed:", err);
    }
  };

  const openDetails = (id) => {
    window.open(`/jobs/${id}`, "_blank");
  };

  if (loading) return <div className="jobs-loading">Loading jobs…</div>;

  return (
    <div className="jobs-page">

      {/* ---------------- PAGE TITLE AREA ---------------- */}
      <div className="jobs-header">
        <h1 className="jobs-title">Risk Management Jobs</h1>
        <p className="jobs-subtitle">
          Discover exciting risk management opportunities across banking, insurance,
          and fintech sectors in India
        </p>
      </div>

      {/* ---------------- FILTER BAR ---------------- */}
      <div className="jobs-filter-bar">
        <input
          type="text"
          className="jobs-search"
          placeholder="Search jobs, companies, or skills..."
        />

        <select className="jobs-filter-select">
          <option>All Locations</option>
          <option>Chennai</option>
          <option>Hyderabad</option>
          <option>Noida</option>
        </select>

        <select className="jobs-filter-select">
          <option>Experience</option>
          <option>0-1 Years</option>
          <option>1-3 Years</option>
          <option>3-5 Years</option>
        </select>

        <select className="jobs-filter-select">
          <option>All Categories</option>
          <option>Fraud Detection</option>
          <option>AML</option>
          <option>Risk Analysis</option>
        </select>
      </div>

      {/* RESULTS COUNT */}
      <p className="jobs-count">Showing {jobs.length} job opportunities</p>

      {/* ---------------- JOB LIST ---------------- */}
      {jobs.length === 0 && (
        <p className="jobs-empty">No jobs posted yet.</p>
      )}

      {jobs.map((job) => (
        <div className="job-card" key={job.id}>
          <h2 className="job-title">{job.title}</h2>
          <p className="company-name">{job.company_name}</p>

          <div className="job-info">
            <span>{job.location}</span> •
            <span>{job.experience}</span> •
            <span>{job.salary}</span> •
            <span>{job.job_type}</span>
          </div>

          <p className="job-desc">
            {job.short_description || "Job description not provided."}
          </p>

          <div className="tags">
            {job.skills?.map((skill, index) => (
              <span key={index}>{skill}</span>
            ))}
          </div>

          <div className="job-actions">
            <button
              className="view-btn"
              onClick={() => openDetails(job.id)}
            >
              View Details
            </button>

            <button
              className="save-btn"
              onClick={() => toggleSave(job.id)}
            >
              {isSaved(job.id) ? "Unsave" : "Save Job"}
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}
