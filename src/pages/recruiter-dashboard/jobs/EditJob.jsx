// EditJob.jsx — Backend Integrated (UI unchanged)
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function EditJob() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    jobType: "Full-Time",
    salary: "",
    experience: "",
    description: "",
    responsibilities: "",
    expertise: "",
    qualification: "",
    scheduleType: "now",
    scheduleDate: "",
    scheduleTime: "",
  });

  // ============================================================
  // 1. FETCH JOB DETAILS BY ID (FIXED MAPPING)
  // ============================================================
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}/`);

        setForm({
          title: res.data.title,
          category: res.data.category,
          location: res.data.location,

          jobType: res.data.employment_type,            // FIXED
          salary: res.data.salary_range,                // FIXED
          experience: res.data.experience_range,        // FIXED

          description: res.data.full_description,       // FIXED
          responsibilities: res.data.responsibilities.join(", "), // FIXED
          expertise: res.data.skills.join(", "),                    // FIXED
          qualification: res.data.eligible_degrees.join(", "),      // FIXED

          scheduleType: "now",
          scheduleDate: "",
          scheduleTime: "",
        });
      } catch (err) {
        console.error("Failed to load job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ============================================================
  // 2. HANDLE FORM CHANGES
  // ============================================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================================
  // 3. SAVE CHANGES — FIXED BACKEND MAPPING
  // ============================================================
  const handleSave = async () => {
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        category: form.category,
        location: form.location,

        employment_type: form.jobType,        // FIXED
        salary_range: form.salary,            // FIXED
        experience_range: form.experience,    // FIXED

        full_description: form.description,   // FIXED
        short_description: form.description.slice(0, 120), // Generate short

        responsibilities: form.responsibilities
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),

        skills: form.expertise
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),

        eligible_degrees: form.qualification
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };

      // ❗ FIXED URL (backend does NOT have /update/)
      await api.patch(`/api/jobs/${id}/`, payload);

      alert("Job updated successfully!");
      window.location.href = "/recruiter-dashboard/jobs/manage-jobs";
    } catch (err) {
      console.error("Job update failed:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rd-loading">Loading...</div>;

  // ============================================================
  // 4. UI — NO DESIGN CHANGES
  // ============================================================
  return (
    <div className="rd-edit-wrapper">
      <h1 className="rd-edit-title">Edit Job</h1>
      <p className="rd-edit-subtitle">
        Modify and update your existing job posting.
      </p>

      {/* JOB DETAILS CARD */}
      <div className="rd-card">
        <h2 className="rd-card-heading">Job Details</h2>

        <div className="rd-grid-3">
          <div className="rd-form-group">
            <label>Job Title</label>
            <input
              className="rd-input"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="rd-form-group">
            <label>Job Category</label>
            <input
              className="rd-input"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <div className="rd-form-group">
            <label>Location</label>
            <input
              className="rd-input"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="rd-form-group">
            <label>Job Type</label>
            <select
              className="rd-input"
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
            >
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Contract</option>
            </select>
          </div>

          <div className="rd-form-group">
            <label>Salary Range</label>
            <input
              className="rd-input"
              name="salary"
              value={form.salary}
              onChange={handleChange}
            />
          </div>

          <div className="rd-form-group">
            <label>Experience Required</label>
            <input
              className="rd-input"
              name="experience"
              value={form.experience}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="rd-form-group full">
          <label>Job Description</label>
          <textarea
            className="rd-input"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="rd-form-group full">
          <label>Job Responsibilities</label>
          <textarea
            className="rd-input"
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
          />
        </div>

        <div className="rd-form-group full">
          <label>Area of Expertise</label>
          <textarea
            className="rd-input"
            name="expertise"
            value={form.expertise}
            onChange={handleChange}
          />
        </div>

        <div className="rd-form-group full">
          <label>Education Qualification</label>
          <textarea
            className="rd-input"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* SCHEDULE (UI kept but backend doesn't use it) */}
      <div className="rd-card rd-schedule-box">
        <h2 className="rd-card-heading">Schedule Job Update</h2>

        <div className="rd-grid-3">
          <div className="rd-form-group">
            <label>Post Type</label>
            <select
              className="rd-input"
              name="scheduleType"
              value={form.scheduleType}
              onChange={handleChange}
            >
              <option value="now">Post Now</option>
              <option value="later">Schedule for Later</option>
            </select>
          </div>

          <div className="rd-form-group">
            <label>Schedule Date</label>
            <input
              type="date"
              className="rd-input"
              name="scheduleDate"
              value={form.scheduleDate}
              onChange={handleChange}
              disabled={form.scheduleType === "now"}
            />
          </div>

          <div className="rd-form-group">
            <label>Schedule Time</label>
            <input
              type="time"
              className="rd-input"
              name="scheduleTime"
              value={form.scheduleTime}
              onChange={handleChange}
              disabled={form.scheduleType === "now"}
            />
          </div>
        </div>
      </div>

      <button className="rd-save-btn" disabled={saving} onClick={handleSave}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
