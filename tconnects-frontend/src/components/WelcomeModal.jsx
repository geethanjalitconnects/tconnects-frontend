import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomeModal.css";

/* src/assets/vc-logo.png (path relative to src/components) */
import vcLogo from "../assets/vc-logo.png";

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const CapIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 9l10-5 10 5-10 5z" />
    <path d="M6 11v5c3 2 9 2 12 0v-5" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 9h18v11H3z" />
    <path d="M9 9V6h6v3" />
    <path d="M3 14h18" />
  </svg>
);

export default function WelcomeModal({ currentUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // Track if this session started with a logged-in user
  const initialUserRef = useRef(currentUser);

  useEffect(() => {
    const onHome = window.location.pathname === "/";
    const dismissed = localStorage.getItem("tc_welcome_dismissed");

    // Never show if user is logged in
    if (currentUser) {
      setOpen(false);
      return;
    }

    // Don't show if the session started logged in (e.g. user just logged out)
    if (initialUserRef.current !== null) {
      return;
    }

    // Only show for genuine first-time visitors
    if (onHome && !dismissed) {
      const t = setTimeout(() => setOpen(true), 350);
      return () => clearTimeout(t);
    }
  }, [currentUser]);

  /* Esc to close + lock page scroll while open */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = (dontShowAgain = false) => {
    setOpen(false);
    if (dontShowAgain) {
      localStorage.setItem("tc_welcome_dismissed", "true");
    }
  };

  const choose = (role) => {
    localStorage.setItem("tc_welcome_dismissed", "true");
    setOpen(false);
    navigate(`/register?role=${role}`);
  };

  if (!open) return null;

  return (
    <div className="vcw-overlay" onClick={() => close(false)}>
      <div
        className="vcw-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vcw-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="vcw-close" aria-label="Close" onClick={() => close(false)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="vcw-brand">
          <img src={vcLogo} alt="VConnects" />
        </div>

        <h2 id="vcw-title" className="vcw-title">
          Your career,
          <br />
          <span className="vcw-grad">fully connected.</span>
        </h2>

        <p className="vcw-sub">Jobs, internships, interviews and mentors in one place.</p>

        <div className="vcw-roles">
          <button className="vcw-role vcw-role-main" onClick={() => choose("candidate")}>
            <span className="vcw-ico"><CapIcon /></span>
            <span className="vcw-rt">
              <b>I want to get hired</b>
              <small>Find jobs, internships and mentors</small>
            </span>
            <i className="vcw-go"><Arrow /></i>
          </button>

          <button className="vcw-role" onClick={() => choose("recruiter")}>
            <span className="vcw-ico"><BriefcaseIcon /></span>
            <span className="vcw-rt">
              <b>I'm hiring</b>
              <small>Post roles and meet talent</small>
            </span>
            <i className="vcw-go"><Arrow /></i>
          </button>
        </div>

        <button className="vcw-later" onClick={() => close(true)}>
          Maybe later, don't show again
        </button>
      </div>
    </div>
  );
}