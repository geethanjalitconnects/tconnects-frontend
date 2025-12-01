// BasicInformation.jsx — Recruiter Dashboard
import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function BasicInformation() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    position: "",
    linkedin_url: "",
  });

  // ============================================================
  // 1. LOAD RECRUITER PROFILE FROM BACKEND
  // ============================================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profiles/recruiter/me/");

        setFormData({
          full_name: res.data.full_name || "",
          email: res.data.email || "",
          phone_number: res.data.phone_number || "",
          position: res.data.position || "",
          linkedin_url: res.data.linkedin_url || "",
        });
      } catch (err) {
        console.error("Failed to load recruiter profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ============================================================
  // 2. HANDLE FORM INPUT
  // ============================================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================================
  // 3. SAVE (PATCH PROFILE UPDATE)
  // ============================================================
  const handleSave = async () => {
    setSaving(true);

    try {
      await api.patch("/api/profiles/recruiter/update/", {
        phone_number: formData.phone_number,
        position: formData.position,
        linkedin_url: formData.linkedin_url,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update recruiter profile:", err);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rd-loading">Loading...</div>;

  // ============================================================
  // UI (EXACT SAME DESIGN — NO CHANGES)
  // ============================================================
  return (
    <div className="rd-basic-info-page">

      <h2 className="rd-page-title">Profile Information</h2>
      <p className="rd-page-subtitle">
        Keep your details updated so companies can reach you easily.
      </p>

      <div className="rd-profile-card">

        <div className="rd-grid">

          {/* FULL NAME (READ ONLY) */}
          <div className="rd-form-group">
            <label className="rd-label">Full Name</label>
            <input
              type="text"
              className="rd-input rd-disabled"
              value={formData.full_name}
              disabled
            />
          </div>

          {/* EMAIL (READ ONLY) */}
          <div className="rd-form-group">
            <label className="rd-label">Company Email</label>
            <input
              type="email"
              className="rd-input rd-disabled"
              value={formData.email}
              disabled
            />
          </div>

          {/* PHONE NUMBER */}
          <div className="rd-form-group">
            <label className="rd-label">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              className="rd-input"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          {/* POSITION */}
          <div className="rd-form-group">
            <label className="rd-label">Position / Role</label>
            <input
              type="text"
              name="position"
              className="rd-input"
              value={formData.position}
              onChange={handleChange}
              placeholder="Recruiter, HR Manager, Talent Acquisition…"
            />
          </div>

          {/* LINKEDIN URL */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">LinkedIn Profile URL</label>
            <input
              type="text"
              name="linkedin_url"
              className="rd-input"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          className="rd-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
