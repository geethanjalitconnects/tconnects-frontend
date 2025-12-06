// JobApplications.jsx
import React, { useEffect, useState } from "react";
import api from "../../../config/api";
 // your global axios instance
import "./RecruiterDashboard.css"; // uses classes defined in your recruiter css

// Set these to match your backend URLs (change if needed)
const JOBS_URL = "/api/recruiter/applications/jobs/"; // GET list
// For update/delete we assume endpoint is /api/recruiter/applications/jobs/<id>/
const JOBS_ITEM_URL = (id) => `/api/recruiter/applications/jobs/${id}/`;

export default function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get(JOBS_URL, { params });
      // Expected res.data to be array of applications
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch job applications", err);
      setError("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(JOBS_ITEM_URL(id), { status: newStatus });
      // update locally
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.delete(JOBS_ITEM_URL(id));
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete application", err);
      setError("Failed to delete application.");
    }
  };

  return (
    <div className="rd-applications-page">
      <div className="rd-page-header">
        <h2 className="rd-page-title">Job Applications</h2>
        <p className="rd-page-subtitle">Manage and review candidate applications</p>
      </div>

      <div className="rd-filter-container">
        <select
          className="rd-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="received">Received</option>
          <option value="reviewing">Reviewing</option>
          <option value="interview">Interview</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>

        <button className="rd-save-btn" onClick={fetchApplications}>
          Refresh
        </button>
      </div>

      {loading && <p>Loading applications...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="rd-applications-list">
        {applications.length === 0 && !loading && <p>No applications found.</p>}

        {applications.map((app) => (
          <div key={app.id} className="rd-application-card">
            <div className="rd-app-card-header">
              <div>
                <div className="rd-job-title">{app.job_title || app.position || "Job"}</div>
                <div className="rd-applicant-info">
                  <div className="rd-applicant-name">{app.applicant_name || app.name}</div>
                  <div className="rd-email-phone">
                    {app.email} {app.phone ? `• ${app.phone}` : null}
                  </div>
                  {app.location && <div className="rd-location">{app.location}</div>}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ marginBottom: 8 }}>
                  <select
                    className="rd-filter-select"
                    value={app.status || ""}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    title="Change status"
                  >
                    <option value="received">Received</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  {app.resume_url ? (
                    <a
                      className="rd-view-resume-btn"
                      href={app.resume_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    <span className="rd-resume-btn" style={{ opacity: 0.6 }}>
                      No resume
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 8 }}>
                  <button
                    className="rd-action-btn delete"
                    onClick={() => handleDelete(app.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Skills / Tags */}
            {app.skills?.length > 0 && (
              <div className="rd-skills-row" style={{ marginTop: 12 }}>
                {app.skills.map((s, idx) => (
                  <div key={idx} className="rd-skill-tag">
                    {s}
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 12, color: "#547878" }}>
              Applied: {new Date(app.created_at || app.applied_at || Date.now()).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
