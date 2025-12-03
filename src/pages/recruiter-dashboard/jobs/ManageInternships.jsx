// ManageInternships.jsx — SAME DESIGN AS ManageJobs (No Status)
import React, { useEffect, useState } from "react";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function ManageInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Internships
  const loadInternships = async () => {
    try {
      const res = await api.get("/api/internships/");
      setInternships(res.data);
    } catch (err) {
      console.error("Failed to load internships:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  // Delete Internship
  const deleteInternship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship?")) return;

    try {
      await api.delete(`/api/internships/${id}/delete/`);
      alert("Internship deleted successfully!");
      loadInternships();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete internship.");
    }
  };

  if (loading) return <div className="rd-loading">Loading internships...</div>;

  return (
    <div className="rd-managejobs-page">
      <h2 className="rd-page-title">Manage Internships</h2>
      <p className="rd-page-subtitle">View, edit or delete your posted internships.</p>

      <div className="rd-job-list">
        {internships.length === 0 ? (
          <p className="rd-empty">No internships posted yet.</p>
        ) : (
          internships.map((internship) => (
            <div key={internship.id} className="rd-job-card">

              {/* LEFT SECTION */}
              <div className="rd-job-card-left">
                <h3 className="rd-job-title">{internship.title}</h3>

                <p className="rd-job-meta">
                  <span>Category:</span> {internship.category || "N/A"} &nbsp; | &nbsp;
                  <span>Location:</span> {internship.location || "N/A"} &nbsp; | &nbsp;
                  <span>Mode:</span> {internship.internship_type || "N/A"} &nbsp; | &nbsp;
                  <span>Duration:</span> {internship.duration || "N/A"} &nbsp; | &nbsp;
                  <span>Stipend:</span> {internship.stipend || "N/A"}
                </p>
              </div>

              {/* RIGHT SECTION */}
              <div className="rd-job-card-actions">

                {/* EDIT BUTTON */}
                <button
                  className="rd-action-btn edit"
                  onClick={() =>
                    (window.location.href = `/recruiter-dashboard/jobs/edit-internship/${internship.id}`)
                  }
                >
                  Edit
                </button>

                {/* VIEW APPLICATIONS BUTTON */}
                <button
                  className="rd-action-btn apps"
                  onClick={() =>
                    (window.location.href = `/recruiter-dashboard/applications/internships?internship_id=${internship.id}`)
                  }
                >
                  View Applications
                </button>

                {/* DELETE BUTTON */}
                <button
                  className="rd-action-btn delete"
                  onClick={() => deleteInternship(internship.id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
