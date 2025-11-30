// InternshipsListPage.jsx
import React from "react";
import "./InternshipsListPage.css";

export default function InternshipsListPage() {
  const openDetails = (id) => {
    window.open(`/internships/${id}`, "_blank");
  };

  return (
    <div className="jobs-page">
      
      {/* -------- HEADER -------- */}
      <div className="jobs-header">
        <h1 className="jobs-title">Risk Management Internships</h1>
        <p className="jobs-subtitle">
          Discover exciting internship opportunities in risk management across banking,
          finance, and fintech sectors in India
        </p>
      </div>

      {/* -------- FILTER BAR -------- */}
      <div className="jobs-filter-bar">
        <input 
          type="text" 
          className="jobs-search" 
          placeholder="Search internships, companies, or skills..." 
        />

        <select className="jobs-filter-select">
          <option>All Locations</option>
          <option>Chennai</option>
          <option>Mumbai</option>
          <option>Hyderabad</option>
          <option>Bangalore</option>
        </select>

        
        <select className="jobs-filter-select">
          <option>All Categories</option>
          <option>Risk Analysis</option>
          <option>Financial Analysis</option>
          <option>AML / KYC</option>
        </select>
      </div>

      {/* -------- COUNT -------- */}
      <p className="jobs-count">Showing 4 internship opportunities</p>

      {/* -------- INTERNSHIP CARD 1 -------- */}
      <div className="job-card" onClick={() => openDetails(1)}>
        <h2 className="job-title">Risk Analytics Intern</h2>
        <p className="company-name">HDFC Bank</p>

        <div className="job-info">
          <span>Mumbai</span> •
          <span>2 Months</span> •
          <span>Stipend ₹10,000</span> •
          <span>Hybrid</span> 
        </div>

        <p className="job-desc">
          Assist in risk modeling, financial data cleaning, and analytics reporting.
        </p>

        <div className="tags">
          <span>Excel</span>
          <span>SQL</span>
          <span>Risk Modelling</span>
        </div>

        <div className="job-actions" onClick={(e) => e.stopPropagation()}>
          <button className="view-btn" onClick={() => openDetails(1)}>View Details</button>
          <button className="save-btn">Save Internship</button>
        </div>
      </div>

      {/* -------- INTERNSHIP CARD 2 -------- */}
      <div className="job-card" onClick={() => openDetails(2)}>
        <h2 className="job-title">Financial Research Intern</h2>
        <p className="company-name">Deloitte</p>

        <div className="job-info">
          <span>Bangalore</span> •
          <span>3 Months</span> •
          <span>Stipend ₹15,000</span> •
          <span>Full-Time</span> 
        </div>

        <p className="job-desc">
          Support research work, prepare financial reports, and perform market studies.
        </p>

        <div className="tags">
          <span>Finance</span>
          <span>Research</span>
          <span>Power BI</span>
        </div>

        <div className="job-actions" onClick={(e) => e.stopPropagation()}>
          <button className="view-btn" onClick={() => openDetails(2)}>View Details</button>
          <button className="save-btn">Save Internship</button>
        </div>
      </div>

    </div>
  );
}
