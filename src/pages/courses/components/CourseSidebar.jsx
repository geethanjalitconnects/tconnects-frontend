import React from "react";
import "../styles/CourseDetails.css";
import { FaCheck, FaClock, FaVideo, FaBook, FaFileAlt, FaMobileAlt } from "react-icons/fa";

const CourseSidebar = ({ price, includes }) => {
  return (
    <div className="course-sidebar">

      <h3 className="sidebar-price">{price}</h3>

      <button className="sidebar-enroll-btn">Enroll Now</button>

      <div className="sidebar-includes">
        <h4>This course includes:</h4>

        <div className="sidebar-include-item"><FaVideo /> {includes.videos} video lessons</div>
        <div className="sidebar-include-item"><FaBook /> {includes.modules} modules</div>
        <div className="sidebar-include-item"><FaClock /> {includes.duration}</div>
        <div className="sidebar-include-item"><FaFileAlt /> {includes.resources} downloadable resources</div>
        <div className="sidebar-include-item"><FaMobileAlt /> {includes.access}</div>

      </div>
    </div>
  );
};

export default CourseSidebar;
