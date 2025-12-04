import React from "react";
import "../styles/CoursesList.css";

const CourseCard = ({ title, instructor, thumbnail, price }) => {
  return (
    <div className="course-card">

      {/* Thumbnail */}
      <div className="course-card-img-wrapper">
        <img
          src={thumbnail}
          alt={title}
          className="course-card-img"
        />
      </div>

      {/* Content */}
      <div className="course-card-content">
        <h3 className="course-card-title">{title}</h3>
        <p className="course-card-instructor">{instructor}</p>

        <div className="course-card-footer">
          <span className="course-card-price">{price || "Free"}</span>
        </div>
      </div>

    </div>
  );
};

export default CourseCard;
