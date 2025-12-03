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
    experience: "",
    skills: "",
    bio: "",
    resume_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // LOAD PROFILE
  const loadProfile = async () => {
    try {
      const res = await api.get("/api/profiles/candidate/me/");
      const data = res.data;

      setUserData({
        full_name: data.user.full_name || "",
        email: data.user.email || "",
        phone_number: data.phone_number || "",
        location: data.location || "",
        experience: data.experience_level || "",
        skills: (data.skills || []).join(", "),
        bio: data.bio || "",
        resume_url: data.resume || "",
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // SAVE PROFILE
  const handleSave = async () => {
    // Required fields validation
    if (!userData.phone_number || !userData.location || !userData.experience || !userData.skills) {
      showToast("Please fill all required fields.");
      return;
    }

    setSaving(true);
    try {
      await api.patch("/api/profiles/candidate/me/", {
        full_name: userData.full_name,
        phone_number: userData.phone_number,
        location: userData.location,
        experience_level: userData.experience,
        skills: userData.skills.split(",").map((s) => s.trim()),
        bio: userData.bio,
      });

      showToast("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed", err);
      showToast("Update failed. Try again.");
    }
    setSaving(false);
  };

  // UPLOAD RESUME
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post("/api/profiles/candidate/upload-resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUserData((prev) => ({ ...prev, resume_url: res.data.resume_url }));
      showToast("Resume uploaded successfully!");
    } catch (err) {
      console.error("Resume upload error", err);
      showToast("Resume upload failed.");
    }

    setUploading(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="cd-profile">

      {toast && <div className="cd-toast">{toast}</div>}

      <div className="cd-section-header">
        <h2 className="cd-profile-title">Profile Information</h2>
        <p className="cd-profile-subtitle">
          Keep your details updated so companies can reach you easily.
        </p>
      </div>

      <div className="cd-profile-card">

        <div className="cd-form-grid">

          <div className="cd-form-group">
            <label className="cd-form-label">Full Name</label>
            <input
              type="text"
              className="cd-input"
              name="full_name"
              value={userData.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="cd-form-group">
            <label className="cd-form-label">Email Address</label>
            <input type="text" className="cd-input" value={userData.email} disabled />
          </div>

          <div className="cd-form-group">
            <label className="cd-form-label">
              Phone Number <span className="cd-required">*</span>
            </label>
            <input
              type="text"
              className="cd-input"
              name="phone_number"
              value={userData.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cd-form-group">
            <label className="cd-form-label">
              Location <span className="cd-required">*</span>
            </label>
            <input
              type="text"
              className="cd-input"
              name="location"
              value={userData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cd-form-group">
            <label className="cd-form-label">
              Experience Level <span className="cd-required">*</span>
            </label>
            <select
              className="cd-input"
              name="experience"
              value={userData.experience}
              onChange={handleChange}
              required
            >
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="3 years">3 years</option>
              <option value="4+ years">4+ years</option>
            </select>
          </div>

          <div className="cd-form-group">
            <label className="cd-form-label">
              Skills <span className="cd-required">*</span>
            </label>
            <input
              type="text"
              className="cd-input"
              name="skills"
              value={userData.skills}
              onChange={handleChange}
              placeholder="e.g. Python, SQL, React"
              required
            />
          </div>

          <div className="cd-form-group cd-full-width">
            <label className="cd-form-label">About You</label>
            <textarea
              className="cd-textarea"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
            />
          </div>

          <div className="cd-form-group cd-full-width cd-upload-card">
            <label className="cd-form-label">Resume</label>

            {userData.resume_url ? (
              <button
                className="cd-resume-btn"
                onClick={() => window.open(userData.resume_url, "_blank")}
              >
                View Resume
              </button>
            ) : (
              <p className="cd-missing-resume">No resume uploaded</p>
            )}

            <div
              className="cd-upload-box"
              onClick={() => document.getElementById("resumeUpload").click()}
            >
              <div className="cd-upload-icon">📄</div>
              <p className="cd-upload-text">Click to upload resume</p>
              <input
                id="resumeUpload"
                type="file"
                onChange={handleResumeUpload}
                style={{ display: "none" }}
              />
            </div>

            {uploading && <p>Uploading...</p>}
          </div>
        </div>

        <button className="cd-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
};

export default Profile;
