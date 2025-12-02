// JobDetailsPage.jsx — FIXED SAVE ENDPOINT
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import "./JobDetailsPage.css";

const JobDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch job details
  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}/`);
        setJob(res.data);
      } catch (err) {
        console.error("Failed to load job:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  // Check saved status
  useEffect(() => {
    const loadSavedStatus = async () => {
      try {
        const res = await api.get("/api/applications/saved-jobs/");
        const savedIds = res.data.map((i) => i.job.id);
        setSaved(savedIds.includes(parseInt(id)));
      } catch (err) {
        console.error("Failed to check saved:", err);
      }
    };
    loadSavedStatus();
  }, [id]);

  // Save / Unsave Job
  const toggleSave = async () => {
    try {
      if (saved) {
        await api.delete(`/api/applications/saved-jobs/remove/${id}/`);
        setSaved(false);
      } else {
        // FIXED ENDPOINT HERE:
        await api.post("/api/applications/saved-jobs/add/", { job: id });
        setSaved(true);
      }
    } catch (err) {
      console.error("Error saving/unsaving:", err);
    }
  };

  const handleApplyNow = () => navigate(`/apply-job/${id}`);

  if (loading) return <div className="jd-loading">Loading job…</div>;
  if (!job) return <div className="jd-error">Job not found.</div>;

  return (
    <div className="jd-desktop-wrapper">
      {/* ... ENTIRE UI EXACTLY AS BEFORE ... */}
    </div>
  );
};

export default JobDetailsPage;
