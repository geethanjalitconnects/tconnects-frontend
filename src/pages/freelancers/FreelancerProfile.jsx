// src/pages/freelancers/FreelancerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import "./FreelancerList.css";

export default function FreelancerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        console.log("=== FREELANCER PROFILE DEBUG ===");
        console.log("Loading profile with ID:", id);
        console.log("Full API URL:", `/api/profiles/freelancers/${id}/`);
        
        const res = await api.get(`/api/profiles/freelancers/${id}/`);
        
        console.log("✅ Profile loaded successfully!");
        console.log("Profile data received:", res.data);
        setData(res.data);
      } catch (err) {
        console.error("❌ Error loading profile:", err);
        console.error("Error response:", err.response);
        console.error("Error data:", err.response?.data);
        console.error("Status code:", err.response?.status);
        
        let errorMessage = "Failed to load profile";
        
        if (err.response?.status === 404) {
          errorMessage = "Profile not found. This profile may not be published yet.";
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="fl-profile-page">
        <p className="loading">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fl-profile-page">
        <div className="fl-card" style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: '#fff3cd',
          border: '2px solid #ffc107'
        }}>
          <h2 style={{ color: '#856404', marginBottom: '1rem' }}>⚠️ Profile Not Found</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</p>
          <p style={{ color: '#666' }}>
            This profile may not be published yet or the ID is incorrect.
          </p>
          <button 
            onClick={() => window.location.href = '/freelancers'}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 2rem',
              background: '#14b8a6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Back to Freelancers List
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fl-profile-page">
        <div className="fl-card">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  const { basic, professional, availability, education, social } = data;

  // Safe data extraction with fallbacks
  const fullName = basic?.full_name || "Unnamed Freelancer";
  const expertise = professional?.expertise || "Freelancer";
  const bio = professional?.bio || "No bio provided.";
  const location = basic?.location || "Location Not Provided";
  
  // Handle languages - it's a JSON array from backend
  const languages = Array.isArray(basic?.languages_known) 
    ? basic.languages_known 
    : [];

  // Badge logic
  const isAvailable = availability?.is_available;
  const statusBadge = isAvailable
    ? { text: "Available for Work", class: "fl-available" }
    : { text: "Currently Occupied", class: "fl-occupied" };

  return (
    <div className="fl-profile-page">
      {/* ================= PROFILE HEADER ================= */}
      <div className="fl-card fl-profile-header">
        {/* Avatar */}
        <div className="fl-profile-photo">
          {basic?.profile_picture ? (
            <img src={basic.profile_picture} alt={fullName} />
          ) : (
            <div className="fl-avatar-placeholder">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="fl-profile-info">
          <h2 className="fl-name">{fullName}</h2>
          <p className="fl-expertise">{expertise}</p>
          
          <span className={`fl-badge ${statusBadge.class}`}>
            {statusBadge.text}
          </span>

          <p className="fl-location">{location}</p>

          {/* Languages */}
          {languages.length > 0 && (
            <div className="fl-lang-row">
              {languages.map((lang, idx) => (
                <span key={idx} className="fl-lang-pill">
                  {lang}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="fl-card fl-section">
        <h3>About</h3>
        <p>{bio}</p>
      </div>

      {/* ================= EDUCATION ================= */}
      <div className="fl-card fl-section">
        <h3>Education</h3>
        {!education || education.length === 0 ? (
          <p>No education details.</p>
        ) : (
          education.map((edu) => (
            <div key={edu.id} className="fl-edu-item">
              <strong>{edu.degree}</strong> — {edu.institution}
              <div className="fl-edu-year">
                {edu.start_year} - {edu.end_year || "Present"}
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
        {availability?.time_zone && (
          <p><strong>Timezone:</strong> {availability.time_zone}</p>
        )}
        {availability?.available_days && availability.available_days.length > 0 && (
          <p><strong>Working Days:</strong> {availability.available_days.join(", ")}</p>
        )}
      </div>

      {/* ================= SOCIAL LINKS ================= */}
      {social && (social.linkedin_url || social.github_url || social.portfolio_url) && (
        <div className="fl-card fl-section">
          <h3>Social Links</h3>
          <div className="fl-social">
            {social.linkedin_url && (
              <a href={social.linkedin_url} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {social.github_url && (
              <a href={social.github_url} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {social.portfolio_url && (
              <a href={social.portfolio_url} target="_blank" rel="noopener noreferrer">
                Portfolio
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}