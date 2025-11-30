// ManageInternships.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../recruiter-dashboard/RecruiterDashboard.css";

export default function ManageInternships() {
  const navigate = useNavigate();

  // Sample internship data
  const internships = [
    {
      id: 1,
      title: "Risk Analytics Intern",
      stipend: "₹10,000",
      duration: "2 Months",
      posted: "10 Dec 2025",
      status: "Active",
    },
    {
      id: 2,
      title: "Financial Research Intern",
      stipend: "₹8,000",
      duration: "3 Months",
      posted: "01 Dec 2025",
      status: "Closed",
    },
    {
      id: 3,
      title: "Compliance Intern",
      stipend: "₹12,000",
      duration: "1 Month",
      posted: "28 Nov 2025",
      status: "Active",
    },
  ];

  return (
    <div className="rd-managejobs-page">

      <h2 className="rd-page-title">Manage Internships</h2>
      <p className="rd-page-subtitle">
        View, edit, close or delete your internship postings.
      </p>

      <div className="rd-job-list">

        {internships.map((item) => (
          <div key={item.id} className="rd-job-card">

            {/* Internship Info */}
            <div className="rd-job-card-left">
              <h3 className="rd-job-title">{item.title}</h3>

              <p className="rd-job-meta">
                Stipend: <span>{item.stipend}</span>
              </p>

              <p className="rd-job-meta">
                Duration: <span>{item.duration}</span>
              </p>

              <p className="rd-job-meta">
                Posted on: <span>{item.posted}</span>
              </p>

              <p className={`rd-job-status ${item.status === "Active" ? "active" : "closed"}`}>
                {item.status}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="rd-job-card-actions">

              {/* 🔥 EDIT INTERNSHIP */}
              <button
                className="rd-action-btn edit"
                onClick={() =>
                  navigate(`/recruiter-dashboard/jobs/edit-internship/${item.id}`)
                }
              >
                Edit
              </button>

              {/* 🔥 VIEW APPLICATIONS */}
              <button
                className="rd-action-btn apps"
                onClick={() =>
                  navigate("/recruiter-dashboard/applications/internships")
                }
              >
                View Applications
              </button>

              <button className="rd-action-btn delete">Delete</button>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
