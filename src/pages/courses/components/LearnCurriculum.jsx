import React from "react";
import LessonRowLearn from "./LessonRowLearn";
import "../styles/LearnCourse.css";

const LearnCurriculum = ({
  modules = [],
  currentLessonId,
  onSelectLesson,
  onOpenAssignment,
}) => {
  return (
    <div className="learn-curriculum">
      <h3>Course Content</h3>

      {modules.map((module) => (
        <div key={module.id} className="learn-module">

          {/* Module Header */}
          <div className="learn-module-header">
            <div className="module-title">Module {module.order} — {module.title}</div>
            <div className="module-meta">{module.lessons.length} lessons</div>
          </div>

          {/* Lessons */}
          <div className="learn-module-lessons">
            {module.lessons.map((lesson) => (
              <LessonRowLearn
                key={lesson.id}
                lesson={lesson}
                isActive={lesson.id === currentLessonId}
                onSelect={() => onSelectLesson(lesson)}
              />
            ))}
          </div>

          {/* Assignment */}
          {module.assignment && (
            <div className="assignment-entry">
              <span>📘 {module.assignment.title}</span>
              <button onClick={() => onOpenAssignment(module)}>Open</button>
            </div>
          )}

        </div>
      ))}
    </div>
  );
};

export default LearnCurriculum;
