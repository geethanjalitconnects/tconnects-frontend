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
  const [error, setError] = useState("");

  // ================================
  // Dynamic Placeholders for Risk Management
  // ================================
  const placeholderExpertise =
    data.job_category.toLowerCase().includes("risk")
      ? "Risk assessment, compliance, mitigation"
      : "UI, Frontend, React";

  const placeholderYears =
    data.job_category.toLowerCase().includes("risk")
      ? "e.g., 3"
      : "e.g., 5";

  const placeholderJobCategory =
    data.job_category.toLowerCase().includes("risk")
      ? "Risk management, Compliance, Audit"
      : "Design, Web development";

  const placeholderBio =
    data.job_category.toLowerCase().includes("risk")
      ? "Experienced in identifying and mitigating organizational risks."
      : "Short summary about you...";

  // ================================
  // 1️⃣ LOAD EXISTING DATA
  // ================================
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
        toast.error("Unable to load professional details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  // ================================
  // 2️⃣ HANDLE INPUT CHANGES
  // ================================
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // ================================
  // 3️⃣ SAVE DETAILS (PATCH)
  // ================================
  const handleSave = async (e) => {
    e.preventDefault();

    if (error) {
      toast.error("Please fix validation errors before saving.");
      return;
    }

    const payload = {
      ...data,
      years_of_experience:
        data.years_of_experience === ""
          ? null
          : Number(data.years_of_experience),
    };

    try {
      await api.patch(
        "/api/profiles/freelancer/professional-details/",
        payload
      );

      toast.success("Professional details updated successfully!");
    } catch (error) {
      toast.error("Unable to update details.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="fr-page">
      <form className="fr-card fr-form" onSubmit={handleSave}>
        <h2 className="fr-title">Professional Details</h2>

        {/* Expertise */}
        <div className="fr-row">
          <label className="fr-label">Area of expertise</label>
          <input
            name="area_of_expertise"
            value={data.area_of_expertise}
            onChange={handleChange}
            className="fr-input"
            placeholder={placeholderExpertise}
          />
        </div>

        {/* Years + Category */}
        <div className="fr-row fr-two-col">
          <div>
            <label className="fr-label">Years of experience</label>
            <input
              name="years_of_experience"
              value={data.years_of_experience}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "" || /^[0-9]+$/.test(value)) {
                  setError("");
                  setData({ ...data, years_of_experience: value });
                } else {
                  setError("Please enter a valid number (e.g., 3).");
                }
              }}
              className={`fr-input ${error ? "fr-input-error" : ""}`}
              placeholder={placeholderYears}
            />
            {error && <p className="fr-error-text">{error}</p>}
          </div>

          <div>
            <label className="fr-label">Job categories</label>
            <input
              name="job_category"
              value={data.job_category}
              onChange={handleChange}
              className="fr-input"
              placeholder={placeholderJobCategory}
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
            placeholder={placeholderBio}
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
