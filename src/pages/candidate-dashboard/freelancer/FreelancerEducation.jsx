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
  });

  const [loading, setLoading] = useState(true);

  // =====================================
  // 1️⃣ Load saved education
  // =====================================
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await api.get("/api/profiles/freelancer/education/");
        setList(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load education records.");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  // =====================================
  // 2️⃣ Add new education
  // =====================================
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!entry.degree || !entry.institution) {
      toast.error("Degree and Institution are required.");
      return;
    }

    try {
      const res = await api.post("/api/profiles/freelancer/education/", entry);

      setList((prev) => [...prev, res.data]);

      toast.success("Education added successfully!");

      setEntry({
        degree: "",
        institution: "",
        start_year: "",
        end_year: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add education.");
    }
  };

  // =====================================
  // 3️⃣ Delete education
  // =====================================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/profiles/freelancer/education/${id}/`);

      setList((prev) => prev.filter((item) => item.id !== id));

      toast.success("Education removed.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="fr-page">
      <div className="fr-card">
        <h2 className="fr-title">Education</h2>

        {/* Add Education Form */}
        <form className="fr-form" onSubmit={handleAdd}>
          <div className="fr-row fr-two-col">
            <input
              className="fr-input"
              placeholder="Degree (e.g., BSc Computer Science)"
              value={entry.degree}
              onChange={(e) => setEntry({ ...entry, degree: e.target.value })}
              required
            />

            <input
              className="fr-input"
              placeholder="Institution (e.g., VIT, IIT)"
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
              onChange={(e) => setEntry({ ...entry, end_year: e.target.value })}
            />
          </div>

          <div className="fr-actions">
            <button className="fr-btn fr-btn-primary">Add +</button>
          </div>
        </form>

        {/* Saved Education */}
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
