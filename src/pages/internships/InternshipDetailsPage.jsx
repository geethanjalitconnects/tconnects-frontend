// InternshipDetailsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./InternshipDetailsPage.css";

const InternshipDetailsPage = () => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate("/apply-internship");
  };

  return (
    <div className="jd-desktop-wrapper">
      <div className="jd-container">

        {/* ======================= INTERNSHIP HEADER ======================== */}
        <div className="jd-header-card">
          <div className="jd-header-left">
            <h1 className="jd-title">Risk Analytics Intern</h1>

            <div className="jd-meta">
              <span className="jd-badge">Risk Management</span>
              <span className="jd-meta-item">HDFC Bank</span>
              <span className="jd-meta-item">Mumbai, India</span>
              <span className="jd-meta-item">2 Months Internship</span>
              <span className="jd-meta-item">Stipend: ₹10,000</span>
              <span className="jd-meta-item">Hybrid</span>
              <span className="jd-meta-item">Deadline: 25 Dec 2025</span>
            </div>
          </div>

          <div className="jd-header-right">
            <button className="jd-apply-btn" onClick={handleApplyNow}>
              Apply Now
            </button>
            <button className="jd-save-btn">Save Internship</button>
          </div>
        </div>

        {/* ======================= COMPANY OVERVIEW ======================== */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Company Overview</h2>

          <div className="jd-company-grid">
            <div className="jd-company-item"><strong>Company Size:</strong> 5000+ Employees</div>
            <div className="jd-company-item"><strong>Industry:</strong> Banking / Financial Services</div>
            <div className="jd-company-item">
              <strong>Website:</strong>{" "}
              <a href="https://hdfcbank.com" target="_blank" rel="noopener noreferrer">
                www.hdfcbank.com
              </a>
            </div>
          </div>

          <p className="jd-company-about">
            HDFC Bank is one of India’s largest private sector banks, known for digital innovation
            and customer-centric financial solutions.
          </p>
        </div>

        {/* ======================= INTERNSHIP DESCRIPTION (NEW) ======================== */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Internship Description</h2>
          <p className="jd-description">
            The Risk Analytics Intern will contribute to data cleaning, dashboard creation, 
            transaction analysis, and investigation of risk-related cases. You will support 
            senior analysts while gaining hands-on experience using Excel, SQL, and analytical tools.
          </p>
        </div>

        {/* ======================= RESPONSIBILITIES ======================== */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Internship Responsibilities</h2>

          <ul className="jd-list">
            <li>Assist risk analysts in modeling, data cleaning, and reporting.</li>
            <li>Analyze transactions to identify unusual patterns.</li>
            <li>Prepare daily/weekly dashboards using Excel and SQL.</li>
            <li>Work with senior analysts in risk investigation projects.</li>
          </ul>
        </div>

        {/* ======================= REQUIRED SKILLS ======================== */}
        <div className="jd-section-card">
          <h2 className="jd-section-title">Required Skills</h2>

          <div className="jd-tags">
            <span className="jd-tag">Excel</span>
            <span className="jd-tag">SQL</span>
            <span className="jd-tag">Risk Modelling</span>
            <span className="jd-tag">Data Analysis</span>
          </div>

          <div className="jd-education">
            <strong>Eligibility:</strong> Students pursuing Bachelor's in Finance, Economics,
            Data Science, Computer Science, or related fields.
          </div>
        </div>

      </div>
    </div>
  );
};

export default InternshipDetailsPage;
