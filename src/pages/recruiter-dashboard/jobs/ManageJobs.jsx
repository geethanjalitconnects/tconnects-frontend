// ManageJobs.jsx — Backend Integrated
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // 1. LOAD ALL JOBS POSTED BY LOGGED-IN RECRUITER
  // ============================================================
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/api/jobs/my-jobs/");
        setJobs(res.data);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ============================================================
  // 2. DELETE JOB
  // ============================================================
  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await api.delete(`/api/jobs/${jobId}/delete/`);
      setJobs(jobs.filter((job) => job.id !== jobId));
      alert("Job deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete job. Try again.");
    }
  };

  // ============================================================
  // 3. TOGGLE JOB STATUS (Active ↔ Closed)
  // ============================================================
  const toggleStatus = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Closed" : "Active";

      const res = await api.patch(`/api/jobs/${jobId}/status/`, {
        status: newStatus,
      });

      setJobs(
        jobs.map((job) =>
          job.id === jobId ? { ...job, status: res.data.status } : job
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading) return <div className="rd-loading">Loading Jobs…</div>;

  return (
    <div className="rd-managejobs-page">
      <h2 className="rd-page-title">Manage Jobs</h2>
      <p className="rd-page-subtitle">
        View, edit, close or delete your posted jobs.
      </p>

      <div className="rd-job-list">
        {jobs.length === 0 && (
          <p className="rd-empty-text">No jobs posted yet.</p>
        )}

        {jobs.map((job) => (
          <div key={job.id} className="rd-job-card">
            {/* Job Info */}
            <div className="rd-job-card-left">
              <h3 className="rd-job-title">{job.title}</h3>

              <p className="rd-job-meta">
                Posted on: <span>{job.posted_on}</span>
              </p>

              <p
                className={`rd-job-status ${
                  job.status === "Active" ? "active" : "closed"
                }`}
              >
                {job.status}
              </p>
            </div>

            {/* Actions */}
            <div className="rd-job-card-actions">
              {/* ⭐ EDIT JOB */}
              <button
                className="rd-action-btn edit"
                onClick={() =>
                  navigate(`/recruiter-dashboard/jobs/edit-job/${job.id}`)
                }
              >
                Edit
              </button>

              {/* ⭐ VIEW APPLICATIONS */}
              <button
                className="rd-action-btn apps"
                onClick={() =>
                  navigate("/recruiter-dashboard/applications/jobs")
                }
              >
                View Applications
              </button>

              {/* ⭐ TOGGLE STATUS */}
              <button
                className="rd-action-btn status"
                onClick={() => toggleStatus(job.id, job.status)}
              >
                {job.status === "Active" ? "Close Job" : "Reopen Job"}
              </button>

              {/* ⭐ DELETE JOB */}
              <button
                className="rd-action-btn delete"
                onClick={() => deleteJob(job.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
