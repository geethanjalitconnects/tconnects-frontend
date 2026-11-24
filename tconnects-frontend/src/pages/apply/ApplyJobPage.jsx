import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../config/api";
import { AuthContext } from "../../context/AuthContext";
import "./ApplyJobPage.css";

export default function ApplyJobPage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [submitting, setSubmitting] = useState(false);
  const [popup, setPopup] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get jobId from URL query parameter
  const jobId = new URLSearchParams(location.search).get("jobId");

  // Load job details and profile
  useEffect(() => {
    const loadData = async () => {
      if (!jobId) {
        toast.error("No job ID provided");
        setLoading(false);
        return;
      }

      try {
        // Load job details
        const jobRes = await api.get(`/api/jobs/${jobId}/`);
        setJobDetails(jobRes.data);

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
  }, [jobId]);

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

    if (!jobId) {
      toast.error("Invalid Job ID.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/api/applications/job/apply/", {
        job_id: Number(jobId),
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
        <div className="apply-loading">Loading job details...</div>
      </div>
    );
  }

  if (!jobId || !jobDetails) {
    return (
      <div className="apply-container">
        <div className="apply-error">
          <h2>Job Not Found</h2>
          <p>The job you're trying to apply for doesn't exist.</p>
          <button onClick={() => navigate("/jobs")} className="apply-btn">
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-container">
      <div className="apply-card">
        <h1 className="apply-title">Apply for Job</h1>

        {/* Job Summary */}
        <div className="apply-job-summary">
          <h2>{jobDetails.title}</h2>
          <p className="apply-company">{jobDetails.company_name}</p>
          <p className="apply-location">📍 {jobDetails.location}</p>
          <p className="apply-experience">💼 {jobDetails.experience_range}</p>
          {jobDetails.salary_range && (
            <p className="apply-salary">💰 {jobDetails.salary_range}</p>
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
            <p>Your application has been sent successfully.</p>
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