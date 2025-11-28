import React from "react";
import "./CandidateDashboard.css"; // reuse dashboard styling

export default function Overview() {
  return (
    <div className="cd-overview">

      {/* Welcome Section */}
      <div className="cd-welcome-card">
        <h2 className="cd-welcome-title">Welcome back, John Dewey 👋</h2>
        <p className="cd-welcome-text">
          Here’s a quick summary of your activity. Explore your applications,
          saved opportunities, and keep your profile updated to get better recommendations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="cd-stats-grid">
        <div className="cd-stat-card">
          <div className="cd-stat-icon">📝</div>
          <div>
            <h3 className="cd-stat-number">4</h3>
            <p className="cd-stat-label">Applied Jobs</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">💾</div>
          <div>
            <h3 className="cd-stat-number">12</h3>
            <p className="cd-stat-label">Saved Jobs</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">📨</div>
          <div>
            <h3 className="cd-stat-number">3</h3>
            <p className="cd-stat-label">New Messages</p>
          </div>
        </div>

        <div className="cd-stat-card">
          <div className="cd-stat-icon">🎓</div>
          <div>
            <h3 className="cd-stat-number">2</h3>
            <p className="cd-stat-label">Ongoing Courses</p>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="cd-section">
        <h2 className="cd-section-title">Recent Applications</h2>

        <div className="cd-application-card">
          <div>
            <h3 className="cd-job-title">Frontend Developer Intern</h3>
            <p className="cd-job-company">Google</p>
          </div>
          <span className="cd-status cd-status-pending">Pending</span>
        </div>

        <div className="cd-application-card">
          <div>
            <h3 className="cd-job-title">Backend Developer</h3>
            <p className="cd-job-company">Amazon</p>
          </div>
          <span className="cd-status cd-status-reviewed">Reviewed</span>
        </div>

      </div>

    </div>
  );
}
