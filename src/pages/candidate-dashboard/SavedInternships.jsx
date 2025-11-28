import React from "react";
import "./CandidateDashboard.css";

export default function SavedInternships() {
  return (
    <div className="cd-saved">

      <h2 className="cd-section-title">Saved Internships</h2>
      <p className="cd-section-subtitle">
        Your saved internships are listed here.
      </p>

      <div className="cd-saved-card">
        <div className="cd-saved-info">
          <h3 className="cd-job-title">Machine Learning Intern</h3>
          <p className="cd-job-company">Wipro • Chennai</p>
          <p className="cd-job-date">Saved on: 12 Nov 2025</p>
        </div>
        <button className="cd-remove-btn">Remove</button>
      </div>

      <div className="cd-saved-card">
        <div className="cd-saved-info">
          <h3 className="cd-job-title">Cybersecurity Intern</h3>
          <p className="cd-job-company">Dell • Hyderabad</p>
          <p className="cd-job-date">Saved on: 5 Nov 2025</p>
        </div>
        <button className="cd-remove-btn">Remove</button>
      </div>

    </div>
  );
}
