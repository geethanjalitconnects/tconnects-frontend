// AppliedInternships.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";

export default function AppliedInternships() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH APPLIED INTERNSHIPS FROM BACKEND
  // ============================================================
  useEffect(() => {
    const fetchAppliedInternships = async () => {
      try {
        const res = await api.get("/api/applications/internship/applied/");
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to load applied internships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedInternships();
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

      <h2 className="cd-section-title">Applied Internships</h2>
      <p className="cd-section-subtitle">
        Track all the internships you have applied for.
      </p>

      {/* No internships applied */}
      {applications.length === 0 && (
        <p className="cd-empty-text">You haven't applied to any internships yet.</p>
      )}

      {/* List all applied internships */}
      {applications.map((app) => (
        <div className="cd-job-card" key={app.id}>
          <div className="cd-job-info">
            <h3 className="cd-job-title">{app.internship_title}</h3>
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
