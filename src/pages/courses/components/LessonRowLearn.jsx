import React from "react";
import "../styles/LearnCourse.css";
import { FaPlayCircle, FaCheckSquare, FaRegSquare } from "react-icons/fa";

const LessonRowLearn = ({ lecture, isActive, isCompleted, onSelect, onToggleComplete }) => {
  return (
    <div className={`lesson-row-learn ${isActive ? "active" : ""}`} onClick={onSelect}>
      <div className="lesson-left">
        <div className="lesson-icon"><FaPlayCircle /></div>
        <div className="lesson-title-wrap">
          <div className="lesson-title">{lecture.title}</div>
          <div className="lesson-sub">{lecture.preview ? "Preview available" : ""}</div>
        </div>
      </div>

      <div className="lesson-right">
        <div className="lesson-duration">{lecture.duration}</div>

        <button
          className="lesson-resources-btn"
          onClick={(e) => { 
            e.stopPropagation(); 
            alert(lecture.resources?.length ? lecture.resources.join(", ") : "No resources");
          }}
        >
          Resources
        </button>

        <button
          className="lesson-complete-btn"
          onClick={(e) => { 
            e.stopPropagation(); 
            onToggleComplete(); 
          }}
        >
          {isCompleted ? <FaCheckSquare /> : <FaRegSquare />}
        </button>
      </div>
    </div>
  );
};

export default LessonRowLearn;
