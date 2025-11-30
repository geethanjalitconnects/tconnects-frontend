import React, { useState } from "react";
import "../../recruiter-dashboard/RecruiterDashboard.css";

export default function JobApplications() {
  // Sample job applications
  const allApplications = [
    {
      id: 1,
      jobTitle: "Senior Risk Analyst",
      name: "Geethanjali V",
      email: "geethanjali@gmail.com",
      phone: "+91 9876543210",
      location: "Chennai, India",
      skills: ["SQL", "Python", "Risk Analysis"],
      experience: "2 Years",
      resume: "/sample-resume.pdf",
      status: "Pending",
    },
    {
      id: 2,
      jobTitle: "Financial Analyst",
      name: "Harini M",
      email: "harini@gmail.com",
      phone: "+91 9876541111",
      location: "Bangalore, India",
      skills: ["Excel", "PowerBI", "Finance"],
      experience: "1 Year",
      resume: "/resume2.pdf",
      status: "Shortlisted",
    },
  ];

  /* ------------------------- FILTER STATES ------------------------- */
  const [filters, setFilters] = useState({
    jobTitle: "",
    status: "",
    skill: "",
    experience: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  /* ------------------------- FILTER LOGIC ------------------------- */
  const filteredApplications = allApplications.filter((app) => {
    return (
      (filters.jobTitle ? app.jobTitle === filters.jobTitle : true) &&
      (filters.status ? app.status === filters.status : true) &&
      (filters.skill ? app.skills.includes(filters.skill) : true) &&
      (filters.experience ? app.experience === filters.experience : true)
    );
  });

  return (
    <div className="rd-applications-page">

      <h2 className="rd-page-title">Job Applications</h2>

      {/* ------------------------- FILTER BAR ------------------------- */}
      <div className="rd-filter-bar">

        <select
          name="jobTitle"
          className="rd-filter-input"
          onChange={handleFilterChange}
        >
          <option value="">Filter by Job Title</option>
          <option>Senior Risk Analyst</option>
          <option>Financial Analyst</option>
        </select>

        <select
          name="status"
          className="rd-filter-input"
          onChange={handleFilterChange}
        >
          <option value="">Filter by Status</option>
          <option>Pending</option>
          <option>Reviewing</option>
          <option>Shortlisted</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>

        <select
          name="skill"
          className="rd-filter-input"
          onChange={handleFilterChange}
        >
          <option value="">Filter by Skill</option>
          <option>SQL</option>
          <option>Python</option>
          <option>Risk Analysis</option>
          <option>Excel</option>
          <option>Finance</option>
        </select>

        <select
          name="experience"
          className="rd-filter-input"
          onChange={handleFilterChange}
        >
          <option value="">Filter by Experience</option>
          <option>Fresher</option>
          <option>1 Year</option>
          <option>2 Years</option>
          <option>3+ Years</option>
        </select>
      </div>

      {/* ------------------------- APPLICATION LIST ------------------------- */}
      <div className="rd-applications-list">

        {filteredApplications.map((app) => (
          <div className="rd-app-card" key={app.id}>

            <div className="rd-app-header">
              <h3 className="rd-app-job">{app.jobTitle}</h3>

              <select className="rd-status-dropdown">
                <option>Pending</option>
                <option>Reviewing</option>
                <option>Shortlisted</option>
                <option>Selected</option>
                <option>Rejected</option>
              </select>
            </div>

            <p className="rd-app-name">{app.name}</p>
            <p className="rd-app-email">{app.email}</p>
            <p className="rd-app-phone">{app.phone}</p>
            <p className="rd-app-location">{app.location}</p>

            <div className="rd-skill-row">
              {app.skills.map((skill, i) => (
                <span key={i} className="rd-skill-tag">{skill}</span>
              ))}
            </div>

            <div className="rd-resume-box">
              <a href={app.resume} target="_blank" className="rd-resume-btn">
                View Resume
              </a>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
