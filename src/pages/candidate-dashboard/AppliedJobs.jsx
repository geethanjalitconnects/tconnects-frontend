// AppliedJobs.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH APPLIED JOBS FROM BACKEND
  // ============================================================
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await api.get("/api/applications/job/applied/");
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to load applied jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  // Status color mapping
  const getStatusClass = (status) => {
    switch (status) {
      case "applied":
        return "cd-status-pending";
      case "viewed":
        return "cd-status-reviewed";
      case "shortlisted":
        return "cd-status-reviewed";
      case "rejected":
        return "cd-status-rejected";
      default:
        return "cd-status-pending";
    }
  };

  if (loading) {
    return <div className="cd-loading">Loading...</div>;
  }

  return (
    <div className="cd-applied">

      {/* Page Header */}
      <h1 className="cd-section-title">Applied Jobs</h1>
      <p className="cd-section-subtitle">
        Track all the jobs you have applied for and check their application status.
      </p>

      {/* If No Applications */}
      {applications.length === 0 && (
        <p className="cd-empty-text">You haven't applied to any jobs yet.</p>
      )}

      {/* List Applications */}
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

          <span className={`cd-status ${getStatusClass(app.status)}`}>
            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
          </span>
        </div>
      ))}
    </div>
  );
}
