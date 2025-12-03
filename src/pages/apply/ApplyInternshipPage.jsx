// ApplyInternshipPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../config/api"; // ✅ Using your global Axios instance
import "./ApplyJobPage.css"; // Using same CSS (correct)

const ApplyInternshipPage = () => {
  const [searchParams] = useSearchParams();
  const internshipId = searchParams.get("id"); // 📌 Get internship ID from URL

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [user, setUser] = useState(null);
  const [popup, setPopup] = useState(false);

  // ============================================================
  // 1. FETCH CANDIDATE PROFILE FROM BACKEND
  // ============================================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profiles/candidate/me/");
        setUser({
          name: res.data.full_name,
          email: res.data.email,
          phone: res.data.phone_number,
          location: res.data.location,
          skills: res.data.skills,
          bio: res.data.bio,
          resume: res.data.resume_url,
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ============================================================
  // 2. SUBMIT INTERNSHIP APPLICATION
  // ============================================================
  const handleSubmit = async () => {
    if (!internshipId) {
      alert("Invalid internship ID");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/api/applications/internship/apply/", {
        internship_id: Number(internshipId),
        cover_letter: "",
      });

      setPopup(true);

      setTimeout(() => {
        setPopup(false);
        window.close();
      }, 1800);
    } catch (err) {
      console.error("Application failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // UI
  // ============================================================

  if (loading) return <div className="apply-loading">Loading...</div>;

  return (
    <div className="apply-wrapper">
      <div className="apply-container">

        <h1 className="apply-title">Quick Profile Review</h1>

        {/* Profile Card */}
        <div className="apply-card">

          <div className="apply-row">
            <span className="apply-label">Full Name</span>
            <span className="apply-value">{user?.name}</span>
          </div>

          <div className="apply-row">
            <span className="apply-label">Email</span>
            <span className="apply-value">{user?.email}</span>
          </div>

          <div className="apply-row">
            <span className="apply-label">Phone Number</span>
            <span className="apply-value">+91 {user?.phone}</span>
          </div>

          <div className="apply-row">
            <span className="apply-label">Location</span>
            <span className="apply-value">{user?.location}</span>
          </div>

          <div className="apply-row">
            <span className="apply-label">Skills</span>
            <div className="apply-tags">
              {user?.skills?.map((skill, idx) => (
                <span key={idx} className="apply-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="apply-row">
            <span className="apply-label">Bio</span>
            <span className="apply-value">{user?.bio}</span>
          </div>

          <div className="apply-row">
            <span className="apply-label">Resume</span>
            <button
              className="resume-btn"
              onClick={() => window.open(user?.resume, "_blank")}
            >
              View Resume
            </button>
          </div>

        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>

      {popup && (
        <div className="apply-popup">
          <div className="apply-popup-card">
            <div className="popup-icon">✓</div>
            <h3>Application Submitted</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyInternshipPage;
