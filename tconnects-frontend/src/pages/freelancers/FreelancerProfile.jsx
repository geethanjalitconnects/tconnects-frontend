// FreelancerProfile.jsx - v3 (teal hero, two-column layout, premium cards). If you do not see this line at the top of your file, the old file is still in place.
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./FreelancerList.css";

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */
// The name can live in several places depending on the API response
const getName = (profileData) => {
  if (!profileData) return "Unnamed Freelancer";

  const basic = profileData.basic || {};
  const professional = profileData.professional || {};
  const user = profileData.user || {};

  const possibleNames = [
    basic.full_name,
    basic.name,
    basic.user?.full_name,
    basic.user?.name,
    user.full_name,
    user.name,
    profileData.full_name,
    profileData.name,
    professional.full_name,
    professional.name,
    basic.first_name && basic.last_name ? `${basic.first_name} ${basic.last_name}` : null,
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

// JSON arrays (working days, payment types) can arrive as an array or a JSON string
const parseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  return [];
};

const asText = (v) => (Array.isArray(v) ? v.filter(Boolean).join(", ") : v || "");

// "09:00:00" -> "09:00"
const fmtTime = (t) => (/^\d{2}:\d{2}:\d{2}$/.test(String(t)) ? String(t).slice(0, 5) : String(t));

const paymentLabel = (type) => {
  if (type === "upi") return "UPI";
  if (type === "bank_transfer") return "Bank Transfer";
  return String(type).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

/* ---------- icons ---------- */
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
);
const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5" /><path d="M11 6l-6 6 6 6" /></svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>
);
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a8 8 0 01-8 8H5l-2 2V12a8 8 0 018-8h2a8 8 0 018 8z" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" /></svg>
);
const CodeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8l-4 4 4 4" /><path d="M16 8l4 4-4 4" /></svg>
);
const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5" /><path d="M12 16.2v.1" /></svg>
);

/* one row in a sidebar list: icon tile + small label + value */
function Fact({ icon, label, children }) {
  return (
    <li>
      {icon}
      <div>
        <span>{label}</span>
        <strong>{children}</strong>
      </div>
    </li>
  );
}

