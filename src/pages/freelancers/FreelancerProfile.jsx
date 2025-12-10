import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import toast from "react-hot-toast";
import "./FreelancerList.css"; // Using your modern UI

export default function FreelancerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
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

    loadProfile();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Profile not found.</p>;

  const { 
    basic = {}, 
    professional = {}, 
    education = [], 
    availability = {}, 
    payments = [], 
    social = {}, 
    ratings = [], 
    badges = [] 
  } = data;

  const initials = (basic.full_name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("");

  const languages =
    Array.isArray(basic.languages_known)
      ? basic.languages_known.join(", ")
      : basic.languages_known || "N/A";

  return (
    <div className="fl-page">

      {/* HERO SECTION */}
      <div className="fl-hero">
        <h1>{basic.full_name || "Unnamed Freelancer"}</h1>
        <p>{professional.categories || "Freelancer"}</p>
      </div>

      {/* PROFILE HEADER */}
      <div className="fl-profile-header">

        <div className="fl-profile-img">
          {basic.profile_picture ? (
            <img src={basic.profile_picture} alt="profile" />
          ) : (
            <div className="fl-placeholder-lg">{initials}</div>
          )}
        </div>

        <div className="fl-profile-main">
          <h2 className="fl-profile-name">{basic.full_name}</h2>
          <p className="fl-profile-expertise">{professional.expertise || "Not provided"}</p>
          <p className="fl-profile-location">
            📍 {basic.location || "Location not provided"}
          </p>

          <button className="fl-hire-btn">Hire Now</button>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="fl-section">
        <h3>About</h3>
        <p className="fl-paragraph">{professional.bio || "No bio added"}</p>
      </div>

      {/* PROFESSIONAL DETAILS */}
      <div className="fl-section">
        <h3>Professional Details</h3>
        <p><strong>Expertise:</strong> {professional.expertise || "N/A"}</p>
        <p><strong>Experience:</strong> {professional.experience || "N/A"}</p>
        <p><strong>Languages:</strong> {languages}</p>
      </div>

      {/* EDUCATION */}
      <div className="fl-section">
        <h3>Education</h3>
        {education.length === 0 ? (
          <p>No education added.</p>
        ) : (
          education.map((edu, i) => (
            <div key={i} className="fl-edu-item">
              <strong>{edu.degree}</strong> - {edu.institution}
              <div className="fl-edu-year">{edu.start_year} - {edu.end_year}</div>
            </div>
          ))
        )}
      </div>

      {/* AVAILABILITY */}
      <div className="fl-section fl-availability">
        <h3>Availability</h3>
        <p><strong>Status:</strong> {availability.is_available ? "Available" : "Not Available"}</p>
        <p><strong>Time From:</strong> {availability.available_from || "N/A"}</p>
        <p><strong>Time To:</strong> {availability.available_to || "N/A"}</p>
        <p><strong>Timezone:</strong> {availability.time_zone || "N/A"}</p>
        <p>
          <strong>Days:</strong>{" "}
          {availability.available_days?.length > 0
            ? availability.available_days.join(", ")
            : "Not selected"}
        </p>
      </div>

      {/* PAYMENT METHODS */}
      <div className="fl-section">
        <h3>Payment Methods</h3>
        {payments.length === 0 ? (
          <p>No payment details added.</p>
        ) : (
          payments.map((p) => (
            <p key={p.id}>
              <strong>{p.payment_type}:</strong>{" "}
              {p.payment_type === "UPI" ? p.upi_id : `${p.account_number} (${p.bank_name})`}
            </p>
          ))
        )}
      </div>

      {/* SOCIAL LINKS */}
      <div className="fl-section">
        <h3>Social Links</h3>
        <div className="fl-social-links">
          <a href={social.linkedin_url} target="_blank">LinkedIn</a>
          <a href={social.github_url} target="_blank">GitHub</a>
          <a href={social.portfolio_url} target="_blank">Portfolio</a>
        </div>
      </div>

      {/* RATINGS */}
      <div className="fl-section">
        <h3>Ratings</h3>
        {ratings.length === 0 ? (
          <p className="fl-ratings-placeholder">No ratings yet.</p>
        ) : (
          ratings.map((r, i) => (
            <p key={i}>{r.score} ⭐ - {r.review}</p>
          ))
        )}
      </div>

      {/* BADGES */}
      <div className="fl-section">
        <h3>Badges</h3>
        {badges.length === 0 ? (
          <p>No badges earned yet.</p>
        ) : (
          badges.map((b, i) => <span key={i} className="fl-skill">{b}</span>)
        )}
      </div>

    </div>
  );
}
