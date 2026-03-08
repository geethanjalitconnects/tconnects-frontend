import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomeModal.css";

const TC_LOGO = "/assets/TconnectsNewLogo.png";

export default function WelcomeModal({ currentUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // Track if this session started with a logged-in user
  const initialUserRef = useRef(currentUser);

  useEffect(() => {
    const onHome = window.location.pathname === "/";
    const dismissed = localStorage.getItem("tc_welcome_dismissed");

    // ✅ FIX 1: Never show if user is logged in
    if (currentUser) {
      setOpen(false);
      return;
    }

    // ✅ FIX 2: Don't show if user just logged out (session started logged in)
    // We track if the page was loaded while logged in — if so, don't show modal
    if (initialUserRef.current !== null) {
      return;
    }

    // Only show for genuine first-time visitors (never logged in this session)
    if (onHome && !dismissed) {
      const t = setTimeout(() => setOpen(true), 350);
      return () => clearTimeout(t);
    }
  }, [currentUser]);

  const close = (dontShowAgain = false) => {
    setOpen(false);
    if (dontShowAgain) {
      localStorage.setItem("tc_welcome_dismissed", "true");
    }
  };

  const handleCandidate = () => {
    localStorage.setItem("tc_welcome_dismissed", "true");
    setOpen(false);
    navigate("/register?role=candidate");
  };

  const handleRecruiter = () => {
    localStorage.setItem("tc_welcome_dismissed", "true");
    setOpen(false);
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

          <button className="tc-btn tc-btn-secondary" onClick={handleRecruiter}>
            Continue as Recruiter
          </button>
        </div>

        <div className="tc-modal-footer">
          <button className="tc-link-muted" onClick={() => close(true)}>
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