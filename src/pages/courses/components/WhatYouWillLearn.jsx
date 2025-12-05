import React from "react";
import "../styles/CourseDetails.css";
import { FaCheckCircle } from "react-icons/fa";

const WhatYouWillLearn = ({ points = [] }) => {
  // Ensure the value is always an array
  if (!Array.isArray(points)) points = [];

  return (
    <div className="learn-section-box">
      <h2 className="section-title">What you will learn</h2>

      {points.length === 0 ? (
        <p className="empty-text">Learning outcomes will be added soon.</p>
      ) : (
        <ul className="learn-list">
          {points.map((item, index) => (
            <li key={index} className="learn-item">
              <FaCheckCircle className="check-icon" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WhatYouWillLearn;
