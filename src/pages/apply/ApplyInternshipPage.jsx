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
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get internshipId from URL query parameter
  const internshipId = new URLSearchParams(location.search).get("internshipId");

  // Load internship details and profile
  useEffect(() => {
    const loadData = async () => {
      if (!internshipId) {
        toast.error("No internship ID provided");
        setLoading(false);
        return;
      }

      try {
        // Load internship details
        const internshipRes = await api.get(`/api/internships/${internshipId}/`);
        setInternshipDetails(internshipRes.data);

        // Load candidate profile
        const profileRes = await api.get("/api/profiles/candidate/me/");
        setProfileData(profileRes.data);
      } catch (err) {
        console.error("Failed to load data:", err);
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [internshipId]);

  // ⭐ Validate profile completeness based on your Profile.jsx structure
  const isProfileComplete = () => {
    if (!profileData) return false;

    const complete = (
      profileData.user?.full_name &&
      profileData.phone_number &&
      profileData.location &&
      profileData.skills?.length > 0 &&
      profileData.bio &&
      profileData.resume
    );

    console.log("Profile completeness check:", {
      full_name: !!profileData.user?.full_name,
      phone_number: !!profileData.phone_number,
      location: !!profileData.location,
      skills: profileData.skills?.length > 0,
      bio: !!profileData.bio,
      resume: !!profileData.resume,
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
              completed={!!profileData?.user?.full_name} 
            />
            <CheckItem 
              label="Phone Number" 
              completed={!!profileData?.phone_number} 
            />
            <CheckItem 
              label="Location" 
              completed={!!profileData?.location} 
            />
            <CheckItem 
              label="Skills" 
              completed={profileData?.skills?.length > 0} 
            />
            <CheckItem 
              label="Bio" 
              completed={!!profileData?.bio} 
            />
            <CheckItem 
              label="Resume" 
              completed={!!profileData?.resume} 
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