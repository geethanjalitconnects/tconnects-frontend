import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";
import { toast } from "react-hot-toast";

export default function JobApplications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const jobIdFromURL = params.get("job_id");

  if (jobIdFromURL) {
    setSelectedJob(jobIdFromURL);
    fetchApplications(jobIdFromURL);
  }
}, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobIdFromURL = params.get("job_id");
    if (jobIdFromURL) {
      setSelectedJob(jobIdFromURL);
      fetchApplications(jobIdFromURL);
    }
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs/my-jobs/");
      setJobs(res.data.results ? res.data.results : res.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      setError("Failed to load jobs");
    }
  };

  const fetchApplications = async (jobId) => {
    if (!jobId) {
      setApplications([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/api/applications/job/${jobId}/applicants/`);
      const data = res.data.results ? res.data.results : res.data;
      setApplications(data.map((app) => ({ ...app, selectedStatus: app.status || "applied" })));
    } catch (error) {
      console.error("Failed to fetch job applications", error);
      setError("Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (appId, newStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, selectedStatus: newStatus } : a))
    );
  };

  const handleUpdateStatus = async (appId) => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return;
    setUpdatingId(appId);
    try {
      await api.patch(`/api/applications/job/${appId}/status/`, {
        status: app.selectedStatus,
      });
      setApplications((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, status: app.selectedStatus } : a
        )
      );
      toast.success("Status updated successfully!");
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "shortlisted":
        return { background: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" };
      case "rejected":
        return { background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" };
      default:
        return { background: "#fef9c3", color: "#854d0e", border: "1px solid #fde047" };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "shortlisted": return "Shortlisted";
      case "rejected":    return "Rejected";
      default:            return "Applied";
    }
  };

  const getResumeUrl = (url) => {
    if (!url) return url;
    if (url.includes('res.cloudinary.com') && url.includes('/raw/upload/')) {
      return url.replace('/raw/upload/', '/raw/upload/fl_attachment/');
    }
    return url;
  };

  return (
    <div className="rd-applications-page">

      <div className="rd-section-header">
        <h2 className="rd-section-title">Job Applications</h2>
        <p className="rd-section-subtitle">
          Review applicants who applied for your job postings
        </p>
      </div>

      <div className="rd-dropdown-wrapper">
        <label className="rd-dropdown-label">Select Job</label>
        <select
          className="rd-dropdown-select"
          value={selectedJob}
          onChange={(e) => {
            setSelectedJob(e.target.value);
            fetchApplications(e.target.value);
          }}
        >
          <option value="">Select a Job</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div style={{ color: "red", padding: "10px", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <div className="rd-applications-list">
        {loading ? (
          <p className="rd-empty-text">Loading applications...</p>
        ) : !selectedJob ? (
          <p className="rd-empty-text">Please select a job to view applications.</p>
        ) : applications.length === 0 ? (
          <p className="rd-empty-text">No applications found for this job.</p>
        ) : (
          applications.map((app) => (
            <div className="rd-application-card" key={app.id}>

              <div className="rd-app-card-header">
                <h3 className="rd-job-title">{app.full_name || "No Name"}</h3>
                <span
                  style={{
                    ...getStatusStyle(app.status),
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.78rem",
                    fontWeight: "600",
                  }}
                >
                  {getStatusLabel(app.status)}
                </span>
              </div>

              <div className="rd-applicant-info">
                <p className="rd-email-phone">📧 {app.email || "No email"}</p>
                <p className="rd-email-phone">📞 {app.phone_number || app.phone || "No phone"}</p>
                <p className="rd-location">📍 {app.location || "No location"}</p>
              </div>

              <div className="rd-skills-row">
                {app.skills && app.skills.length > 0 ? (
                  app.skills.map((skill, idx) => (
                    <span key={idx} className="rd-skill-tag">{skill}</span>
                  ))
                ) : (
                  <span className="rd-skill-tag">No skills listed</span>
                )}
              </div>

              {app.resume && (
                <a
                  href={getResumeUrl(app.resume)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rd-view-resume-btn"
                >
                  View Resume
                </a>
              )}

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "14px",
                paddingTop: "14px",
                borderTop: "1px solid #e5e7eb",
                flexWrap: "wrap",
              }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
                  Update Status:
                </label>
                <select
                  value={app.selectedStatus}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "13px",
                    cursor: "pointer",
                    background: "#f9fafb",
                    color: "#111827",
                    outline: "none",
                  }}
                >
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>

                <button
                  onClick={() => handleUpdateStatus(app.id)}
                  disabled={updatingId === app.id}
                  style={{
                    padding: "7px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: updatingId === app.id ? "#9ca3af" : "linear-gradient(135deg,#0f7173,#1bb2b0)",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: updatingId === app.id ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {updatingId === app.id ? "Saving..." : "Update Status"}
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}