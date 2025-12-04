import React from "react";
import "../styles/CourseDetails.css";

const Description = ({ text }) => {
  return (
    <div className="description-box">
      <h2>Description</h2>

      <p className="description-text">
        {text}
      </p>
    </div>
  );
};

export default Description;
