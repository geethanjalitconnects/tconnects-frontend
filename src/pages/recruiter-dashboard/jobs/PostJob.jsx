import React from "react";
import "../RecruiterDashboard.css"; // ensure correct path

export default function PostJob() {
  return (
    <div className="rd-postjob-page">

      {/* ====== Title ====== */}
      <h2 className="rd-page-title">Post a Job</h2>
      <p className="rd-page-subtitle">Fill all details to publish a new job opening.</p>

      {/* ======================================================
                       JOB DETAILS FORM CARD
      ====================================================== */}
      <div className="rd-profile-card">

        <h3 className="rd-card-title">Job Details</h3>

        <div className="rd-grid">

          {/* Job Title */}
          <div className="rd-form-group">
            <label className="rd-label">Job Title</label>
            <input type="text" className="rd-input" placeholder="e.g., Risk Analyst" />
          </div>

          {/* Job Category */}
          <div className="rd-form-group">
            <label className="rd-label">Job Category</label>
            <input type="text" className="rd-input" placeholder="Risk, Finance, Operations..." />
          </div>

          {/* Location */}
          <div className="rd-form-group">
            <label className="rd-label">Location</label>
            <input type="text" className="rd-input" placeholder="Chennai, India" />
          </div>

          {/* Job Type */}
          <div className="rd-form-group">
            <label className="rd-label">Job Type</label>
            <select className="rd-input">
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>

          {/* Salary Range */}
          <div className="rd-form-group">
            <label className="rd-label">Salary Range</label>
            <input type="text" className="rd-input" placeholder="₹6–10 LPA" />
          </div>

          {/* Experience Required */}
          <div className="rd-form-group">
            <label className="rd-label">Experience Required</label>
            <input type="text" className="rd-input" placeholder="2–4 Years" />
          </div>

          {/* Job Description – full width */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">Job Description</label>
            <textarea
              className="rd-textarea"
              placeholder="Describe the job role and expectations..."
            ></textarea>
          </div>

          {/* Job Responsibilities – full width */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">Job Responsibilities</label>
            <textarea
              className="rd-textarea"
              placeholder="List key responsibilities..."
            ></textarea>
          </div>

          {/* Area of Expertise */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">Area of Expertise</label>
            <input
              type="text"
              className="rd-input"
              placeholder="SQL, Python, Risk Modeling, Excel…"
            />
          </div>

          {/* Education Qualification */}
          <div className="rd-form-group rd-full">
            <label className="rd-label">Education Qualification</label>
            <input
              type="text"
              className="rd-input"
              placeholder="MBA, B.Tech, B.Com or relevant degree"
            />
          </div>
        </div>

      </div>

      {/* ======================================================
                     SCHEDULE JOB POSTING
====================================================== */}
<div className="rd-schedule-card">

  <h3 className="rd-card-title">Schedule Job</h3>

  <p className="rd-schedule-info">
    You can post the job immediately or schedule it for a future date & time.
  </p>

  <div className="rd-grid">

    {/* Post Type */}
    <div className="rd-form-group">
      <label className="rd-label">Post Job</label>
      <select className="rd-input">
        <option>Post Now</option>
        <option>Schedule for later</option>
      </select>
    </div>

    {/* Date */}
    <div className="rd-form-group">
      <label className="rd-label">Schedule Date</label>
      <input type="date" className="rd-input" />
    </div>

    {/* Time */}
    <div className="rd-form-group">
      <label className="rd-label">Schedule Time</label>
      <input type="time" className="rd-input" />
    </div>

  </div>
</div>


      {/* Submit button */}
      <button className="rd-save-btn">Post Job</button>
    </div>
  );
}
