import React from "react";
import "./CandidateDashboard.css";

export default function Courses() {
  return (
    <div className="cd-courses">

      {/* Page Header */}
      <h2 className="cd-section-title">My Courses</h2>
      <p className="cd-section-subtitle">
        Continue your learning and track your course progress.
      </p>

      {/* Course 1 */}
      <div className="cd-course-card">
        <div className="cd-course-info">
          <h3 className="cd-course-title">Frontend Development Bootcamp</h3>
          <p className="cd-course-provider">Offered by: TConnects Academy</p>
          <p className="cd-course-progress-text">Progress: 65%</p>

          {/* Progress Bar */}
          <div className="cd-progress">
            <div className="cd-progress-bar" style={{ width: "65%" }}></div>
          </div>
        </div>

        <span className="cd-course-status cd-status-ongoing">Ongoing</span>
      </div>

      {/* Course 2 */}
      <div className="cd-course-card">
        <div className="cd-course-info">
          <h3 className="cd-course-title">Python for Beginners</h3>
          <p className="cd-course-provider">Offered by: SkillUp Learning</p>
          <p className="cd-course-progress-text">Progress: 100%</p>

          <div className="cd-progress">
            <div className="cd-progress-bar" style={{ width: "100%" }}></div>
          </div>
        </div>

        <span className="cd-course-status cd-status-completed">Completed</span>
      </div>

      {/* Course 3 */}
      <div className="cd-course-card">
        <div className="cd-course-info">
          <h3 className="cd-course-title">UI/UX Essentials</h3>
          <p className="cd-course-provider">Offered by: DesignMaster</p>
          <p className="cd-course-progress-text">Progress: 20%</p>

          <div className="cd-progress">
            <div className="cd-progress-bar" style={{ width: "20%" }}></div>
          </div>
        </div>

        <span className="cd-course-status cd-status-ongoing">Ongoing</span>
      </div>

    </div>
  );
}
