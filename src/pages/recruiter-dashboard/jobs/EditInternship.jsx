// EditInternship.jsx — FINAL FIXED VERSION (UI UNCHANGED)
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import api from "../../../config/api";
import "../../recruiter-dashboard/RecruiterDashboard.css";

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
          responsibilities: res.data.responsibilities.join(", "),
          skills: res.data.skills.join(", "),

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

  // ============================================================
  // 3. SAVE (PATCH) TO BACKEND — FIXED PAYLOAD & URL
  // ============================================================
  const handleSave = async () => {
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        category: form.category,
        location: form.location,
        stipend: form.stipend,
        duration: form.duration,

        internship_type: form.internship_type, // FIXED FIELD

        full_description: form.description,
        short_description: form.description.slice(0, 120),

        responsibilities: form.responsibilities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),

        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),

        eligibility: form.eligibility,

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
          <label>Skills</label>
          <textarea
            className="rd-input"
            name="skills"
            value={form.skills}
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

      <button className="rd-save-btn" disabled={saving} onClick={handleSave}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
