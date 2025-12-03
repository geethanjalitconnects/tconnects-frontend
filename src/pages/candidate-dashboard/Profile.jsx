// src/pages/candidate-dashboard/Profile.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";

const Profile = () => {
  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    experience: "Fresher",
    skills: "",
    bio: "",
    resume_url: "",
    resume_name: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  // ============================
  // SHOW MESSAGE BAR (SUCCESS/ERROR)
  // ============================
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // ============================
  // LOAD CANDIDATE PROFILE
  // ============================
  const loadProfile = async () => {
    try {
      const res = await api.get("/api/profiles/candidate/me/");
      const data = res.data;

      const resumeName = data.resume_url
        ? data.resume_url.split("/").pop()
        : "";

      setUserData({
        full_name: data.user.full_name || "",
        email: data.user.email || "",
        phone_number: data.phone_number || "",
        location: data.location || "",
        experience: data.experience_level || "Fresher",
        skills: (data.skills || []).join(", "),
        bio: data.bio || "",
        resume_url: data.resume_url || "",
        resume_name: resumeName,
      });

    } catch (error) {
      console.error("Failed to load profile:", error);
      showMessage("error", "Failed to load profile");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ============================
  // UPDATE INPUT STATES
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  // SAVE PROFILE
  // ============================
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/api/profiles/candidate/me/", {
        phone_number: userData.phone_number,
        location: userData.location,
        experience_level: userData.experience, // Valid value only
        skills: userData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        bio: userData.bio,
      });

      showMessage("success", "Profile updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
      showMessage("error", "Profile update failed");
    }
    setSaving(false);
  };

  // ============================
  // RESUME UPLOAD
  // ============================
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

      const fileName = res.data.resume_url
        ? res.data.resume_url.split("/").pop()
        : "";

      setUserData((prev) => ({
        ...prev,
        resume_url: res.data.resume_url,
        resume_name: fileName,
      }));

      showMessage("success", "Resume uploaded");
    } catch (error) {
      console.error("Resume upload failed:", error);
      showMessage("error", "Resume upload failed");
    }

    setUploading(false);
  };

  if (loading) return <div className="cd-loading">Loading profile...</div>;

  return (
    <div className="cd-main">

      {/* MESSAGE BAR */}
      {message.text && (
        <div
          className={`cd-message ${
            message.type === "success" ? "cd-success" : "cd-error"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Heading */}
      <h2 className="cd-title">Profile Information</h2>
      <p className="cd-subtitle">
        Keep your details updated so companies can reach you easily.
      </p>

      {/* Profile Card */}
      <div className="cd-profile-card">
        
        <div className="cd-form-grid">

          {/* FULL NAME */}
          <div className="cd-form-group">
            <label className="cd-form-label">Full Name</label>
            <input
              type="text"
              className="cd-input"
              name="full_name"
              value={userData.full_name}
              disabled
            />
          </div>

          {/* EMAIL */}
          <div className="cd-form-group">
            <label className="cd-form-label">Email Address</label>
            <input
              type="text"
              className="cd-input"
              value={userData.email}
              disabled
            />
          </div>

          {/* PHONE */}
          <div className="cd-form-group">
            <label className="cd-form-label">Phone Number</label>
            <input
              type="text"
              className="cd-input"
              name="phone_number"
              value={userData.phone_number}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          {/* LOCATION */}
          <div className="cd-form-group">
            <label className="cd-form-label">Location</label>
            <input
              type="text"
              className="cd-input"
              name="location"
              value={userData.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>

          {/* EXPERIENCE */}
          <div className="cd-form-group">
            <label className="cd-form-label">Experience Level</label>
            <select
              className="cd-input"
              name="experience"
              value={userData.experience}
              onChange={handleChange}
            >
              <option value="Fresher">Fresher</option>
              <option value="1-2 years">1–2 years</option>
              <option value="3-5 years">3–5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>

          {/* SKILLS */}
          <div className="cd-form-group">
            <label className="cd-form-label">Skills</label>
            <input
              type="text"
              className="cd-input"
              name="skills"
              value={userData.skills}
              onChange={handleChange}
              placeholder="Python, SQL, Communication..."
            />
          </div>

          {/* BIO */}
          <div className="cd-form-group cd-full-width">
            <label className="cd-form-label">About You</label>
            <textarea
              className="cd-textarea"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              placeholder="Write a short summary about yourself..."
            ></textarea>
          </div>

          {/* RESUME */}
          <div className="cd-form-group cd-full-width">
            <label className="cd-form-label">Resume</label>

            {userData.resume_url ? (
              <button
                className="cd-resume-view"
                onClick={() => window.open(userData.resume_url, "_blank")}
              >
                📄 {userData.resume_name}
              </button>
            ) : (
              <p className="cd-no-resume">No resume uploaded yet</p>
            )}

            <div
              className="cd-upload-box"
              onClick={() => document.getElementById("resumeInput").click()}
            >
              <span className="cd-upload-icon">⬆️</span>
              <p>Click to upload resume</p>
            </div>

            <input
              id="resumeInput"
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleResumeUpload}
            />

            {uploading && <p className="cd-uploading">Uploading...</p>}
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
};

export default Profile;
