import React from "react";
import "../styles/CourseDetails.css";
import { FaPlayCircle } from "react-icons/fa";

const LessonRow = ({ title, duration, preview }) => {
  return (
    <div className="lesson-row">
      <div className="lesson-left">
        <FaPlayCircle className="lesson-icon" />
        <span className="lesson-title">{title}</span>
      </div>

      <div className="lesson-right">
        {preview && <span className="preview-tag">Preview</span>}
        <span className="lesson-duration">{duration}</span>
      </div>
    </div>
  );
};

export default LessonRow;
