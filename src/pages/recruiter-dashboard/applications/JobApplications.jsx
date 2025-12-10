import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function JobApplications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs/my-jobs/");
      console.log("Jobs fetched:", res.data);
      setJobs(res.data);
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
      console.log("Applications fetched:", res.data);
      console.log("Number of applications:", res.data.length);
      
      // Check the structure of first application if exists
      if (res.data.length > 0) {
        console.log("First application structure:", res.data[0]);
      }
      
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch job applications", error);
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
        <h2 className="rd-section-title">Job Applications</h2>
        <p className="rd-section-subtitle">
          Review applicants who applied for your job postings
        </p>
      </div>

      {/* Dropdown */}
      <div className="rd-dropdown-wrapper">
        <label className="rd-dropdown-label">Select Job</label>

        <select
          className="rd-dropdown-select"
          value={selectedJob}
          onChange={(e) => {
            console.log("Selected job ID:", e.target.value);
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

      {/* Error Message */}
      {error && (
        <div style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      {/* Debug Info */}
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '10px', fontSize: '12px' }}>
        <strong>Debug Info:</strong>
        <div>Selected Job: {selectedJob || 'None'}</div>
        <div>Applications Count: {applications.length}</div>
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
      </div>

      {/* Applications */}
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

              {/* Resume */}
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