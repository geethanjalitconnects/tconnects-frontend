import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";

export default function FreelancerProfessionalDetails() {
  const [data, setData] = useState({
    area_of_expertise: "",
    years_of_experience: "",
    job_category: "",
    professional_bio: "",
  });

  const [loading, setLoading] = useState(true);

  // =======================================
  // 1️⃣ LOAD EXISTING PROFESSIONAL DETAILS
  // =======================================
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(
          "/api/profiles/freelancer/professional-details/"
        );
        const d = res.data;

        setData({
          area_of_expertise: d.area_of_expertise || "",
          years_of_experience: d.years_of_experience || "",
          job_category: d.job_category || "",
          professional_bio: d.professional_bio || "",
        });
      } catch (error) {
        console.error("Error loading professional details:", error);
        toast.error("Unable to load professional details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  // =======================================
  // 2️⃣ HANDLE INPUTS
  // =======================================
  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  // =======================================
  // 3️⃣ SAVE (PATCH)
  // =======================================
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await api.patch(
        "/api/profiles/freelancer/professional-details/",
        data
      );

      toast.success("Professional details updated successfully!");
    } catch (error) {
      console.error("Error updating professional details:", error);
      toast.error("Unable to update details. Try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="fr-page">
      <form className="fr-card fr-form" onSubmit={handleSave}>
        <h2 className="fr-title">Professional Details</h2>

        {/* Expertise */}
        <div className="fr-row">
          <label className="fr-label">Area of expertise (comma separated)</label>
          <input
            name="area_of_expertise"
            value={data.area_of_expertise}
            onChange={handleChange}
            className="fr-input"
            placeholder="UI, Frontend, React"
          />
        </div>

        {/* Experience + Job Category */}
        <div className="fr-row fr-two-col">
          <div>
            <label className="fr-label">Years of experience</label>
            <input
              name="years_of_experience"
              value={data.years_of_experience}
              onChange={handleChange}
              className="fr-input"
              placeholder="e.g. 5"
            />
          </div>

          <div>
            <label className="fr-label">Job categories</label>
            <input
              name="job_category"
              value={data.job_category}
              onChange={handleChange}
              className="fr-input"
              placeholder="Design, Web development"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="fr-row">
          <label className="fr-label">Professional bio</label>
          <textarea
            name="professional_bio"
            value={data.professional_bio}
            onChange={handleChange}
            className="fr-textarea"
            placeholder="Short summary about you..."
            rows={6}
          />
        </div>

        <div className="fr-actions">
          <button className="fr-btn fr-btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
}
