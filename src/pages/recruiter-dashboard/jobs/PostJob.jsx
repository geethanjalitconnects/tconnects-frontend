import React, { useState } from "react";
import axios from "../../utils/axiosInstance";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    job_type: "full_time", // FIXED: backend expects this ID
    salary: "",
    experience: "",
    description: "",
    responsibilities: "",
    skills: "",
    education: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        category: form.category,
        location: form.location,

        // ⭐ BACKEND EXPECTS THESE EXACT FIELDS
        employment_type: form.job_type,
        salary_range: form.salary,
        experience_range: form.experience,

        full_description: form.description,

        // ⭐ Convert comma texts → lists
        responsibilities: form.responsibilities
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p !== ""),

        skills: form.skills
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p !== ""),

        eligible_degrees: form.education
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p !== ""),

        application_deadline: form.deadline || null,
      };

      await axios.post("/api/jobs/create/", payload);

      alert("Job posted successfully!");
      window.location.href = "/recruiter-dashboard/jobs/manage-jobs";
    } catch (error) {
      console.error("Job posting failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rd-postjob-page">
      <h2 className="rd-page-title">Post a Job</h2>
      <p className="rd-page-subtitle">Fill all details to publish a new job opening.</p>

      <form className="rd-postjob-form" onSubmit={handleSubmit}>
        
        <label className="rd-label">Job Title</label>
        <input
          type="text"
          name="title"
          className="rd-input"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label className="rd-label">Category</label>
        <input
          type="text"
          name="category"
          className="rd-input"
          value={form.category}
          onChange={handleChange}
          required
        />

        <label className="rd-label">Location</label>
        <input
          type="text"
          name="location"
          className="rd-input"
          value={form.location}
          onChange={handleChange}
          required
        />

        <label className="rd-label">Employment Type</label>
        {/* ⭐ UI stays the same but backend receives correct IDs */}
        <select
          name="job_type"
          className="rd-input"
          value={form.job_type}
          onChange={handleChange}
          required
        >
          <option value="full_time">Full-Time</option>
          <option value="part_time">Part-Time</option>
          <option value="contract">Contract</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <label className="rd-label">Salary Range</label>
        <input
          type="text"
          name="salary"
          className="rd-input"
          value={form.salary}
          onChange={handleChange}
        />

        <label className="rd-label">Experience Required</label>
        <input
          type="text"
          name="experience"
          className="rd-input"
          value={form.experience}
          onChange={handleChange}
        />

        <label className="rd-label">Job Description</label>
        <textarea
          name="description"
          className="rd-textarea"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label className="rd-label">Responsibilities (comma separated)</label>
        <textarea
          name="responsibilities"
          className="rd-textarea"
          value={form.responsibilities}
          onChange={handleChange}
        />

        <label className="rd-label">Skills Required (comma separated)</label>
        <textarea
          name="skills"
          className="rd-textarea"
          value={form.skills}
          onChange={handleChange}
        />

        <label className="rd-label">Eligible Degrees (comma separated)</label>
        <textarea
          name="education"
          className="rd-textarea"
          value={form.education}
          onChange={handleChange}
        />

        <label className="rd-label">Application Deadline</label>
        <input
          type="date"
          name="deadline"
          className="rd-input"
          value={form.deadline}
          onChange={handleChange}
        />

        <button className="rd-submit-btn" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
