import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../../../pages/recruiter-dashboard/RecruiterDashboard.css";

export default function JobApplications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load recruiter's posted jobs
  useEffect(() => {
    fetchRecruiterJobs();
  }, []);

  const fetchRecruiterJobs = async () => {
    try {
      const res = await api.get("/api/recruiter/jobs/");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to load jobs", err);
    }
  };

  const fetchApplicants = async (jobId) => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/applications/job/${jobId}/applicants/`);
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch job applicants", err);
    }
    setLoading(false);
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await api.patch(`/api/applications/job/${applicationId}/status/`, {
        status: newStatus,
      });
      fetchApplicants(selectedJob);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="dashboard-container">

      <h2 className="dashboard-title">Job Applications</h2>

      {/* PREMIUM DROPDOWN */}
      <div className="rd-dropdown-wrapper">
        <label className="rd-dropdown-label">Select Job</label>

        <select
          className="rd-dropdown-select"
          value={selectedJob}
          onChange={(e) => {
            setSelectedJob(e.target.value);
            fetchApplicants(e.target.value);
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

      {/* Applications List */}
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
