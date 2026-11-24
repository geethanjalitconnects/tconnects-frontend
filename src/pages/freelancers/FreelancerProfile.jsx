import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./FreelancerList.css";

export default function FreelancerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        console.log("Loading profile ID:", id);
        const res = await api.get(`/api/profiles/freelancers/${id}/`);
        console.log("=== PROFILE DATA DEBUG ===");
        console.log("Full response:", JSON.stringify(res.data, null, 2));
        console.log("Response keys:", Object.keys(res.data));
        console.log("Basic object:", res.data.basic);
        if (res.data.basic) {
          console.log("Basic keys:", Object.keys(res.data.basic));
          console.log("full_name:", res.data.basic.full_name);
          console.log("name:", res.data.basic.name);
          console.log("user:", res.data.basic.user);
        }
        setData(res.data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  // Helper function to extract name from various possible locations
  const getName = (profileData) => {
    if (!profileData) return "Unnamed Freelancer";
    
    const basic = profileData.basic || {};
    const professional = profileData.professional || {};
    const user = profileData.user || {};
    
    // Try all possible locations for the name
    const possibleNames = [
      basic.full_name,
      basic.name,
      basic.user?.full_name,
      basic.user?.name,
      user.full_name,
      user.name,
      profileData.full_name,
      profileData.name,
      professional.full_name,
      professional.name,
      basic.first_name && basic.last_name ? `${basic.first_name} ${basic.last_name}` : null
    ];
    
    const foundName = possibleNames.find(name => name && name.trim() !== "");
    
    console.log("getName checked locations:", possibleNames);
    console.log("getName result:", foundName || "NOT FOUND");
    
    return foundName || "Unnamed Freelancer";
  };

  // Helper function to parse languages
  const parseLanguages = (languages) => {
    if (!languages) return [];
    
    if (Array.isArray(languages)) {
      return languages;
    }
    
    if (typeof languages === 'string') {
      try {
        const parsed = JSON.parse(languages);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return languages.split(',').map(lang => lang.trim()).filter(Boolean);
      }
    }
    
    return [];
  };

  // Helper function to parse JSON arrays
  const parseArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    
    return [];
  };

  if (loading) {
    return (
      <div className="fl-page">
        <div className="fl-hero">
          <h1>Loading profile...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fl-page">
        <div className="fl-hero" style={{ background: '#dc3545' }}>
          <h1>⚠️ Profile Not Found</h1>
          <p>{error}</p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => navigate('/freelancers')}
            className="fl-hire-btn"
            style={{ maxWidth: '300px', margin: '0 auto' }}
          >
            ← Back to Freelancers
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fl-page">
        <div className="fl-hero">
          <h1>No data available</h1>
        </div>
      </div>
    );
  }

  const { basic, professional, availability, education, social, payment_types } = data;

  // Safe data extraction with comprehensive name search
  const fullName = getName(data);
  const expertise = professional?.expertise || professional?.category || professional?.categories || "Freelancer";
  const bio = professional?.bio || "No bio provided.";
  const location = basic?.location || "Location Not Provided";
  const phoneNumber = basic?.phone_number || basic?.phone || "Not Provided";
  
  // Parse languages properly
  const languages = parseLanguages(basic?.languages_known);

  // Parse available days
  const availableDays = parseArray(availability?.available_days);

  // Parse payment types
  const paymentMethods = parseArray(payment_types);

  // Availability badge
  const isAvailable = availability?.is_available;
  const statusBadge = isAvailable
    ? { text: "Available for Work", class: "fl-available" }
    : { text: "Currently Occupied", class: "fl-occupied" };

  return (
    <div className="fl-page">
      {/* HERO */}
      <div className="fl-hero">
        <h1>{fullName}</h1>
        <p>{expertise}</p>
      </div>

      {/* PROFILE HEADER */}
      <div className="fl-profile-header">
        <div className="fl-profile-img">
          {basic?.profile_picture ? (
            <img src={basic.profile_picture} alt={fullName} />
          ) : (
            <div className="fl-placeholder-lg">
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="fl-profile-main">
          <h2 className="fl-profile-name">{fullName}</h2>
          <p className="fl-profile-expertise">{expertise}</p>
          
          <span className={`fl-badge ${statusBadge.class}`}>
            {statusBadge.text}
          </span>

          <p className="fl-profile-location">📍 {location}</p>

          {/* Languages */}
          {languages.length > 0 && (
            <div className="fl-skills" style={{ marginTop: '12px' }}>
              {languages.map((lang, idx) => (
                <span key={idx} className="fl-skill">{lang}</span>
              ))}
            </div>
          )}

          <button className="fl-hire-btn" onClick={() => alert('Contact functionality coming soon!')}>
            💼 Hire Me
          </button>
        </div>
      </div>

      {/* ABOUT */}
      <div className="fl-section">
        <h3 className="fl-section-title">About</h3>
        <p className="fl-paragraph">{bio}</p>
      </div>

      {/* CONTACT INFO */}
      <div className="fl-section">
        <h3 className="fl-section-title">Contact Information</h3>
        <div className="fl-paragraph">
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Phone:</strong> {phoneNumber}</p>
          {languages.length > 0 && (
            <p><strong>Languages:</strong> {languages.join(", ")}</p>
          )}
        </div>
      </div>

      {/* EDUCATION */}
      {education && education.length > 0 && (
        <div className="fl-section">
          <h3 className="fl-section-title">Education</h3>
          {education.map((edu) => (
            <div key={edu.id} className="fl-edu-item">
              <strong>{edu.degree}</strong> — {edu.institution}
              <div className="fl-edu-year">
                {edu.start_year} - {edu.end_year || "Present"}
              </div>
              {edu.description && <p className="fl-paragraph">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* AVAILABILITY */}
      {availability && (
        <div className="fl-section">
          <h3 className="fl-section-title">Availability</h3>
          <div className="fl-paragraph">
            <p><strong>Status:</strong> {statusBadge.text}</p>
            {availability.time_zone && (
              <p><strong>Timezone:</strong> {availability.time_zone}</p>
            )}
            {availability.available_from && (
              <p><strong>Available From:</strong> {availability.available_from}</p>
            )}
            {availability.available_to && (
              <p><strong>Available To:</strong> {availability.available_to}</p>
            )}
            {availableDays.length > 0 && (
              <p><strong>Working Days:</strong> {availableDays.join(", ")}</p>
            )}
          </div>
        </div>
      )}

      {/* SOCIAL LINKS */}
      {social && (social.linkedin_url || social.github_url || social.portfolio_url) && (
        <div className="fl-section">
          <h3 className="fl-section-title">Social Links</h3>
          <div className="fl-social-links">
            {social.linkedin_url && (
              <a href={social.linkedin_url} target="_blank" rel="noopener noreferrer">
                🔗 LinkedIn
              </a>
            )}
            {social.github_url && (
              <a href={social.github_url} target="_blank" rel="noopener noreferrer">
                💻 GitHub
              </a>
            )}
            {social.portfolio_url && (
              <a href={social.portfolio_url} target="_blank" rel="noopener noreferrer">
                🌐 Portfolio
              </a>
            )}
          </div>
        </div>
      )}

      {/* PAYMENT METHODS */}
      {paymentMethods.length > 0 && (
        <div className="fl-section">
          <h3 className="fl-section-title">Accepted Payment Methods</h3>
          <div className="fl-skills">
            {paymentMethods.map((type, idx) => (
              <span key={idx} className="fl-skill">
                {type === 'upi' ? '💳 UPI' : 
                 type === 'bank_transfer' ? '🏦 Bank Transfer' : 
                 type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <button 
          onClick={() => navigate('/freelancers')}
          className="fl-view-btn"
          style={{ maxWidth: '300px', margin: '0 auto' }}
        >
          ← Back to All Freelancers
        </button>
      </div>
    </div>
  );
}