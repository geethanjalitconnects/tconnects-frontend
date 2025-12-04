import React from "react";
import "../styles/LearnCourse.css";
import { FaPlayCircle } from "react-icons/fa";

const LessonRowLearn = ({ lesson, isActive, onSelect }) => {
  return (
    <div
      className={`lesson-row-learn ${isActive ? "active" : ""}`}
      onClick={onSelect}
    >
      <div className="lesson-left">
        <div className="lesson-icon"><FaPlayCircle /></div>

        <div>
          <div className="lesson-title">{lesson.title}</div>
          {lesson.is_preview && (
            <div className="lesson-sub">Preview available</div>
          )}
        </div>
      </div>

      <div className="lesson-right">
        <div className="lesson-duration">{lesson.duration}</div>
      </div>
    </div>
  );
};

export default LessonRowLearn;
