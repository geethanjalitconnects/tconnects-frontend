import React from "react";
import "../styles/CourseDetails.css";
import { FaVideo, FaBook, FaClock, FaFileAlt, FaMobileAlt } from "react-icons/fa";

const CourseIncludes = ({ includes = {} }) => {
  return (
    <div className="course-includes-box">
      <h2>This course includes</h2>

      <div className="includes-grid">
        {/* Videos */}
        <div className="include-item">
          <FaVideo className="include-icon" />
          <span>{includes.videos} video lessons</span>
        </div>

        {/* Modules */}
        <div className="include-item">
          <FaBook className="include-icon" />
          <span>{includes.modules} modules</span>
        </div>

        {/* Duration */}
        <div className="include-item">
          <FaClock className="include-icon" />
          <span>{includes.duration}</span>
        </div>

        {/* Resources */}
        <div className="include-item">
          <FaFileAlt className="include-icon" />
          <span>{includes.resources} downloadable resources</span>
        </div>

        {/* Access */}
        <div className="include-item">
          <FaMobileAlt className="include-icon" />
          <span>{includes.access}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseIncludes;
