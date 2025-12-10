import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./FreelancerList.css";
import { useNavigate } from "react-router-dom";

export default function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await api.get("/api/profiles/freelancers/");

        const fixed = (res.data || []).map((f) => {
          const basic = f.basic || {};
          const professional = f.professional || {};

          // Normalize languages
          const langs = basic.languages_known || [];
          let langsArr = [];

          if (Array.isArray(langs)) langsArr = langs;
          else if (typeof langs === "string")
            langsArr = langs.split(",").map((l) => l.trim()).filter(Boolean);

          // FIXED: Correct user ID for profile routing
          const id = basic.user;  // The actual freelancer's user ID

          return {
            id,
            full_name: basic.full_name || "Unnamed Freelancer",
            profile_picture: basic.profile_picture || null,
            location: basic.location || "Location Not Provided",
            languages_known: langsArr,
            expertise: professional.expertise || "Freelancer",
          };
        });

        setFreelancers(fixed);
      } catch (error) {
        console.error("Error loading freelancers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="fl-container">
      <h2 className="fl-title">Freelancers</h2>

      <div className="fl-grid">
        {freelancers.map((f) => (
          <div key={f.id} className="fl-card">
            
            {/* Avatar */}
            <div className="fl-avatar">
              {f.profile_picture ? (
                <img src={f.profile_picture} alt={f.full_name} />
              ) : (
                <div className="fl-avatar-placeholder">
                  {f.full_name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="fl-name">{f.full_name}</h3>

            {/* Expertise */}
            <p className="fl-expertise">{f.expertise}</p>

            {/* Location */}
            <p className="fl-location">{f.location}</p>

            {/* Languages */}
            <div className="fl-languages">
              {f.languages_known.length > 0 ? (
                f.languages_known.slice(0, 3).map((lang, i) => (
                  <span key={i} className="fl-skill">
                    {lang}
                  </span>
                ))
              ) : (
                <span className="fl-skill">Languages Not Provided</span>
              )}
            </div>

            {/* Button */}
            <button
              className="fl-btn"
              onClick={() => navigate(`/freelancers/${f.id}`)}
            >
              View Profile
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}
