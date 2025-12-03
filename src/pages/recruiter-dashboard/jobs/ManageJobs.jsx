// ManageJobs.jsx — CLEAN DASHBOARD CARD UI (Backend Fully Compatible)
import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD JOBS
  const loadJobs = async () => {
    try {
      const res = await api.get("/api/jobs/");
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // DELETE JOB
  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await api.delete(`/api/jobs/${jobId}/delete/`);
      alert("Job deleted successfully!");
      loadJobs();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete job.");
    }
  };

  // UPDATE STATUS
  const updateStatus = async (jobId, newStatus) => {
    try {
      await api.patch(`/api/jobs/${jobId}/`, { status: newStatus });
      alert("Status updated successfully!");
      loadJobs();
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="rd-loading">Loading jobs...</div>;

  return (
  <div className="rd-managejobs-page">
    <h2 className="rd-page-title">Manage Jobs</h2>
    <p className="rd-page-subtitle">View, update or delete your posted jobs.</p>

    <div className="rd-job-list">
      {jobs.length === 0 ? (
        <p className="rd-empty">No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="rd-job-card">

            {/* LEFT SECTION */}
            <div className="rd-job-card-left">
              <h3 className="rd-job-title">{job.title}</h3>

              <p className="rd-job-meta">
                <span>Category:</span> {job.category} &nbsp; | &nbsp;
                <span>Location:</span> {job.location} &nbsp; | &nbsp;
                <span>Type:</span> {job.employment_type} &nbsp; | &nbsp;
                <span>Salary:</span> {job.salary_range}
              </p>

              <span
                className={`rd-job-status ${
                  job.status === "Open" ? "active" : "closed"
                }`}
              >
                {job.status}
              </span>
            </div>

            {/* RIGHT SECTION (ACTIONS) */}
            <div className="rd-job-card-actions">

              <select
                className="rd-status-dropdown"
                value={job.status}
                onChange={(e) => updateStatus(job.id, e.target.value)}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>

              <button
                className="rd-action-btn edit"
                onClick={() =>
                  (window.location.href = `/recruiter-dashboard/jobs/edit-job/${job.id}`)
                }
              >
                Edit
              </button>

              <button
                className="rd-action-btn delete"
                onClick={() => deleteJob(job.id)}
              >
                Delete
              </button>

            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

}
