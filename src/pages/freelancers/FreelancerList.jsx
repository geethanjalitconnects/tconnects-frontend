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
        console.log("Freelancers loaded:", res.data);
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
        <h1>Browse skilled professionals available for work.</h1>
      </div>

      <div className="fl-grid">
        {freelancers.map((item) => {
          const basic = item.basic || {};
          const professional = item.professional || {};
          const availability = item.availability || {};

          const fullName = basic.full_name || "Unnamed Freelancer";
          const expertise = professional.expertise || "Not Provided";
          const location = basic.location || "Not Provided";
          
          // Handle languages - it's a JSON array
          const languages = Array.isArray(basic.languages_known) 
            ? basic.languages_known 
            : [];

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
            badge = <p className="badge-available">Available for Work</p>;
          } else if (availability?.is_occupied) {
            badge = <p className="badge-occupied">Currently Occupied</p>;
          }

          return (
            <div key={item.id} className="fl-card">
              {avatar}

              <h3 className="fl-name">{fullName}</h3>
              <p className="fl-expertise">{expertise}</p>

              {badge}

              <p className="fl-location">{location}</p>

              {/* Languages */}
              <div className="fl-skills">
                {languages.length > 0 ? (
                  languages.map((lang, i) => (
                    <span key={i} className="fl-skill">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="fl-skill">No languages listed</span>
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