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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Close sidebar when clicking on main content
  const handleMainClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Close sidebar when clicking on a link
  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`cd-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      
      {/* Mobile Hamburger Button */}
      <button 
        className="cd-hamburger" 
        onClick={(e) => {
          e.stopPropagation();
          setSidebarOpen(!sidebarOpen);
        }}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* SIDEBAR */}
      <aside className="cd-sidebar">
        <div className="cd-sidebar-top">
          <div className="cd-logo" onClick={() => {
            navigate("/candidate-dashboard/overview");
            handleLinkClick();
          }}>
            TConnects
          </div>
        </div>

        <nav className="cd-nav">
          {MAIN_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "cd-nav-link active" : "cd-nav-link"
              }
              onClick={handleLinkClick}
            >
              {item.label}
            </NavLink>
          ))}

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
                  onClick={handleLinkClick}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="cd-main" onClick={handleMainClick}>
        <section className="cd-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}