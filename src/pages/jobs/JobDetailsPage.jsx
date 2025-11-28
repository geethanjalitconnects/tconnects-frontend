// JobDetailsPage.jsx
import React from "react";
import "./JobDetailsPage.css";

const JobDetailsPage = () => {
  return (
    <div className="jd-container">

      {/* =======================
          JOB HEADER SECTION
      ======================== */}
      <div className="jd-header-card">
        <div className="jd-header-left">

          <h1 className="jd-title">Fraud Risk Investigator</h1>

          <div className="jd-meta">
            <span className="jd-badge">Risk Management</span>
            <span className="jd-meta-item">Paytm</span>
            <span className="jd-meta-item">Noida, India</span>
            <span className="jd-meta-item">Full-Time</span>
            <span className="jd-meta-item">₹6–9 LPA</span>
            <span className="jd-meta-item">3+ years experience</span>
            <span className="jd-meta-item">Posted 1 week ago</span>
            <span className="jd-meta-item">Deadline: 30 Dec 2025</span>
            {/* Removed: Apply Before */}
          </div>
        </div>

        <div className="jd-header-right">
          <button className="jd-apply-btn">Apply Now</button>
          <button className="jd-save-btn">Save Job</button>
        </div>
      </div>

      {/* =======================
          COMPANY OVERVIEW
      ======================== */}
      <div className="jd-section-card">
        <h2 className="jd-section-title">Company Overview</h2>

        <div className="jd-company-grid">
          <div className="jd-company-item"><strong>Company Size:</strong> 5,000+ Employees</div>
          <div className="jd-company-item"><strong>Industry:</strong> FinTech / Payments</div>
          <div className="jd-company-item">
            <strong>Website:</strong>{" "}
            <a href="https://paytm.com" target="_blank" rel="noopener noreferrer">
              www.paytm.com
            </a>
          </div>
        </div>

        <p className="jd-company-about">
          Paytm is India’s largest payments company, providing secure and seamless financial
          technology solutions to millions of users.
        </p>
      </div>

      {/* =======================
          JOB RESPONSIBILITIES
      ======================== */}
      <div className="jd-section-card">
        <h2 className="jd-section-title">Job Responsibilities</h2>

        <ul className="jd-list">
          <li>Investigate suspicious transactions and detect fraud patterns.</li>
          <li>Monitor daily transaction activities and raise alerts.</li>
          <li>Collaborate with risk and compliance teams.</li>
          <li>Prepare risk assessment reports.</li>
        </ul>
      </div>

      {/* =======================
          REQUIRED SKILLS
      ======================== */}
      <div className="jd-section-card">
        <h2 className="jd-section-title">Required Skills</h2>

        <div className="jd-tags">
          <span className="jd-tag">Fraud Detection</span>
          <span className="jd-tag">SQL</span>
          <span className="jd-tag">AML</span>
          <span className="jd-tag">Transaction Monitoring</span>
        </div>

        <div className="jd-education">
          <strong>Educational Qualification:</strong>{" "}
          Bachelor’s Degree in Finance, Economics, Computer Science,
          or related fields.
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
