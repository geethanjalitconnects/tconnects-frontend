import React, { useEffect, useState } from "react";
import api from "../../config/api";
  // ← your global API
import "./RecruiterDashboard.css";       // keep your styling

export default function RecruiterOverview() {
  const [stats, setStats] = useState({
    total_jobs: 0,
    active_jobs: 0,
    total_applications: 0,
    scheduled_jobs: 0,
    total_internships: 0,
    active_internships: 0,
  });

  const [loading, setLoading] = useState(true);

  // Fetch Recruiter Overview Stats
  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await api.get("/api/applications/recruiter/overview/");
      setStats(res.data);
    } catch (error) {
      console.log("Error loading recruiter overview:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cd-overview">

      {/* Welcome Section */}
      <div className="cd-welcome-card">
        <h2 className="cd-welcome-title">Welcome back, Recruiter 👋</h2>
        <p className="cd-welcome-text">
          Here’s your hiring activity summary. Manage jobs, track applications,
          and post new opportunities with ease.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="cd-stats-grid">

        <div className="cd-stat-card">
          <div className="cd-stat-icon">📢</div>
          <div>
            <h3 className="cd-stat-number">
              {loading ? "…" : stats.total_jobs}
            </h3>
            <p className="cd-stat-label">Total Jobs Posted</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">⚡</div>
          <div>
            <h3 className="cd-stat-number">
              {loading ? "…" : stats.active_jobs}
            </h3>
            <p className="cd-stat-label">Active Jobs</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">📩</div>
          <div>
            <h3 className="cd-stat-number">
              {loading ? "…" : stats.total_applications}
            </h3>
            <p className="cd-stat-label">Total Applications</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">🕒</div>
          <div>
            <h3 className="cd-stat-number">
              {loading ? "…" : stats.scheduled_jobs}
            </h3>
            <p className="cd-stat-label">Scheduled Jobs</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">🎓</div>
          <div>
            <h3 className="cd-stat-number">
              {loading ? "…" : stats.total_internships}
            </h3>
            <p className="cd-stat-label">Total Internships Posted</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">🚀</div>
          <div>
            <h3 className="cd-stat-number">
              {loading ? "…" : stats.active_internships}
            </h3>
            <p className="cd-stat-label">Active Internships</p>
          </div>
        </div>

      </div>
    </div>
  );
}
