import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CourseDetails.css";
import { FaVideo, FaBook, FaClock, FaFileAlt, FaMobileAlt } from "react-icons/fa";

const CourseSidebar = ({ price, includes, courseId, slug }) => {
  const navigate = useNavigate();

  const handleEnroll = () => {
    navigate(`/course/learn/${slug}/${courseId}`);
  };

  return (
    <div className="course-sidebar">

      <h3 className="sidebar-price">{price}</h3>

      <button className="sidebar-enroll-btn" onClick={handleEnroll}>
        Enroll Now
      </button>

      <div className="sidebar-includes">
        <h4>This course includes:</h4>

        <div className="sidebar-include-item">
          <FaVideo /> {includes.videos} video lessons
        </div>

        <div className="sidebar-include-item">
          <FaBook /> {includes.modules} modules
        </div>

        <div className="sidebar-include-item">
          <FaClock /> {includes.duration}
        </div>

        <div className="sidebar-include-item">
          <FaFileAlt /> {includes.resources} downloadable resources
        </div>

        <div className="sidebar-include-item">
          <FaMobileAlt /> {includes.access}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
