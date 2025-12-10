// src/pages/freelancers/FreelancerList.jsx
import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./FreelancerList.css";
import { useNavigate } from "react-router-dom";

export default function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/profiles/freelancers/");
        const arr = Array.isArray(res.data) ? res.data : [];

        const normalized = arr.map((f) => {
          const basic = f.basic || {};
          const professional = f.professional || {};

          // Normalise languages into array
          const langsRaw = basic.languages_known || "";
          let langs = [];
          if (Array.isArray(langsRaw)) langs = langsRaw;
          else if (typeof langsRaw === "string")
            langs = langsRaw.split(",").map((s) => s.trim()).filter(Boolean);

          // Correct ID to route to profile — use user id from basic.user
          const id = basic.user || basic.id || f.id;

          return {
            id,
            full_name: basic.full_name || "Unnamed Freelancer",
            location: basic.location || "Location Not Provided",
            profile_picture: basic.profile_picture || null,
            languages: langs,
            expertise: professional.expertise || professional.categories || "Freelancer",
          };
        });

        setFreelancers(normalized);
      } catch (err) {
        console.error("FreelancerList load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <div className="fl-loading">Loading freelancers...</div>;

  return (
    <div className="fl-container">
      <h2 className="fl-heading">Freelancers</h2>

      <div className="fl-grid">
        {freelancers.map((f) => (
          <article key={f.id || Math.random()} className="fl-card">
            <div className="fl-avatar">
              {f.profile_picture ? (
                <img src={f.profile_picture} alt={f.full_name} />
              ) : (
                <div className="fl-placeholder">{(f.full_name || "U").charAt(0)}</div>
              )}
            </div>

            <div className="fl-body">
              <h3 className="fl-name">{f.full_name}</h3>
              <div className="fl-expertise">{f.expertise}</div>
              <div className="fl-location">{f.location}</div>
              <div className="fl-lang-list">
                {f.languages.length > 0 ? (
                  f.languages.slice(0, 4).map((l, i) => (
                    <span className="fl-tag" key={i}>{l}</span>
                  ))
                ) : (
                  <span className="fl-tag">Languages Not Provided</span>
                )}
              </div>
            </div>

            <div className="fl-actions">
              <button className="fl-view-btn" onClick={() => navigate(`/freelancers/${f.id}`)}>
                View Profile
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
