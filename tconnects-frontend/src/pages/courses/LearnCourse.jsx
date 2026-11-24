// src/pages/courses/LearnCourse.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
import "./styles/LearnCourse.css";

import LearnVideoPlayer from "./components/LearnVideoPlayer";
import LearnCurriculum from "./components/LearnCurriculum";

/**
 * LearnCourse page
 * - GET /api/courses/:slug/:id/learn/  (expected shape below)
 *
 * expected res.data shape (example):
 * {
 *   id, slug, title, instructor, rating, language,
 *   modules: [
 *     { id, order, title, lessons: [{id,title,duration,is_preview,video_url}], assignment: { id, title, questions: [{id, question, options: [], correct_answer}] } }
 *   ]
 * }
 *
 * This component:
 * - picks first available lesson as default safely
 * - displays video player (LearnVideoPlayer)
 * - shows curriculum (LearnCurriculum)
 * - handles assignment modal and submit flow (shows correct answers & score)
 */

const LearnCourse = () => {
  const { slug, id } = useParams();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assignment UI state
  const [openAssignment, setOpenAssignment] = useState(null); // assignment object
  const [answers, setAnswers] = useState({}); // { questionId: chosenOption }
  const [submitResult, setSubmitResult] = useState(null); // { correct, total, score, detail: [{qId, correctAnswer, yourAnswer, isCorrect}] }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/api/courses/${slug}/${id}/learn/`);
        const payload = res?.data ?? null;
        setCourse(payload);

        // find first lesson safely
        const modules = Array.isArray(payload?.modules) ? payload.modules : [];
        const allLessons = modules.flatMap((m) => Array.isArray(m.lessons) ? m.lessons : []);
        if (allLessons.length > 0) {
          setCurrentLesson(allLessons[0]);
        } else {
          setCurrentLesson(null);
        }
      } catch (err) {
        console.error("LEARN PAGE LOAD ERROR:", err);
        setError("Failed to load course. Please try again later.");
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug && id) {
      fetchCourse();
    } else {
      setLoading(false);
      setError("Missing course identifier.");
    }
  }, [slug, id]);

  // mark lesson complete (backend) — best effort
  const markLessonComplete = async (lessonId) => {
    try {
      await api.post(`/api/courses/lesson/${lessonId}/complete/`);
    } catch (err) {
      // not critical — log
      console.warn("Lesson completion failed", err);
    }
  };

  // when a video ends
  const handleVideoEnded = () => {
    if (!currentLesson?.id) return;
    markLessonComplete(currentLesson.id);
  };

  // Open assignment modal for a module
  const handleOpenAssignment = (assignment) => {
    if (!assignment) return;
    setOpenAssignment(assignment);
    setAnswers({});
    setSubmitResult(null);
  };

  // Local fallback evaluation function (in case backend doesn't return detail)
  const evaluateAssignmentLocally = (assignment, answersMap) => {
    const questions = Array.isArray(assignment.questions) ? assignment.questions : [];
    let correct = 0;
    const detail = questions.map((q) => {
      const correctAnswer = q.correct_answer ?? q.correctAnswer ?? null;
      const your = answersMap[q.id] ?? null;
      const isCorrect = your !== null && String(your).trim() === String(correctAnswer).trim();
      if (isCorrect) correct += 1;
      return { qId: q.id, correctAnswer, yourAnswer: your, isCorrect };
    });
    const total = questions.length;
    const score = total ? Math.round((correct / total) * 100) : 0;
    return { correct, total, score, detail };
  };

  // Submit assignment (calls API; if API doesn't return detail, evaluate locally)
  const submitAssignment = async (assignmentId) => {
    if (!openAssignment || openAssignment.id !== assignmentId) return;
    setSubmitting(true);
    setSubmitResult(null);

    try {
      // POST to backend (expects: {answers: {questionId: chosenOption}} and returns result)
      const payload = { answers }; // answers keyed by question id
      const res = await api.post(`/api/courses/assignment/${assignmentId}/submit/`, payload);

      // If backend returns result shape, use it. Otherwise fallback to local eval.
      if (res?.data?.total != null && res?.data?.correct != null) {
        setSubmitResult(res.data);
      } else {
        // fallback local eval: we need original assignment questions with correct answers
        const local = evaluateAssignmentLocally(openAssignment, answers);
        setSubmitResult(local);
      }
    } catch (err) {
      console.error("Assignment submit failed:", err);
      // fallback to local evaluation so user sees result even if network fails
      const local = evaluateAssignmentLocally(openAssignment, answers);
      setSubmitResult(local);
    } finally {
      setSubmitting(false);
    }
  };

  // UI helpers for assignment: after submit, we will disable inputs (submitResult present indicates completed)
  const isAssignmentSubmitted = !!submitResult;

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  if (!course) return <div style={{ padding: 20 }}>Course not found.</div>;

  return (
    <div className="learn-page">
      {/* HERO */}
      <div className="learn-hero">
        <div className="learn-hero-inner">
          <h1>{course.title}</h1>
          <p className="learn-hero-meta">
            Created by {course.instructor ?? "Instructor"} • ⭐ {course.rating ?? 0} • {course.language ?? "English"}
          </p>
        </div>
      </div>

      <div className="learn-main">
        {/* LEFT: player + tab */}
        <div className="learn-left">
          <div className="player-wrapper">
            {/* LearnVideoPlayer expects lecture object or null */}
            <LearnVideoPlayer lecture={currentLesson} onEnded={handleVideoEnded} />
          </div>

          <div className="learn-tabs">
            <h3 style={{ margin: 0 }}>{currentLesson?.title ?? "Select a lesson"}</h3>
            <p>Duration: {currentLesson?.duration ?? "-"}</p>
          </div>
        </div>

        {/* RIGHT: curriculum */}
        <div className="learn-right">
          <LearnCurriculum
            modules={course.modules ?? []}
            currentLessonId={currentLesson?.id}
            onSelectLesson={(lesson) => {
              setCurrentLesson(lesson);
              // when switching lesson reset assignment modal
              setOpenAssignment(null);
              setSubmitResult(null);
            }}
            onOpenAssignment={(module) => {
              // module may include assignment object
              handleOpenAssignment(module.assignment);
            }}
          />
        </div>
      </div>

      {/* ASSIGNMENT MODAL */}
      {openAssignment && (
        <div className="assignment-modal" style={{
          position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.5)", zIndex: 1200
        }}>
          <div style={{
            width: "min(900px, 95%)", background: "#fff", borderRadius: 8, padding: 24, boxShadow: "0 30px 60px rgba(0,0,0,0.25)"
          }}>
            <h2 style={{ marginTop: 0 }}>{openAssignment.title}</h2>

            {/* Questions */}
            <div>
              {(openAssignment.questions ?? []).map((q, idx) => {
                const qid = q.id;
                return (
                  <div key={qid} style={{ marginBottom: 18 }}>
                    <p style={{ fontWeight: 600 }}>{idx + 1}. {q.question}</p>

                    {(q.options ?? []).map((opt, oi) => {
                      const optionValue = opt;
                      const isChecked = answers[qid] === optionValue;
                      const isDisabled = isAssignmentSubmitted;
                      // highlight correct/incorrect after submit
                      const correctAnswer = q.correct_answer ?? q.correctAnswer ?? null;
                      const showCorrectness = isAssignmentSubmitted && correctAnswer != null;
                      const isCorrectOption = showCorrectness && String(optionValue).trim() === String(correctAnswer).trim();
                      const isUserPicked = isAssignmentSubmitted && String(optionValue).trim() === String(answers[qid] ?? "").trim();

                      // determine style
                      let optionStyle = { display: "block", margin: "6px 0" };
                      if (isAssignmentSubmitted) {
                        if (isCorrectOption) optionStyle = { ...optionStyle, color: "#0b7", fontWeight: 700 };
                        else if (isUserPicked && !isCorrectOption) optionStyle = { ...optionStyle, color: "#e44", textDecoration: "line-through" };
                        else optionStyle = { ...optionStyle, color: "#444" };
                      }

                      return (
                        <label key={oi} style={optionStyle}>
                          <input
                            type="radio"
                            name={`q_${qid}`}
                            value={optionValue}
                            checked={isChecked}
                            disabled={isDisabled}
                            onChange={() => setAnswers((p) => ({ ...p, [qid]: optionValue }))}
                            style={{ marginRight: 10 }}
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Buttons and result */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10 }}>
              <button
                onClick={() => submitAssignment(openAssignment.id)}
                className="submit-assignment-btn"
                disabled={submitting || isAssignmentSubmitted}
                style={{
                  background: "#0097a7", color: "#fff", padding: "10px 18px", borderRadius: 6, border: "none", cursor: "pointer"
                }}
              >
                {submitting ? "Submitting..." : (isAssignmentSubmitted ? "Submitted" : "Submit Assignment")}
              </button>

              <button
                onClick={() => setOpenAssignment(null)}
                style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}
              >
                Close
              </button>

              {submitResult && (
                <div style={{ marginLeft: 12 }}>
                  <strong>Score:</strong> {submitResult.correct} / {submitResult.total} ({submitResult.score}%)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnCourse;
