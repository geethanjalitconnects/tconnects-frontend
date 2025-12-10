import React, { useEffect, useState } from "react";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./FreelancerList.css";

/**
 * Defensive / normalized FreelancerList
 * - Logs raw API response (check browser console: "LOADED FREELANCERS")
 * - Tries multiple possible keys for basic/professional/availability
 * - Robust image fallback + placeholder letter
 * - Multiple availability formats supported
 */

function normalizeFreelancer(raw) {
  // Attempt to find basic/professional/availability under several keys
  const basic =
    raw.basic ||
    raw.basic_info ||
    raw.freelancer_basic ||
    raw.profile ||
    raw.user_profile ||
    {};

  const professional =
    raw.professional ||
    raw.professional_info ||
    raw.prof_details ||
    raw.prof ||
    {};

  const availability =
    raw.availability ||
    raw.avail ||
    raw.schedule ||
    raw.freelancer_availability ||
    {};

  // some APIs return languages as array or string
  let languages = [];
  if (basic.languages_known) {
    if (Array.isArray(basic.languages_known)) languages = basic.languages_known;
    else languages = String(basic.languages_known).split(",").map((s) => s.trim());
  }

  // Name detection
  const full_name =
    basic.full_name || basic.name || basic.fullName || raw.name || "Unnamed Freelancer";

  // Picture detection
  const profile_picture =
    basic.profile_picture || basic.avatar || basic.image || raw.profile_picture || null;

  // Expertise / role
  const expertise =
    professional.expertise ||
    professional.title ||
    professional.role ||
    basic.role ||
    "Freelancer";

  // location
  const location =
    basic.location || basic.city || basic.town || professional.location || "Location Not Provided";

  // availability normalization - try several formats
  const is_available =
    availability.is_available === true ||
    availability.available === true ||
    availability.status === "available" ||
    availability.status === "free";

  const is_occupied =
    availability.is_occupied === true ||
    availability.occupied === true ||
    availability.status === "occupied" ||
    availability.status === "busy";

  // final object
  return {
    id: raw.id ?? raw.user_id ?? raw.pk ?? null,
    full_name,
    profile_picture,
    expertise,
    location,
    languages,
    is_available,
    is_occupied,
    raw, // keep raw for inspection
  };
}

export default function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        const res = await api.get("/api/profiles/freelancers/");
        // log raw for debugging — check console for "LOADED FREELANCERS"
        console.log("LOADED FREELANCERS (raw response):", res.data);

        const arr = Array.isArray(res.data) ? res.data : res.data.results || [];
        const normalized = arr.map((r) => normalizeFreelancer(r));
        console.log("LOADED FREELANCERS (normalized):", normalized);
        setFreelancers(normalized);
      } catch (error) {
        console.error("Error loading freelancers:", error);
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
        {freelancers.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40 }}>
            No freelancers found.
          </div>
        )}

        {freelancers.map((f, index) => {
          const firstLetter = (f.full_name || "U").charAt(0).toUpperCase();

          // Build safe image URL — if your backend returns relative media URLs,
          // you might need to prefix with the backend base (e.g. process.env.VITE_API_BASE_URL)
          const imgSrc = f.profile_picture || "";

          // local state trick: we hide the <img> when it fails to load (so placeholder appears)
          return (
            <div key={index || f.id || index} className="fl-card">
              <div className="fl-img-container">
                {imgSrc ? (
                  <>
                    <img
                      src={imgSrc}
                      alt={f.full_name}
                      onError={(e) => {
                        // hide broken image so placeholder shows
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    {/* placeholder remains behind image — CSS should manage stacking */}
                    <div className="fl-placeholder">{firstLetter}</div>
                  </>
                ) : (
                  <div className="fl-placeholder">{firstLetter}</div>
                )}
              </div>

              <h3 className="fl-name">{f.full_name}</h3>

              <p className="fl-expertise">{f.expertise}</p>

              <p className="fl-location">{f.location}</p>

              <div className="fl-status-badge">
                {f.is_available && !f.is_occupied && (
                  <span className="badge-available">Available for Work</span>
                )}
                {f.is_occupied && <span className="badge-occupied">Currently Occupied</span>}
              </div>

              <div className="fl-skills">
                {f.languages && f.languages.length > 0 ? (
                  f.languages.map((lang, i) => (
                    <span key={i} className="fl-skill">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="fl-skill">Languages Not Provided</span>
                )}
              </div>

              <button
                className="fl-view-btn"
                onClick={() => {
                  // prefer id, fallback to index if null
                  const id = f.id ?? index;
                  navigate(`/freelancers/${id}`);
                }}
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
