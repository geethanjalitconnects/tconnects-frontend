// CandidateDashboardLayout.jsx
import React, { useEffect, useState } from "react";
import { mentorshipApi } from "../../services/mentorshipApi";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./CandidateDashboard.css";

/* Put vc-logo.png in src/assets/. Path is relative to src/pages/candidate-dashboard/ */
import vcLogo from "../../assets/vc-logo.png";

/* `icon` = Bootstrap Icons class (bootstrap-icons is already loaded in App.jsx) */
const MAIN_LINKS = [
  { to: "/candidate-dashboard/overview", label: "Overview", icon: "bi-grid-1x2" },
  { to: "/candidate-dashboard/profile", label: "Profile", icon: "bi-person" },
  { to: "/candidate-dashboard/applied-jobs", label: "Applied Jobs", icon: "bi-briefcase" },
  { to: "/candidate-dashboard/applied-internships", label: "Applied Internships", icon: "bi-journal-check" },
  { to: "/candidate-dashboard/saved-jobs", label: "Saved Jobs", icon: "bi-bookmark-heart" },
  { to: "/candidate-dashboard/saved-internships", label: "Saved Internships", icon: "bi-bookmarks" },
  { to: "/candidate-dashboard/courses", label: "Courses", icon: "bi-mortarboard" },
  { to: "/candidate-dashboard/my-mentorship", label: "My Mentorship", icon: "bi-people" },
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
  // Approved (or suspended) mentors get the mentor dashboard; everyone else sees "Become a Mentor".
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    let active = true;
    mentorshipApi
      .getApplication()
      .then((a) => active && setIsMentor(["approved", "suspended"].includes(a?.status)))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const mentorLink = isMentor
    ? { to: "/candidate-dashboard/mentor-dashboard", label: "Mentor Dashboard", icon: "bi-person-video3" }
    : { to: "/mentorship/become-a-mentor", label: "Become a Mentor", icon: "bi-person-plus" };

  return (
    <div className={`cd-layout ${sidebarOpen ? "sidebar-open" : ""}`}>

      {/* Mobile hamburger */}
      <button
        className="cd-hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <i className="bi bi-list" />
      </button>

      {/* Overlay for mobile: click closes the sidebar */}
      {sidebarOpen && (
        <div className="cd-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className="cd-sidebar">
        <button
          className="cd-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <i className="bi bi-x-lg" />
        </button>

        <div className="cd-sidebar-top">
          <div
            className="cd-logo"
            onClick={() => {
              navigate("/candidate-dashboard/overview");
              setSidebarOpen(false);
            }}
          >
            <img src={vcLogo} alt="" />
            <span>VConnects</span>
          </div>

          <button
            className="cd-home-btn"
            onClick={() => {
              navigate("/");
              setSidebarOpen(false);
            }}
          >
            <i className="bi bi-arrow-left" /> Back to Home
          </button>
        </div>

        <nav className="cd-nav">
          {[...MAIN_LINKS, mentorLink].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "cd-nav-link active" : "cd-nav-link"
              }
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon} cd-nav-icon`} />
              {item.label}
            </NavLink>
          ))}

          <div className={`cd-dropdown ${freelancerOpen ? "open" : ""}`}>
            <button
              className="cd-nav-link cd-dropdown-toggle"
              onClick={() => setFreelancerOpen(!freelancerOpen)}
            >
              <span className="cd-dd-label">
                <i className="bi bi-laptop cd-nav-icon" />
                Freelancer
              </span>
              <i className="bi bi-chevron-down cd-dropdown-arrow" />
            </button>

            <div className={`cd-dropdown-menu ${freelancerOpen ? "show" : "hide"}`}>
              {FREELANCER_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? "cd-dropdown-item active" : "cd-dropdown-item"
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
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