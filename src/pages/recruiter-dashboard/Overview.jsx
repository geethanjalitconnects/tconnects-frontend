import React from "react";
import "./RecruiterDashboard.css"; // using your recruiter CSS

export default function RecruiterOverview() {
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
            <h3 className="cd-stat-number">0</h3>
            <p className="cd-stat-label">Total Jobs Posted</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">⚡</div>
          <div>
            <h3 className="cd-stat-number">0</h3>
            <p className="cd-stat-label">Active Jobs</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">📩</div>
          <div>
            <h3 className="cd-stat-number">0</h3>
            <p className="cd-stat-label">Total Applications</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">🕒</div>
          <div>
            <h3 className="cd-stat-number">0</h3>
            <p className="cd-stat-label">Scheduled Jobs</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">🎓</div>
          <div>
            <h3 className="cd-stat-number">0</h3>
            <p className="cd-stat-label"> Total Internships Posted</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">🚀</div>
          <div>
            <h3 className="cd-stat-number">0</h3>
            <p className="cd-stat-label">Active Internships</p>
          </div>
        </div>

      </div>

    </div>
  );
}
