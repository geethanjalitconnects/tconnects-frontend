import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../recruiter-dashboard/RecruiterDashboard.css";

export default function EditInternship() {
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    stipend: "",
    duration: "",
    mode: "",
    description: "",
    responsibilities: "",
    eligibility: "",
    scheduleType: "now",
    scheduleDate: "",
    scheduleTime: "",
  });

  useEffect(() => {
    const internship = {
      title: "Risk Analytics Intern",
      category: "Risk Management",
      location: "Mumbai, India",
      stipend: "₹10,000",
      duration: "2 Months",
      mode: "Hybrid",
      description: "Assist with risk modeling, data cleaning and reporting.",
      responsibilities:
        "• Assist risk analysts\n• Prepare dashboards\n• Analyze transactions",
      eligibility: "B.Com, BBA, Finance, Economics, Data Science Students",
    };
    setForm(internship);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="rd-edit-wrapper">

      <h1 className="rd-edit-title">Edit Internship</h1>
      <p className="rd-edit-subtitle">Modify internship posting details.</p>

      {/* ======================= INTERNSHIP DETAILS ======================= */}
      <div className="rd-card">
        <h2 className="rd-card-heading">Internship Details</h2>

        <div className="rd-grid-3">

          <div className="rd-form-group">
            <label>Internship Title</label>
            <input
              className="rd-input"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="rd-form-group">
            <label>Category</label>
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
            <label>Stipend</label>
            <input
              className="rd-input"
              name="stipend"
              value={form.stipend}
              onChange={handleChange}
            />
          </div>

          <div className="rd-form-group">
            <label>Duration</label>
            <input
              className="rd-input"
              name="duration"
              value={form.duration}
              onChange={handleChange}
            />
          </div>

          <div className="rd-form-group">
            <label>Mode</label>
            <select
              className="rd-input"
              name="mode"
              value={form.mode}
              onChange={handleChange}
            >
              <option>Onsite</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>

        </div>

        <div className="rd-form-group full">
          <label>Description</label>
          <textarea
            className="rd-input"
            name="description"
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="rd-form-group full">
          <label>Responsibilities</label>
          <textarea
            className="rd-input"
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="rd-form-group full">
          <label>Eligibility</label>
          <textarea
            className="rd-input"
            name="eligibility"
            value={form.eligibility}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      {/* ======================= SCHEDULE SECTION ======================= */}
      <div className="rd-card rd-schedule-box">
        <h2 className="rd-card-heading">Schedule Internship Update</h2>

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

      <button className="rd-save-btn">Save Changes</button>
    </div>
  );
}
