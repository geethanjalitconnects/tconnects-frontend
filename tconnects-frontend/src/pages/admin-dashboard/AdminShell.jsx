// Shared top navigation and sign-in gate for the admin mentorship screens.
import { Link, NavLink } from "react-router-dom";
import "../mentorship/booking/booking.css";

export function AdminNav() {
  return (
    <nav className="mb-admin-nav" aria-label="Admin sections">
      <NavLink to="/admin-dashboard/mentorship" end className={({ isActive }) => (isActive ? "active" : "")}>
        <i className="bi bi-graph-up" /> Mentorship business
      </NavLink>
      <NavLink to="/admin-dashboard/mentors" className={({ isActive }) => (isActive ? "active" : "")}>
        <i className="bi bi-patch-check" /> Mentor verification
      </NavLink>
      <Link to="/">
        <i className="bi bi-house" /> Back to site
      </Link>
    </nav>
  );
}

/** Shown when an admin API answers 401 / 403. */
export function AdminGate({ status }) {
  const signedOut = status === 401;
  return (
    <div className="mb-empty" style={{ maxWidth: 520, margin: "40px auto" }}>
      <i className="bi bi-shield-lock" />
      <h3>{signedOut ? "Admin sign-in required" : "This area is for TConnects administrators"}</h3>
      <p>
        {signedOut
          ? "Please sign in with your admin account to manage mentorship."
          : "Your account does not have admin access. Sign in with an admin account."}
      </p>
      <Link className="mb-btn primary" to={`/login?next=${encodeURIComponent(window.location.pathname)}`}>
        Sign in
      </Link>
    </div>
  );
}
