import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobsListPage.css";

export default function JobsListPage() {
  const navigate = useNavigate();

  return (
    <div className="jobs-page">

      {/* ---------------- PAGE TITLE AREA ---------------- */}
      <div className="jobs-header">
        <h1 className="jobs-title">Risk Management Jobs</h1>
        <p className="jobs-subtitle">
          Discover exciting risk management opportunities across banking, insurance,
          and fintech sectors in India
        </p>
      </div>

      {/* ---------------- FILTER BAR ---------------- */}
      <div className="jobs-filter-bar">
        <input
          type="text"
          className="jobs-search"
          placeholder="Search jobs, companies, or skills..."
        />

        <select className="jobs-filter-select">
          <option>All Locations</option>
          <option>Chennai</option>
          <option>Hyderabad</option>
          <option>Noida</option>
        </select>

        <select className="jobs-filter-select">
          <option>Experience</option>
          <option>0-1 Years</option>
          <option>1-3 Years</option>
          <option>3-5 Years</option>
        </select>

        <select className="jobs-filter-select">
          <option>All Categories</option>
          <option>Fraud Detection</option>
          <option>AML</option>
          <option>Risk Analysis</option>
        </select>
      </div>

      {/* RESULTS COUNT */}
      <p className="jobs-count">Showing 5 of 5 job opportunities</p>

      {/* ---------------- JOB CARD 1 ---------------- */}
      <div className="job-card">
        <h2 className="job-title">Fraud Risk Investigator</h2>
        <p className="company-name">Paytm</p>

        <div className="job-info">
          <span>Noida</span> •
          <span>1–3 Years</span> •
          <span>6–9 LPA</span> •
          <span>Full-Time</span> •
          <span>1 week ago</span>
        </div>

        <p className="job-desc">
          Investigate suspicious transactions and build fraud detection patterns.
        </p>

        <div className="tags">
          <span>Fraud Detection</span>
          <span>SQL</span>
          <span>Transaction Monitoring</span>
        </div>

        <div className="job-actions">
          <button
            className="view-btn"
            onClick={() => navigate("/jobs/1")}
          >
            View Details
          </button>
          <button className="save-btn">Save Job</button>
        </div>
      </div>

      {/* ---------------- JOB CARD 2 ---------------- */}
      <div className="job-card">
        <h2 className="job-title">AML Compliance Analyst</h2>
        <p className="company-name">HSBC</p>

        <div className="job-info">
          <span>Chennai</span> •
          <span>0–1 Years</span> •
          <span>4–6 LPA</span> •
          <span>Full-Time</span> •
          <span>3 days ago</span>
        </div>

        <p className="job-desc">
          Monitor alerts and support AML investigation activities.
        </p>

        <div className="tags">
          <span>AML</span>
          <span>Compliance</span>
          <span>KYC</span>
        </div>

        <div className="job-actions">
          <button
            className="view-btn"
            onClick={() => navigate("/jobs/2")}
          >
            View Details
          </button>
          <button className="save-btn">Save Job</button>
        </div>
      </div>

    </div>
  );
}
