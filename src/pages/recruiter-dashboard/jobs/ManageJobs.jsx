// ManageJobs.jsx — SAME UI AS ManageInternships (NO STATUS)
import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import { toast } from "react-hot-toast";
import "../RecruiterDashboard.css";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Jobs
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

  // Delete Job
  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await api.delete(`/api/jobs/${jobId}/delete/`);
      toast.success("Job deleted successfully!");
      loadJobs();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete job.");
    }
  };

  if (loading) return <div className="rd-loading">Loading jobs...</div>;

  return (
    <div className="rd-managejobs-page">
      <h2 className="rd-page-title">Manage Jobs</h2>
      <p className="rd-page-subtitle">View, edit or delete your posted jobs.</p>

      <div className="rd-job-list">
        {jobs.length === 0 ? (
          <p className="rd-empty">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="rd-job-card">

              {/* LEFT SIDE */}
              <div className="rd-job-card-left">
                <h3 className="rd-job-title">{job.title}</h3>

                <p className="rd-job-meta">
                  <span>Category:</span> {job.category || "N/A"} &nbsp; | &nbsp;
                  <span>Location:</span> {job.location || "N/A"} &nbsp; | &nbsp;
                  <span>Type:</span> {job.employment_type || "N/A"} &nbsp; | &nbsp;
                  <span>Salary:</span> {job.salary_range || "N/A"}
                </p>
              </div>

              {/* RIGHT SIDE BUTTONS */}
              <div className="rd-job-card-actions">

                {/* VIEW APPLICATIONS */}
                <button
                  className="rd-action-btn apps"
                  onClick={() =>
                    (window.location.href = `/recruiter-dashboard/applications/jobs?job_id=${job.id}`)
                  }
                >
                  View Applications
                </button>

                {/* EDIT BUTTON */}
                <button
                  className="rd-action-btn edit"
                  onClick={() =>
                    (window.location.href = `/recruiter-dashboard/jobs/edit-job/${job.id}`)
                  }
                >
                  Edit
                </button>

                {/* DELETE BUTTON */}
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
