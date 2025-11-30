// JobDetailsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobDetailsPage.css";

const JobDetailsPage = () => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate("/apply-job");
  };

  return (
    <div className="jd-desktop-wrapper">
      <div className="jd-container">

        {/* ======================= JOB HEADER ======================= */}
        <div className="jd-header-card">
          <div className="jd-header-left">

            <h1 className="jd-title">Senior Risk Analyst</h1>

            <div className="jd-meta">
              <span className="jd-badge">Risk Management</span>
              <span className="jd-meta-item">ICICI Bank</span>
              <span className="jd-meta-item">Hyderabad, India</span>
              <span className="jd-meta-item">4–6 Years Experience</span>
              <span className="jd-meta-item">₹12–16 LPA</span>
              <span className="jd-meta-item">Full-Time</span>
              <span className="jd-meta-item">Deadline: 30 Dec 2025</span>
            </div>
          </div>

          <div className="jd-header-right">
            <button className="jd-apply-btn" onClick={handleApplyNow}>
              Apply Now
            </button>
            <button className="jd-save-btn">Save Job</button>
          </div>
        </div>

        {/* ======================= COMPANY OVERVIEW ======================= */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Company Overview</h2>

          <div className="jd-company-grid">
            <div className="jd-company-item"><strong>Company Size:</strong> 20,000+ Employees</div>
            <div className="jd-company-item"><strong>Industry:</strong> Banking / Finance</div>
            <div className="jd-company-item">
              <strong>Website:</strong>{" "}
              <a href="https://www.icicibank.com" target="_blank" rel="noopener noreferrer">
                www.icicibank.com
              </a>
            </div>
          </div>

          <p className="jd-company-about">
            ICICI Bank is a leading private sector bank offering banking and financial services 
            with a strong focus on digital innovation and customer satisfaction.
          </p>
        </div>

        {/* ======================= JOB DESCRIPTION (NEW) ======================= */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Job Description</h2>
          <p className="jd-description">
            The Senior Risk Analyst is responsible for analyzing financial risks, evaluating 
            market and credit exposure, preparing risk assessment reports, and supporting 
            senior managers in forming risk mitigation strategies. You will work across 
            departments, ensuring compliance and contributing to high-level financial decisions.
          </p>
        </div>

        {/* ======================= RESPONSIBILITIES ======================= */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Job Responsibilities</h2>

          <ul className="jd-list">
            <li>Perform financial and operational risk analysis.</li>
            <li>Develop and maintain risk monitoring dashboards.</li>
            <li>Investigate suspicious transactions.</li>
            <li>Prepare risk assessment reports.</li>
            <li>Collaborate across teams for risk mitigation.</li>
          </ul>
        </div>

        {/* ======================= SKILLS ======================= */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Required Skills</h2>

          <div className="jd-tags">
            <span className="jd-tag">SQL</span>
            <span className="jd-tag">Excel</span>
            <span className="jd-tag">Risk Modelling</span>
            <span className="jd-tag">Python</span>
            <span className="jd-tag">Data Analysis</span>
          </div>

          <div className="jd-education">
            <strong>Eligible Degrees:</strong> MBA, B.Tech, BBA, B.Com, CA, Finance-specific degrees.
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobDetailsPage;
