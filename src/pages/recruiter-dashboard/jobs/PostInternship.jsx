// PostInternship.jsx — Backend Integrated
import React, { useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function PostInternship() {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    mode: "On-site",
    stipend: "",
    duration: "",
    description: "",
    responsibilities: "",
    skills: "",
    eligibility: "",
    post_type: "Post Now",
    schedule_date: "",
    schedule_time: "",
  });

  // Handle Input Change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit Internship to Backend
  const handleSubmit = async () => {
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        category: form.category,
        location: form.location,
        mode: form.mode,
        stipend: form.stipend,
        duration: form.duration,
        description: form.description,
        responsibilities: form.responsibilities,
        skills: form.skills.split(",").map((s) => s.trim()),
        eligibility: form.eligibility,
        post_type: form.post_type,
        schedule_date:
          form.post_type === "Schedule for later" ? form.schedule_date : null,
        schedule_time:
          form.post_type === "Schedule for later" ? form.schedule_time : null,
      };

      await api.post("/api/internships/create/", payload);

      alert("Internship posted successfully!");
      window.location.href =
        "/recruiter-dashboard/jobs/manage-internships"; // your UI route
    } catch (err) {
      console.error("Internship posting failed:", err);
      alert("Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rd-postjob-page">

      <h2 className="rd-page-title">Post an Internship</h2>
      <p className="rd-page-subtitle">
        Fill all details to publish a new internship opportunity.
      </p>

      {/* Internship Details */}
      <div className="rd-profile-card">
        <h3 className="rd-card-title">Internship Details</h3>

        <div className="rd-grid">

          <div className="rd-form-group">
            <label className="rd-label">Internship Title</label>
            <input
              type="text"
              className="rd-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Risk Analyst Intern"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Internship Category</label>
            <input
              type="text"
              className="rd-input"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Risk, Finance, Operations..."
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Location</label>
            <input
              type="text"
              className="rd-input"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Chennai, India"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Mode</label>
            <select
              className="rd-input"
              name="mode"
              value={form.mode}
              onChange={handleChange}
            >
              <option>On-site</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Stipend</label>
            <input
              type="text"
              className="rd-input"
              name="stipend"
              value={form.stipend}
              onChange={handleChange}
              placeholder="₹5,000 – ₹15,000"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Duration</label>
            <input
              type="text"
              className="rd-input"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="2 Months, 3 Months, 6 Months..."
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Internship Description</label>
            <textarea
              className="rd-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the internship role and expectations..."
            ></textarea>
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Internship Responsibilities</label>
            <textarea
              className="rd-textarea"
              name="responsibilities"
              value={form.responsibilities}
              onChange={handleChange}
              placeholder="List key responsibilities..."
            ></textarea>
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Area of Expertise</label>
            <input
              type="text"
              className="rd-input"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Excel, SQL, Research, Data Analysis…"
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Eligibility</label>
            <input
              type="text"
              className="rd-input"
              name="eligibility"
              value={form.eligibility}
              onChange={handleChange}
              placeholder="BBA, B.Com, B.Tech, Finance Degrees…"
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="rd-schedule-card">
        <h3 className="rd-card-title">Schedule Internship</h3>

        <p className="rd-schedule-info">
          You can post immediately or schedule this internship for a later date & time.
        </p>

        <div className="rd-grid">
          <div className="rd-form-group">
            <label className="rd-label">Post Internship</label>
            <select
              className="rd-input"
              name="post_type"
              value={form.post_type}
              onChange={handleChange}
            >
              <option>Post Now</option>
              <option>Schedule for later</option>
            </select>
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Schedule Date</label>
            <input
              type="date"
              className="rd-input"
              name="schedule_date"
              value={form.schedule_date}
              onChange={handleChange}
              disabled={form.post_type === "Post Now"}
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Schedule Time</label>
            <input
              type="time"
              className="rd-input"
              name="schedule_time"
              value={form.schedule_time}
              onChange={handleChange}
              disabled={form.post_type === "Post Now"}
            />
          </div>
        </div>
      </div>

      <button className="rd-save-btn" disabled={saving} onClick={handleSubmit}>
        {saving ? "Posting..." : "Post Internship"}
      </button>
    </div>
  );
}
