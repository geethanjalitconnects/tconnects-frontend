// RecruiterDashboardLayout.jsx
import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./RecruiterDashboard.css";
import { mentorshipApi } from "../../services/mentorshipApi";

const PROFILE_LINKS = [
  { to: "/recruiter-dashboard/profile/basic-info", label: "Basic Information" },
  { to: "/recruiter-dashboard/profile/company-profile", label: "Company Profile" },
];

const JOB_LINKS = [
  { to: "/recruiter-dashboard/jobs/post-job", label: "Post Job" },
  { to: "/recruiter-dashboard/jobs/post-internship", label: "Post Internship" },
  { to: "/recruiter-dashboard/jobs/manage-jobs", label: "Manage Jobs" },
  { to: "/recruiter-dashboard/jobs/manage-internships", label: "Manage Internships" },
];

const APPLICATION_LINKS = [
  { to: "/recruiter-dashboard/applications/jobs", label: "Job Applications" },
  { to: "/recruiter-dashboard/applications/internships", label: "Internship Applications" },
];

export default function RecruiterDashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [openProfile, setOpenProfile] = useState(false);
  const [openJobs, setOpenJobs] = useState(false);
  const [openApplications, setOpenApplications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Keep the dropdown of the current page open
  useEffect(() => {
    if (pathname.includes("/profile/")) setOpenProfile(true);
    if (pathname.includes("/jobs/")) setOpenJobs(true);
    if (pathname.includes("/applications/")) setOpenApplications(true);
  }, [pathname]);

  const closeSidebar = () => setSidebarOpen(false);

  // Recruiters can mentor too: approved (or suspended) mentors see the mentor dashboard link.
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

  const renderDropdown = (label, links, open, setOpen) => (
    <div className={`rd-dropdown ${open ? "open" : ""}`}>
      <button
        className="rd-nav-link rd-dropdown-toggle"
        onClick={() => setOpen(!open)}
      >
        {label}
        <span className="rd-dropdown-arrow">▼</span>
      </button>

      <div className={`rd-dropdown-menu ${open ? "show" : ""}`}>
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "rd-dropdown-item active" : "rd-dropdown-item"
            }
            onClick={closeSidebar}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`rd-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Mobile hamburger */}
      <button
        className="rd-hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Mobile overlay - click closes sidebar */}
      {sidebarOpen && <div className="rd-sidebar-overlay" onClick={closeSidebar} />}

      {/* SIDEBAR */}
      <aside className="rd-sidebar">
        <div className="rd-sidebar-top">
          <div
            className="rd-logo"
            onClick={() => {
              navigate("/recruiter-dashboard/overview");
              closeSidebar();
            }}
          >
            VConnects
          </div>

          <button
            className="rd-home-btn"
            onClick={() => {
              navigate("/");
              closeSidebar();
            }}
          >
            ← Back to Home
          </button>
        </div>

        <nav className="rd-nav">
          <NavLink
            to="/recruiter-dashboard/overview"
            className={({ isActive }) =>
              isActive ? "rd-nav-link active" : "rd-nav-link"
            }
            onClick={closeSidebar}
          >
            Overview
          </NavLink>

          {renderDropdown("Profile", PROFILE_LINKS, openProfile, setOpenProfile)}
          {renderDropdown("Jobs", JOB_LINKS, openJobs, setOpenJobs)}
          {renderDropdown(
            "Applications",
            APPLICATION_LINKS,
            openApplications,
            setOpenApplications
          )}

          <NavLink
            to="/recruiter-dashboard/my-mentorship"
            className={({ isActive }) =>
              isActive ? "rd-nav-link active" : "rd-nav-link"
            }
            onClick={closeSidebar}
          >
            My Mentorship
          </NavLink>

          <NavLink
            to={isMentor ? "/recruiter-dashboard/mentor-dashboard" : "/mentorship/become-a-mentor"}
            className={({ isActive }) =>
              isActive ? "rd-nav-link active" : "rd-nav-link"
            }
            onClick={closeSidebar}
          >
            {isMentor ? "Mentor Dashboard" : "Become a Mentor"}
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="rd-main">
        <section className="rd-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