export default function FreelancerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(`/api/profiles/freelancers/${id}/`);
        setData(res.data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id]);

  const goBack = () => navigate("/freelancers");

  if (loading) {
    return (
      <div className="fl-page">
        <p className="fl-state">Loading profile…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fl-page">
        <div className="fl-empty is-error">
          <div className="fl-empty-icon"><AlertIcon /></div>
          <h2>Profile not found</h2>
          <p>{error || "No data available for this profile."}</p>
          <button type="button" className="fl-btn" onClick={goBack}>
            <ArrowLeftIcon />All freelancers
          </button>
        </div>
      </div>
    );
  }

  const { basic, professional, availability, education, social, payment_types } = data;

  const fullName = getName(data);
  const expertise =
    asText(professional?.expertise) ||
    asText(professional?.category) ||
    asText(professional?.categories) ||
    "Freelancer";
  const bio = professional?.bio || "No bio provided.";
  const location = basic?.location || "";
  const phoneNumber = basic?.phone_number || basic?.phone || "";
  const languages = parseLanguages(basic?.languages_known);
  const availableDays = parseArray(availability?.available_days);
  const paymentMethods = parseArray(payment_types);

  const isAvailable = availability?.is_available;
  const statusText = isAvailable ? "Available for Work" : "Currently Occupied";
  const statusClass = isAvailable ? "fl-available" : "fl-occupied";

  const hasSocial = social && (social.linkedin_url || social.github_url || social.portfolio_url);

  return (
    <div className="fl-page">
      {/* HERO: avatar, name, status and the Hire Me button */}
      <section className="flp-hero">
        <button type="button" className="flp-back" onClick={goBack}>
          <ArrowLeftIcon />All freelancers
        </button>

        <div className="flp-hero-main">
          <div className="flp-avatar">
            {basic?.profile_picture ? (
              <img src={basic.profile_picture} alt={fullName} />
            ) : (
              <span>{fullName.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="flp-hero-text">
            <h1 className="flp-name">{fullName}</h1>
            <p className="flp-expertise">{expertise}</p>

            <div className="flp-chips">
              <span className={`fl-badge ${statusClass}`}><i />{statusText}</span>
              {location && <span className="flp-chip"><PinIcon />{location}</span>}
              {languages.slice(0, 4).map((lang, idx) => (
                <span key={idx} className="flp-chip">{lang}</span>
              ))}
              {languages.length > 4 && (
                <span className="flp-chip">+{languages.length - 4} more</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className="flp-hire"
            onClick={() => alert("Contact functionality coming soon!")}
          >
            Hire Me<i><ArrowIcon /></i>
          </button>
        </div>
      </section>

      <div className="flp-layout">
        {/* MAIN COLUMN */}
        <div className="flp-main">
          <section className="flp-section">
            <h2 className="flp-section-title">About</h2>
            <p className="flp-paragraph">{bio}</p>
          </section>

          {education && education.length > 0 && (
            <section className="flp-section">
              <h2 className="flp-section-title">Education</h2>
              <ul className="flp-edu">
                {education.map((edu) => (
                  <li key={edu.id} className="flp-edu-item">
                    <h3>{edu.degree}</h3>
                    <p className="flp-edu-school">{edu.institution}</p>
                    <span className="flp-edu-year">
                      {edu.start_year} - {edu.end_year || "Present"}
                    </span>
                    {edu.description && <p className="flp-paragraph">{edu.description}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="flp-side">
          <div className="flp-card">
            <h3 className="flp-side-title">Contact Information</h3>
            <ul className="flp-facts">
              {location && <Fact icon={<PinIcon />} label="Location">{location}</Fact>}
              {phoneNumber && <Fact icon={<PhoneIcon />} label="Phone">{phoneNumber}</Fact>}
              {languages.length > 0 && (
                <Fact icon={<ChatIcon />} label="Languages">{languages.join(", ")}</Fact>
              )}
            </ul>
            {!location && !phoneNumber && languages.length === 0 && (
              <p className="flp-muted">No contact details added.</p>
            )}
          </div>

          {availability && (
            <div className="flp-card">
              <h3 className="flp-side-title">Availability</h3>
              <span className={`fl-badge ${statusClass}`}><i />{statusText}</span>

              {(availability.time_zone || availability.available_from || availability.available_to) && (
                <ul className="flp-facts flp-facts-compact">
                  {availability.time_zone && (
                    <Fact icon={<GlobeIcon />} label="Timezone">{availability.time_zone}</Fact>
                  )}
                  {availability.available_from && (
                    <Fact icon={<ClockIcon />} label="Available from">{fmtTime(availability.available_from)}</Fact>
                  )}
                  {availability.available_to && (
                    <Fact icon={<ClockIcon />} label="Available to">{fmtTime(availability.available_to)}</Fact>
                  )}
                </ul>
              )}

              {availableDays.length > 0 && (
                <div className="flp-days">
                  <span className="flp-days-label">Working days</span>
                  <div className="fl-skills flp-left">
                    {availableDays.map((day, idx) => (
                      <span key={idx} className="fl-skill">{day}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {hasSocial && (
            <div className="flp-card">
              <h3 className="flp-side-title">Social Links</h3>
              <div className="flp-links">
                {social.linkedin_url && (
                  <a href={social.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <LinkIcon /><span>LinkedIn</span><ExternalIcon />
                  </a>
                )}
                {social.github_url && (
                  <a href={social.github_url} target="_blank" rel="noopener noreferrer">
                    <CodeIcon /><span>GitHub</span><ExternalIcon />
                  </a>
                )}
                {social.portfolio_url && (
                  <a href={social.portfolio_url} target="_blank" rel="noopener noreferrer">
                    <GlobeIcon /><span>Portfolio</span><ExternalIcon />
                  </a>
                )}
              </div>
            </div>
          )}

          {paymentMethods.length > 0 && (
            <div className="flp-card">
              <h3 className="flp-side-title">Accepted Payment Methods</h3>
              <div className="fl-skills flp-left">
                {paymentMethods.map((type, idx) => (
                  <span key={idx} className="fl-skill">{paymentLabel(type)}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}