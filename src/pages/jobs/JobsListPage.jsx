// JobsListPage.jsx — FINAL VERSION (Uses Global SavedJobsContext)
// ✔ No UI changed
// ✔ Global saved jobs sync (Naukri/Indeed style)
// ✔ Instant update across all pages
// ✔ Backend synced

import React, { useEffect, useState } from "react";
import api from "../../config/api";
import { useSavedJobs } from "../../context/SavedJobsContext";   // ⭐ ADDED
import "./JobsListPage.css";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ GET GLOBAL SAVED JOBS
  const { savedIds, toggleSave } = useSavedJobs();

  // 👉 Create readable slug
  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  // 👉 Build final SEO URL
  const buildSlug = (job) => {
    const titleSlug = slugify(job.title);
    const locationSlug = slugify(job.location || "india");
    return `${titleSlug}-${locationSlug}-${job.id}`;
  };

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

  const isSaved = (id) => savedIds.includes(id); // ⭐ GLOBAL CHECK

  // 👉 SEO-friendly View Details
  const openDetails = (job) => {
    const slug = buildSlug(job);
    window.open(`/jobs/${slug}`, "_blank");
  };

  if (loading) return <div className="jobs-loading">Loading jobs…</div>;

  return (
    <div className="jobs-page">

      {/* PAGE TITLE */}
      <div className="jobs-header">
        <h1 className="jobs-title">Risk Management Jobs</h1>
        <p className="jobs-subtitle">
          Discover exciting risk management opportunities across banking, insurance,
          and fintech sectors in India.
        </p>
      </div>

      {/* COUNT */}
      <p className="jobs-count">Showing {jobs.length} job opportunities</p>

      {/* JOB LIST */}
      {jobs.length === 0 && (
        <p className="jobs-empty">No jobs posted yet.</p>
      )}

      {jobs.map((job) => (
        <div className="job-card" key={job.id}>
          <h2 className="job-title">{job.title}</h2>
          <p className="company-name">{job.company_name}</p>

          {/* FIXED FIELD NAMES TO MATCH BACKEND */}
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

            {/* 👉 OPEN SEO URL */}
            <button
              className="view-btn"
              onClick={() => openDetails(job)}
            >
              View Details
            </button>

            {/* ⭐ GLOBAL SAVE STATE BUTTON */}
            <button
              className="save-btn"
              onClick={() => toggleSave(job.id)}
            >
              {isSaved(job.id) ? "Saved" : "Save Job"}
            </button>

          </div>
        </div>
      ))}

    </div>
  );
}
