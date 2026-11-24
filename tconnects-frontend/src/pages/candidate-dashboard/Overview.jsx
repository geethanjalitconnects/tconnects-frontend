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

  const CARDS = [
    { icon: "bi-briefcase", value: stats.applied_jobs, label: "Applied Jobs" },
    { icon: "bi-journal-check", value: stats.applied_internships, label: "Applied Internships" },
    { icon: "bi-bookmark-heart", value: stats.saved_jobs, label: "Saved Jobs" },
    { icon: "bi-bookmarks", value: stats.saved_internships, label: "Saved Internships" },
    { icon: "bi-mortarboard", value: stats.ongoing_courses, label: "Ongoing Courses" },
  ];

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
        {CARDS.map((c) => (
          <div className="cd-stat-card" key={c.label}>
            <div className="cd-stat-icon"><i className={`bi ${c.icon}`} /></div>
            <div>
              <h3 className="cd-stat-number">{c.value}</h3>
              <p className="cd-stat-label">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}