// BasicInformation.jsx — Recruiter Dashboard (Fixed)
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
  // 1. LOAD USER DATA + RECRUITER PROFILE
  // ============================================================
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1️⃣ USER INFO (name + email)
        const userRes = await api.get("/api/auth/me/");
        const user = userRes.data;

        // 2️⃣ RECRUITER BASIC PROFILE (backend fields)
        const profileRes = await api.get("/api/profiles/recruiter/basic/");

        setFormData({
          full_name: user.full_name || "",
          email: user.email || "",
          phone_number: profileRes.data.phone_number || "",
          position: profileRes.data.position_in_company || "",
          linkedin_url: profileRes.data.linkedin_profile || "",
        });

      } catch (err) {
        console.error("Failed to load recruiter profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ============================================================
  // 2. HANDLE INPUT CHANGE
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
      await api.patch("/api/profiles/recruiter/basic/", {
        phone_number: formData.phone_number,
        position_in_company: formData.position,
        linkedin_profile: formData.linkedin_url,
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
  // 4. UI (STRUCTURE SAME)
  // ============================================================
  return (
    <div className="rd-basic-info-page">

      <h2 className="rd-page-title">Profile Information</h2>
      <p className="rd-page-subtitle">
        Keep your details updated so companies can reach you easily.
      </p>

      <div className="rd-profile-card">

        <div className="rd-grid">

          {/* FULL NAME (NON EDITABLE) */}
          <div className="rd-form-group">
            <label className="rd-label">Full Name</label>
            <input
              type="text"
              className="rd-input rd-disabled"
              value={formData.full_name}
              disabled
            />
          </div>

          {/* EMAIL (NON EDITABLE) */}
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
