import React from "react";
import "../styles/CoursesList.css";

const CourseCard = ({
  id,
  slug,
  title,
  instructor,
  thumbnail,
  rating,
  price,
}) => {
  return (
    <div className="course-card">

      <div className="course-card-image-wrapper">
        <img src={thumbnail} alt={title} className="course-card-image" />
        <span className="video-badge">VIDEO</span>
      </div>

      <div className="course-card-body">
        <h3 className="course-card-title">{title}</h3>
        <p className="course-card-instructor">{instructor}</p>

        <div className="course-rating-price">
          <span className="course-card-rating">⭐ {rating}</span>
          <span className="course-card-price">{price}</span>
        </div>

        <button
          className="course-view-btn"
          onClick={() => (window.location.href = `/course/${slug}/${id}`)}
        >
          View Details
        </button>
      </div>

    </div>
  );
};

export default CourseCard;
