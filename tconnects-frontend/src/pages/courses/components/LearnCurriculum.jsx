// src/pages/courses/components/LearnCurriculum.jsx
import React from "react";
import LessonRowLearn from "./LessonRowLearn";
import "../styles/LearnCourse.css";

/**
 * Props:
 * - modules: array of module objects
 * - currentLessonId: id of active lesson
 * - onSelectLesson(lesson)
 * - onOpenAssignment(module)  -- pass module (module.assignment expected)
 */

const LearnCurriculum = ({
  modules = [],
  currentLessonId,
  onSelectLesson,
  onOpenAssignment,
}) => {
  return (
    <div className="learn-curriculum">
      <h3>Course Content</h3>

      {modules.length === 0 && <p>No curriculum added yet.</p>}

      {modules.map((module) => (
        <div key={module.id} className="learn-module">
          <div className="learn-module-header">
            <div className="module-title">Module {module.order ?? module.id} — {module.title}</div>
            <div className="module-meta">{(module.lessons ?? []).length} lessons</div>
          </div>

          <div className="learn-module-lessons">
            {(module.lessons ?? []).map((lesson) => (
              <LessonRowLearn
                key={lesson.id}
                lesson={lesson}
                isActive={lesson.id === currentLessonId}
                onSelect={() => onSelectLesson && onSelectLesson(lesson)}
              />
            ))}
          </div>

          {/* Assignment entry */}
          {module.assignment && (
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span role="img" aria-label="assignment">📘</span>
                <strong>{module.assignment.title}</strong>
              </div>
              <button
                onClick={() => onOpenAssignment && onOpenAssignment(module)}
                style={{ background: "#0097a7", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
              >
                Open
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LearnCurriculum;
