import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function JobApplications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs/my-jobs/");
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };

  const fetchApplications = async (jobId) => {
    if (!jobId) {
      setApplications([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/api/applications/job/${jobId}/applicants/`);
      setApplications(res.data);
    } catch (error) {
      console.error("Failed to fetch job applications", error);
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

      {/* Applications */}
      <div className="rd-applications-list">
        {loading ? (
          <p className="rd-empty-text">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="rd-empty-text">No applications found.</p>
        ) : (
          applications.map((app) => (
            <div className="rd-application-card" key={app.id}>
              <div className="rd-app-card-header">
                <h3 className="rd-job-title">{app.full_name}</h3>
                <span className="rd-status-badge">{app.status}</span>
              </div>

              <div className="rd-applicant-info">
                <p className="rd-email-phone">📧 {app.email}</p>
                <p className="rd-email-phone">📞 {app.phone_number}</p>
                <p className="rd-location">📍 {app.location}</p>
              </div>

              {/* Skills */}
              <div className="rd-skills-row">
                {app.skills?.map((skill, idx) => (
                  <span key={idx} className="rd-skill-tag">
                    {skill}
                  </span>
                ))}
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