import React, { useState } from "react";
import "./freelancer.css";

export default function FreelancerBasicInfo() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    languages: "",
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saved data:", form);
    alert("Basic information saved (UI only, no backend yet).");
  };

  return (
    <div className="fr-page">
      <form className="fr-card fr-form" onSubmit={handleSave}>
        <h2 className="fr-title">Basic Information</h2>

        {/* Full name */}
        <div className="fr-row">
          <label className="fr-label">Full name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="fr-input"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div className="fr-row">
          <label className="fr-label">Email address</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="fr-input"
            placeholder="you@example.com"
          />
        </div>

        {/* Phone + Location */}
        <div className="fr-row fr-two-col">
          <div>
            <label className="fr-label">Phone number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="fr-input"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="fr-label">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="fr-input"
              placeholder="City, Country"
            />
          </div>
        </div>

        {/* Languages */}
        <div className="fr-row">
          <label className="fr-label">Languages known (comma separated)</label>
          <input
            name="languages"
            value={form.languages}
            onChange={handleChange}
            className="fr-input"
            placeholder="English, Hindi, Spanish"
          />
        </div>

        {/* Upload Profile Picture */}
        <div className="fr-row">
          <label className="fr-label">Upload profile picture</label>
          <div className="fr-upload-row">
            <div className="fr-avatar-preview">
              {preview ? (
                <img src={preview} alt="preview" />
              ) : (
                <div className="fr-avatar-placeholder">JD</div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="fr-file-input"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="fr-actions">
          <button type="submit" className="fr-btn fr-btn-primary">
            Save
          </button>

          <button
            type="button"
            className="fr-btn"
            onClick={() => {
              setForm({
                fullName: "",
                email: "",
                phone: "",
                location: "",
                languages: "",
              });
              setPreview(null);
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
