import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import vcLogo from '../assets/vc-logo.png'; // src/assets/vc-logo.png (path relative to src/pages)

/* ------------------------------------------------------------------
   EDIT HERE: words shown for each account type.
   Two accounts only. Candidate includes mentorship.
   (`sub` is the line shown under the popup title.)
------------------------------------------------------------------- */
export const ROLE_COPY = {
  candidate: {
    tab: 'Candidate',
    tabHint: 'Get hired & grow',
    sub: { login: 'Log in to pick up your career journey.', register: 'Create your free profile in a minute.' },
  },
  recruiter: {
    tab: 'Recruiter',
    tabHint: 'Hire job-ready talent',
    sub: { login: 'Log in to manage your hiring.', register: 'Set up your recruiter account with your company email.' },
  },
};

const CapIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /></svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18v11H3z" /><path d="M9 9V6h6v3" /><path d="M3 14h18" /></svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12" /><path d="M18 6L6 18" /></svg>
);

/* Candidate / Recruiter switch at the top of every auth popup */
export function RoleSwitch({ value, onChange, disabled }) {
  return (
    <div className="va-roles" role="tablist" aria-label="Account type">
      {['candidate', 'recruiter'].map((r) => (
        <button
          key={r}
          type="button"
          role="tab"
          aria-selected={value === r}
          disabled={disabled}
          className={value === r ? 'on' : ''}
          onClick={() => onChange(r)}
        >
          {r === 'candidate' ? <CapIcon /> : <BriefcaseIcon />}
          <span><b>{ROLE_COPY[r].tab}</b><small>{ROLE_COPY[r].tabHint}</small></span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Login / sign up popup.

   Same props as before (role, mode, children, footer), so Login.jsx and
   Register.jsx do not need to change.

   The popup closes (and goes back to the home page) when you:
   - click the X button
   - click the dark area outside the popup
   - press Escape

   mode = 'login' | 'register'
------------------------------------------------------------------- */
export default function AuthLayout({ role, mode, children, footer }) {
  const navigate = useNavigate();
  const dialogRef = useRef(null);

  const copy = ROLE_COPY[role] || ROLE_COPY.candidate;
  const title = mode === 'login' ? ['Welcome to ', 'VConnects', ''] : ['Create ', 'VConnects', ' account'];

  const close = () => navigate('/');

  /* Escape closes, the page behind stops scrolling while the popup is open */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') navigate('/'); };
    const prevOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    if (dialogRef.current) dialogRef.current.focus({ preventScroll: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [navigate]);

  /* only a click that starts on the dark area closes it, so selecting text inside and releasing outside does not */
  const onBackdropDown = (e) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <div className="va-page" onMouseDown={onBackdropDown}>
      {/* a div with role="dialog", not a <main> tag: a global `main { ... }` rule in the app could stretch and un-pad the card */}
      <div
        className="va-card"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'login' ? 'Log in to VConnects' : 'Create a VConnects account'}
        tabIndex={-1}
        ref={dialogRef}
      >
        <div className="va-inner">
          <Link to="/" className="va-logo" aria-label="VConnects home"><img src={vcLogo} alt="VConnects" /></Link>
          <h1>{title[0]}<span>{title[1]}</span>{title[2]}</h1>
          <p className="va-sub">{copy.sub[mode]}</p>
          {children}
          <div className="va-foot">{footer}</div>
        </div>

        <button type="button" className="va-close" onClick={close} aria-label="Close">
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}