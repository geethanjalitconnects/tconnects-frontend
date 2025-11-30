import React from "react";
import "../RecruiterDashboard.css";

export default function InternshipApplications() {
  const applications = [
    {
      id: 1,
      internshipTitle: "Risk Analytics Intern",
      name: "Mahesh Kumar",
      email: "maheshk@example.com",
      phone: "+91 9898989898",
      location: "Chennai, India",
      skills: ["Excel", "SQL", "Data Cleaning"],
      status: "Applied",
      resume: "#",
    },
  ];

  return (
    <div className="rd-applications-page">

      {/* ===== PAGE HEADER ===== */}
      <div className="rd-page-header">
        <h2 className="rd-page-title">Internship Applications</h2>
        <p className="rd-page-subtitle">
          Review applicants and manage your internship hiring process.
        </p>
      </div>

      {/* ===== FILTERS BAR ===== */}
      <div className="rd-filter-container">
        <select className="rd-filter-select">
          <option>Filter by Internship Title</option>
        </select>

        <select className="rd-filter-select">
          <option>Filter by Status</option>
        </select>

        <select className="rd-filter-select">
          <option>Filter by Skill</option>
        </select>

        <select className="rd-filter-select">
          <option>Filter by Experience</option>
        </select>
      </div>

      {/* ===== APPLICATION LIST ===== */}
      <div className="rd-applications-list">
        {applications.map((app) => (
          <div key={app.id} className="rd-application-card">

            <div className="rd-app-card-header">
              <h2 className="rd-job-title">{app.internshipTitle}</h2>

              <select className="rd-status-dropdown">
                <option>Applied</option>
                <option>Shortlisted</option>
                <option>Reviewing</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>
            </div>

            <div className="rd-applicant-info">
              <p className="rd-applicant-name">{app.name}</p>
              <p className="rd-email-phone">
                {app.email} • {app.phone}
              </p>
              <p className="rd-location">{app.location}</p>

              <div className="rd-skills-row">
                {app.skills.map((skill, index) => (
                  <span key={index} className="rd-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button className="rd-view-resume-btn">View Resume</button>
          </div>
        ))}
      </div>
    </div>
  );
}
