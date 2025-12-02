// CompanyProfile.jsx — Recruiter Dashboard Integration
import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    size: "",
    location: "",
    website: "",
    about: "",
  });

  // FETCH COMPANY PROFILE
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get("/api/profiles/recruiter/company/");
        setForm({
          companyName: res.data.company_name || "",
          industry: res.data.industry || "",
          size: res.data.size || "",
          location: res.data.location || "",
          website: res.data.website || "",
          about: res.data.about || "",
        });
      } catch (err) {
        console.error("Failed to load company profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // UPDATE COMPANY PROFILE
  const handleSave = async () => {
    setSaving(true);

    try {
      await api.patch("/api/profiles/recruiter/company/", {
        company_name: form.companyName,
        industry: form.industry,
        size: form.size,
        location: form.location,
        website: form.website,
        about: form.about,
      });

      alert("Company profile updated successfully!");
    } catch (err) {
      console.error("Failed to update company profile:", err);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rd-loading">Loading...</div>;

  // UI (NO DESIGN CHANGES)
  return (
    <div className="rd-company-profile-page">
      <h2 className="rd-page-title">Company Profile</h2>
      <p className="rd-page-subtitle">
        Keep your company information updated for candidates to view.
      </p>

      <div className="rd-profile-card">
        <div className="rd-grid">

          <div className="rd-form-group">
            <label className="rd-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              className="rd-input"
              placeholder="Enter company name"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Industry Category</label>
            <input
              type="text"
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className="rd-input"
              placeholder="Finance, Banking, Technology, etc."
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Company Size</label>
            <input
              type="text"
              name="size"
              value={form.size}
              onChange={handleChange}
              className="rd-input"
              placeholder="e.g. 50–200 employees"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Company Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="rd-input"
              placeholder="City, Country"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Company Website</label>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              className="rd-input"
              placeholder="https://companysite.com"
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">About Company</label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              className="rd-textarea"
              placeholder="Write a brief description about your company..."
            ></textarea>
          </div>
        </div>

        <button
          className="rd-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Company Profile"}
        </button>
      </div>
    </div>
  );
}
