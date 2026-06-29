import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";
import { toast } from "react-hot-toast";

export default function InternshipApplications() {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const internshipIdFromURL = params.get("internship_id");
    if (internshipIdFromURL) {
      setSelectedInternship(internshipIdFromURL);
      fetchApplications(internshipIdFromURL);
    }
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await api.get("/api/internships/my-internships/");
      setInternships(res.data.results ? res.data.results : res.data);
    } catch (error) {
      console.error("Failed to fetch internships", error);
      setError("Failed to load internships");
    }
  };

  const fetchApplications = async (internshipId) => {
    if (!internshipId) {
      setApplications([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.get(
        `/api/applications/internship/${internshipId}/applicants/`
      );
      const data = res.data.results ? res.data.results : res.data;
      setApplications(data.map((app) => ({ ...app, selectedStatus: app.status || "applied" })));
    } catch (error) {
      console.error("Failed to fetch internship applications", error);
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
      await api.patch(`/api/applications/internship/${appId}/status/`, {
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
        <h2 className="rd-section-title">Internship Applications</h2>
        <p className="rd-section-subtitle">
          View applicants who applied for your posted internships
        </p>
      </div>

      <div className="rd-dropdown-wrapper">
        <label className="rd-dropdown-label">Select Internship</label>
        <select
          className="rd-dropdown-select"
          value={selectedInternship}
          onChange={(e) => {
            setSelectedInternship(e.target.value);
            fetchApplications(e.target.value);
          }}
        >
          <option value="">Select an Internship</option>
          {internships.map((i) => (
            <option key={i.id} value={i.id}>
              {i.title}
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
        ) : !selectedInternship ? (
          <p className="rd-empty-text">Please select an internship to view applications.</p>
        ) : applications.length === 0 ? (
          <p className="rd-empty-text">No applications found for this internship.</p>
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