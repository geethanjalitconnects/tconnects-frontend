import React from "react";
import "./CandidateDashboard.css";

export default function AppliedInternships() {
  return (
    <div className="cd-applied">

      <h2 className="cd-section-title">Applied Internships</h2>
      <p className="cd-section-subtitle">
        Track all the internships you have applied for.
      </p>

      <div className="cd-job-card">
        <div className="cd-job-info">
          <h3 className="cd-job-title">Software Intern</h3>
          <p className="cd-job-company">Microsoft • Remote</p>
          <p className="cd-job-date">Applied on: 20 Nov 2025</p>
        </div>
        <span className="cd-status cd-status-pending">Pending</span>
      </div>

      <div className="cd-job-card">
        <div className="cd-job-info">
          <h3 className="cd-job-title">Data Analyst Intern</h3>
          <p className="cd-job-company">Infosys • Bangalore</p>
          <p className="cd-job-date">Applied on: 14 Nov 2025</p>
        </div>
        <span className="cd-status cd-status-reviewed">Reviewed</span>
      </div>

    </div>
  );
}
