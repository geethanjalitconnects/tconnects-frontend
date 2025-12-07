import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";

export default function FreelancerProfilePreview() {
  const [data, setData] = useState({
    basic: {},
    professional: {},
    education: [],
    availability: {},
    payments: [],
    social: {},
    ratings: [],
    badges: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/api/profiles/freelancer/profile-preview/");

        setData({
          basic: res.data.basic || {},
          professional: res.data.professional || {},
          education: Array.isArray(res.data.education) ? res.data.education : [],
          availability: res.data.availability || {},
          payments: Array.isArray(res.data.payments) ? res.data.payments : [],
          social: res.data.social || {},
          ratings: Array.isArray(res.data.ratings) ? res.data.ratings : [],
          badges: Array.isArray(res.data.badges) ? res.data.badges : []
        });
      } catch (error) {
        console.error(error);
        toast.error("Unable to load profile preview.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const publishProfile = async () => {
    try {
      await api.post("/api/profiles/freelancer/publish/");
      toast.success("Your profile is now published!");

      setData(prev => ({
        ...prev,
        basic: { ...prev.basic, is_published: true }
      }));
    } catch (error) {
      toast.error("Failed to publish profile.");
    }
  };

  // ====================================================
  // DELETE FREELANCER PROFILE ADDED HERE
  // ====================================================
  const deleteFreelancerProfile = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your freelancer profile.")) {
      return;
    }
    try {
      await api.delete("/api/profiles/freelancer/delete/");
      toast.success("Freelancer profile deleted successfully.");
      window.location.href = "/candidate-dashboard"; 
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete freelancer profile.");
    }
  };

  if (loading) return <p>Loading...</p>;

  const basic = data.basic || {};
  const professional = data.professional || {};
  const availability = data.availability || {};
  const social = data.social || {};
  const education = Array.isArray(data.education) ? data.education : [];
  const payments = Array.isArray(data.payments) ? data.payments : [];
  const ratings = Array.isArray(data.ratings) ? data.ratings : [];
  const badges = Array.isArray(data.badges) ? data.badges : [];

  const initials = (basic.full_name || "User Name")
    .split(" ")
    .map(w => w[0] || "")
    .join("")
    .toUpperCase();

  return (
    <div className="fr-page">
      <div className="fr-card">

        <h2 className="fr-title">Profile Preview</h2>

        <div className="fr-preview-header">
          <div className="fr-preview-img">
            {basic.profile_picture ? (
              <img src={basic.profile_picture} alt="Profile" />
            ) : (
              <div className="fr-avatar-placeholder-large">{initials}</div>
            )}
          </div>

          <div className="fr-preview-basic">
            <h3>{basic.full_name || "Unnamed Freelancer"}</h3>
            <p>{professional?.categories || "No category added"}</p>
            <p className="fr-small">{basic.location || "Not specified"}</p>
          </div>
        </div>

        {/* BASIC INFORMATION */}
        <div className="fr-section">
          <h4 className="fr-section-title">Basic Info</h4>
          <div className="fr-info-row"><span>Phone:</span> {basic.phone_number || "N/A"}</div>
          <div className="fr-info-row"><span>Location:</span> {basic.location || "N/A"}</div>
          <div className="fr-info-row"><span>Languages:</span> {Array.isArray(basic.languages_known) ? basic.languages_known.join(", ") : "N/A"}</div>
        </div>

        {/* PROFESSIONAL DETAILS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Professional Details</h4>
          <div className="fr-info-row"><span>Expertise:</span> {professional.expertise || "N/A"}</div>
          <div className="fr-info-row"><span>Experience:</span> {professional.experience || "N/A"}</div>
          <div className="fr-info-row"><span>Bio:</span> {professional.bio || "No bio added"}</div>
        </div>

        {/* EDUCATION */}
        <div className="fr-section">
          <h4 className="fr-section-title">Education</h4>
          {education.length === 0 ? (
            <p className="fr-empty">No education added</p>
          ) : (
            education.map((edu, i) => (
              <div key={i} className="fr-edu-item">
                <strong>{edu.degree}</strong>
                <p>{edu.institution}</p>
                <span>{edu.start_year} - {edu.end_year}</span>
              </div>
            ))
          )}
        </div>

        {/* AVAILABILITY */}
        <div className="fr-section">
          <h4 className="fr-section-title">Availability</h4>
          {availability ? (
            <>
              <div className="fr-info-row"><span>Status:</span> {availability.is_available ? "Available" : "Occupied"}</div>
              <div className="fr-info-row"><span>From:</span> {availability.available_from || "N/A"}</div>
              <div className="fr-info-row"><span>To:</span> {availability.available_to || "N/A"}</div>
              <div className="fr-info-row"><span>Timezone:</span> {availability.time_zone || "N/A"}</div>
              <div className="fr-info-row"><span>Days:</span> {Array.isArray(availability.available_days) ? availability.available_days.join(", ") : "No days selected"}</div>
            </>
          ) : (
            <p className="fr-empty">No availability added</p>
          )}
        </div>

        {/* PAYMENT METHODS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Payment Methods</h4>
          {payments.length === 0 ? (
            <p className="fr-empty">No payment methods added</p>
          ) : (
            payments.map(p => (
              <div key={p.id} className="fr-info-row">
                <span>{p.payment_type}:</span>
                {p.payment_type === "UPI" ? p.upi_id : `${p.account_number} (${p.bank_name})`}
              </div>
            ))
          )}
        </div>

        {/* SOCIAL LINKS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Social Links</h4>
          <div className="fr-info-row"><span>LinkedIn:</span> {social.linkedin_url || "N/A"}</div>
          <div className="fr-info-row"><span>GitHub:</span> {social.github_url || "N/A"}</div>
          <div className="fr-info-row"><span>Portfolio:</span> {social.portfolio_url || "N/A"}</div>
        </div>

        {/* RATINGS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Ratings</h4>
          {ratings.length === 0 ? (
            <p className="fr-empty">No ratings yet</p>
          ) : ratings.map((r, i) => (
            <div key={i} className="fr-rating-item">
              <div>{"★".repeat(r.stars)}</div>
              {r.comment && <p>{r.comment}</p>}
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="fr-actions">
          <button
            className="fr-btn fr-btn-primary"
            disabled={basic.is_published}
            onClick={publishProfile}
          >
            {basic.is_published ? "Profile Already Published" : "Publish Profile"}
          </button>

          {/* DELETE BUTTON ADDED HERE */}
          <button
            className="fr-btn fr-btn-danger"
            onClick={deleteFreelancerProfile}
          >
            Delete Freelancer Profile
          </button>
        </div>

      </div>
    </div>
  );
}
