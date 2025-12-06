import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./RecruiterDashboard.css";

const RecruiterDashboardLayout = () => {
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [openJobs, setOpenJobs] = useState(false);
  const [openApplications, setOpenApplications] = useState(false);

  // ⭐ Added sidebar toggle for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`rd-layout ${sidebarOpen ? "sidebar-open" : ""}`}>

      {/* ⭐ MOBILE HAMBURGER BUTTON */}
      <button className="rd-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* SIDEBAR */}
      <aside className="rd-sidebar">
        <div className="rd-sidebar-top" onClick={() => navigate("/")}>
          <h2 className="rd-logo">TConnects</h2>
        </div>

        <nav className="rd-nav">

          {/* Overview */}
          <NavLink
            to="/recruiter-dashboard/overview"
            className="rd-nav-link"
            onClick={() => setSidebarOpen(false)}
          >
            Overview
          </NavLink>

          {/* Profile Dropdown */}
          <div className={`rd-dropdown ${openProfile ? "open" : ""}`}>
            <button
              className="rd-dropdown-toggle"
              onClick={() => setOpenProfile(!openProfile)}
            >
              <span>Profile</span>
              <span className="rd-dropdown-arrow">▼</span>
            </button>

            <div className={`rd-dropdown-menu ${openProfile ? "show" : ""}`}>
              <NavLink
                to="/recruiter-dashboard/profile/basic-info"
                className="rd-dropdown-item"
                onClick={() => setSidebarOpen(false)}
              >
                Basic Information
              </NavLink>

              <NavLink
                to="/recruiter-dashboard/profile/company-profile"
                className="rd-dropdown-item"
                onClick={() => setSidebarOpen(false)}
              >
                Company Profile
              </NavLink>
            </div>
          </div>

          {/* Jobs Dropdown */}
          <div className={`rd-dropdown ${openJobs ? "open" : ""}`}>
            <button
              className="rd-dropdown-toggle"
              onClick={() => setOpenJobs(!openJobs)}
            >
              <span>Jobs</span>
              <span className="rd-dropdown-arrow">▼</span>
            </button>

            <div className={`rd-dropdown-menu ${openJobs ? "show" : ""}`}>
              <NavLink
                to="/recruiter-dashboard/jobs/post-job"
                className="rd-dropdown-item"
                onClick={() => setSidebarOpen(false)}
              >
                Post Job
              </NavLink>

              <NavLink
                to="/recruiter-dashboard/jobs/post-internship"
                className="rd-dropdown-item"
                onClick={() => setSidebarOpen(false)}
              >
                Post Internship
              </NavLink>

              <NavLink
                to="/recruiter-dashboard/jobs/manage-jobs"
                className="rd-dropdown-item"
                onClick={() => setSidebarOpen(false)}
              >
                Manage Jobs
              </NavLink>

              <NavLink
                to="/recruiter-dashboard/jobs/manage-internships"
                className="rd-dropdown-item"
                onClick={() => setSidebarOpen(false)}
              >
                Manage Internships
              </NavLink>
            </div>
          </div>

          {/* Applications Dropdown */}
          <div className={`rd-dropdown ${openApplications ? "open" : ""}`}>
            <button
              className="rd-dropdown-toggle"
              onClick={() => setOpenApplications(!openApplications)}
            >
              <span>Applications</span>
              <span className="rd-dropdown-arrow">▼</span>
            </button>

            <div className={`rd-dropdown-menu ${openApplications ? "show" : ""}`}>
              <NavLink
                to="/recruiter-dashboard/applications/jobs"
                className="rd-dropdown-item"
                onClick={() => setSidebarOpen(false)}
              >
                Job Applications
              </NavLink>

              <NavLink
                to="/recruiter-dashboard/applications/internships"
                className="rd-dropdown-item"
                onClick={() => setSidebarOpen(false)}
              >
                Internship Applications
              </NavLink>
            </div>
          </div>

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="rd-main"
        onClick={() => setSidebarOpen(false)} // close sidebar when tapping outside
      >
        <div className="rd-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboardLayout;
