// JobDetailsPage.jsx — FINAL with Applied Status + Save Job Integration

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import "./JobDetailsPage.css";

const JobDetailsPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  // Extract job ID from slug (e.g. risk-analyst-5 → 5)
  const id = slug.split("-").pop();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false); // ⭐ NEW
  const [loading, setLoading] = useState(true);

  // =============================
  // 1) LOAD JOB DETAILS
  // =============================
  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}/`);
        setJob(res.data);

        // Load company profile
        if (res.data.recruiter_id) {
          try {
            const companyRes = await api.get(
              `/api/profiles/company/${res.data.recruiter_id}/`
            );
            setCompany(companyRes.data);
          } catch (err) {
            console.warn("No public company profile");
          }
        }
      } catch (err) {
        console.error("Failed to load job:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  // =============================
  // 2) LOAD SAVED STATUS
  // =============================
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const res = await api.get("/api/applications/saved-jobs/");
        const savedIds = res.data.map((i) => i.job.id);
        setSaved(savedIds.includes(parseInt(id)));
      } catch (err) {
        console.error("Failed to load saved jobs");
      }
    };
    loadSaved();
  }, [id]);

  // =============================
  // 3) LOAD APPLIED STATUS ⭐ NEW
  // =============================
  useEffect(() => {
    const loadApplied = async () => {
      try {
        const res = await api.get("/api/applications/job/applied/");
        const appliedIds = res.data.map((a) => a.job_id); // backend now returns job_id
        setApplied(appliedIds.includes(Number(id)));
      } catch (err) {
        console.error("Failed to load applied status:", err);
      }
    };

    loadApplied();
  }, [id]);

  // =============================
  // 4) SAVE / UNSAVE
  // =============================
  const toggleSave = async () => {
    try {
      if (saved) {
        await api.delete(`/api/applications/saved-jobs/remove/${id}/`);
        setSaved(false);
      } else {
        await api.post("/api/applications/saved-jobs/add/", { job_id: id });
        setSaved(true);
      }
    } catch (err) {
      console.error("Failed to update saved jobs");
    }
  };

  // =============================
  // 5) APPLY NOW
  // =============================
  const handleApplyNow = () => {
    navigate(`/apply?id=${id}`);
  };

  if (loading) return <div className="jd-loading">Loading job…</div>;
  if (!job) return <div className="jd-error">Job not found.</div>;

  return (
    <div className="jd-desktop-wrapper">
      <div className="jd-container">

        {/* ======================================================
                        JOB HEADER SECTION
        ======================================================= */}
        <div className="jd-header-card">
          <div className="jd-header-left">
            <h1 className="jd-title">{job.title}</h1>

            <div className="jd-meta">
              <span className="jd-badge">{job.category}</span>
              <span className="jd-meta-item">{job.company_name}</span>
              <span className="jd-meta-item">{job.location}</span>
              <span className="jd-meta-item">{job.experience_range}</span>
              <span className="jd-meta-item">{job.salary_range}</span>
              <span className="jd-meta-item">{job.employment_type}</span>

              {job.application_deadline && (
                <span className="jd-meta-item">
                  Deadline:{" "}
                  {new Date(job.application_deadline).toLocaleDateString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="jd-header-right">

            {/* ⭐ APPLY BUTTON WITH NEW LOGIC */}
            <button
              className="jd-apply-btn"
              disabled={applied}
              onClick={!applied ? handleApplyNow : null}
            >
              {applied ? "Applied ✓" : "Apply Now"}
            </button>

            {/* SAVE / SAVED */}
            <button className="jd-save-btn" onClick={toggleSave}>
              {saved ? "Saved" : "Save Job"}
            </button>
          </div>
        </div>

        {/* ======================================================
                        JOB DESCRIPTION
        ======================================================= */}
        <div className="jd-section">
          <h2 className="jd-section-title">About the Job</h2>
          <p className="jd-description">{job.full_description}</p>
        </div>

        {/* RESPONSIBILITIES */}
        {job.responsibilities?.length > 0 && (
          <div className="jd-section">
            <h2 className="jd-section-title">Responsibilities</h2>
            <ul className="jd-list">
              {job.responsibilities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* REQUIREMENTS */}
        {job.requirements?.length > 0 && (
          <div className="jd-section">
            <h2 className="jd-section-title">Requirements</h2>
            <ul className="jd-list">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* SKILLS */}
        <div className="jd-section">
          <h2 className="jd-section-title">Skills Required</h2>
          <div className="jd-skills">
            {job.skills?.map((skill, i) => (
              <span key={i} className="jd-skill">{skill}</span>
            ))}
          </div>
        </div>

        {/* ======================================================
                    COMPANY DETAILS SECTION
        ======================================================= */}
        {company && (
          <div className="jd-section-card">
            <h2 className="jd-section-title">Company Details</h2>

            <div className="jd-company-grid">
              <p><strong>Company Name:</strong> {company.company_name}</p>
              <p><strong>Industry:</strong> {company.industry_category || "Not specified"}</p>
              <p><strong>Company Size:</strong> {company.company_size || "Not specified"}</p>
              <p><strong>Location:</strong> {company.company_location || "Not specified"}</p>

              {company.company_website && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={company.company_website} target="_blank" rel="noreferrer">
                    {company.company_website}
                  </a>
                </p>
              )}
            </div>

            {company.about_company && (
              <p className="jd-company-about">
                <strong>About Company:</strong> {company.about_company}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;
