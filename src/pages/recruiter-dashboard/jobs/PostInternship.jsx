// src/pages/RecruiterDashboard/PostInternship.jsx
import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function PostInternship() {
  const [saving, setSaving] = useState(false);

  // Company profile (auto-fetched)
  const [companyData, setCompanyData] = useState({
    company_name: "",
    company_location: "",
    industry_category: "",
    company_size: "",
    company_website: "",
    about_company: "",
  });

  // Success / Error message
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"

  // Form
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    internship_type: "remote",
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

  // Fetch company profile (recruiter-only endpoint)
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get("/api/profiles/recruiter/company/");
        setCompanyData({
          company_name: res.data.company_name || "",
          company_location: res.data.company_location || "",
          industry_category: res.data.industry_category || "",
          company_size: res.data.company_size || "",
          company_website: res.data.company_website || "",
          about_company: res.data.about_company || "",
        });
      } catch (err) {
        console.error("Failed to load company profile:", err);
        // don't block posting UI — but show message if needed
        setMessageType("error");
        setMessage("Unable to load company profile. Please update Company Profile first.");
        setTimeout(() => setMessage(""), 4000);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setSaving(true);
    setMessage("");

    // minimal validation
    if (!form.title || !form.description) {
      setMessageType("error");
      setMessage("Please provide at least a title and description.");
      setSaving(false);
      setTimeout(() => setMessage(""), 3500);
      return;
    }

    try {
      const payload = {
        title: form.title,
        // company_name comes from recruiter company profile (auto-filled)
        company_name: companyData.company_name || "Company",
        category: form.category || "",
        // if form.location empty, fall back to company location
        location: form.location || companyData.company_location || "",
        internship_type: form.internship_type,
        stipend: form.stipend || "",
        duration: form.duration || "",
        // backend requires full_description and short_description (serializer expects both)
        full_description: form.description,
        short_description: form.description.substring(0, 120),
        responsibilities: form.responsibilities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        eligibility: form.eligibility || "",
        application_deadline:
          form.post_type === "Schedule for later" ? form.schedule_date : null,
        is_active: true,
      };

      await api.post("/api/internships/create/", payload);

      setMessageType("success");
      setMessage("🎉 Internship posted successfully!");
      setTimeout(() => setMessage(""), 3000);

      // short delay then navigate to manage page
      setTimeout(() => {
        window.location.href = "/recruiter-dashboard/jobs/manage-internships";
      }, 1200);
    } catch (err) {
      console.error("Post internship failed:", err);
      setMessageType("error");

      // Try to show specific error message if backend returned validation details
      const serverMsg =
        err?.response?.data ||
        err?.response?.data?.detail ||
        "Something went wrong while posting the internship.";
      setMessage(
        typeof serverMsg === "string" ? serverMsg : "Failed to post internship."
      );
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rd-postjob-page">
      {message && (
        <div className={`rd-message-box ${messageType === "success" ? "rd-success" : "rd-error"}`}>
          {message}
        </div>
      )}

      <h2 className="rd-page-title">Post an Internship</h2>
      <p className="rd-page-subtitle">Fill the details to publish the internship.</p>

      <div className="rd-profile-card">
        <h3 className="rd-card-title">Internship Details</h3>
        <div className="rd-grid">

          <div className="rd-form-group">
            <label className="rd-label">Internship Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="rd-input" placeholder="e.g., Risk Analyst Intern, Financial Risk Intern, Operational Risk Intern"  />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="rd-input" placeholder="Risk Management, Financial Risk, Operational Risk, Compliance Risk"  />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="rd-input" placeholder="City, State (optional — will use company location if left blank)" />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Internship Mode</label>
            <select name="internship_type" value={form.internship_type} onChange={handleChange} className="rd-input">
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Stipend</label>
            <input name="stipend" value={form.stipend} onChange={handleChange} className="rd-input" placeholder="₹5,000 – ₹15,000 or Unpaid" />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Duration</label>
            <input name="duration" value={form.duration} onChange={handleChange} className="rd-input" placeholder="2 Months, 6 Months..." />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="rd-textarea" placeholder="Describe the internship: assisting in risk analysis, preparing reports, monitoring KRIs, validating data, supporting audits..." />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Responsibilities (comma separated)</label>
            <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} className="rd-textarea" placeholder="e.g., Assist in research, Create reports" />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Skills Required (comma separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange} className="rd-input" placeholder="Excel, SQL, Power BI, Risk Analysis, Data Interpretation, Reporting"  />
          </div>

          <div className="rd-form-group rd-full">
            <label className="rd-label">Eligibility</label>
            <input name="eligibility" value={form.eligibility} onChange={handleChange} className="rd-input" placeholder="B.Tech, BBA, etc." />
          </div>

        </div>
      </div>

      <div className="rd-schedule-card">
        <h3 className="rd-card-title">Schedule</h3>
        <div className="rd-grid">

          <div className="rd-form-group">
            <label className="rd-label">Post Type</label>
            <select name="post_type" value={form.post_type} onChange={handleChange} className="rd-input">
              <option>Post Now</option>
              <option>Schedule for later</option>
            </select>
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Schedule Date</label>
            <input name="schedule_date" value={form.schedule_date} onChange={handleChange} className="rd-input" type="date" disabled={form.post_type === "Post Now"} />
          </div>

          <div className="rd-form-group">
            <label className="rd-label">Schedule Time</label>
            <input name="schedule_time" value={form.schedule_time} onChange={handleChange} className="rd-input" type="time" disabled={form.post_type === "Post Now"} />
          </div>

        </div>
      </div>

      <button className="rd-save-btn" disabled={saving} onClick={handleSubmit}>
        {saving ? "Posting..." : "Post Internship"}
      </button>
    </div>
  );
}
