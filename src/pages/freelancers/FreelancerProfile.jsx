import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import toast from "react-hot-toast";
import "./FreelancerList.css"; // Reuse theme styling

export default function FreelancerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // =============================
  // Load freelancer full profile
  // =============================
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/profiles/freelancers/${id}/`);
        setData(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load freelancer profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p className="loading">Loading profile...</p>;
  if (!data) return <p>Freelancer not found.</p>;

  const basic = data.basic;
  const professional = data.professional;
  const availability = data.availability;
  const social = data.social;

  return (
    <div className="fl-profile-page">

      {/* TOP HEADER */}
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
          <p className="fl-profile-expertise">{professional?.expertise}</p>
          <p className="fl-profile-location">{basic.location}</p>

          {/* Hire button */}
          <button className="fl-hire-btn">
            Hire This Freelancer
          </button>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="fl-section">
        <h3 className="fl-section-title">About</h3>
        <p className="fl-paragraph">{professional?.bio || "No bio provided."}</p>
      </div>

      {/* SKILLS */}
      <div className="fl-section">
        <h3 className="fl-section-title">Skills</h3>
        <div className="fl-skills">
          {professional?.skills?.map((s, i) => (
            <span key={i} className="fl-skill">{s}</span>
          )) || <p>No skills added</p>}
        </div>
      </div>

      {/* EDUCATION */}
      <div className="fl-section">
        <h3 className="fl-section-title">Education</h3>
        {data.education?.length === 0 ? (
          <p>No education added</p>
        ) : (
          data.education.map((edu, i) => (
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
            <p><strong>Status:</strong> {availability.is_available ? "Available" : "Busy"}</p>
            <p><strong>From:</strong> {availability.available_from}</p>
            <p><strong>To:</strong> {availability.available_to}</p>
            <p><strong>Timezone:</strong> {availability.time_zone}</p>
            <p><strong>Days:</strong> {availability.available_days?.join(", ")}</p>
          </>
        ) : (
          <p>No availability added</p>
        )}
      </div>

      {/* SOCIAL LINKS */}
      <div className="fl-section">
        <h3 className="fl-section-title">Social Profiles</h3>
        <div className="fl-social-links">
          {social?.linkedin_url && (
            <a href={social.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>
          )}
          {social?.github_url && (
            <a href={social.github_url} target="_blank" rel="noreferrer">GitHub</a>
          )}
          {social?.portfolio_url && (
            <a href={social.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a>
          )}
        </div>
      </div>

      {/* RATINGS */}
      <div className="fl-section">
        <h3 className="fl-section-title">Ratings & Feedback</h3>
        {data.ratings?.length === 0 ? (
          <p>No ratings yet</p>
        ) : (
          data.ratings.map((r, i) => (
            <div key={i} className="fl-rating-box">
              <div className="fl-rating-stars">{"★".repeat(r.stars)}</div>
              <p className="fl-rating-comment">{r.comment}</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
