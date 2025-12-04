import React, { useState } from "react";
import "../styles/CourseDetails.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LessonRow from "./LessonRow";

const ModuleAccordion = ({ moduleTitle, lectures = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="module-accordion">

      <div className="module-header" onClick={() => setOpen(!open)}>
        <h3 className="module-title">{moduleTitle}</h3>
        {open ? <FaChevronUp className="module-icon" /> : <FaChevronDown className="module-icon" />}
      </div>

      {open && (
        <div className="module-lessons">
          {lectures.map((lesson, i) => (
  <div key={lesson.id} className="lesson-row">
    <p>{lesson.title}</p>
    <span>{lesson.duration}</span>
  </div>
))}

        </div>
      )}

    </div>
  );
};

export default ModuleAccordion;
