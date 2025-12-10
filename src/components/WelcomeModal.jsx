import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomeModal.css"; // paste the CSS from below
// Put your TC-only logo at public/assets/tc-only.png (or update the path below)
import TC_LOGO from "../assets/TconnectsNewLogo.png";


export default function WelcomeModal({ currentUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show on homepage and only for not-logged-in users
    const onHome = window.location.pathname === "/";
    const dismissed = localStorage.getItem("tc_welcome_dismissed") === "true";
    if (onHome && !dismissed && !currentUser) {
      // small delay for nicer effect
      const t = setTimeout(() => setOpen(true), 350);
      return () => clearTimeout(t);
    }
  }, [currentUser]);

  const close = (dontShowAgain = false) => {
    setOpen(false);
    if (dontShowAgain) localStorage.setItem("tc_welcome_dismissed", "true");
  };

  const handleCandidate = () => {
    localStorage.setItem("tc_welcome_dismissed", "true");
    navigate("/register?role=candidate");
  };

  const handleRecruiter = () => {
    localStorage.setItem("tc_welcome_dismissed", "true");
    navigate("/register?role=recruiter");
  };

  if (!open) return null;

  return (
    <div className="tc-modal-overlay" onClick={() => close(false)}>
      <div className="tc-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="tc-modal-top">
          <img src={TC_LOGO} alt="TC" className="tc-modal-logo" />
        </div>

        <h2 className="tc-modal-title">Welcome to TConnects! 🎉</h2>

        <p className="tc-modal-sub">
          Create your profile to get personalized job recommendations and apply instantly.
          <br />
          <strong>Recruiters:</strong> Build your hiring pipeline and post opportunities with ease.
        </p>

        <div className="tc-modal-actions">
          <button className="tc-btn tc-btn-primary" onClick={handleCandidate}>
            Continue as Candidate
          </button>

          <button
            className="tc-btn tc-btn-secondary"
            onClick={handleRecruiter}
          >
            Continue as Recruiter
          </button>
        </div>

        <div className="tc-modal-footer">
          <button
            className="tc-link-muted"
            onClick={() => close(true)}
          >
            Maybe later — don't show again
          </button>

          <button className="tc-close-btn" aria-label="close" onClick={() => close(false)}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
