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
        console.log("Freelancers data:", res.data); // Debug log
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

  const handleViewProfile = (freelancer) => {
    // Log the entire object to debug
    console.log("Full freelancer object:", freelancer);
    
    // Try multiple possible ID locations
    const profileId = 
      freelancer.id || 
      freelancer.user_id || 
      freelancer.profile_id ||
      freelancer.user ||
      (freelancer.basic && freelancer.basic.id) ||
      (freelancer.basic && freelancer.basic.user_id);
    
    console.log("Found ID:", profileId);
    console.log("ID type:", typeof profileId);
    
    if (profileId) {
      console.log("Navigating to:", `/freelancers/${profileId}`);
      navigate(`/freelancers/${profileId}`);
    } else {
      console.error("No valid ID found!");
      console.error("Available keys:", Object.keys(freelancer));
      if (freelancer.basic) {
        console.error("Basic keys:", Object.keys(freelancer.basic));
      }
      alert("Unable to view profile - missing ID. Check console for details.");
    }
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
          <h1>No freelancers available</h1>
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
        {freelancers.map((item, index) => {
          const basic = item.basic || {};
          const professional = item.professional || {};
          const availability = item.availability || {};

          const fullName = basic.full_name || "Unnamed Freelancer";
          const expertise = professional.job_role || professional.expertise || "Not Provided";
          const location = basic.location || "Not Provided";
          const languages = basic.languages_known || "";

          // Avatar logic
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
          if (availability.is_available) {
            badge = <p className="badge-available">Available for Work</p>;
          } else if (availability.is_occupied) {
            badge = <p className="badge-occupied">Currently Occupied</p>;
          }

          return (
            <div key={item.id || item.user_id || index} className="fl-card">
              {avatar}

              <h3 className="fl-name">{fullName}</h3>

              <p className="fl-expertise">{expertise}</p>

              {badge}

              <p className="fl-location">{location}</p>

              {/* Languages */}
              <div className="fl-skills">
                {languages
                  ? languages.split(",").map((lang, i) => (
                      <span key={i} className="fl-skill">
                        {lang.trim()}
                      </span>
                    ))
                  : <span className="fl-skill">Languages Not Provided</span>}
              </div>

              <button
                className="fl-view-btn"
                onClick={() => handleViewProfile(item)}
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