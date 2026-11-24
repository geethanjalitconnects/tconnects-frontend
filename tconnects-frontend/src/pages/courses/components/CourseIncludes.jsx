import React from "react";
import "../styles/CourseDetails.css";
import { FaVideo, FaBook, FaClock, FaFileAlt, FaMobileAlt } from "react-icons/fa";

const CourseIncludes = ({ includes = {} }) => {
  // includes should be an object — ensure fallback
  const {
    videos = 0,
    modules = 0,
    duration = "N/A",
    resources = 0,
    access = "Lifetime access",
  } = includes || {};

  return (
    <div className="includes-section learn-section-box">
      <h2 className="section-title">This course includes</h2>

      <div className="includes-grid">

        <div className="include-item">
          <FaVideo className="include-icon" />
          <span>{videos} video lessons</span>
        </div>

        <div className="include-item">
          <FaBook className="include-icon" />
          <span>{modules} modules</span>
        </div>

        <div className="include-item">
          <FaClock className="include-icon" />
          <span>{duration}</span>
        </div>

        <div className="include-item">
          <FaFileAlt className="include-icon" />
          <span>{resources} downloadable resources</span>
        </div>

        <div className="include-item">
          <FaMobileAlt className="include-icon" />
          <span>{access}</span>
        </div>

      </div>
    </div>
  );
};

export default CourseIncludes;
