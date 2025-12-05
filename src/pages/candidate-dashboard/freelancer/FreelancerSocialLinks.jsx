import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";

export default function FreelancerSocialLinks() {
  const [data, setData] = useState({
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    ratings: [],
    badges: []
  });

  const [reviewerEmail, setReviewerEmail] = useState("");

  // ======================================================
  // 1️⃣ LOAD SOCIAL LINKS + RATINGS (GET)
  // ======================================================
  useEffect(() => {
    const loadLinks = async () => {
      try {
        const res = await api.get("/api/profiles/freelancer/social-links/");
        setData(res.data);
      } catch (error) {
        toast.error("Unable to load social links.");
      }
    };
    loadLinks();
  }, []);

  // ======================================================
  // 2️⃣ SAVE SOCIAL LINKS (PATCH)
  // ======================================================
  const saveLinks = async () => {
    try {
      await api.patch("/api/profiles/freelancer/social-links/", {
        linkedin_url: data.linkedin_url,
        github_url: data.github_url,
        portfolio_url: data.portfolio_url
      });

      toast.success("Social links updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update links.");
    }
  };

  // ======================================================
  // 3️⃣ SEND RATING REQUEST EMAIL (UI ONLY)
  // ======================================================
  const sendRequest = () => {
    if (!reviewerEmail) {
      toast.error("Enter recruiter's email.");
      return;
    }

    // In real backend → you would send email
    toast.success(`Rating request sent to ${reviewerEmail}`);
    setReviewerEmail("");
  };

  return (
    <div className="fr-page">
      <div className="fr-card fr-form">
        <h2 className="fr-title">Social Links & Ratings</h2>

        {/* SOCIAL LINKS */}
        <div className="fr-row">
          <label className="fr-label">LinkedIn URL</label>
          <input
            className="fr-input"
            value={data.linkedin_url || ""}
            onChange={(e) =>
              setData({ ...data, linkedin_url: e.target.value })
            }
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="fr-row">
          <label className="fr-label">GitHub URL</label>
          <input
            className="fr-input"
            value={data.github_url || ""}
            onChange={(e) =>
              setData({ ...data, github_url: e.target.value })
            }
            placeholder="https://github.com/username"
          />
        </div>

        <div className="fr-row">
          <label className="fr-label">Portfolio URL</label>
          <input
            className="fr-input"
            value={data.portfolio_url || ""}
            onChange={(e) =>
              setData({ ...data, portfolio_url: e.target.value })
            }
            placeholder="https://myportfolio.com"
          />
        </div>

        <button
          type="button"
          className="fr-btn fr-btn-primary"
          onClick={saveLinks}
        >
          Save Links
        </button>

        {/* FEEDBACK REQUEST */}
        <div className="fr-section-divider">Request Rating from Recruiter</div>

        <div className="fr-row fr-two-col">
          <div>
            <label className="fr-label">Recruiter Email</label>
            <input
              className="fr-input"
              value={reviewerEmail}
              onChange={(e) => setReviewerEmail(e.target.value)}
              placeholder="recruiter@example.com"
            />
          </div>
          <button
            type="button"
            className="fr-btn fr-btn-secondary"
            style={{ marginTop: "26px" }}
            onClick={sendRequest}
          >
            Send Request
          </button>
        </div>

        {/* RATINGS SECTION */}
        <div className="fr-section-divider">Ratings Received</div>

        {data.ratings.length === 0 ? (
          <p className="fr-empty">No ratings received yet.</p>
        ) : (
          data.ratings.map((r, index) => (
            <div key={index} className="fr-rating-item">
              <div className="fr-rating-stars">
                {"★".repeat(r.stars)}{" "}
                <span className="fr-rating-date">({r.date})</span>
              </div>

              {r.badge && (
                <div className="fr-badge">{r.badge}</div>
              )}
            </div>
          ))
        )}

        {/* BADGES */}
        <div className="fr-section-divider">Badges Earned</div>

        {data.badges.length === 0 ? (
          <p className="fr-empty">No badges awarded yet.</p>
        ) : (
          <div className="fr-badge-list">
            {data.badges.map((b, i) => (
              <span key={i} className="fr-badge">
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
