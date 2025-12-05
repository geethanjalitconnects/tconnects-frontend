import React from "react";
import "../styles/CourseDetails.css";
import { FaCheck } from "react-icons/fa";

const Requirements = ({ items = [] }) => {
  if (!Array.isArray(items)) items = [];

  return (
    <div className="requirements-section learn-section-box">
      <h2 className="section-title">Requirements</h2>

      {items.length === 0 ? (
        <p className="empty-text">No prerequisites required for this course.</p>
      ) : (
        <ul className="requirements-list">
          {items.map((req, i) => (
            <li key={i} className="req-item">
              <FaCheck className="req-icon" />
              {req}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Requirements;
