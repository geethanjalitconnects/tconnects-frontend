import React from "react";
import "./CandidateDashboard.css";

export default function Profile() {
  return (
    <div className="cd-profile">

      {/* Profile Header */}
      <div className="cd-section-header">
        <h2 className="cd-profile-title">Profile Information</h2>
        <p className="cd-profile-subtitle">
          Keep your details updated so recruiters can reach out easily.
        </p>
      </div>

      {/* Profile Form */}
      <div className="cd-profile-card">
        <div className="cd-form-grid">

          {/* Full Name */}
          <div className="cd-form-group">
            <label className="cd-form-label">Full Name</label>
            <input
              type="text"
              className="cd-input"
              placeholder="Enter your full name"
              defaultValue="John Dewey"
            />
          </div>

          {/* Email */}
          <div className="cd-form-group">
            <label className="cd-form-label">Email Address</label>
            <input
              type="email"
              className="cd-input"
              placeholder="Enter your email"
              defaultValue="johndewey@example.com"
            />
          </div>

          {/* Phone */}
          <div className="cd-form-group">
            <label className="cd-form-label">Phone Number</label>
            <input
              type="text"
              className="cd-input"
              placeholder="+91 9876543210"
            />
          </div>

          {/* Location */}
          <div className="cd-form-group">
            <label className="cd-form-label">Location</label>
            <input
              type="text"
              className="cd-input"
              placeholder="City, Country"
              defaultValue="Chennai, India"
            />
          </div>

          {/* Skills */}
          <div className="cd-form-group cd-full-width">
            <label className="cd-form-label">Skills</label>
            <input
              type="text"
              className="cd-input"
              placeholder="E.g., React, Python, UI/UX, JavaScript..."
            />
          </div>

          {/* Bio */}
          <div className="cd-form-group cd-full-width">
            <label className="cd-form-label">Bio</label>
            <textarea
              className="cd-textarea"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
        </div>
      </div>

      {/* Resume Upload */}
      <div className="cd-section-header" style={{ marginTop: "24px" }}>
        <h2 className="cd-profile-title">Resume</h2>
        <p className="cd-profile-subtitle">Upload your latest resume.</p>
      </div>

      <div className="cd-profile-card cd-upload-card">
        <label className="cd-upload-box">
          <input type="file" hidden />
          <div className="cd-upload-icon">📄</div>
          <p className="cd-upload-text">Click to upload your resume (PDF/DOCX)</p>
        </label>
      </div>

      {/* Save Button */}
      <button className="cd-save-btn">Save Changes</button>
    </div>
  );
}
