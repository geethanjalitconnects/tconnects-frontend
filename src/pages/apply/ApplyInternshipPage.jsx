import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../config/api";
import { AuthContext } from "../context/AuthContext";

export default function ApplyInternshipPage() {
  const { currentUser } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState(false);

  const location = useLocation();
  const internshipId = new URLSearchParams(location.search).get("internshipId");

  // ⭐ Validate profile completeness
  const isProfileComplete = () => {
    const p = currentUser?.profile;

    return (
      currentUser?.full_name &&
      p?.phone_number &&
      p?.location &&
      p?.skills?.length > 0 &&
      p?.bio &&
      p?.resume
    );
  };

  const handleSubmit = async () => {
    if (!isProfileComplete()) {
      toast.error("Please complete your profile before applying.");
      return;
    }

    if (!internshipId) {
      toast.error("Invalid Internship ID.");
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
      toast.error(err?.response?.data?.error || "Something went wrong.");
    }

    setSubmitting(false);
  };

  return (
    <div className="apply-container">
      <h2>Submit Your Internship Application</h2>

      <button
        disabled={submitting}
        onClick={handleSubmit}
        className="apply-btn"
      >
        {submitting ? "Submitting..." : "Apply Now"}
      </button>

      {popup && <div className="success-popup">Application Submitted!</div>}
    </div>
  );
}
