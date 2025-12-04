import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import "../styles/CourseDetails.css";
import { FaClock, FaFileAlt, FaMobileAlt } from "react-icons/fa";

const CourseSidebar = ({ price, includes = {}, courseId, slug }) => {
  const navigate = useNavigate();

  const handleEnroll = async () => {
    try {
      await api.post(`/api/courses/${courseId}/enroll/`);
      navigate(`/course/learn/${slug}/${courseId}`);
    } catch (error) {
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

        {includes.hours && (
          <div className="sidebar-include-item">
            <FaClock /> {includes.hours}
          </div>
        )}

        {includes.resources && (
          <div className="sidebar-include-item">
            <FaFileAlt /> {includes.resources}
          </div>
        )}

        {includes.access && (
          <div className="sidebar-include-item">
            <FaMobileAlt /> {includes.access}
          </div>
        )}

        {!includes.hours && !includes.resources && !includes.access && (
          <p>No additional materials listed.</p>
        )}
      </div>
    </div>
  );
};

export default CourseSidebar;
