// FreelancerList.jsx - v3 (teal hero, premium cards, search). If you do not see this line at the top of your file, the old file is still in place.
import React, { useEffect, useMemo, useState } from "react";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";
import "./FreelancerList.css";

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */
// The name can live in several places depending on the API response
const getName = (item) => {
  const basic = item.basic || {};
  const professional = item.professional || {};
  const user = item.user || {};

  const possibleNames = [
    basic.full_name,
    basic.name,
    basic.user?.full_name,
    basic.user?.name,
    user.full_name,
    user.name,
    item.full_name,
    item.name,
    professional.full_name,
    professional.name,
  ];

  const foundName = possibleNames.find((name) => name && String(name).trim() !== "");
  return foundName ? String(foundName).trim() : "Unnamed Freelancer";
};

// Languages can arrive as an array, a JSON string, or "English, Tamil"
const parseLanguages = (languages) => {
  if (!languages) return [];
  if (Array.isArray(languages)) return languages;

  if (typeof languages === "string") {
    try {
      const parsed = JSON.parse(languages);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return languages.split(",").map((lang) => lang.trim()).filter(Boolean);
    }
  }

  return [];
};

const asText = (v) => (Array.isArray(v) ? v.filter(Boolean).join(", ") : v || "");

/* ---------- icons ---------- */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.6a3.5 3.5 0 010 6.8" /><path d="M18.5 14.4c1.8.8 3 2.6 3 5.6" /></svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5" /><path d="M12 16.2v.1" /></svg>
);

export default function FreelancerList() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadFreelancers = async () => {
      try {
        const res = await api.get("/api/profiles/freelancers/");
        setFreelancers(Array.isArray(res.data) ? res.data : res.data?.results || []);
      } catch (err) {
        console.error("Error loading freelancers:", err);
        setError("Failed to load freelancers");
      } finally {
        setLoading(false);
      }
    };
    loadFreelancers();
  }, []);

  const handleViewProfile = (id) => {
    navigate(`/freelancers/${id}`);
  };

  // One tidy object per freelancer, so the card below stays simple
  const cards = useMemo(
    () =>
      freelancers.map((item) => {
        const basic = item.basic || {};
        const professional = item.professional || {};
        const availability = item.availability || {};

        return {
          id: item.id,
          fullName: getName(item),
          expertise:
            asText(professional.expertise) ||
            asText(professional.category) ||
            asText(professional.categories) ||
            "Freelancer",
          location: basic.location || "",
          languages: parseLanguages(basic.languages_known),
          picture: basic.profile_picture || "",
          status: availability.is_available ? "available" : availability.is_occupied ? "occupied" : null,
        };
      }),
    [freelancers]
  );

  const q = query.trim().toLowerCase();
  const visible = q
    ? cards.filter((c) =>
        [c.fullName, c.expertise, c.location, ...c.languages].join(" ").toLowerCase().includes(q)
      )
    : cards;
  const availableCount = cards.filter((c) => c.status === "available").length;

  return (
    <div className="fl-page">
      {/* HERO: title and live search on the teal gradient panel */}
      <section className="fl-hero">
        <h1 className="fl-h1">Browse Skilled Professionals</h1>
        <p className="fl-subtitle">Find the perfect freelancer for your project</p>

        <div className="fl-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name, skill, location or language..."
            aria-label="Search freelancers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {!loading && !error && cards.length > 0 && (
          <div className="fl-count-row">
            <p className="fl-count" aria-live="polite">
              Showing {visible.length} of {cards.length} professionals
            </p>
            <div className="fl-count-right">
              {availableCount > 0 && (
                <span className="fl-live"><i />{availableCount} available for work</span>
              )}
              {query && (
                <button type="button" className="fl-clear" onClick={() => setQuery("")}>
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {loading && <p className="fl-state">Loading freelancers…</p>}

      {!loading && error && (
        <div className="fl-empty is-error">
          <div className="fl-empty-icon"><AlertIcon /></div>
          <h2>Something went wrong</h2>
          <p>{error}. Please refresh the page and try again.</p>
        </div>
      )}

      {!loading && !error && cards.length === 0 && (
        <div className="fl-empty">
          <div className="fl-empty-icon"><UsersIcon /></div>
          <h2>No freelancers available yet</h2>
          <p>Check back soon for talented professionals!</p>
        </div>
      )}

      {!loading && !error && cards.length > 0 && visible.length === 0 && (
        <div className="fl-empty">
          <div className="fl-empty-icon"><SearchIcon /></div>
          <h2>No matches found</h2>
          <p>Try a different name, skill, location or language.</p>
          <button type="button" className="fl-btn" onClick={() => setQuery("")}>Clear search</button>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="fl-grid">
          {visible.map((c) => (
            <article key={c.id} className="fl-card">
              <div className="fl-banner" aria-hidden="true" />

              {c.status && (
                <span className={`fl-badge fl-${c.status}`}>
                  <i />
                  {c.status === "available" ? "Available for Work" : "Currently Occupied"}
                </span>
              )}

              <div className="fl-avatar">
                {c.picture ? (
                  <img src={c.picture} alt={c.fullName} />
                ) : (
                  <span>{c.fullName.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <h2 className="fl-name">{c.fullName}</h2>
              <p className="fl-expertise">{c.expertise}</p>

              {c.location && (
                <p className="fl-location"><PinIcon />{c.location}</p>
              )}

              {c.languages.length > 0 && (
                <div className="fl-skills">
                  {c.languages.slice(0, 3).map((lang, i) => (
                    <span key={i} className="fl-skill">{lang}</span>
                  ))}
                  {c.languages.length > 3 && (
                    <span className="fl-skill fl-more">+{c.languages.length - 3} more</span>
                  )}
                </div>
              )}

              <div className="fl-card-foot">
                <button type="button" className="fl-view-btn" onClick={() => handleViewProfile(c.id)}>
                  View Profile<i><ArrowIcon /></i>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}