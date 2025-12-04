import React from "react";
import "../styles/CourseDetails.css";
import ModuleAccordion from "./ModuleAccordion";

const Curriculum = ({ curriculum = [] }) => {
  return (
    <div className="curriculum-box">
      <h2>Course Curriculum</h2>

      <div className="curriculum-list">
        {curriculum.map((module, index) => (
          <ModuleAccordion
            key={index}
            moduleTitle={`Module ${index + 1} — ${module.moduleTitle}`}
            lectures={module.lectures}
          />
        ))}
      </div>
    </div>
  );
};

export default Curriculum;
