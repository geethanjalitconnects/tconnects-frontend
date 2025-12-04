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
          {lectures.map((lesson) => (
            <LessonRow
              key={lesson.id}
              title={lesson.title}
              duration={lesson.duration}
              preview={lesson.is_preview}   // ⭐ backend mapping
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default ModuleAccordion;
