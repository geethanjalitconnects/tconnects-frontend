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

  // ============================
  // LOAD PROFILE DATA
  // ============================
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

    } catch (error) {
      console.error("Failed to load profile:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ============================
  // HANDLE INPUT CHANGE
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
        full_name: userData.full_name,
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

      setUserData((prev) => ({ ...prev, resume_url: res.data.resume_url }));
      alert("Resume uploaded successfully!");

    } catch (error) {
      console.error("Resume upload failed:", error);
      alert("Resume upload failed!");
    }

    setUploading(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="cd-profile">
      
      {/* Page Heading */}
      <div className="cd-section-header">
        <h2 className="cd-profile-title">My Profile</h2>
        <p className="cd-profile-subtitle">
          Update your personal information and resume
        </p>
      </div>

      <div className="cd-profile-card">

        {/* FORM GRID */}
        <div className="cd-form-grid">

          {/* FULL NAME */}
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
            />
          </div>

          {/* EXPERIENCE */}
          <div className="cd-form-group">
            <label className="cd-form-label">Experience</label>
            <select
              className="cd-input"
              name="experience"
              value={userData.experience}
              onChange={handleChange}
            >
              <option value="">Select Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
              <option value="4+ Years">4+ Years</option>
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
              placeholder="e.g. Python, SQL, React"
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
            />
          </div>

          {/* RESUME */}
          <div className="cd-form-group cd-full-width cd-upload-card">
            <label className="cd-form-label">Resume</label>

            {userData.resume_url ? (
              <button
                className="cd-resume-btn"
                onClick={() => window.open(userData.resume_url, "_blank")}
              >
                View Current Resume
              </button>
            ) : (
              <p>No resume uploaded yet</p>
            )}

            <div className="cd-upload-box" onClick={() => document.getElementById("resumeUpload").click()}>
              <div className="cd-upload-icon">📄</div>
              <p className="cd-upload-text">Click to upload a new resume</p>
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

        {/* SAVE BUTTON */}
        <button className="cd-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
};

export default Profile;
