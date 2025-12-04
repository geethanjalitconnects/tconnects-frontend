import React from "react";
import ModuleAccordion from "./ModuleAccordion";

const Curriculum = ({ curriculum = [] }) => {
  return (
    <div className="curriculum-box">
      <h2>Course Curriculum</h2>

      <div className="curriculum-list">
        {curriculum.map((module, index) => (
          <ModuleAccordion
            key={index}
            moduleTitle={module.title}
            lectures={module.lessons || []}   // ⭐ FIX: use lessons, not videos
            assignment={module.assignment}
          />
        ))}
      </div>
    </div>
  );
};

export default Curriculum;
