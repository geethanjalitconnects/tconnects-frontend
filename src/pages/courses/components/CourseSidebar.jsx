import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";  // ⭐ ADD THIS
import "../styles/CourseDetails.css";
import { FaVideo, FaBook, FaClock, FaFileAlt, FaMobileAlt } from "react-icons/fa";

const CourseSidebar = ({ price, includes, courseId, slug }) => {
  const navigate = useNavigate();

  const handleEnroll = async () => {
    try {
      // ⭐ BACKEND ENROLL CALL
      const res = await api.post(`/api/courses/${courseId}/enroll/`);
      console.log("Enroll success:", res.data);

      // ⭐ NOW NAVIGATE TO LEARN PAGE
      navigate(`/course/learn/${slug}/${courseId}`);

    } catch (error) {
      console.error("Enroll error:", error);

      if (error.response?.status === 401) {
        alert("Please login to enroll in this course.");
      } else {
        alert("Enrollment failed. Try again.");
      }
    }
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
