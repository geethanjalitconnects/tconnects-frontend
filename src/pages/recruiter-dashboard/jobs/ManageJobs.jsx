import React from "react";
import { useNavigate } from "react-router-dom";
import "../RecruiterDashboard.css"; // adjust path if needed

export default function ManageJobs() {
  const navigate = useNavigate();

  // Sample job data (later you will replace this with backend API data)
  const jobs = [
    {
      id: 1,
      title: "Senior Risk Analyst",
      posted: "12 Dec 2025",
      status: "Active",
    },
    {
      id: 2,
      title: "Financial Risk Manager",
      posted: "08 Dec 2025",
      status: "Closed",
    },
    {
      id: 3,
      title: "Compliance & AML Specialist",
      posted: "01 Dec 2025",
      status: "Active",
    },
  ];

  return (
    <div className="rd-managejobs-page">

      <h2 className="rd-page-title">Manage Jobs</h2>
      <p className="rd-page-subtitle">
        View, edit, close or delete your posted jobs.
      </p>

      <div className="rd-job-list">

        {jobs.map((job) => (
          <div key={job.id} className="rd-job-card">

            {/* Job Info */}
            <div className="rd-job-card-left">
              <h3 className="rd-job-title">{job.title}</h3>

              <p className="rd-job-meta">
                Posted on: <span>{job.posted}</span>
              </p>

              <p className={`rd-job-status ${job.status === "Active" ? "active" : "closed"}`}>
                {job.status}
              </p>
            </div>

            {/* Actions */}
            <div className="rd-job-card-actions">

              {/* ⭐ EDIT JOB */}
              <button
                className="rd-action-btn edit"
                onClick={() =>
                  navigate(`/recruiter-dashboard/jobs/edit-job/${job.id}`)
                }
              >
                Edit
              </button>

              {/* ⭐ VIEW APPLICATIONS */}
              <button
                className="rd-action-btn apps"
                onClick={() =>
                  navigate("/recruiter-dashboard/applications/jobs")
                }
              >
                View Applications
              </button>

              {/* ⭐ DELETE (UI only for now) */}
              <button className="rd-action-btn delete">
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
