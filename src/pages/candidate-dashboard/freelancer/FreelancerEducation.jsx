import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";

export default function FreelancerEducation() {
  const [list, setList] = useState([]);
  const [entry, setEntry] = useState({
    degree: "",
    institution: "",
    start_year: "",
    end_year: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  // =====================================
  // 1️⃣ Load existing education from backend
  // =====================================
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await api.get("/api/profiles/freelancer/education/");
        setList(res.data);
      } catch (error) {
        toast.error("Unable to load education records.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  // =====================================
  // 2️⃣ Handle Add Education (POST)
  // =====================================
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!entry.degree || !entry.institution) {
      toast.error("Degree and Institution are required.");
      return;
    }

    try {
      const res = await api.post(
        "/api/profiles/freelancer/education/",
        entry
      );

      // Append newly added backend record
      setList((prev) => [...prev, res.data]);

      toast.success("Education added successfully!");

      // Reset form fields
      setEntry({
        degree: "",
        institution: "",
        start_year: "",
        end_year: "",
        description: "",
      });
    } catch (error) {
      toast.error("Failed to add education. Try again.");
      console.error(error);
    }
  };

  // =====================================
  // 3️⃣ Handle Delete Education (DELETE)
  // =====================================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/profiles/freelancer/education/${id}/`);

      // Update local list
      setList((prev) => prev.filter((item) => item.id !== id));

      toast.success("Education removed successfully.");
    } catch (error) {
      toast.error("Failed to delete education.");
      console.error(error);
    }
  };

  // =====================================
  // Loading state
  // =====================================
  if (loading) return <p>Loading...</p>;

  return (
    <div className="fr-page">
      <div className="fr-card">
        <h2 className="fr-title">Education</h2>

        {/* ADD EDUCATION FORM */}
        <form className="fr-form" onSubmit={handleAdd}>
          <div className="fr-row fr-two-col">
            <input
              className="fr-input"
              placeholder="Degree"
              value={entry.degree}
              onChange={(e) =>
                setEntry({ ...entry, degree: e.target.value })
              }
              required
            />
            <input
              className="fr-input"
              placeholder="Institution"
              value={entry.institution}
              onChange={(e) =>
                setEntry({ ...entry, institution: e.target.value })
              }
              required
            />
          </div>

          <div className="fr-row fr-two-col">
            <input
              className="fr-input"
              placeholder="Start year (e.g., 2020)"
              value={entry.start_year}
              onChange={(e) =>
                setEntry({ ...entry, start_year: e.target.value })
              }
            />
            <input
              className="fr-input"
              placeholder="End year (e.g., 2023)"
              value={entry.end_year}
              onChange={(e) =>
                setEntry({ ...entry, end_year: e.target.value })
              }
            />
          </div>

          <div className="fr-row">
            <textarea
              className="fr-textarea"
              placeholder="Description (optional)"
              value={entry.description}
              onChange={(e) =>
                setEntry({ ...entry, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="fr-actions">
            <button className="fr-btn fr-btn-primary">Add +</button>
          </div>
        </form>

        {/* SAVED EDUCATION LIST */}
        <div className="fr-section">
          <h3 className="fr-subtitle">Saved Education</h3>

          {list.length === 0 && (
            <p className="fr-muted">No education records added yet.</p>
          )}

          <ul className="fr-list">
            {list.map((it) => (
              <li key={it.id} className="fr-list-item">
                <div>
                  <strong>{it.degree}</strong> — {it.institution} (
                  {it.start_year || "N/A"} — {it.end_year || "N/A"})
                  <p className="fr-muted">{it.description}</p>
                </div>

                <button
                  className="fr-btn fr-btn-ghost"
                  onClick={() => handleDelete(it.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
