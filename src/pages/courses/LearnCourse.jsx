import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./styles/LearnCourse.css";

import LearnVideoPlayer from "./components/LearnVideoPlayer";
import LearnCurriculum from "./components/LearnCurriculum";

const LearnCourse = () => {
  const { id } = useParams();

  // ====================================================
  // SAMPLE COURSE DATA (Replace with backend later)
  // ====================================================
  const sampleCourse = {
    id,
    title: "Python Bootcamp: From Zero to Hero",
    instructor: "Dr. Angela Yu",
    rating: 4.7,
    language: "English",

    curriculum: [
      {
        moduleTitle: "Introduction & Setup",
        lectures: [
          { id: "m1l1", title: "Welcome Intro", duration: "03:27", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", resources: [] },
          { id: "m1l2", title: "Installing Python", duration: "02:53", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", resources: [] }
        ],
        assignment: {
          title: "Assignment 1: Python Basics",
          questions: [
            {
              id: 1,
              question: "Which keyword is used to define a function in Python?",
              options: ["func", "define", "def", "function"],
              answer: "def"
            },
            {
              id: 2,
              question: "What is the output of: print(type(10))?",
              options: ["<class 'str'>", "<class 'int'>", "<class 'float'>", "<class 'number'>"],
              answer: "<class 'int'>"
            }
          ]
        }
      },

      {
        moduleTitle: "Python Basics",
        lectures: [
          { id: "m2l1", title: "Variables", duration: "09:12", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", resources: [] },
          { id: "m2l2", title: "Control Flow", duration: "11:00", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", resources: [] }
        ],
        assignment: {
          title: "Assignment 2: Control Flow",
          questions: [
            {
              id: 3,
              question: "Which statement is used for looping in Python?",
              options: ["repeat", "loop", "for", "iterate"],
              answer: "for"
            }
          ]
        }
      }
    ]
  };

  // ====================================================
  // STATE MANAGEMENT
  // ====================================================

  const allLectures = sampleCourse.curriculum.flatMap((m) => m.lectures);
  const [currentLecture, setCurrentLecture] = useState(allLectures[0]);

  const [activeTab, setActiveTab] = useState("overview");
  const [completed, setCompleted] = useState({});
  const [openAssignment, setOpenAssignment] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // ====================================================
  // HANDLERS
  // ====================================================
  const toggleComplete = (lectureId) => {
    setCompleted((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId]
    }));
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  const submitQuiz = (moduleData) => {
    const questions = moduleData.assignment.questions;
    let correct = 0;

    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.answer) correct++;
    });

    setQuizResult({
      total: questions.length,
      correct
    });
  };

  // ====================================================
  // UI RETURN
  // ====================================================

  return (
    <div className="learn-page">

      {/* HERO */}
      <div className="learn-hero">
        <div className="learn-hero-inner">
          <h1>{sampleCourse.title}</h1>
          <p className="learn-hero-meta">
            Created by {sampleCourse.instructor} • ⭐ {sampleCourse.rating} • {sampleCourse.language}
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div className="learn-main">

        {/* LEFT SIDE (VIDEO + TABS) */}
        <div className="learn-left">

          {/* VIDEO PLAYER */}
          <LearnVideoPlayer
            lecture={currentLecture}
            onEnded={() => toggleComplete(currentLecture.id)}
          />

          {/* TABS */}
          <div className="learn-tabs">
            <nav className="tabs-nav">
              <button className={`tab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
              <button className={`tab ${activeTab === "qa" ? "active" : ""}`} onClick={() => setActiveTab("qa")}>Q&A</button>
              <button className={`tab ${activeTab === "notes" ? "active" : ""}`} onClick={() => setActiveTab("notes")}>Notes</button>
              <button className={`tab ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>Reviews</button>
              <button className={`tab ${activeTab === "tools" ? "active" : ""}`} onClick={() => setActiveTab("tools")}>Learning tools</button>
            </nav>

            {/* TAB CONTENT */}
            <div className="tabs-content">
              {activeTab === "overview" && (
                <>
                  <h3>{currentLecture.title}</h3>
                  <p>Duration: {currentLecture.duration}</p>
                </>
              )}

              {activeTab === "qa" && (
                <div>
                  <h3>Questions & Answers</h3>
                  <textarea className="qa-input" placeholder="Ask your question..."></textarea>
                  <button className="qa-btn">Submit</button>
                </div>
              )}

              {activeTab === "notes" && (
                <div>
                  <h3>Your Notes</h3>
                  <textarea className="notes-input" placeholder="Write notes here..."></textarea>
                  <button className="save-notes-btn">Save Notes</button>
                </div>
              )}

              {activeTab === "reviews" && <p>No reviews yet.</p>}
              {activeTab === "tools" && <p>Extra tools will appear here.</p>}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE CURRICULUM */}
        <div className="learn-right">
          <LearnCurriculum
            curriculum={sampleCourse.curriculum}
            currentLectureId={currentLecture.id}
            onSelectLecture={handleSelectLecture}
            completed={completed}
            onToggleComplete={toggleComplete}
            onOpenAssignment={(module) => {
              setQuizAnswers({});
              setQuizResult(null);
              setOpenAssignment(module);
            }}
          />
        </div>
      </div>

      {/* ====================================================
            ASSIGNMENT MCQ MODAL  
      ==================================================== */}
      {openAssignment && (
        <div className="assignment-modal">
          <div className="assignment-content">
            <h2>{openAssignment.assignment.title}</h2>

            {openAssignment.assignment.questions.map((q) => (
              <div key={q.id} className="mcq-question">
                <p className="question-text">{q.question}</p>

                {q.options.map((opt) => (
                  <label className="mcq-option" key={opt}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={opt}
                      onChange={() =>
                        setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}

            <button
              className="submit-assignment-btn"
              onClick={() => submitQuiz(openAssignment)}
            >
              Submit Assignment
            </button>

            {quizResult && (
              <p className="quiz-result">
                You got {quizResult.correct} out of {quizResult.total} correct!
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
