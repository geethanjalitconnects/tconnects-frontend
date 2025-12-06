import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";

export default function FreelancerProfilePreview() {
  const [data, setData] = useState({
    basic: null,
    professional: null,
    education: [],
    availability: null,
    payments: [],
    social: null,
    ratings: [],
    badges: []
  });

  const [loading, setLoading] = useState(true);

  // ======================================================
  // 1️⃣ LOAD FULL PROFILE PREVIEW FROM BACKEND
  // ======================================================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/api/profiles/freelancer/profile-preview/");
        setData({
          basic: res.data.basic || null,
          professional: res.data.professional || null,
          education: Array.isArray(res.data.education) ? res.data.education : [],
          availability: res.data.availability || null,
          payments: Array.isArray(res.data.payments) ? res.data.payments : [],
          social: res.data.social || null,
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

  // ======================================================
  // 2️⃣ PUBLISH PROFILE
  // ======================================================
  const publishProfile = async () => {
    try {
      await api.post("/api/profiles/freelancer/publish/");
      toast.success("Your profile is now published!");

      // Update UI
      setData((prev) => ({
        ...prev,
        basic: { ...prev.basic, is_published: true }
      }));
    } catch (error) {
      toast.error("Failed to publish profile.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!data.basic) return <p>No profile data found.</p>;

  const basic = data.basic;
  const professional = data.professional;
  const availability = data.availability;
  const social = data.social;

  return (
    <div className="fr-page">
      <div className="fr-card">

        {/* HEADER */}
        <h2 className="fr-title">Profile Preview</h2>

        <div className="fr-preview-header">
          <div className="fr-preview-img">
            {basic.profile_picture ? (
              <img src={basic.profile_picture} alt="Profile" />
            ) : (
              <div className="fr-avatar-placeholder-large">
                {basic.full_name
                  ?.split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="fr-preview-basic">
            <h3>{basic.full_name}</h3>
            <p>{professional?.categories || "No category added"}</p>
            <p className="fr-small">{basic.location}</p>
          </div>
        </div>

        {/* BASIC INFORMATION */}
        <div className="fr-section">
          <h4 className="fr-section-title">Basic Info</h4>
          <div className="fr-info-row"><span>Phone:</span> {basic.phone_number}</div>
          <div className="fr-info-row"><span>Location:</span> {basic.location}</div>
          <div className="fr-info-row"><span>Languages:</span> {basic.languages_known?.join(", ")}</div>
        </div>

        {/* PROFESSIONAL DETAILS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Professional Details</h4>
          <div className="fr-info-row"><span>Expertise:</span> {professional?.expertise}</div>
          <div className="fr-info-row"><span>Experience:</span> {professional?.experience}</div>
          <div className="fr-info-row"><span>Bio:</span> {professional?.bio}</div>
        </div>

        {/* EDUCATION */}
        <div className="fr-section">
          <h4 className="fr-section-title">Education</h4>
          {data.education.length === 0 ? (
            <p className="fr-empty">No education added</p>
          ) : (
            data.education.map((edu, i) => (
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
              <div className="fr-info-row"><span>From:</span> {availability.available_from}</div>
              <div className="fr-info-row"><span>To:</span> {availability.available_to}</div>
              <div className="fr-info-row"><span>Timezone:</span> {availability.time_zone}</div>
              <div className="fr-info-row"><span>Days:</span> {availability.available_days?.join(", ")}</div>
            </>
          ) : (
            <p className="fr-empty">No availability added</p>
          )}
        </div>

        {/* PAYMENT */}
        <div className="fr-section">
          <h4 className="fr-section-title">Payment Methods</h4>
          {data.payments.length === 0 ? (
            <p className="fr-empty">No payment methods added</p>
          ) : (
            data.payments.map((p) => (
              <div key={p.id} className="fr-info-row">
                <span>{p.payment_type}:</span>
                {p.payment_type === "UPI" ? p.upi_id : p.account_number}
              </div>
            ))
          )}
        </div>

        {/* SOCIAL LINKS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Social Links</h4>
          <div className="fr-info-row"><span>LinkedIn:</span> {social?.linkedin_url}</div>
          <div className="fr-info-row"><span>GitHub:</span> {social?.github_url}</div>
          <div className="fr-info-row"><span>Portfolio:</span> {social?.portfolio_url}</div>
        </div>

        {/* RATINGS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Ratings</h4>
          {data.ratings.length === 0 ? (
            <p className="fr-empty">No ratings yet</p>
          ) : (
            data.ratings.map((r, i) => (
              <div key={i} className="fr-rating-item">
                <div>{"★".repeat(r.stars)}</div>
                {r.comment && <p>{r.comment}</p>}
              </div>
            ))
          )}
        </div>

        {/* PUBLISH BUTTON */}
        <div className="fr-actions">
          <button
            className="fr-btn fr-btn-primary"
            disabled={basic.is_published}
            onClick={publishProfile}
          >
            {basic.is_published ? "Profile Already Published" : "Publish Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
