// CandidateDashboardLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./CandidateDashboard.css";

const MAIN_LINKS = [
  { to: "/candidate-dashboard/overview", label: "Overview" },
  { to: "/candidate-dashboard/profile", label: "Profile" },
  { to: "/candidate-dashboard/applied-jobs", label: "Applied Jobs" },
  { to: "/candidate-dashboard/applied-internships", label: "Applied Internships" },
  { to: "/candidate-dashboard/saved-jobs", label: "Saved Jobs" },
  { to: "/candidate-dashboard/saved-internships", label: "Saved Internships" },
  { to: "/candidate-dashboard/courses", label: "Courses" },
];

const FREELANCER_LINKS = [
  { to: "/candidate-dashboard/freelancer/overview", label: "Overview" },
  { to: "/candidate-dashboard/freelancer/basic-information", label: "Basic Information" },
  { to: "/candidate-dashboard/freelancer/professional-details", label: "Professional Details" },
  { to: "/candidate-dashboard/freelancer/education", label: "Education" },
  { to: "/candidate-dashboard/freelancer/availability", label: "Availability" },
  { to: "/candidate-dashboard/freelancer/payment-method", label: "Payment Method" },
  { to: "/candidate-dashboard/freelancer/social-links", label: "Social Links & Ratings" },
  { to: "/candidate-dashboard/freelancer/profile-preview", label: "Profile Preview" },
];

export default function CandidateDashboardLayout() {
  const [freelancerOpen, setFreelancerOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="cd-layout">

      {/* SIDEBAR */}
      <aside className="cd-sidebar">

        {/* TOP — TITLE ONLY */}
        <div className="cd-sidebar-top">
          <div className="cd-logo" onClick={() => navigate("/candidate-dashboard/overview")}>
            TConnects
          </div>
        </div>

        <nav className="cd-nav">

          {/* MAIN LINKS */}
          {MAIN_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "cd-nav-link active" : "cd-nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* FREELANCER DROPDOWN */}
          <div className={`cd-dropdown ${freelancerOpen ? "open" : ""}`}>

            <button
              className="cd-nav-link cd-dropdown-toggle"
              onClick={() => setFreelancerOpen(!freelancerOpen)}
            >
              Freelancer
              <span className="cd-dropdown-arrow">▼</span>
            </button>

            <div className={`cd-dropdown-menu ${freelancerOpen ? "show" : "hide"}`}>
              {FREELANCER_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? "cd-dropdown-item active" : "cd-dropdown-item"
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* MESSAGES (LAST ITEM) */}
          <NavLink
            to="/candidate-dashboard/messages"
            className={({ isActive }) =>
              isActive ? "cd-nav-link active" : "cd-nav-link"
            }
          >
            Messages
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="cd-main">
        <section className="cd-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}