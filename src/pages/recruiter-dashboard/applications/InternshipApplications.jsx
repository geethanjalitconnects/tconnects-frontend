import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function InternshipApplications() {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await api.get("/api/internships/my-internships/");
      console.log("Internships fetched:", res.data);
      setInternships(res.data);
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
      console.log("Applications fetched:", res.data);
      console.log("Number of applications:", res.data.length);
      
      // Check the structure of first application if exists
      if (res.data.length > 0) {
        console.log("First application structure:", res.data[0]);
      }
      
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch internship applications", error);
      console.error("Error details:", error.response?.data);
      setError("Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rd-applications-page">

      {/* Page Header */}
      <div className="rd-section-header">
        <h2 className="rd-section-title">Internship Applications</h2>
        <p className="rd-section-subtitle">
          View applicants who applied for your posted internships
        </p>
      </div>

      {/* Dropdown */}
      <div className="rd-dropdown-wrapper">
        <label className="rd-dropdown-label">Select Internship</label>

        <select
          className="rd-dropdown-select"
          value={selectedInternship}
          onChange={(e) => {
            console.log("Selected internship ID:", e.target.value);
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

      {/* Error Message */}
      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      {/* Debug Info */}
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '10px', fontSize: '12px' }}>
        <strong>Debug Info:</strong>
        <div>Selected Internship: {selectedInternship || 'None'}</div>
        <div>Applications Count: {applications.length}</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
      </div>

      {/* Applications List */}
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
                <h3 className="rd-job-title">{app.full_name || 'No Name'}</h3>
                <span className="rd-status-badge">{app.status || 'Applied'}</span>
              </div>

              <div className="rd-applicant-info">
                <p className="rd-email-phone">📧 {app.email || 'No email'}</p>
                <p className="rd-email-phone">📞 {app.phone_number || app.phone || 'No phone'}</p>
                <p className="rd-location">📍 {app.location || 'No location'}</p>
              </div>

              {/* Skills */}
              <div className="rd-skills-row">
                {app.skills && app.skills.length > 0 ? (
                  app.skills.map((skill, idx) => (
                    <span key={idx} className="rd-skill-tag">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="rd-skill-tag">No skills listed</span>
                )}
              </div>

              {/* Resume Button */}
              {app.resume && (
                <a
                  href={app.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rd-view-resume-btn"
                >
                  View Resume
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}