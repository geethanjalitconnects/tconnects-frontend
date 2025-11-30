import React from "react";
import "../RecruiterDashboard.css";  // make sure this path is correct

export default function BasicInformation() {
  return (
    <div className="rd-basic-info-page">

      {/* ======= Page Title ======= */}
      <h2 className="rd-page-title">Profile Information</h2>
      <p className="rd-page-subtitle">
        Keep your details updated so recruiters can reach out easily.
      </p>

      {/* ======= White Card Box ======= */}
      <div className="rd-profile-card">

        {/* Grid Row */}
        <div className="rd-grid">

          {/* Full Name */}
          <div className="rd-form-group">
            <label className="rd-label">Full Name</label>
            <input
              type="text"
              className="rd-input rd-disabled"
              value="John Doe"
              disabled
            />
          </div>

          {/* Email Address */}
          <div className="rd-form-group">
            <label className="rd-label">Company Email</label>
            <input
              type="email"
              className="rd-input rd-disabled"
              value="john@company.com"
              disabled
            />
          </div>

          {/* Phone Number */}
          <div className="rd-form-group">
            <label className="rd-label">Phone Number</label>
            <input
              type="text"
              className="rd-input"
              placeholder="Enter phone number"
            />
          </div>

          {/* Position */}
          <div className="rd-form-group">
            <label className="rd-label">Position / Role</label>
            <input
              type="text"
              className="rd-input"
              placeholder="Recruiter, HR Manager, Talent Acquisition…"
            />
          </div>

          {/* LinkedIn */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">LinkedIn Profile URL</label>
            <input
              type="text"
              className="rd-input"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>

        {/* Save Button */}
        <button className="rd-save-btn">Save Changes</button>
      </div>
    </div>
  );
}
