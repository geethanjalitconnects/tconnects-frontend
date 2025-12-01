// InternshipApplications.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function InternshipApplications() {
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    skill: "",
  });
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const internshipId = searchParams.get("internship_id");

  // ============================================================
  // FETCH INTERNSHIP APPLICANTS
  // ============================================================
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!internshipId) {
        console.error("Internship ID missing in URL");
        return;
      }

      try {
        const res = await api.get(
          `/api/applications/internship/${internshipId}/applicants/`
        );
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to load internship applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [internshipId]);

  // ============================================================
  // UPDATE STATUS
  // ============================================================
  const updateStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/api/applications/internship/${appId}/status/`, {
        status: newStatus,
      });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Failed to update application status:", err);
    }
  };

  // ============================================================
  // FILTER LOGIC
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

      {/* ===== PAGE HEADER ===== */}
      <div className="rd-page-header">
        <h2 className="rd-page-title">Internship Applications</h2>
        <p className="rd-page-subtitle">
          Review applicants and manage your internship hiring process.
        </p>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div className="rd-filter-container">
        <select name="status" className="rd-filter-select" onChange={handleFilterChange}>
          <option value="">Filter by Status</option>
          <option value="applied">Applied</option>
          <option value="viewed">Viewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>

        <select name="skill" className="rd-filter-select" onChange={handleFilterChange}>
          <option value="">Filter by Skill</option>
          <option value="Excel">Excel</option>
          <option value="SQL">SQL</option>
          <option value="PowerBI">PowerBI</option>
          <option value="Risk Analysis">Risk Analysis</option>
        </select>
      </div>

      {/* ===== APPLICATION LIST ===== */}
      <div className="rd-applications-list">
        {filteredApplications.length === 0 && (
          <p className="rd-empty-text">No internship applications found.</p>
        )}

        {filteredApplications.map((app) => (
          <div key={app.id} className="rd-application-card">

            <div className="rd-app-card-header">
              <h2 className="rd-job-title">{app.internship_title}</h2>

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

            <div className="rd-applicant-info">
              <p className="rd-applicant-name">{app.candidate_full_name}</p>
              <p className="rd-email-phone">
                {app.candidate_email} • +91 {app.candidate_phone}
              </p>
              <p className="rd-location">{app.candidate_location}</p>

              <div className="rd-skills-row">
                {app.candidate_skills.map((skill, index) => (
                  <span key={index} className="rd-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              className="rd-view-resume-btn"
              onClick={() => window.open(app.candidate_resume_url, "_blank")}
            >
              View Resume
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}
