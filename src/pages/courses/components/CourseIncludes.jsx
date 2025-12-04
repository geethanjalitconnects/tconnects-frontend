import React from "react";
import "../styles/CourseDetails.css";
import { FaVideo, FaBook, FaClock, FaFileAlt, FaMobileAlt } from "react-icons/fa";

const CourseIncludes = ({ includes = {} }) => {
  return (
    <div className="course-includes-box">
      <h2>This course includes</h2>

      <div className="includes-grid">

        <div className="include-item">
          <FaVideo className="include-icon" />
          <span>{includes.videos || 0} video lessons</span>
        </div>

        <div className="include-item">
          <FaBook className="include-icon" />
          <span>{includes.modules || 0} modules</span>
        </div>

        <div className="include-item">
          <FaClock className="include-icon" />
          <span>{includes.duration || "N/A"}</span>
        </div>

        <div className="include-item">
          <FaFileAlt className="include-icon" />
          <span>{includes.resources || 0} downloadable resources</span>
        </div>

        <div className="include-item">
          <FaMobileAlt className="include-icon" />
          <span>{includes.access || "Lifetime access"}</span>
        </div>

      </div>
    </div>
  );
};

export default CourseIncludes;
