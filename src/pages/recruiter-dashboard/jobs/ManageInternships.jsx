// ManageInternships.jsx — Backend Integrated
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import "../RecruiterDashboard.css";

export default function ManageInternships() {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // 1. FETCH ALL INTERNSHIPS POSTED BY LOGGED-IN RECRUITER
  // ============================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/internships/my-internships/");
        setInternships(res.data);
      } catch (err) {
        console.error("Failed to load internships:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ============================================================
  // 2. DELETE INTERNSHIP
  // ============================================================
  const deleteInternship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship?")) return;

    try {
      await api.delete(`/api/internships/${id}/delete/`);
      setInternships(internships.filter((i) => i.id !== id));
      alert("Internship deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete internship.");
    }
  };

  // ============================================================
  // 3. TOGGLE STATUS (Active <-> Closed)
  // ============================================================
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Closed" : "Active";

      const res = await api.patch(`/api/internships/${id}/status/`, {
        status: newStatus,
      });

      setInternships(
        internships.map((i) =>
          i.id === id ? { ...i, status: res.data.status } : i
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading) return <div className="rd-loading">Loading Internships…</div>;

  return (
    <div className="rd-managejobs-page">
      <h2 className="rd-page-title">Manage Internships</h2>
      <p className="rd-page-subtitle">
        View, edit, close or delete your internship postings.
      </p>

      <div className="rd-job-list">
        {internships.length === 0 && (
          <p className="rd-empty-text">No internships posted yet.</p>
        )}

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
                Posted on: <span>{item.posted_on}</span>
              </p>

              <p
                className={`rd-job-status ${
                  item.status === "Active" ? "active" : "closed"
                }`}
              >
                {item.status}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="rd-job-card-actions">

              {/* Edit Internship */}
              <button
                className="rd-action-btn edit"
                onClick={() =>
                  navigate(`/recruiter-dashboard/jobs/edit-internship/${item.id}`)
                }
              >
                Edit
              </button>

              {/* View Applications */}
              <button
                className="rd-action-btn apps"
                onClick={() =>
                  navigate("/recruiter-dashboard/applications/internships")
                }
              >
                View Applications
              </button>

              {/* Toggle Status */}
              <button
                className="rd-action-btn status"
                onClick={() => toggleStatus(item.id, item.status)}
              >
                {item.status === "Active" ? "Close Internship" : "Reopen Internship"}
              </button>

              {/* Delete Internship */}
              <button
                className="rd-action-btn delete"
                onClick={() => deleteInternship(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
