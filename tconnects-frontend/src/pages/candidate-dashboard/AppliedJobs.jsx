// AppliedJobs.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await api.get("/api/applications/job/applied/");
        setApplications(res.data.results ? res.data.results : res.data);
      } catch (err) {
        console.error("Failed to load applied jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  // ── Status badge style ──────────────────────────────────────
  const getStatusStyle = (status) => {
    switch (status) {
      case "shortlisted":
        return { background: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" };
      case "rejected":
        return { background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" };
      default: // applied / viewed
        return { background: "#fef9c3", color: "#854d0e", border: "1px solid #fde047" };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "shortlisted": return "Shortlisted";
      case "rejected":    return "Rejected";
      case "viewed":      return "Viewed";
      default:            return "Applied";
    }
  };

  if (loading) {
    return <div className="cd-loading">Loading...</div>;
  }

  return (
    <div className="cd-applied">

      <h1 className="cd-section-title">Applied Jobs</h1>
      <p className="cd-section-subtitle">
        Track all the jobs you have applied for and check their application status.
      </p>

      {applications.length === 0 && (
        <p className="cd-empty-text">You haven't applied to any jobs yet.</p>
      )}

      {applications.map((app) => (
        <div className="cd-job-card" key={app.id}>
          <div className="cd-job-info">
            <h3 className="cd-job-title">{app.job_title}</h3>
            <p className="cd-job-company">
              {app.company_name} • {app.candidate_location}
            </p>
            <p className="cd-job-date">
              Applied on: {new Date(app.created_at).toLocaleDateString()}
            </p>
          </div>

          <span style={{
            ...getStatusStyle(app.status),
            padding: "5px 14px",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: "600",
            whiteSpace: "nowrap",
          }}>
            {getStatusLabel(app.status)}
          </span>
        </div>
      ))}
    </div>
  );
}