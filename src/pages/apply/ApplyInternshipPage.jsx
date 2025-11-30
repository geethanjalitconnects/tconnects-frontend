// ApplyInternshipPage.jsx
import React, { useEffect, useState } from "react";
import "./ApplyJobPage.css"; // using same CSS for consistent design

const ApplyInternshipPage = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "9876543210",
    location: "Chennai",
    skills: ["Excel", "Communication", "Teamwork"],
    bio: "A motivated student seeking internship experience.",
    resume: "resume.pdf",
  });

  const [popup, setPopup] = useState(false);

  // Load real data if available
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) setUser(userData);
  }, []);

  const handleSubmit = () => {
    setPopup(true);

    setTimeout(() => {
      setPopup(false);
      window.close();
    }, 1800);
  };

  return (
    <div className="apply-wrapper">
      <div className="apply-container">

        <h1 className="apply-title">Quick Profile Review</h1>

        {/* Profile Card */}
        <div className="apply-card">
          <div className="apply-row">
            <span className="apply-label">Full Name</span>
            <span className="apply-value">{user.name}</span>
          </div>

          <div className="apply-row">
            <span className="apply-label">Email</span>
            <span className="apply-value">{user.email}</span>
          </div>

          <div className="apply-row">
            <span className="apply-label">Phone Number</span>
            <span className="apply-value">+91 {user.phone}</span>
          </div>

          <div className="apply-row">
            <span className="apply-label">Location</span>
            <span className="apply-value">{user.location}</span>
          </div>

          <div className="apply-row">
            <span className="apply-label">Skills</span>
            <div className="apply-tags">
              {user.skills.map((skill, idx) => (
                <span key={idx} className="apply-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="apply-row">
            <span className="apply-label">Bio</span>
            <span className="apply-value">{user.bio}</span>
          </div>

          <div className="apply-row">
            <span className="apply-label">Resume</span>
            <button className="resume-btn">View Resume</button>
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit Application
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
