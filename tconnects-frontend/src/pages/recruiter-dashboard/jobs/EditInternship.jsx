// EditInternship.jsx — FINAL FIXED VERSION (UI UNCHANGED)
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import api from "../../../config/api";
import "../../recruiter-dashboard/RecruiterDashboard.css";
import { toTitleCase, cleanText, cleanLine, toList, formatByRule } from "../utils/formatText";

export default function EditInternship() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    stipend: "",
    duration: "",
    internship_type: "",
    description: "",
    responsibilities: "",
    skills: "",
    eligibility: "",
  });

  // ============================================================
  // 1. FETCH INTERNSHIP DETAILS (FIXED BACKEND FIELDS)
  // ============================================================
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await api.get(`/api/internships/${id}/`);

        setForm({
          title: res.data.title,
          category: res.data.category,
          location: res.data.location,
          stipend: res.data.stipend,
          duration: res.data.duration,

          internship_type: res.data.internship_type,  // FIXED FIELD

          description: res.data.full_description,
          responsibilities: (res.data.responsibilities || []).join("\n"),
          skills: (res.data.skills || []).join(", "),

          eligibility: res.data.eligibility || "",
        });
      } catch (err) {
        console.error("Failed to load internship:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  // ============================================================
  // 2. HANDLE INPUT
  // ============================================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Clean up pasted / typed content as soon as the recruiter leaves a field
  const RULES = {
    title: "title",
    category: "title",
    location: "title",
    stipend: "line",
    duration: "line",
    description: "text",
    responsibilities: "list",
    skills: "titlelist",
    eligibility: "titlelist",
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const rule = RULES[name];
    if (rule) setForm((prev) => ({ ...prev, [name]: formatByRule(rule, value) }));
  };

  // ============================================================
  // 3. SAVE (PATCH) TO BACKEND — FIXED PAYLOAD & URL
  // ============================================================
  const handleSave = async () => {
    setSaving(true);

    try {
      const payload = {
        title: toTitleCase(form.title),
        category: toTitleCase(form.category),
        location: toTitleCase(form.location),
        stipend: cleanLine(form.stipend),
        duration: cleanLine(form.duration),

        internship_type: form.internship_type, // FIXED FIELD

        full_description: cleanText(form.description),
        short_description: cleanText(form.description).slice(0, 120),

        responsibilities: toList(form.responsibilities),

        skills: toList(form.skills, { title: true }),

        eligibility: toList(form.eligibility, { title: true }).join(", "),

        // Backend does NOT support scheduling →
        application_deadline: null,
      };

      await api.patch(`/api/internships/${id}/update/`, payload); // FIXED URL

      toast.success("Internship updated successfully!");
      window.location.href = "/recruiter-dashboard/jobs/manage-internships";
    } catch (err) {
      console.error("Failed to update internship:", err);
      toast.error("Error updating internship.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rd-loading">Loading...</div>;

  // ============================================================
  // 4. UI — UNCHANGED
  // ============================================================
  return (
    <div className="rd-edit-wrapper">
      <h1 className="rd-edit-title">Edit Internship</h1>
      <p className="rd-edit-subtitle">Modify internship posting details.</p>

      <div className="rd-card">
        <h2 className="rd-card-heading">Internship Details</h2>

        <div className="rd-grid-3">

          <div className="rd-form-group">
            <label>Internship Title</label>
            <input
              className="rd-input"
              name="title"
              value={form.title}
              onChange={handleChange} onBlur={handleBlur}
            />
          </div>

          <div className="rd-form-group">
            <label>Category</label>
            <input
              className="rd-input"
              name="category"
              value={form.category}
              onChange={handleChange} onBlur={handleBlur}
            />
          </div>

          <div className="rd-form-group">
            <label>Location</label>
            <input
              className="rd-input"
              name="location"
              value={form.location}
              onChange={handleChange} onBlur={handleBlur}
            />
          </div>

          <div className="rd-form-group">
            <label>Stipend</label>
            <input
              className="rd-input"
              name="stipend"
              value={form.stipend}
              onChange={handleChange} onBlur={handleBlur}
            />
          </div>

          <div className="rd-form-group">
            <label>Duration</label>
            <input
              className="rd-input"
              name="duration"
              value={form.duration}
              onChange={handleChange} onBlur={handleBlur}
            />
          </div>

          <div className="rd-form-group">
            <label>Internship Mode</label>
            <select
              className="rd-input"
              name="internship_type"
              value={form.internship_type}
              onChange={handleChange}
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="rd-form-group full">
          <label>Description</label>
          <textarea
            className="rd-input"
            name="description"
            value={form.description}
            onChange={handleChange} onBlur={handleBlur}
          ></textarea>
        </div>

        <div className="rd-form-group full">
          <label>Responsibilities (one point per line)</label>
          <textarea
            className="rd-input"
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange} onBlur={handleBlur}
          ></textarea>
        </div>

        <div className="rd-form-group full">
          <label>Skills</label>
          <textarea
            className="rd-input"
            name="skills"
            value={form.skills}
            onChange={handleChange} onBlur={handleBlur}
          ></textarea>
        </div>

        <div className="rd-form-group full">
          <label>Eligibility</label>
          <textarea
            className="rd-input"
            name="eligibility"
            value={form.eligibility}
            onChange={handleChange} onBlur={handleBlur}
          ></textarea>
        </div>
      </div>

      <button className="rd-save-btn" disabled={saving} onClick={handleSave}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
