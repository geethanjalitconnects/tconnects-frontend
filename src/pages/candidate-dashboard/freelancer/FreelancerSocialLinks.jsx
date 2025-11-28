import React, { useState } from "react";
import "./freelancer.css";

export default function FreelancerSocialLinks() {
  const [links, setLinks] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    reviewerEmail: "",
  });

  const [ratings, setRatings] = useState([]);
  const [stars, setStars] = useState(0);
  const [badge, setBadge] = useState("");

  const updateLinks = (field, value) => {
    setLinks((s) => ({ ...s, [field]: value }));
  };

  const sendRequest = () => {
    if (!links.reviewerEmail) {
      alert("Enter recruiter's email before sending request.");
      return;
    }
    alert(
      `Request sent to ${links.reviewerEmail}. (UI only, backend not implemented)`
    );
    setLinks((s) => ({ ...s, reviewerEmail: "" }));
  };

  const saveRating = () => {
    if (stars === 0) {
      alert("Please select a rating.");
      return;
    }

    const entry = {
      stars,
      badge,
      date: new Date().toLocaleDateString(),
    };

    setRatings((prev) => [...prev, entry]);
    setStars(0);
    setBadge("");

    alert("Rating added (UI only)");
  };

  const removeRating = (index) => {
    setRatings((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fr-page">
      <div className="fr-card fr-form">
        <h2 className="fr-title">Social Links & Ratings</h2>

        {/* SOCIAL LINKS */}
        <div className="fr-row">
          <label className="fr-label">LinkedIn Profile URL</label>
          <input
            className="fr-input"
            placeholder="https://linkedin.com/in/yourname"
            value={links.linkedin}
            onChange={(e) => updateLinks("linkedin", e.target.value)}
          />
        </div>

        <div className="fr-row">
          <label className="fr-label">GitHub Profile URL</label>
          <input
            className="fr-input"
            placeholder="https://github.com/yourname"
            value={links.github}
            onChange={(e) => updateLinks("github", e.target.value)}
          />
        </div>

        <div className="fr-row">
          <label className="fr-label">Portfolio Link</label>
          <input
            className="fr-input"
            placeholder="https://myportfolio.com"
            value={links.portfolio}
            onChange={(e) => updateLinks("portfolio", e.target.value)}
          />
        </div>

        {/* FEEDBACK REQUEST */}
        <div className="fr-section-divider">Feedback Request</div>

        <div className="fr-row fr-two-col">
          <div>
            <label className="fr-label">Recruiter Email</label>
            <input
              className="fr-input"
              placeholder="recruiter@example.com"
              value={links.reviewerEmail}
              onChange={(e) => updateLinks("reviewerEmail", e.target.value)}
            />
          </div>

          <button
            type="button"
            className="fr-btn fr-btn-primary"
            style={{ marginTop: "28px" }}
            onClick={sendRequest}
          >
            Send Request
          </button>
        </div>

        {/* RATINGS */}
        <div className="fr-section-divider">Add Rating (Manually for Now)</div>

        <div className="fr-row">
          <label className="fr-label">Star Rating</label>
          <div className="fr-stars-row">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`fr-star ${stars >= s ? "active" : ""}`}
                onClick={() => setStars(s)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="fr-row">
          <label className="fr-label">Badge (Optional)</label>
          <input
            className="fr-input"
            placeholder="Top Performer, Hardworker, On-time Delivery..."
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
          />
        </div>

        <button className="fr-btn fr-btn-secondary" onClick={saveRating}>
          + Add Rating
        </button>

        {/* SAVED RATINGS LIST */}
        <div className="fr-section-divider">Received Ratings</div>

        {ratings.length === 0 ? (
          <p className="fr-empty">No ratings added yet.</p>
        ) : (
          ratings.map((r, index) => (
            <div key={index} className="fr-rating-item">
              <div className="fr-rating-stars">
                {"★".repeat(r.stars)}{" "}
                <span className="fr-rating-date">({r.date})</span>
              </div>

              {r.badge && <div className="fr-badge">{r.badge}</div>}

              <button
                className="fr-btn fr-btn-danger fr-small-remove"
                onClick={() => removeRating(index)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
