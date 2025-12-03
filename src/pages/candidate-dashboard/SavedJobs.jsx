// SavedJobs.jsx — GLOBAL SYNC VERSION (Uses SavedJobsContext)
// ✔ Syncs instantly with JobsListPage + JobDetailsPage
// ✔ Removal updates global context + local list
// ✔ UI unchanged

import React, { useEffect, useState } from "react";
import api from "../../config/api";
import { useSavedJobs } from "../../context/SavedJobsContext";   // ⭐ ADDED
import "./CandidateDashboard.css";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ GLOBAL CONTEXT
  const { toggleSave, savedIds } = useSavedJobs();

  // ============================================================
  // 1. LOAD SAVED JOBS (FULL DETAILS)
  // ============================================================
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await api.get("/api/applications/saved-jobs/");
        setSavedJobs(res.data);
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [savedIds]); 
  // ⭐ When savedIds changes, reload details
  // This keeps dashboard always accurate

  // ============================================================
  // 2. REMOVE SAVED JOB — GLOBAL + LOCAL UI
  // ============================================================
  const removeJob = async (jobId) => {
    try {
      await toggleSave(jobId); // ⭐ GLOBAL SAVE/UNSAVE
      setSavedJobs((prev) => prev.filter((job) => job.job.id !== jobId)); // remove instantly from UI
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
