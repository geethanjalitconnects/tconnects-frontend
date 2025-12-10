import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../config/api";
import { AuthContext } from "../../context/AuthContext";
import "./ApplyJobPage.css"; // ⭐ Using the same CSS

export default function ApplyInternshipPage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState(false);
  const [internshipDetails, setInternshipDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get internshipId from URL query parameter
  const internshipId = new URLSearchParams(location.search).get("internshipId");

  // Load internship details
  useEffect(() => {
    const loadInternshipDetails = async () => {
      if (!internshipId) {
        toast.error("No internship ID provided");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/internships/${internshipId}/`);
        setInternshipDetails(res.data);
      } catch (err) {
        console.error("Failed to load internship:", err);
        toast.error("Failed to load internship details");
      } finally {
        setLoading(false);
      }
    };

    loadInternshipDetails();
  }, [internshipId]);

  // ⭐ Validate profile completeness
  const isProfileComplete = () => {
    const p = currentUser?.profile;

    const complete = (
      currentUser?.full_name &&
      p?.phone_number &&
      p?.location &&
      p?.skills?.length > 0 &&
      p?.bio &&
      p?.resume
    );

    console.log("Profile completeness check:", {
      full_name: !!currentUser?.full_name,
      phone_number: !!p?.phone_number,
      location: !!p?.location,
      skills: p?.skills?.length > 0,
      bio: !!p?.bio,
      resume: !!p?.resume,
      complete
    });

    return complete;
  };

  const handleSubmit = async () => {
    if (!isProfileComplete()) {
      toast.error("Please complete your profile before applying.");
      setTimeout(() => {
        navigate("/candidate-dashboard/profile");
      }, 2000);
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

      toast.success("Application submitted successfully!");
      setPopup(true);

      setTimeout(() => {
        setPopup(false);
        navigate(-1); // Go back to previous page
      }, 1800);

    } catch (err) {
      console.error("Application error:", err);
      const errorMsg = err?.response?.data?.error || 
                       err?.response?.data?.message || 
                       "Something went wrong.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="apply-container">
        <div className="apply-loading">Loading internship details...</div>
      </div>
    );
  }

  if (!internshipId || !internshipDetails) {
    return (
      <div className="apply-container">
        <div className="apply-error">
          <h2>Internship Not Found</h2>
          <p>The internship you're trying to apply for doesn't exist.</p>
          <button onClick={() => navigate("/internships")} className="apply-btn">
            Browse Internships
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-container">
      <div className="apply-card">
        <h1 className="apply-title">Apply for Internship</h1>

        {/* Internship Summary */}
        <div className="apply-job-summary">
          <h2>{internshipDetails.title}</h2>
          <p className="apply-company">{internshipDetails.company_name}</p>
          <p className="apply-location">📍 {internshipDetails.location}</p>
          <p className="apply-experience">⏱️ {internshipDetails.duration}</p>
          {internshipDetails.stipend && (
            <p className="apply-salary">💰 ₹{internshipDetails.stipend}/month</p>
          )}
          {internshipDetails.internship_type && (
            <p className="apply-location">
              🏢 {internshipDetails.internship_type === 'remote' ? 'Remote' : 
                  internshipDetails.internship_type === 'onsite' ? 'On-site' : 
                  'Hybrid'}
            </p>
          )}
        </div>

        {/* Profile Completeness Check */}
        <div className="apply-requirements">
          <h3>Application Requirements</h3>
          <div className="apply-checklist">
            <CheckItem 
              label="Full Name" 
              completed={!!currentUser?.full_name} 
            />
            <CheckItem 
              label="Phone Number" 
              completed={!!currentUser?.profile?.phone_number} 
            />
            <CheckItem 
              label="Location" 
              completed={!!currentUser?.profile?.location} 
            />
            <CheckItem 
              label="Skills" 
              completed={currentUser?.profile?.skills?.length > 0} 
            />
            <CheckItem 
              label="Bio" 
              completed={!!currentUser?.profile?.bio} 
            />
            <CheckItem 
              label="Resume" 
              completed={!!currentUser?.profile?.resume} 
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="apply-actions">
          <button
            disabled={submitting || !isProfileComplete()}
            onClick={handleSubmit}
            className="apply-btn apply-btn-primary"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>

          <button
            onClick={handleCancel}
            className="apply-btn apply-btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>

        {!isProfileComplete() && (
          <div className="apply-warning">
            ⚠️ Please complete all required fields in your profile before applying.
            <button 
              onClick={() => navigate("/candidate-dashboard/profile")}
              className="apply-link-btn"
            >
              Go to Profile →
            </button>
          </div>
        )}
      </div>

      {/* Success Popup */}
      {popup && (
        <div className="apply-success-overlay">
          <div className="apply-success-popup">
            <div className="apply-success-icon">✓</div>
            <h2>Application Submitted!</h2>
            <p>Your internship application has been sent successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for checklist items
function CheckItem({ label, completed }) {
  return (
    <div className={`check-item ${completed ? 'completed' : 'incomplete'}`}>
      <span className="check-icon">{completed ? '✓' : '✗'}</span>
      <span className="check-label">{label}</span>
    </div>
  );
}