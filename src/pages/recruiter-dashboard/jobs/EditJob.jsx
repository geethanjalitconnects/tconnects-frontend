import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../recruiter-dashboard/RecruiterDashboard.css";

export default function EditJob() {
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    jobType: "",
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

  useEffect(() => {
    const job = {
      title: "Senior Risk Analyst",
      category: "Risk Management",
      location: "Hyderabad, India",
      jobType: "Full-Time",
      salary: "₹12–16 LPA",
      experience: "4–6 Years",
      description: "Analyze financial risks and support investigation teams.",
      responsibilities:
        "• Perform financial analysis\n• Prepare weekly dashboards\n• Monitor KPIs",
      expertise: "SQL, Excel, Python, Tableau",
      qualification: "MBA, B.Tech, BBA, Finance Degrees",
    };
    setForm(job);
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="rd-edit-wrapper">

      {/* Page Title */}
      <h1 className="rd-edit-title">Edit Job</h1>
      <p className="rd-edit-subtitle">
        Modify and update your existing job posting.
      </p>

      {/* ============ JOB DETAILS CARD ============ */}
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
              <option>Contract</option>
              <option>Internship</option>
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
          ></textarea>
        </div>

        <div className="rd-form-group full">
          <label>Job Responsibilities</label>
          <textarea
            className="rd-input"
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="rd-form-group full">
          <label>Area of Expertise</label>
          <textarea
            className="rd-input"
            name="expertise"
            value={form.expertise}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="rd-form-group full">
          <label>Education Qualification</label>
          <textarea
            className="rd-input"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      {/* ============ SCHEDULE JOB CARD ============ */}
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

      <button className="rd-save-btn">Save Changes</button>
    </div>
  );
}
