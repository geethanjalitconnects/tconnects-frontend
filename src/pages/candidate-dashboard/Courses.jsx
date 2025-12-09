import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./CandidateDashboard.css";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/courses/my-courses/")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Course fetch error:", err));
  }, []);

  return (
    <div className="cd-courses">

      <h2 className="cd-section-title">My Courses</h2>
      <p className="cd-section-subtitle">
        Continue your learning and track your course progress.
      </p>

      {courses.length === 0 && (
        <p className="cd-empty">No enrolled courses yet.</p>
      )}

      {courses.map((course) => (
        <div key={course.id} className="cd-course-card" onClick={() => 
          // Navigate to Learn route: /course/learn/:slug/:id (matches App.jsx)
          navigate(`/course/learn/${course.slug}/${course.id}`)
        }>
          <div className="cd-course-info">
            <h3 className="cd-course-title">{course.title}</h3>
            <p className="cd-course-provider">Offered by: TConnects Academy</p>
            <p className="cd-course-progress-text">
              Progress: {course.progress}%
            </p>

            <div className="cd-progress">
              <div className="cd-progress-bar" style={{ width: `${course.progress}%` }}></div>
            </div>
          </div>

          <span className={`cd-course-status ${
            course.status === "Completed" ? "cd-status-completed" : "cd-status-ongoing"
          }`}>
            {course.status}
          </span>
        </div>
      ))}
    </div>
  );
}
