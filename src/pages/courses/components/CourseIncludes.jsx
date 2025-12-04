import React from "react";

const CourseIncludes = ({ includes = {} }) => {
  return (
    <div className="course-includes-box">
      <h2>This course includes:</h2>

      <ul className="course-includes-list">
        {includes.hours && <li>⏱ {includes.hours}</li>}
        {includes.resources && <li>📄 {includes.resources}</li>}
        {includes.access && <li>📚 {includes.access}</li>}

        {/* SAFE FALLBACKS */}
        {!includes.hours && !includes.resources && !includes.access && (
          <li>No extra materials listed.</li>
        )}
      </ul>
    </div>
  );
};

export default CourseIncludes;
