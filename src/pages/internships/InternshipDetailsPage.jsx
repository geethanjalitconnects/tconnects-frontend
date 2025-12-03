// src/pages/InternshipDetails/InternshipDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import "./InternshipDetailsPage.css";

const InternshipDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [saved, setSaved] = useState(false);
  const [internship, setInternship] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // 1) Internship details (includes recruiter_id)
        const res = await api.get(`/api/internships/${id}/`);
        setInternship(res.data);

        // 2) If recruiter_id present -> fetch public company profile
        const rid = res.data.recruiter_id;
        if (rid) {
          try {
            const companyRes = await api.get(`/api/profiles/company/${rid}/`);
            setCompany(companyRes.data);
          } catch (err) {
            // company profile may not exist publicly — handle gracefully
            console.warn("Company profile not found for recruiter:", rid);
            setCompany(null);
          }
        }
      } catch (err) {
        console.error("Failed to load internship:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await api.get("/api/applications/saved-internships/");
        const ids = res.data.map((i) => i.internship.id);
        setSaved(ids.includes(parseInt(id)));
      } catch (err) {
        console.error("Error checking saved status:", err);
      }
    };
    fetchSaved();
  }, [id]);

  const toggleSave = async () => {
    try {
      if (saved) {
        await api.delete(`/api/applications/saved-internships/remove/${id}/`);
        setSaved(false);
      } else {
        await api.post("/api/applications/saved-internships/", { internship: id });
        setSaved(true);
      }
    } catch (err) {
      console.error("Failed to save/unsave:", err);
    }
  };

  const handleApplyNow = () => navigate(`/apply-internship?id=${id}`);


  if (loading) return <div className="jd-loading">Loading internship…</div>;
  if (!internship) return <div className="jd-error">Internship not found.</div>;

  return (
    <div className="jd-desktop-wrapper">
      <div className="jd-container">

        {/* HEADER */}
        <div className="jd-header-card">
          <div className="jd-header-left">
            <h1 className="jd-title">{internship.title}</h1>

            <div className="jd-meta">
              <span className="jd-badge">{internship.category || "Internship"}</span>
              <span className="jd-meta-item">{internship.company_name}</span>
              <span className="jd-meta-item">{internship.location}</span>
              <span className="jd-meta-item">{internship.duration}</span>
              <span className="jd-meta-item">Stipend: {internship.stipend}</span>
              <span className="jd-meta-item">{internship.internship_type}</span>
              {internship.application_deadline && (
                <span className="jd-meta-item">
                  Deadline: {new Date(internship.application_deadline).toLocaleDateString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="jd-header-right">
            <button className="jd-apply-btn" onClick={handleApplyNow}>Apply Now</button>
            <button className="jd-save-btn" onClick={toggleSave}>{saved ? "Unsave" : "Save Internship"}</button>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="jd-section">
          <h2 className="jd-section-title">About the Internship</h2>
          <p className="jd-description">{internship.full_description}</p>
        </div>

        {/* RESPONSIBILITIES */}
        {internship.responsibilities && internship.responsibilities.length > 0 && (
          <div className="jd-section">
            <h2 className="jd-section-title">Responsibilities</h2>
            <ul className="jd-list">
              {internship.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* SKILLS */}
        <div className="jd-section">
          <h2 className="jd-section-title">Skills Required</h2>
          <div className="jd-skills">
            {internship.skills?.map((skill, i) => <span key={i} className="jd-skill">{skill}</span>)}
          </div>
        </div>
        {/* APPLICATION DEADLINE */}
{internship.application_deadline && (
  <div className="jd-section">
    <h2 className="jd-section-title">Application Deadline</h2>
    <p className="jd-description">
      {new Date(internship.application_deadline).toLocaleDateString("en-IN")}
    </p>
  </div>
)}

        {/* COMPANY PROFILE SECTION (fetched via recruiter_id) */}
        {company && (
          <div className="jd-section">
            <h2 className="jd-section-title">Company Details</h2>
            <div className="jd-company-box">
              <p><strong>Company Name:</strong> {company.company_name}</p>
              <p><strong>Industry:</strong> {company.industry_category || "Not provided"}</p>
              <p><strong>Company Size:</strong> {company.company_size || "Not provided"}</p>
              <p><strong>Location:</strong> {company.company_location || "Not provided"}</p>
              {company.company_website && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={company.company_website} target="_blank" rel="noreferrer">{company.company_website}</a>
                </p>
              )}
              {company.about_company && (
                <p><strong>About Company:</strong> {company.about_company}</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InternshipDetailsPage;
