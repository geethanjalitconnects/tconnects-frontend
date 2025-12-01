// JobApplications.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../../config/api"; 
import "../../recruiter-dashboard/RecruiterDashboard.css";

export default function JobApplications() {
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    skill: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("job_id");

  // ============================================================
  // FETCH APPLICANTS FOR THIS JOB
  // ============================================================
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) {
        console.error("Job ID missing in URL");
        return;
      }

      try {
        const res = await api.get(
          `/api/applications/job/${jobId}/applicants/`
        );
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to load job applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  // ============================================================
  // UPDATE STATUS
  // ============================================================
  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/api/applications/job/${appId}/status/`, {
        status: status,
      });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: status } : app
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // ============================================================
  // FILTERS
  // ============================================================
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredApplications = applications.filter((app) => {
    return (
      (filters.status ? app.status === filters.status : true) &&
      (filters.skill ? app.candidate_skills.includes(filters.skill) : true)
    );
  });

  if (loading) return <div className="rd-loading">Loading...</div>;

  return (
    <div className="rd-applications-page">
      <h2 className="rd-page-title">Job Applications</h2>

      {/* ======================================================
          FILTER BAR
        ====================================================== */}
      <div className="rd-filter-bar">
        <select
          name="status"
          className="rd-filter-input"
          onChange={handleFilterChange}
        >
          <option value="">Filter by Status</option>
          <option value="applied">Applied</option>
          <option value="viewed">Viewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          name="skill"
          className="rd-filter-input"
          onChange={handleFilterChange}
        >
          <option value="">Filter by Skill</option>
          <option value="Python">Python</option>
          <option value="SQL">SQL</option>
          <option value="Excel">Excel</option>
          <option value="PowerBI">PowerBI</option>
          <option value="Risk Analysis">Risk Analysis</option>
        </select>
      </div>

      {/* ======================================================
          APPLICATION LIST
        ====================================================== */}
      <div className="rd-applications-list">
        {filteredApplications.length === 0 && (
          <p className="rd-empty-text">No applications found.</p>
        )}

        {filteredApplications.map((app) => (
          <div className="rd-app-card" key={app.id}>
            {/* Header */}
            <div className="rd-app-header">
              <h3 className="rd-app-job">{app.job_title}</h3>

              <select
                className="rd-status-dropdown"
                value={app.status}
                onChange={(e) => updateStatus(app.id, e.target.value)}
              >
                <option value="applied">Applied</option>
                <option value="viewed">Viewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Candidate Info */}
            <p className="rd-app-name">{app.candidate_full_name}</p>
            <p className="rd-app-email">{app.candidate_email}</p>
            <p className="rd-app-phone">+91 {app.candidate_phone}</p>
            <p className="rd-app-location">{app.candidate_location}</p>

            {/* Skills */}
            <div className="rd-skill-row">
              {app.candidate_skills.map((skill, i) => (
                <span key={i} className="rd-skill-tag">
                  {skill}
                </span>
              ))}
            </div>

            {/* Resume */}
            <div className="rd-resume-box">
              <a
                href={app.candidate_resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rd-resume-btn"
              >
                View Resume
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
