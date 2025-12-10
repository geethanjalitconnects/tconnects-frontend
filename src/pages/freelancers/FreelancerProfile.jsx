// src/pages/freelancers/FreelancerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import "./FreelancerList.css"; // reuse same CSS for simplicity
import toast from "react-hot-toast";

export default function FreelancerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/profiles/freelancers/${id}/`);
        setProfile(res.data);
      } catch (err) {
        console.error("Unable to load freelancer profile.", err);
        toast.error("Unable to load freelancer profile.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) return <div className="fl-loading">Loading profile...</div>;
  if (!profile) return <div className="fl-empty">Profile not found.</div>;

  const basic = profile.basic || {};
  const prof = profile.professional || {};
  const edu = profile.education || [];
  const avail = profile.availability || {};
  const payments = profile.payments || [];
  const social = profile.social || {};
  const ratings = profile.ratings || [];

  const languages = Array.isArray(basic.languages_known)
    ? basic.languages_known.join(", ")
    : basic.languages_known || "Not provided";

  return (
    <div className="fl-profile-page">
      <div className="fl-profile-top">
        <div className="fl-profile-left">
          {basic.profile_picture ? (
            <img className="fl-profile-photo" src={basic.profile_picture} alt={basic.full_name} />
          ) : (
            <div className="fl-placeholder-lg">{(basic.full_name || "U").charAt(0)}</div>
          )}
        </div>

        <div className="fl-profile-right">
          <h1 className="fl-big-name">{basic.full_name || "Unnamed Freelancer"}</h1>
          <p className="fl-role">{prof.expertise || prof.categories || "Freelancer"}</p>
          <p className="fl-location">📍 {basic.location || "Location Not Provided"}</p>
          <div className="fl-tags-row">
            { (basic.languages_known && (Array.isArray(basic.languages_known) ? basic.languages_known : basic.languages_known.split(",").map(s=>s.trim())))?.slice(0,5).map((l,i)=>(
              <span key={i} className="fl-tag">{l}</span>
            )) }
          </div>
        </div>
      </div>

      <div className="fl-main-grid">
        <section className="fl-card-section">
          <h3>About</h3>
          <p>{prof.bio || "No bio provided."}</p>

          <h4>Experience</h4>
          <p>{prof.experience || "Not provided"}</p>

          <h4>Expertise</h4>
          <p>{prof.expertise || "Not provided"}</p>
        </section>

        <section className="fl-card-section">
          <h3>Availability</h3>
          <p><strong>Status:</strong> {avail.is_available ? "Available" : "Not available"}</p>
          <p><strong>From:</strong> {avail.available_from || "N/A"}</p>
          <p><strong>To:</strong> {avail.available_to || "N/A"}</p>
          <p><strong>Timezone:</strong> {avail.time_zone || "N/A"}</p>
          <p><strong>Days:</strong> {(avail.available_days && avail.available_days.length) ? avail.available_days.join(", ") : "Not specified"}</p>

          <h4>Education</h4>
          {edu.length === 0 ? <p>No education added.</p> : edu.map((e,i)=>(
            <div key={i} className="fl-edu">
              <strong>{e.degree || e.title}</strong> — {e.institution || e.school}
              <div className="fl-edu-year">{e.start_year || ""} {e.end_year ? `- ${e.end_year}` : ""}</div>
            </div>
          ))}
        </section>

        <section className="fl-card-section">
          <h3>Payment Methods</h3>
          {payments.length === 0 ? <p>No payment methods added.</p> : payments.map((p,i)=>(
            <div key={i}>
              <strong>{p.payment_type}</strong>: {p.upi_id || `${p.account_number || ""} ${p.bank_name ? `(${p.bank_name})` : ""}`}
            </div>
          ))}

          <h3 style={{marginTop:20}}>Social Links</h3>
          <div className="fl-socials">
            {social.linkedin_url && <a href={social.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>}
            {social.github_url && <a href={social.github_url} target="_blank" rel="noreferrer">GitHub</a>}
            {social.portfolio_url && <a href={social.portfolio_url} target="_blank" rel="noreferrer">Portfolio</a>}
            {!social.linkedin_url && !social.github_url && !social.portfolio_url && <p>No social links</p>}
          </div>

          <h3 style={{marginTop:20}}>Ratings</h3>
          {ratings.length === 0 ? <p>No ratings yet.</p> : ratings.map((r,i)=>(
            <div key={i} className="fl-rating">{r.score} ★ — {r.review}</div>
          ))}
        </section>
      </div>
    </div>
  );
}
