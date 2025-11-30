import React from "react";
import "./CandidateDashboard.css";

export default function AppliedJobs() {
  return (
    <div className="cd-applied">

      {/* Page Header */}
      <h1 className="cd-section-title">Applied Jobs</h1>
      <p className="cd-section-subtitle">
        Track all the jobs you have applied for and check their application status.
      </p>

      {/* Applied Jobs List */}
      <div className="cd-job-card">
        <div className="cd-job-info">
          <h3 className="cd-job-title">Frontend Developer Intern</h3>
          <p className="cd-job-company">Google • Bangalore</p>
          <p className="cd-job-date">Applied on: 22 Nov 2025</p>
        </div>
        <span className="cd-status cd-status-pending">Pending</span>
      </div>

      <div className="cd-job-card">
        <div className="cd-job-info">
          <h3 className="cd-job-title">Junior Backend Developer</h3>
          <p className="cd-job-company">Amazon • Hyderabad</p>
          <p className="cd-job-date">Applied on: 18 Nov 2025</p>
        </div>
        <span className="cd-status cd-status-reviewed">Reviewed</span>
      </div>

      <div className="cd-job-card">
        <div className="cd-job-info">
          <h3 className="cd-job-title">UI/UX Designer</h3>
          <p className="cd-job-company">Swiggy • Chennai</p>
          <p className="cd-job-date">Applied on: 12 Nov 2025</p>
        </div>
        <span className="cd-status cd-status-rejected">Rejected</span>
      </div>

    </div>
  );
}
