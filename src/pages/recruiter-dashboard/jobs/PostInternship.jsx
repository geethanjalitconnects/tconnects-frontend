import React from "react";
import "../RecruiterDashboard.css"; // adjust path if needed

export default function PostInternship() {
  return (
    <div className="rd-postjob-page">

      {/* ====== Title ====== */}
      <h2 className="rd-page-title">Post an Internship</h2>
      <p className="rd-page-subtitle">Fill all details to publish a new internship opportunity.</p>

      {/* ======================================================
                       INTERNSHIP DETAILS CARD
      ====================================================== */}
      <div className="rd-profile-card">

        <h3 className="rd-card-title">Internship Details</h3>

        <div className="rd-grid">

          {/* Internship Title */}
          <div className="rd-form-group">
            <label className="rd-label">Internship Title</label>
            <input
              type="text"
              className="rd-input"
              placeholder="e.g., Risk Analyst Intern"
            />
          </div>

          {/* Internship Category */}
          <div className="rd-form-group">
            <label className="rd-label">Internship Category</label>
            <input
              type="text"
              className="rd-input"
              placeholder="Risk, Finance, Operations..."
            />
          </div>

          {/* Location */}
          <div className="rd-form-group">
            <label className="rd-label">Location</label>
            <input
              type="text"
              className="rd-input"
              placeholder="Chennai, India"
            />
          </div>

          {/* Mode */}
          <div className="rd-form-group">
            <label className="rd-label">Mode</label>
            <select className="rd-input">
              <option>On-site</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>

          {/* Stipend */}
          <div className="rd-form-group">
            <label className="rd-label">Stipend</label>
            <input
              type="text"
              className="rd-input"
              placeholder="₹5,000 – ₹15,000"
            />
          </div>

          {/* Duration */}
          <div className="rd-form-group">
            <label className="rd-label">Duration</label>
            <input
              type="text"
              className="rd-input"
              placeholder="2 Months, 3 Months, 6 Months..."
            />
          </div>

          {/* Internship Description */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">Internship Description</label>
            <textarea
              className="rd-textarea"
              placeholder="Describe the internship role and expectations..."
            ></textarea>
          </div>

          {/* Responsibilities */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">Internship Responsibilities</label>
            <textarea
              className="rd-textarea"
              placeholder="List key responsibilities..."
            ></textarea>
          </div>

          {/* Area of Expertise */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">Area of Expertise</label>
            <input
              type="text"
              className="rd-input"
              placeholder="Excel, SQL, Research, Data Analysis…"
            />
          </div>

          {/* Eligibility */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">Eligibility</label>
            <input
              type="text"
              className="rd-input"
              placeholder="BBA, B.Com, B.Tech, Finance Degrees…"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
                        SCHEDULE INTERNSHIP CARD
      ====================================================== */}
      <div className="rd-schedule-card">

        <h3 className="rd-card-title">Schedule Internship</h3>

        <p className="rd-schedule-info">
          You can post immediately or schedule this internship for a later date & time.
        </p>

        <div className="rd-grid">

          {/* Post Now or Schedule */}
          <div className="rd-form-group">
            <label className="rd-label">Post Internship</label>
            <select className="rd-input">
              <option>Post Now</option>
              <option>Schedule for later</option>
            </select>
          </div>

          {/* Date */}
          <div className="rd-form-group">
            <label className="rd-label">Schedule Date</label>
            <input type="date" className="rd-input" />
          </div>

          {/* Time */}
          <div className="rd-form-group">
            <label className="rd-label">Schedule Time</label>
            <input type="time" className="rd-input" />
          </div>

        </div>
      </div>

      {/* Submit Button */}
      <button className="rd-save-btn">Post Internship</button>
    </div>
  );
}
