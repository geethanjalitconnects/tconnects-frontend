import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./FreelancerList.css";

export default function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load published freelancers
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/profiles/freelancers/");
        setFreelancers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error loading freelancers:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading freelancers...</p>;

  return (
    <div className="fl-page">
      <h2 className="fl-title">Hire Top Freelancers</h2>

      <div className="fl-grid">
        {freelancers.map((f) => (
          <div key={f.id} className="fl-card">
            {/* Image */}
            <div className="fl-img-container">
              {f.profile_picture ? (
                <img src={f.profile_picture} alt="Profile" />
              ) : (
                <div className="fl-placeholder">
                  {f.full_name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name & Expertise */}
            <h3 className="fl-name">{f.full_name}</h3>
            <p className="fl-expertise">{f.expertise || "Freelancer"}</p>

            {/* Location */}
            <p className="fl-location">{f.location}</p>

            {/* Skills */}
            {f.skills && f.skills.length > 0 && (
              <div className="fl-skills">
                {f.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="fl-skill">{skill}</span>
                ))}
                {f.skills.length > 3 && (
                  <span className="fl-more">
                    +{f.skills.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Rating */}
            {f.rating && (
              <div className="fl-rating">
                {"★".repeat(Math.round(f.rating))}
                <span className="fl-rating-number">{f.rating.toFixed(1)}</span>
              </div>
            )}

            {/* View Profile */}
            <button
              className="fl-view-btn"
              onClick={() => (window.location.href = `/freelancers/${f.id}`)}

            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
