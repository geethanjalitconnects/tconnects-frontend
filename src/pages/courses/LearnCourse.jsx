import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/api";
import "./styles/LearnCourse.css";

import LearnVideoPlayer from "./components/LearnVideoPlayer";
import LearnCurriculum from "./components/LearnCurriculum";

const LearnCourse = () => {
  const { slug, id } = useParams();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assignment modal state
  const [openAssignment, setOpenAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // ============================================
  // 🔥 FETCH LEARN COURSE DATA
  // GET /api/courses/<slug>/<id>/learn/
  // ============================================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/courses/${slug}/${id}/learn/`);
        setCourse(res.data);

        // Pick first lesson as default
        const allLessons = res.data.modules.flatMap((m) => m.lessons);
        if (allLessons.length > 0) {
          setCurrentLesson(allLessons[0]);
        }

      } catch (err) {
        console.error("LEARN PAGE LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, id]);

  // ============================================
  // 🔥 Mark Lesson Complete (backend)
  // POST /api/courses/lesson/<lesson_id>/complete/
  // ============================================
  const markLessonComplete = async (lessonId) => {
    try {
      await api.post(`/api/courses/lesson/${lessonId}/complete/`);
    } catch (error) {
      console.error("Lesson completion failed", error);
    }
  };

  // When video ends → mark completed
  const handleVideoEnded = () => {
    if (!currentLesson) return;
    markLessonComplete(currentLesson.id);
  };

  // ============================================
  // 🔥 Assignment Submit
  // POST /api/courses/assignment/<assignment_id>/submit/
  // ============================================
  const submitAssignment = async (assignmentId) => {
    try {
      const res = await api.post(
        `/api/courses/assignment/${assignmentId}/submit/`,
        { answers }
      );
      setResult(res.data);
    } catch (error) {
      console.error("Assignment submit failed", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course Not Found</p>;

  return (
    <div className="learn-page">

      {/* HERO */}
      <div className="learn-hero">
        <div className="learn-hero-inner">
          <h1>{course.title}</h1>
          <p className="learn-hero-meta">
            Created by {course.instructor} • ⭐ {course.rating} • {course.language}
          </p>
        </div>
      </div>

      <div className="learn-main">

        {/* LEFT PANEL */}
        <div className="learn-left">

          {/* VIDEO PLAYER */}
          <LearnVideoPlayer lecture={currentLesson} onEnded={handleVideoEnded} />

          {/* TABS SECTION — TEMP (same as your previous setup) */}
          <div className="learn-tabs">
            <h3>{currentLesson?.title}</h3>
            <p>Duration: {currentLesson?.duration}</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="learn-right">
          <LearnCurriculum
            modules={course.modules}
            currentLessonId={currentLesson?.id}
            onSelectLesson={setCurrentLesson}
            onOpenAssignment={(module) => {
              setOpenAssignment(module.assignment);
              setAnswers({});
              setResult(null);
            }}
          />
        </div>
      </div>

      {/* ASSIGNMENT MODAL */}
      {openAssignment && (
        <div className="assignment-modal">
          <div className="assignment-content">

            <h2>{openAssignment.title}</h2>

            {openAssignment.questions.map((q) => (
              <div key={q.id} className="mcq-question">
                <p className="question-text">{q.question}</p>

                {q.options.map((opt) => (
                  <label key={opt} className="mcq-option">
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value={opt}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: opt }))
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}

            <button
              className="submit-assignment-btn"
              onClick={() => submitAssignment(openAssignment.id)}
            >
              Submit Assignment
            </button>

            {result && (
              <p className="quiz-result">
                Score: {result.correct} / {result.total} ({result.score}%)
              </p>
            )}

            <button
              className="close-assignment-btn"
              onClick={() => setOpenAssignment(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LearnCourse;
