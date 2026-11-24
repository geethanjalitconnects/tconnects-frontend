import React, { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../config/api";
import "../RecruiterDashboard.css";
import { toTitleCase, cleanText, cleanLine, toList, formatByRule } from "../utils/formatText";

export default function PostJob() {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    job_type: "full_time",
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Clean up pasted / typed content as soon as the recruiter leaves a field
  const RULES = {
    title: "title",
    location: "title",
    salary: "line",
    experience: "line",
    description: "text",
    responsibilities: "list",
    skills: "titlelist",
    education: "titlelist",
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const rule = RULES[name];
    if (rule) setForm((prev) => ({ ...prev, [name]: formatByRule(rule, value) }));
  };

  const handleSubmit = async () => {
    // ✅ Validate scheduling fields before submission
    if (form.post_type === "Schedule for later") {
      if (!form.schedule_date || !form.schedule_time) {
        toast.error("Please select both a schedule date and time.");
        return;
      }

      const scheduledDateTime = new Date(`${form.schedule_date}T${form.schedule_time}:00`);
      if (scheduledDateTime <= new Date()) {
        toast.error("Scheduled time must be in the future.");
        return;
      }
    }

    setSaving(true);

    try {
      // ✅ Build scheduled_at ISO string only when scheduling
      let scheduled_at = null;
      if (form.post_type === "Schedule for later" && form.schedule_date && form.schedule_time) {
        scheduled_at = new Date(`${form.schedule_date}T${form.schedule_time}:00`).toISOString();
      }

      const payload = {
        title: toTitleCase(form.title),
        category: form.category,
        location: toTitleCase(form.location),
        employment_type: form.job_type,
        salary_range: cleanLine(form.salary),
        experience_range: cleanLine(form.experience),
        full_description: cleanText(form.description),
        responsibilities: toList(form.responsibilities),
        skills: toList(form.skills, { title: true }),
        eligible_degrees: toList(form.education, { title: true }),
        application_deadline: form.deadline || null,
        scheduled_at,   // ✅ null = post immediately, ISO string = schedule
      };

      await api.post("/api/jobs/create/", payload);

      if (scheduled_at) {
        toast.success(`Job scheduled for ${new Date(scheduled_at).toLocaleString("en-IN")}`);
      } else {
        toast.success("Job posted successfully!");
      }

      window.location.href = "/recruiter-dashboard/jobs/manage-jobs";

    } catch (err) {
      console.error("Job posting failed:", err);
      console.error("Error detail:", JSON.stringify(err.response?.data, null, 2));
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rd-postjob-page">
      <h2 className="rd-page-title">Post a Job</h2>
      <p className="rd-page-subtitle">Fill all details to publish a new job opening.</p>

      {/* ====================================================== JOB DETAILS CARD */}
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
              onChange={handleChange} onBlur={handleBlur}
              placeholder="e.g., Risk Analyst"
            />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Job Category</label>
            <select
              className="rd-input"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Credit Risk">Credit Risk</option>
              <option value="Market Risk">Market Risk</option>
              <option value="Operational Risk">Operational Risk</option>
              <option value="Fraud Risk">Fraud Risk</option>
              <option value="Compliance & GRC">Compliance & GRC</option>
              <option value="Audit & Analytics">Audit & Analytics</option>
              <option value="Cybersecurity & IT Risk">Cybersecurity & IT Risk</option>
              <option value="Finance & Banking">Finance & Banking</option>
              <option value="Insurance">Insurance</option>
              <option value="Enterprise Risk Management">Enterprise Risk Management</option>
              <option value="Third Party Risk Management">Third Party Risk Management</option>
              <option value="Model Risk Management">Model Risk Management</option>
              <option value="Data Privacy & Technology Risk">Data Privacy & Technology Risk</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Location</label>
            <input
              type="text"
              className="rd-input"
              name="location"
              value={form.location}
              onChange={handleChange} onBlur={handleBlur}
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
              <option value="full_time">Full-Time</option>
              <option value="part_time">Part-Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Salary Range</label>
            <input
              type="text"
              className="rd-input"
              name="salary"
              value={form.salary}
              onChange={handleChange} onBlur={handleBlur}
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
              onChange={handleChange} onBlur={handleBlur}
              placeholder="2–4 Years"
            />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Job Description</label>
            <textarea
              className="rd-textarea"
              name="description"
              value={form.description}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="Describe the job role and expectations..."
            ></textarea>
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Job Responsibilities</label>
            <textarea
              className="rd-textarea"
              name="responsibilities"
              value={form.responsibilities}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="Paste or type key responsibilities — one point per line"
            ></textarea>
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Area of Expertise</label>
            <input
              type="text"
              className="rd-input"
              name="skills"
              value={form.skills}
              onChange={handleChange} onBlur={handleBlur}
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
              onChange={handleChange} onBlur={handleBlur}
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

      {/* ====================================================== SCHEDULE SECTION */}
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
              min={new Date().toISOString().split("T")[0]}  // ✅ prevent past dates
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
        {saving ? "Posting..." : form.post_type === "Schedule for later" ? "Schedule Job" : "Post Job"}
      </button>
    </div>
  );
}