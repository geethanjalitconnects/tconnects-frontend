import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../../../pages/recruiter-dashboard/RecruiterDashboard.css";

export default function InternshipApplications() {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load recruiter's posted internships
  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await api.get("/api/recruiter/internships/");
      setInternships(res.data);
    } catch (err) {
      console.error("Failed to load internships", err);
    }
  };

  const fetchApplicants = async (internshipId) => {
    if (!internshipId) return;
    setLoading(true);
    try {
      const res = await api.get(
        `/api/applications/internship/${internshipId}/applicants/`
      );
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch internship applicants", err);
    }
    setLoading(false);
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await api.patch(
        `/api/applications/internship/${applicationId}/status/`,
        { status: newStatus }
      );
      fetchApplicants(selectedInternship);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="dashboard-container">

      <h2 className="dashboard-title">Internship Applications</h2>

      {/* PREMIUM DROPDOWN */}
      <div className="rd-dropdown-wrapper">
        <label className="rd-dropdown-label">Select Internship</label>

        <select
          className="rd-dropdown-select"
          value={selectedInternship}
          onChange={(e) => {
            setSelectedInternship(e.target.value);
            fetchApplicants(e.target.value);
          }}
        >
          <option value="">Select an Internship</option>
          {internships.map((intern) => (
            <option key={intern.id} value={intern.id}>
              {intern.title}
            </option>
          ))}
        </select>
      </div>

      {/* Applications */}
      {loading ? (
        <p>Loading applicants...</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              
              <div className="application-info">
                <h4>{app.candidate_name}</h4>
                <p>Email: {app.email}</p>
                <p>
                  Resume:{" "}
                  <a href={app.resume} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </p>
              </div>

              <div className="application-status">
                <span className={`status-badge status-${app.status}`}>
                  {app.status}
                </span>

                <select
                  className="status-dropdown"
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value)}
                >
                  <option value="applied">Applied</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
