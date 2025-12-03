// src/pages/candidate-dashboard/Profile.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";  // keep same CSS

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
    <div className="cd-main">

      {/* PAGE HEADER */}
      <h2 className="cd-title">Profile Information</h2>
      <p className="cd-subtitle">Keep your details updated so companies can reach you easily.</p>

      {/* PROFILE CARD */}
      <div className="cd-profile-card">
        <div className="cd-form-grid">

          {/* FULL NAME (Disabled) */}
          <div className="cd-form-group">
            <label className="cd-form-label">Full Name</label>
            <input
              type="text"
              className="cd-input"
              value={userData.full_name}
              disabled
            />
          </div>

          {/* EMAIL (Disabled) */}
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
              <option value="">Select</option>
              <option value="Fresher">Fresher</option>
              <option value="1-2 years">1–2 years</option>
              <option value="3-5 years">3–5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>

          {/* SKILLS */}
          <div className="cd-form-group cd-full-width">
            <label className="cd-form-label">Skills</label>
            <input
              type="text"
              className="cd-input"
              name="skills"
              value={userData.skills}
              onChange={handleChange}
              placeholder="Java, Python, Design..."
            />
          </div>

          {/* BIO */}
          <div className="cd-form-group cd-full-width">
            <label className="cd-form-label">Bio</label>
            <textarea
              className="cd-textarea"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              placeholder="Write something about yourself..."
            ></textarea>
          </div>

          {/* RESUME */}
          <div className="cd-form-group cd-full-width">
            <label className="cd-form-label">Resume</label>

            <div className="cd-upload-box">
              <p className="cd-upload-text">
                {userData.resume_name
                  ? userData.resume_name
                  : "No resume uploaded"}
              </p>

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
        <button className="cd-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
