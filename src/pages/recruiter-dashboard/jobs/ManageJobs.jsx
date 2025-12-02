// ManageJobs.jsx — FULL WORKING (UI unchanged)
import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD JOBS (FIXED URL)
  const loadJobs = async () => {
    try {
      // FIXED: Your backend does NOT have /my-jobs/
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

  // DELETE A JOB
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

  // UPDATE JOB STATUS (FIXED URL)
  const updateStatus = async (jobId, newStatus) => {
    try {
      // FIXED: Backend does NOT have /status/ endpoint
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

      <div className="rd-job-table">
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Type</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="7" className="rd-empty">
                  No jobs posted yet.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.category}</td>
                  <td>{job.location}</td>
                  <td>{job.employment_type}</td>
                  <td>{job.salary_range}</td>

                  <td>
                    <select
                      className="rd-status-dropdown"
                      value={job.status}
                      onChange={(e) =>
                        updateStatus(job.id, e.target.value)
                      }
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>

                  <td>
                    <button
                      className="rd-delete-btn"
                      onClick={() => deleteJob(job.id)}
                    >
                      Delete
                    </button>

                    <button
                      className="rd-view-btn"
                      onClick={() =>
                        (window.location.href = `/recruiter-dashboard/jobs/edit-job/${job.id}`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
