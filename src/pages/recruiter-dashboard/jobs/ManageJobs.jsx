// ManageJobs.jsx
import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import { toast } from "react-hot-toast";
import "../RecruiterDashboard.css";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const res = await api.get("/api/jobs/my-jobs/");
      setJobs(res.data.results ? res.data.results : res.data);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/api/jobs/${jobId}/delete/`);
      toast.success("Job deleted successfully!");
      loadJobs();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete job.");
    }
  };

  // ✅ Status badge helper
  const getStatusBadge = (job) => {
    if (!job.is_active && job.scheduled_at) {
      const scheduledDate = new Date(job.scheduled_at);
      const formatted = scheduledDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return (
        <span style={{
          backgroundColor: "#fff3cd",
          color: "#856404",
          border: "1px solid #ffc107",
          borderRadius: "6px",
          padding: "3px 10px",
          fontSize: "0.78rem",
          fontWeight: "600",
          whiteSpace: "nowrap",
        }}>
          🕒 Scheduled: {formatted}
        </span>
      );
    }

    if (job.is_active) {
      return (
        <span style={{
          backgroundColor: "#d1fae5",
          color: "#065f46",
          border: "1px solid #6ee7b7",
          borderRadius: "6px",
          padding: "3px 10px",
          fontSize: "0.78rem",
          fontWeight: "600",
        }}>
          ✅ Posted
        </span>
      );
    }

    return (
      <span style={{
        backgroundColor: "#f3f4f6",
        color: "#6b7280",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        padding: "3px 10px",
        fontSize: "0.78rem",
        fontWeight: "600",
      }}>
        ⏸ Inactive
      </span>
    );
  };

  if (loading) return <div className="rd-loading">Loading jobs...</div>;

  return (
    <div className="rd-managejobs-page">
      <h2 className="rd-page-title">Manage Jobs</h2>
      <p className="rd-page-subtitle">View, edit or delete your posted jobs.</p>

      <div className="rd-job-list">
        {jobs.length === 0 ? (
          <p className="rd-empty">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="rd-job-card">

              {/* LEFT SIDE */}
              <div className="rd-job-card-left">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <h3 className="rd-job-title" style={{ margin: 0 }}>{job.title}</h3>
                  {getStatusBadge(job)}
                </div>

                <p className="rd-job-meta">
                  <span>Category:</span> {job.category || "N/A"} &nbsp;|&nbsp;
                  <span>Location:</span> {job.location || "N/A"} &nbsp;|&nbsp;
                  <span>Type:</span> {job.employment_type || "N/A"} &nbsp;|&nbsp;
                  <span>Salary:</span> {job.salary_range || "N/A"}
                </p>
              </div>

              {/* RIGHT SIDE BUTTONS */}
              <div className="rd-job-card-actions">
                <button
                  className="rd-action-btn apps"
                  onClick={() =>
                    (window.location.href = `/recruiter-dashboard/applications/jobs?job_id=${job.id}`)
                  }
                >
                  View Applications
                </button>

                <button
                  className="rd-action-btn edit"
                  onClick={() =>
                    (window.location.href = `/recruiter-dashboard/jobs/edit-job/${job.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="rd-action-btn delete"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}