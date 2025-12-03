// src/pages/candidate-dashboard/Profile.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./Profile.css";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    experience: "",
    skills: "",
    bio: "",
    resume_url: "",
    resume_name: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/api/profiles/candidate/me/");

        const resumeFileName = res.data.resume
          ? res.data.resume.split("/").pop()
          : "";

        setUserData({
          full_name: res.data.user.full_name,
          email: res.data.user.email,
          phone_number: res.data.phone_number || "",
          location: res.data.location || "",
          experience: res.data.experience_level || "",
          skills: res.data.skills ? res.data.skills.join(", ") : "",
          bio: res.data.bio || "",
          resume_url: res.data.resume || "",
          resume_name: resumeFileName,
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/api/profiles/candidate/me/", {
        phone_number: userData.phone_number,
        location: userData.location,
        experience_level: userData.experience,
        skills: userData.skills.split(",").map((s) => s.trim()),
        bio: userData.bio,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed!");
    }
    setSaving(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post(
        "/api/profiles/candidate/upload-resume/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const uploadedName = res.data.resume.split("/").pop();

      setUserData((prev) => ({
        ...prev,
        resume_url: res.data.resume,
        resume_name: uploadedName,
      }));

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error("Resume upload failed:", error);
      alert("Resume upload failed!");
    }

    setUploading(false);
  };

  if (loading) return <div className="cd-loading">Loading profile...</div>;

  return (
    <div className="cd-profile-page">
      <h2 className="cd-title">My Profile</h2>
      <p className="cd-subtitle">Manage your candidate profile information.</p>

      <div className="cd-card">
        <h3 className="cd-card-title">Personal Information</h3>

        <div className="cd-grid">
          
          {/* FULL NAME — DISPLAY ONLY */}
          <div className="cd-form-group">
            <label className="cd-label">Full Name</label>
            <input
              type="text"
              className="cd-input"
              value={userData.full_name}
              disabled
            />
          </div>

          {/* EMAIL — DISPLAY ONLY */}
          <div className="cd-form-group">
            <label className="cd-label">Email</label>
            <input
              type="text"
              className="cd-input"
              value={userData.email}
              disabled
            />
          </div>

          {/* PHONE */}
          <div className="cd-form-group">
            <label className="cd-label">Phone Number</label>
            <input
              type="text"
              className="cd-input"
              name="phone_number"
              value={userData.phone_number}
              onChange={handleChange}
            />
          </div>

          {/* LOCATION */}
          <div className="cd-form-group">
            <label className="cd-label">Location</label>
            <input
              type="text"
              className="cd-input"
              name="location"
              value={userData.location}
              onChange={handleChange}
            />
          </div>

          {/* EXPERIENCE */}
          <div className="cd-form-group">
            <label className="cd-label">Experience Level</label>
            <select
              className="cd-input"
              name="experience"
              value={userData.experience}
              onChange={handleChange}
            >
              <option value="">Select experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1-2 years">1–2 years</option>
              <option value="3-5 years">3–5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>

          {/* SKILLS */}
          <div className="cd-form-group cd-full">
            <label className="cd-label">Skills (Comma-separated)</label>
            <input
              type="text"
              className="cd-input"
              name="skills"
              value={userData.skills}
              onChange={handleChange}
            />
          </div>

          {/* BIO */}
          <div className="cd-form-group cd-full">
            <label className="cd-label">Bio</label>
            <textarea
              className="cd-input"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* RESUME SECTION */}
          <div className="cd-form-group cd-full">
            <label className="cd-label">Resume</label>

            <div className="cd-resume-box">
              {userData.resume_name ? (
                <p className="cd-resume-name">{userData.resume_name}</p>
              ) : (
                <p className="cd-resume-placeholder">No resume uploaded yet</p>
              )}

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="cd-file-input"
                onChange={handleResumeUpload}
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          className="cd-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
