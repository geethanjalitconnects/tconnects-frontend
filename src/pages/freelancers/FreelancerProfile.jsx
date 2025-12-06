import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import "./FreelancerList.css";

export default function FreelancerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/api/profiles/freelancers/${id}/`);
        setData(res.data);
      } catch (error) {
        console.error("Error loading freelancer profile:", error);
      }
    };
    loadProfile();
  }, [id]);

  if (!data) return <p className="loading">Loading profile...</p>;

  const basic = data.basic;
  const professional = data.professional;
  const availability = data.availability;
  const education = data.education;
  const payments = data.payments;
  const social = data.social;

  return (
    <div className="fl-profile-page">
      {/* HEADER */}
      <div className="fl-profile-header">
        <div className="fl-profile-img">
          {basic.profile_picture ? (
            <img src={basic.profile_picture} alt="Profile" />
          ) : (
            <div className="fl-placeholder-lg">
              {basic.full_name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="fl-profile-main">
          <h2 className="fl-profile-name">{basic.full_name}</h2>
          <p className="fl-profile-expertise">
            {professional?.expertise || "Freelancer"}
          </p>
          <p className="fl-profile-location">{basic.location}</p>

          <button className="fl-hire-btn">Hire This Freelancer</button>
        </div>
      </div>

      {/* ABOUT */}
      <div className="fl-section">
        <h3 className="fl-section-title">About</h3>
        <p className="fl-paragraph">
          {professional?.bio || "This freelancer has not added a bio yet."}
        </p>
      </div>

      {/* EDUCATION */}
      <div className="fl-section">
        <h3 className="fl-section-title">Education</h3>
        {education.length === 0 ? (
          <p>No education details available.</p>
        ) : (
          education.map((edu, i) => (
            <div key={i} className="fl-edu-item">
              <strong>{edu.degree}</strong> — {edu.institution}
              <div className="fl-edu-year">
                {edu.start_year} - {edu.end_year}
              </div>
            </div>
          ))
        )}
      </div>

      {/* AVAILABILITY */}
      <div className="fl-section">
        <h3 className="fl-section-title">Availability</h3>
        {availability ? (
          <>
            <p><strong>Status:</strong> {availability.is_available ? "Available" : "Not Available"}</p>
            <p><strong>Timezone:</strong> {availability.time_zone}</p>
            <p>
              <strong>Days:</strong>{" "}
              {availability.available_days?.join(", ") || "Not specified"}
            </p>
          </>
        ) : (
          <p>Availability not provided.</p>
        )}
      </div>

      {/* SOCIAL LINKS */}
      <div className="fl-section">
        <h3 className="fl-section-title">Social Profiles</h3>
        <div className="fl-social-links">
          {social?.linkedin_url && <a href={social.linkedin_url}>LinkedIn</a>}
          {social?.github_url && <a href={social.github_url}>GitHub</a>}
          {social?.portfolio_url && <a href={social.portfolio_url}>Portfolio</a>}
        </div>
      </div>

      {/* RATINGS */}
      <div className="fl-section">
        <h3 className="fl-section-title">Ratings & Badges</h3>
        <p>No ratings or badges yet.</p>
      </div>
    </div>
  );
}
