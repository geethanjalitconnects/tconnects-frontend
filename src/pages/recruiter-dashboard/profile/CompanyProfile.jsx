import React, { useState } from "react";
import "../RecruiterDashboard.css"; // correct relative path

export default function CompanyProfile() {
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    size: "",
    location: "",
    website: "",
    about: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="rd-company-profile-page">

      {/* ====== Page Title ====== */}
      <h2 className="rd-page-title">Company Profile</h2>
      <p className="rd-page-subtitle">
        Keep your company information updated for candidates to view.
      </p>

      {/* ====== White Card ====== */}
      <div className="rd-profile-card">

        <div className="rd-grid">

          {/* Company Name */}
          <div className="rd-form-group">
            <label className="rd-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="rd-input"
            />
          </div>

          {/* Industry */}
          <div className="rd-form-group">
            <label className="rd-label">Industry Category</label>
            <input
              type="text"
              name="industry"
              value={form.industry}
              onChange={handleChange}
              placeholder="Finance, Banking, Technology, etc."
              className="rd-input"
            />
          </div>

          {/* Company Size */}
          <div className="rd-form-group">
            <label className="rd-label">Company Size</label>
            <input
              type="text"
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="e.g. 50–200 employees"
              className="rd-input"
            />
          </div>

          {/* Location */}
          <div className="rd-form-group">
            <label className="rd-label">Company Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="rd-input"
            />
          </div>

          {/* Website */}
          <div className="rd-form-group">
            <label className="rd-label">Company Website</label>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://companysite.com"
              className="rd-input"
            />
          </div>

          {/* About Company - Full width */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">About Company</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              placeholder="Write a brief description about your company..."
              className="rd-textarea"
            ></textarea>
          </div>

        </div>

        {/* Save Button */}
        <button className="rd-save-btn">Save Company Profile</button>
      </div>
    </div>
  );
}
