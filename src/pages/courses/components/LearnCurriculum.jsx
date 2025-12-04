import React from "react";
import LessonRowLearn from "./LessonRowLearn";
import "../styles/LearnCourse.css";

const LearnCurriculum = ({
  curriculum = [],
  currentLectureId,
  onSelectLecture,
  completed = {},
  onToggleComplete
}) => {
  return (
    <div className="learn-curriculum">
      <h3>Course content</h3>

      {curriculum.map((module, mIndex) => (
        <div className="learn-module" key={mIndex}>
          <div className="learn-module-header">
            <div className="module-title">
              Module {mIndex + 1} • {module.moduleTitle}
            </div>
            <div className="module-meta">{module.lectures.length} lectures</div>
          </div>

          <div className="learn-module-lessons">
            {module.lectures.map((lec) => (
              <LessonRowLearn
                key={lec.id}
                lecture={lec}
                isActive={lec.id === currentLectureId}
                isCompleted={!!completed[lec.id]}
                onSelect={() => onSelectLecture(lec)}
                onToggleComplete={() => onToggleComplete(lec.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearnCurriculum;
