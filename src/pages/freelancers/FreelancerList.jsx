import React, { useEffect, useState } from "react";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./FreelancerList.css";

export default function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        const res = await api.get("/api/profiles/freelancers/");
        setFreelancers(res.data || []);
      } catch (error) {
        toast.error("Unable to load freelancers.");
      }
    };
    loadFreelancers();
  }, []);

  return (
    <div className="fl-page">
      <div className="fl-hero">
        <h1>Find Top Freelancers</h1>
        <p>Browse skilled professionals available for work.</p>
      </div>

      <div className="fl-grid">
        {freelancers.map((f, index) => {
          const basic = f.basic || {};
          const pro = f.professional || {};
          const availability = f.availability || {};

          const fullName = basic.full_name?.trim() || "Unnamed Freelancer";
          const firstLetter = fullName.charAt(0).toUpperCase();

          const profilePic = basic.profile_picture || null;
          const expertise = pro.expertise || "Freelancer";
          const location = basic.location || "Location Not Provided";

          const languages = basic.languages_known
            ? basic.languages_known.split(",").map((l) => l.trim())
            : [];

          const isAvailable = availability.is_available === true;
          const isOccupied = availability.is_occupied === true;

          return (
            <div key={index} className="fl-card">

              {/* IMAGE */}
              <div className="fl-img-container">
                {profilePic ? (
                  <img src={profilePic} alt={fullName} />
                ) : (
                  <div className="fl-placeholder">{firstLetter}</div>
                )}
              </div>

              {/* NAME */}
              <h3 className="fl-name">{fullName}</h3>

              {/* EXPERTISE */}
              <p className="fl-expertise">{expertise}</p>

              {/* LOCATION */}
              <p className="fl-location">{location}</p>

              {/* AVAILABILITY BADGE */}
              <div className="fl-status-badge">
                {isAvailable && !isOccupied && (
                  <span className="badge-available">Available for Work</span>
                )}

                {isOccupied && (
                  <span className="badge-occupied">Currently Occupied</span>
                )}
              </div>

              {/* LANGUAGES */}
              <div className="fl-skills">
                {languages.length > 0 ? (
                  languages.map((lang, i) => (
                    <span key={i} className="fl-skill">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="fl-skill">Languages Not Provided</span>
                )}
              </div>

              {/* BUTTON */}
              <button
                className="fl-view-btn"
                onClick={() => navigate(`/freelancers/${f.id}`)}
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
