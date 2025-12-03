// EditJob.jsx — FINAL FIXED VERSION (UI UNCHANGED)
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function EditJob() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    employment_type: "",
    salary_range: "",
    experience_range: "",
    full_description: "",
    responsibilities: "",
    skills: "",
    eligible_degrees: "",
    application_deadline: "",
  });

  // Load Job Data
  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}/`);
        setJob(res.data);

        setForm({
          title: res.data.title || "",
          category: res.data.category || "",
          location: res.data.location || "",
          employment_type: res.data.employment_type || "",
          salary_range: res.data.salary_range || "",
          experience_range: res.data.experience_range || "",
          full_description: res.data.full_description || "",
          responsibilities: res.data.responsibilities?.join(", ") || "",
          skills: res.data.skills?.join(", ") || "",
          eligible_degrees: res.data.eligible_degrees || "",
          application_deadline: res.data.application_deadline || "",
        });
      } catch (err) {
        console.error("Failed to load job:", err);
      }
    };

    loadJob();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Submit Edited Job
  const handleSubmit = async () => {
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        title: form.title,
        category: form.category,
        location: form.location,
        employment_type: form.employment_type,
        salary_range: form.salary_range,
        experience_range: form.experience_range,
        full_description: form.full_description,
        responsibilities: form.responsibilities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        eligible_degrees: form.eligible_degrees,
        application_deadline: form.application_deadline || null,
      };

      // ⭐ FIXED: Correct backend update URL
      await api.patch(`/api/jobs/${id}/update/`, payload);

      setMessageType("success");
      setMessage("Job updated successfully!");

      setTimeout(() => {
        window.location.href = "/recruiter-dashboard/jobs/manage-jobs";
      }, 1200);
    } catch (err) {
      console.error("Update failed:", err);
      setMessageType("error");
      setMessage("Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (!job) return <div className="rd-loading">Loading job...</div>;

  return (
    <div className="rd-postjob-page">
      {message && (
        <div className={`rd-message-box ${messageType === "success" ? "rd-success" : "rd-error"}`}>
          {message}
        </div>
      )}

      <h2 className="rd-page-title">Edit Job</h2>
      <p className="rd-page-subtitle">Modify job details and save changes.</p>

      <div className="rd-profile-card">
        <h3 className="rd-card-title">Job Details</h3>
        <div className="rd-grid">

          <div className="rd-form-group">
            <label className="rd-label">Job Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="rd-input"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="rd-input"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="rd-input"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Employment Type</label>
            <select
              name="employment_type"
              value={form.employment_type}
              onChange={handleChange}
              className="rd-input"
            >
              <option value="">Select</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Temporary">Temporary</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Salary Range</label>
            <input
              name="salary_range"
              value={form.salary_range}
              onChange={handleChange}
              className="rd-input"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Experience Range</label>
            <input
              name="experience_range"
              value={form.experience_range}
              onChange={handleChange}
              className="rd-input"
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Full Description</label>
            <textarea
              name="full_description"
              value={form.full_description}
              onChange={handleChange}
              className="rd-textarea"
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Responsibilities (comma separated)</label>
            <textarea
              name="responsibilities"
              value={form.responsibilities}
              onChange={handleChange}
              className="rd-textarea"
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Skills Required (comma separated)</label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="rd-input"
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Eligible Degrees</label>
            <input
              name="eligible_degrees"
              value={form.eligible_degrees}
              onChange={handleChange}
              className="rd-input"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Application Deadline</label>
            <input
              name="application_deadline"
              type="date"
              value={form.application_deadline}
              onChange={handleChange}
              className="rd-input"
            />
          </div>

        </div>
      </div>

      <button className="rd-save-btn" disabled={saving} onClick={handleSubmit}>
        {saving ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
}
