import React from "react";
import "../styles/CourseDetails.css";
import { FaCheckCircle } from "react-icons/fa";

const WhatYouWillLearn = ({ points = [] }) => {
  return (
    <div className="what-you-will-learn">
      <h2>What you'll learn</h2>

      <div className="learn-grid">
        {points.map((item, index) => (
          <div key={index} className="learn-item">
            <FaCheckCircle className="learn-icon" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatYouWillLearn;
