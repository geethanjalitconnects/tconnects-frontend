// FINAL FIXED CANDIDATE PROFILE — FULL UI + BACKEND FIXES

import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    experience: "fresher",
    skills: "",
    bio: "",
    resume_url: "",
    resume_name: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ======================
  // LOAD PROFILE
  // ======================
  const loadProfile = async () => {
    try {
      const res = await api.get("/api/profiles/candidate/me/");
      const data = res.data;

      const filePath = data.resume ? data.resume : "";
      const fileName = filePath ? filePath.split("/").pop() : "";

      setUserData({
        full_name: data.user.full_name,
        email: data.user.email,
        phone_number: data.phone_number || "",
        location: data.location || "",
        experience: data.experience_level || "fresher",
        skills: (data.skills || []).join(", "),
        bio: data.bio || "",
        resume_url: filePath,
        resume_name: fileName,
      });
    } catch (err) {
      showMessage("error", "Unable to load profile");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setUserData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // ======================
  // SAVE PROFILE
  // ======================

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/api/profiles/candidate/me/", {
        phone_number: userData.phone_number,
        location: userData.location,
        experience_level: userData.experience, // backend safe value
        skills: userData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        bio: userData.bio,
      });

      showMessage("success", "Profile updated successfully");
    } catch (err) {
      showMessage("error", "Failed to update profile");
    }
    setSaving(false);
  };

  // ======================
  // RESUME UPLOAD
  // ======================

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

      const filePath = res.data.resume_url;
      const fileName = filePath.split("/").pop();

      setUserData((prev) => ({
        ...prev,
        resume_url: filePath,
        resume_name: fileName,
      }));

      showMessage("success", "Resume uploaded successfully");
    } catch (err) {
      showMessage("error", "Resume upload failed");
    }
    setUploading(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="cd-main">

      {message.text && (
        <div className={`cd-message ${message.type === "success" ? "cd-success" : "cd-error"}`}>
          {message.text}
        </div>
      )}

      <h2 className="cd-title">Profile Information</h2>
      <p className="cd-subtitle">
        Keep your details updated so companies can reach you easily.
      </p>

      <div className="cd-profile-card">

        <div className="cd-form-grid">

          <div className="cd-form-group">
            <label>Full Name</label>
            <input className="cd-input" value={userData.full_name} disabled />
          </div>

          <div className="cd-form-group">
            <label>Email Address</label>
            <input className="cd-input" value={userData.email} disabled />
          </div>

          <div className="cd-form-group">
            <label>Phone Number</label>
            <input
              className="cd-input"
              name="phone_number"
              value={userData.phone_number}
              onChange={handleChange}
            />
          </div>

          <div className="cd-form-group">
            <label>Location</label>
            <input
              className="cd-input"
              name="location"
              value={userData.location}
              onChange={handleChange}
            />
          </div>

          <div className="cd-form-group">
            <label>Experience Level</label>
            <select
              className="cd-input"
              name="experience"
              value={userData.experience}
              onChange={handleChange}
            >
              <option value="fresher">Fresher</option>
              <option value="1_year">1 year</option>
              <option value="2_years">2 years</option>
              <option value="3_years">3 years</option>
              <option value="4_plus">4+ years</option>
            </select>
          </div>

          <div className="cd-form-group">
            <label>Skills</label>
            <input
              className="cd-input"
              name="skills"
              value={userData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="cd-form-group cd-full-width">
            <label>About You</label>
            <textarea
              className="cd-textarea"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="cd-form-group cd-full-width">
            <label>Resume</label>

            {userData.resume_url ? (
              <button
                className="cd-resume-view"
                onClick={() => window.open(userData.resume_url)}
              >
                📄 {userData.resume_name}
              </button>
            ) : (
              <p>No resume uploaded yet</p>
            )}

            <div className="cd-upload-box" onClick={() => document.getElementById("resumeFile").click()}>
              <span className="cd-upload-icon">⬆️</span>
              <p>Click to upload resume</p>
            </div>

            <input
              id="resumeFile"
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleResumeUpload}
            />

            {uploading && <p>Uploading...</p>}
          </div>

        </div>

        <button className="cd-save-btn" disabled={saving} onClick={handleSave}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
};

export default Profile;
