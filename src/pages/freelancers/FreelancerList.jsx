import React, { useEffect, useState } from "react";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";
import "./FreelancerList.css";

export default function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        const res = await api.get("/api/profiles/freelancers/");
        setFreelancers(res.data);
      } catch (error) {
        console.error("Error loading freelancers:", error);
      }
    };
    loadFreelancers();
  }, []);

  const handleViewProfile = (id) => {
    navigate(`/freelancers/${id}`);
  };

  return (
    <div className="fl-container">
      <h2 className="fl-page-title">Browse skilled professionals available for work.</h2>

      <div className="fl-grid">
        {freelancers.map((item, index) => {
          const basic = item.basic || {};
          const professional = item.professional || {};
          const availability = item.availability || {};

          const fullName = basic.full_name || "Unnamed Freelancer";
          const location = basic.location || "Location Not Provided";
          const languages = basic.languages_known || null;
          const jobRole = professional.job_role || "Not Provided";

          // Avatar Logic (Letter OR Image)
          const avatar = basic.profile_picture ? (
            <img src={basic.profile_picture} alt={fullName} className="fl-avatar-img" />
          ) : (
            <div className="fl-avatar-letter">
              {fullName.charAt(0).toUpperCase()}
            </div>
          );

          // Availability Badge
          const showBadge = availability && (availability.is_available || availability.is_occupied);

          return (
            <div key={index} className="fl-card">
              
              {/* Avatar */}
              <div className="fl-avatar">{avatar}</div>

              {/* Name */}
              <h3 className="fl-name">{fullName}</h3>

              {/* Role */}
              <p className="fl-role">{jobRole}</p>

              {/* Availability Badge */}
              {showBadge && (
                <p
                  className={`fl-badge ${
                    availability.is_available ? "badge-available" : "badge-occupied"
                  }`}
                >
                  {availability.is_available ? "Available for Work" : "Currently Occupied"}
                </p>
              )}

              {/* Location */}
              <p className="fl-location">{location}</p>

              {/* Languages */}
              <div className="fl-lang-section">
                {languages ? (
                  languages.split(",").map((lang, i) => (
                    <span key={i} className="fl-lang-pill">
                      {lang.trim()}
                    </span>
                  ))
                ) : (
                  <span className="fl-lang-pill">Languages Not Provided</span>
                )}
              </div>

              {/* View Profile Button */}
              <button
                className="fl-btn"
                onClick={() => handleViewProfile(basic.id)}
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
