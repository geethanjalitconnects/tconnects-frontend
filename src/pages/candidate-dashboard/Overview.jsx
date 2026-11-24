import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";

export default function Overview() {
  const [stats, setStats] = useState({
    applied_jobs: 0,
    applied_internships: 0,
    saved_jobs: 0,
    saved_internships: 0,
    ongoing_courses: 0,
  });

  useEffect(() => {
    api
      .get("/api/applications/dashboard/stats/")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Dashboard stats fetch error:", err));
  }, []);

  return (
    <div className="cd-overview">

      {/* Welcome Section */}
      <div className="cd-welcome-card">
        <h2 className="cd-welcome-title">Welcome back 👋</h2>
        <p className="cd-welcome-text">
          Here’s a quick summary of your activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="cd-stats-grid">

        <div className="cd-stat-card">
          <div className="cd-stat-icon">📝</div>
          <div>
            <h3 className="cd-stat-number">{stats.applied_jobs}</h3>
            <p className="cd-stat-label">Applied Jobs</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">📝</div>
          <div>
            <h3 className="cd-stat-number">{stats.applied_internships}</h3>
            <p className="cd-stat-label">Applied Internships</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">💾</div>
          <div>
            <h3 className="cd-stat-number">{stats.saved_jobs}</h3>
            <p className="cd-stat-label">Saved Jobs</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">💾</div>
          <div>
            <h3 className="cd-stat-number">{stats.saved_internships}</h3>
            <p className="cd-stat-label">Saved Internships</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">🎓</div>
          <div>
            <h3 className="cd-stat-number">{stats.ongoing_courses}</h3>
            <p className="cd-stat-label">Ongoing Courses</p>
          </div>
        </div>

      </div>
    </div>
  );
}
