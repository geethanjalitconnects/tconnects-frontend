// Profile.jsx (Candidate Dashboard)
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";

export default function Profile() {
  const [loading, setLoading] = useState(true);

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

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ============================================================
  // 1. FETCH PROFILE FROM BACKEND
  // ============================================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profiles/me/");

        setUserData({
          full_name: res.data.full_name || "",
          email: res.data.email || "",
          phone_number: res.data.phone_number || "",
          location: res.data.location || "",
          experience: res.data.experience || "",
          skills: res.data.skills?.join(", ") || "",
          bio: res.data.bio || "",
          resume_url: res.data.resume_url || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ============================================================
  // 2. HANDLE INPUT CHANGES
  // ============================================================
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================================
  // 3. UPDATE PROFILE (PATCH)
  // ============================================================
  const handleSave = async () => {
    setSaving(true);

    try {
      await api.patch("/api/profiles/update/", {
        full_name: userData.full_name,
        phone_number: userData.phone_number,
        location: userData.location,
        experience: userData.experience,
        skills: userData.skills.split(",").map((s) => s.trim()),
        bio: userData.bio,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // 4. UPLOAD RESUME
  // ============================================================
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post("/api/profiles/upload-resume/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUserData({
        ...userData,
        resume_url: res.data.resume_url,
      });

      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error("Resume upload failed:", err);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="cd-loading">Loading...</div>;

  // ============================================================
  // UI (NO DESIGN CHANGES)
  // ============================================================
  return (
    <div className="cd-profile">
      <h2 className="cd-section-title">My Profile</h2>

      <div className="cd-profile-form">

        {/* FULL NAME */}
        <div className="cd-input-group">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={userData.full_name}
            onChange={handleChange}
          />
        </div>

        {/* EMAIL (READ ONLY) */}
        <div className="cd-input-group">
          <label>Email Address</label>
          <input type="text" value={userData.email} disabled />
          <small className="cd-readonly-text">Email cannot be changed</small>
        </div>

        {/* PHONE NUMBER */}
        <div className="cd-input-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={userData.phone_number}
            onChange={handleChange}
          />
        </div>

        {/* LOCATION */}
        <div className="cd-input-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={userData.location}
            onChange={handleChange}
          />
        </div>

        {/* EXPERIENCE */}
        <div className="cd-input-group">
          <label>Experience</label>
          <select
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
        <div className="cd-input-group">
          <label>Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={userData.skills}
            onChange={handleChange}
            placeholder="e.g. Python, SQL, Risk Analysis"
          />
        </div>

        {/* BIO */}
        <div className="cd-input-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* RESUME UPLOAD */}
        <div className="cd-input-group">
          <label>Resume</label>

          {userData.resume_url ? (
            <button
              className="cd-resume-btn"
              onClick={() => window.open(userData.resume_url, "_blank")}
            >
              View Resume
            </button>
          ) : (
            <p>No resume uploaded</p>
          )}

          <input type="file" onChange={handleResumeUpload} />

          {uploading && <p className="cd-uploading">Uploading...</p>}
        </div>

        {/* SAVE BUTTON */}
        <button className="cd-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
