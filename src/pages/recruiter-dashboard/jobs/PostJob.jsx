// PostJob.jsx — Backend Integrated (UI unchanged)
import React, { useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function PostJob() {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    job_type: "Full-Time",
    salary: "",
    experience: "",
    description: "",
    responsibilities: "",
    skills: "",
    education: "",
    post_type: "Post Now",
    schedule_date: "",
    schedule_time: "",
    deadline: "",
  });

  // Handle Input Change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit Job to Backend
  const handleSubmit = async () => {
    setSaving(true);

    try {
      // 🔥 MATCHED PAYLOAD TO BACKEND
      const payload = {
        title: form.title,
        category: form.category,
        location: form.location,

        employment_type: form.job_type,          // backend field
        salary_range: form.salary,              // backend field
        experience_range: form.experience,      // backend field

        full_description: form.description,      // backend field

        // responsibilities MUST be list
        responsibilities: form.responsibilities
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),

        // skills MUST be list
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),

        // education -> eligible_degrees
        eligible_degrees: form.education
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),

        application_deadline: form.deadline || null,
      };

      // POST JOB (URL CORRECT)
      await api.post("/api/jobs/create/", payload);

      alert("Job posted successfully!");
      window.location.href = "/recruiter-dashboard/jobs/manage-jobs";
    } catch (err) {
      console.error("Job posting failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rd-postjob-page">
      <h2 className="rd-page-title">Post a Job</h2>
      <p className="rd-page-subtitle">Fill all details to publish a new job opening.</p>

      {/* ======================================================
                       JOB DETAILS CARD
      ====================================================== */}
      <div className="rd-profile-card">
        <h3 className="rd-card-title">Job Details</h3>

        <div className="rd-grid">
          <div className="rd-form-group">
            <label className="rd-label">Job Title</label>
            <input
              type="text"
              className="rd-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Risk Analyst"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Job Category</label>
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
            <label className="rd-label">Job Type</label>
            <select
              className="rd-input"
              name="job_type"
              value={form.job_type}
              onChange={handleChange}
            >
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Salary Range</label>
            <input
              type="text"
              className="rd-input"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="₹6–10 LPA"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Experience Required</label>
            <input
              type="text"
              className="rd-input"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="2–4 Years"
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Job Description</label>
            <textarea
              className="rd-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the job role and expectations..."
            ></textarea>
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Job Responsibilities</label>
            <textarea
              className="rd-textarea"
              name="responsibilities"
              value={form.responsibilities}
              onChange={handleChange}
              placeholder="List key responsibilities... (comma separated)"
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
              placeholder="SQL, Python, Risk Modeling, Excel…"
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Education Qualification</label>
            <input
              type="text"
              className="rd-input"
              name="education"
              value={form.education}
              onChange={handleChange}
              placeholder="MBA, B.Tech, B.Com or relevant degree"
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Application Deadline</label>
            <input
              type="date"
              className="rd-input"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* === SCHEDULE SECTION (UI SAME, BACKEND IGNORES THIS) === */}
      <div className="rd-schedule-card">
        <h3 className="rd-card-title">Schedule Job</h3>
        <p className="rd-schedule-info">
          You can post the job immediately or schedule it for a later date.
        </p>

        <div className="rd-grid">
          <div className="rd-form-group">
            <label className="rd-label">Post Job</label>
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
        {saving ? "Posting..." : "Post Job"}
      </button>
    </div>
  );
}
