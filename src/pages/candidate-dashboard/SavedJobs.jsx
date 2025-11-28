import React from "react";
import "./CandidateDashboard.css";

export default function SavedJobs() {
  return (
    <div className="cd-saved">

      {/* Page Header */}
      <h2 className="cd-section-title">Saved Jobs</h2>
      <p className="cd-section-subtitle">
        Here are all the jobs you have saved for later. Apply when you're ready!
      </p>

      {/* Saved Jobs List */}
      <div className="cd-saved-card">
        <div className="cd-saved-info">
          <h3 className="cd-job-title">React Developer</h3>
          <p className="cd-job-company">Infosys • Chennai</p>
          <p className="cd-job-date">Saved on: 15 Nov 2025</p>
        </div>

        <button className="cd-remove-btn">Remove</button>
      </div>

      <div className="cd-saved-card">
        <div className="cd-saved-info">
          <h3 className="cd-job-title">Software Engineer</h3>
          <p className="cd-job-company">TCS • Bangalore</p>
          <p className="cd-job-date">Saved on: 10 Nov 2025</p>
        </div>

        <button className="cd-remove-btn">Remove</button>
      </div>

      <div className="cd-saved-card">
        <div className="cd-saved-info">
          <h3 className="cd-job-title">UI Designer</h3>
          <p className="cd-job-company">Zoho • Chennai</p>
          <p className="cd-job-date">Saved on: 7 Nov 2025</p>
        </div>

        <button className="cd-remove-btn">Remove</button>
      </div>

    </div>
  );
}
