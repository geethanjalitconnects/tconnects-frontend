import React from "react";
import "../styles/CourseDetails.css";
import { FaVideo, FaBook, FaClock, FaFileAlt, FaMobileAlt } from "react-icons/fa";

const CourseIncludes = ({ includes = {} }) => {
  return (
    <div className="course-includes-box">
      <h2>This course includes</h2>

      <div className="includes-grid">

        {/* HOURS */}
        {includes.hours && (
          <div className="include-item">
            <FaClock className="include-icon" />
            <span>{includes.hours}</span>
          </div>
        )}

        {/* DOWNLOADABLE RESOURCES */}
        {includes.resources && (
          <div className="include-item">
            <FaFileAlt className="include-icon" />
            <span>{includes.resources}</span>
          </div>
        )}

        {/* ACCESS */}
        {includes.access && (
          <div className="include-item">
            <FaMobileAlt className="include-icon" />
            <span>{includes.access}</span>
          </div>
        )}

        {/* SAFE FALLBACK IF EMPTY */}
        {!includes.hours && !includes.resources && !includes.access && (
          <div className="include-item">
            <span>No extra materials listed</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseIncludes;
