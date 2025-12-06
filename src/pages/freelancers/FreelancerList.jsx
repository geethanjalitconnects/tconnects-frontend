import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./FreelancerList.css";
import { useNavigate } from "react-router-dom";

export default function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        const res = await api.get("/api/profiles/freelancers/");
        setFreelancers(res.data);
      } catch (err) {
        console.error("Error loading freelancers:", err);
      }
    };
    loadFreelancers();
  }, []);

  return (
    <div className="fl-page">

      {/* ================= HERO SECTION ================= */}
      <section className="fl-hero">
        <h1 className="fl-hero-title">Find Top Freelancers</h1>
        <p className="fl-hero-subtitle">
          Browse skilled professionals ready to work on your next project.
        </p>
      </section>

      {/* ================= LIST SECTION ================= */}
      <div className="fl-grid">
        {freelancers.length === 0 ? (
          <p>No freelancers available.</p>
        ) : (
          freelancers.map((f) => (
            <div key={f.id} className="fl-card">
              {/* PROFILE IMAGE */}
              <div className="fl-img-container">
                {f.profile_picture ? (
                  <img src={f.profile_picture} alt="Freelancer" />
                ) : (
                  <div className="fl-placeholder">
                    {f.full_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <h3 className="fl-name">{f.full_name || "Unnamed Freelancer"}</h3>

              <p className="fl-expertise">
                {f.professional?.expertise || "Freelancer"}
              </p>

              <p className="fl-location">
                {f.location || "Location Not Provided"}
              </p>

              {/* LANGUAGES */}
              <div className="fl-skills">
                {Array.isArray(f.languages_known) &&
                f.languages_known.length > 0 ? (
                  f.languages_known.slice(0, 3).map((lang, i) => (
                    <span key={i} className="fl-skill">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="fl-skill">Languages Not Provided</span>
                )}
              </div>

              {/* VIEW PROFILE NAVIGATION */}
              <button
                className="fl-view-btn"
                onClick={() => navigate(`/freelancers/${f.id}`)}
              >
                View Profile
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
