// src/pages/freelancers/FreelancerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import "./FreelancerList.css";    // keep your same UI styling

export default function FreelancerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // LOAD PUBLIC FREELANCER DATA
  // ============================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/api/profiles/freelancer/public/${id}/`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!data) return <p>Profile not found</p>;

  const { basic, professional, availability, education, social } = data;

  // Badge color
  const statusBadge = availability?.is_available
    ? { text: "Available for Work", class: "fl-available" }
    : { text: "Currently Occupied", class: "fl-occupied" };

  return (
    <div className="fl-profile-page">

      {/* ================= PROFILE HEADER ================= */}
      <div className="fl-card fl-profile-header">

        {/* Avatar */}
        <div className="fl-profile-photo">
          {basic.profile_picture ? (
            <img src={basic.profile_picture} alt="Freelancer" />
          ) : (
            <div className="fl-avatar-placeholder">
              {basic.full_name ? basic.full_name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>

        <div className="fl-profile-info">
          <h2 className="fl-name">{basic.full_name}</h2>

          {/* Expertise */}
          <p className="fl-expertise">
            {professional?.expertise || "Freelancer"}
          </p>

          {/* Availability */}
          <span className={`fl-badge ${statusBadge.class}`}>
            {statusBadge.text}
          </span>

          {/* Location */}
          <p className="fl-location">{basic.location || "Location Not Provided"}</p>

          {/* Languages */}
          <div className="fl-lang-row">
            {basic.languages_known
              ?.split(",")
              .map((lang) => (
                <span key={lang} className="fl-lang-pill">{lang.trim()}</span>
              ))}
          </div>
        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="fl-card fl-section">
        <h3>About</h3>
        <p>{professional?.bio || "No bio provided."}</p>
      </div>

      {/* ================= EDUCATION ================= */}
      <div className="fl-card fl-section">
        <h3>Education</h3>
        {education.length === 0 ? (
          <p>No education details.</p>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className="fl-edu-item">
              <strong>{edu.degree}</strong> — {edu.institution}
              <div className="fl-edu-year">
                {edu.start_year} - {edu.end_year}
              </div>
              {edu.description && <p>{edu.description}</p>}
            </div>
          ))
        )}
      </div>

      {/* ================= AVAILABILITY ================= */}
      <div className="fl-card fl-section">
        <h3>Availability</h3>
        <p><strong>Status:</strong> {statusBadge.text}</p>
        <p><strong>Timezone:</strong> {availability?.time_zone}</p>
        <p><strong>Working Days:</strong> {availability?.available_days?.join(", ")}</p>
      </div>

      {/* ================= SOCIAL LINKS ================= */}
      <div className="fl-card fl-section">
        <h3>Social Links</h3>
        <div className="fl-social">
          {social?.linkedin_url && <a href={social.linkedin_url} target="_blank">LinkedIn</a>}
          {social?.github_url && <a href={social.github_url} target="_blank">GitHub</a>}
          {social?.portfolio_url && <a href={social.portfolio_url} target="_blank">Portfolio</a>}
        </div>
      </div>
    </div>
  );
}
