import React from "react";
import "../styles/CourseDetails.css";
import { FaStar } from "react-icons/fa";

const CourseBanner = ({ title, instructor, rating, language }) => {
  return (
    <div className="course-banner">

      <div className="course-banner-content">
        {/* Title */}
        <h1 className="course-title">{title}</h1>

        {/* Instructor */}
        <p className="course-instructor">Created by {instructor}</p>

        {/* Row: Rating + Language */}
        <div className="course-meta-row">
          <span className="course-rating">
            <FaStar className="star-icon" /> {rating}
          </span>

          <span className="course-language">{language}</span>
        </div>

        {/* Enroll Button */}
        <button className="course-enroll-btn">
          Enroll Now
        </button>
      </div>

    </div>
  );
};

export default CourseBanner;
