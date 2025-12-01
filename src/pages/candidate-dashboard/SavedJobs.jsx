// SavedJobs.jsx — Backend Integrated
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // 1. LOAD SAVED JOBS
  // ============================================================
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await api.get("/api/saved-jobs/");
        setSavedJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  // ============================================================
  // 2. REMOVE SAVED JOB
  // ============================================================
  const removeJob = async (jobId) => {
    try {
      await api.delete(`/api/saved-jobs/remove/${jobId}/`);
      setSavedJobs(savedJobs.filter((job) => job.job.id !== jobId));
    } catch (err) {
      console.error("Failed to remove saved job:", err);
    }
  };

  if (loading) return <div className="cd-loading">Loading saved jobs...</div>;

  return (
    <div className="cd-saved">
      {/* Page Header */}
      <h2 className="cd-section-title">Saved Jobs</h2>
      <p className="cd-section-subtitle">
        Here are all the jobs you have saved for later. Apply when you're ready!
      </p>

      {/* Empty State */}
      {savedJobs.length === 0 && (
        <p className="cd-empty-msg">No saved jobs yet.</p>
      )}

      {/* Saved Jobs List */}
      {savedJobs.map((item) => (
        <div key={item.id} className="cd-saved-card">
          <div className="cd-saved-info">
            <h3 className="cd-job-title">{item.job.title}</h3>
            <p className="cd-job-company">
              {item.job.company_name} • {item.job.location}
            </p>
            <p className="cd-job-date">
              Saved on: {new Date(item.saved_on).toLocaleDateString()}
            </p>
          </div>

          <button
            className="cd-remove-btn"
            onClick={() => removeJob(item.job.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
