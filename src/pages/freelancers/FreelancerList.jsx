import React, { useEffect, useState } from "react";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";
import "./FreelancerList.css";

export default function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        const res = await api.get("/api/profiles/freelancers/");
        console.log("=== FREELANCERS DATA DEBUG ===");
        console.log("Total freelancers:", res.data.length);
        console.log("Full response:", res.data);
        
        // Debug first freelancer
        if (res.data.length > 0) {
          console.log("First freelancer:", res.data[0]);
          console.log("Basic data:", res.data[0].basic);
          console.log("Languages:", res.data[0].basic?.languages_known);
        }
        
        setFreelancers(res.data);
      } catch (error) {
        console.error("Error loading freelancers:", error);
        setError("Failed to load freelancers");
      } finally {
        setLoading(false);
      }
    };
    loadFreelancers();
  }, []);

  const handleViewProfile = (id) => {
    console.log("Navigating to profile:", id);
    navigate(`/freelancers/${id}`);
  };

  // Helper function to parse languages
  const parseLanguages = (languages) => {
    if (!languages) return [];
    
    // If it's already an array
    if (Array.isArray(languages)) {
      return languages;
    }
    
    // If it's a string that looks like JSON array
    if (typeof languages === 'string') {
      try {
        // Try parsing as JSON first
        const parsed = JSON.parse(languages);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // If not JSON, try splitting by comma
        return languages.split(',').map(lang => lang.trim()).filter(Boolean);
      }
    }
    
    return [];
  };

  if (loading) {
    return (
      <div className="fl-page">
        <div className="fl-hero">
          <h1>Loading freelancers...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fl-page">
        <div className="fl-hero">
          <h1>Error: {error}</h1>
        </div>
      </div>
    );
  }

  if (freelancers.length === 0) {
    return (
      <div className="fl-page">
        <div className="fl-hero">
          <h1>No freelancers available yet</h1>
          <p>Check back soon for talented professionals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fl-page">
      <div className="fl-hero">
        <h1>Browse Skilled Professionals</h1>
        <p>Find the perfect freelancer for your project</p>
      </div>

      <div className="fl-grid">
        {freelancers.map((item) => {
          const basic = item.basic || {};
          const professional = item.professional || {};
          const availability = item.availability || {};

          // Get full name with fallback
          const fullName = basic.full_name || basic.name || "Unnamed Freelancer";
          const expertise = professional.expertise || professional.category || "Not Provided";
          const location = basic.location || "Not Provided";
          
          // Parse languages properly
          const languages = parseLanguages(basic.languages_known);
          
          console.log(`Freelancer ${item.id}:`, {
            fullName,
            expertise,
            location,
            languages,
            rawLanguages: basic.languages_known
          });

          // Avatar
          const avatar = basic.profile_picture ? (
            <div className="fl-img-container">
              <img src={basic.profile_picture} alt={fullName} />
            </div>
          ) : (
            <div className="fl-placeholder">
              {fullName.charAt(0).toUpperCase()}
            </div>
          );

          // Availability Badge
          let badge = null;
          if (availability?.is_available) {
            badge = <span className="fl-badge fl-available">Available for Work</span>;
          } else if (availability?.is_occupied) {
            badge = <span className="fl-badge fl-occupied">Currently Occupied</span>;
          }

          return (
            <div key={item.id} className="fl-card">
              {avatar}

              <h3 className="fl-name">{fullName}</h3>
              <p className="fl-expertise">{expertise}</p>

              {badge}

              <p className="fl-location">📍 {location}</p>

              {/* Languages */}
              <div className="fl-skills">
                {languages.length > 0 ? (
                  languages.slice(0, 3).map((lang, i) => (
                    <span key={i} className="fl-skill">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="fl-skill">No languages listed</span>
                )}
                {languages.length > 3 && (
                  <span className="fl-skill">+{languages.length - 3} more</span>
                )}
              </div>

              <button
                className="fl-view-btn"
                onClick={() => handleViewProfile(item.id)}
              >
                View Profile
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}