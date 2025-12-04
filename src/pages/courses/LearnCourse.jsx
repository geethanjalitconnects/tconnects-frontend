import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/LearnCourse.css";

import LearnVideoPlayer from "./components/LearnVideoPlayer";
import LearnCurriculum from "./components/LearnCurriculum";

const LearnCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // NOTE: replace this with backend fetch using id
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
          { id: "m1l1", title: "What you're going to get from this course", duration: "03:27", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", resources: [], preview: true },
          { id: "m1l2", title: "START HERE", duration: "02:53", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", resources: [], preview: false },
          { id: "m1l3", title: "Downloadable Resources & Tips", duration: "04:22", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", resources: ["notes.pdf"], preview: true },
        ]
      },
      {
        moduleTitle: "Python Basics",
        lectures: [
          { id: "m2l1", title: "Variables & Types", duration: "09:12", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", resources: [], preview: false },
          { id: "m2l2", title: "Control Flow", duration: "11:00", videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", resources: ["sample.py"], preview: false },
        ]
      }
    ]
  };

  // flatten lessons and pick first playable as initial
  const allLectures = sampleCourse.curriculum.flatMap((m) => m.lectures);
  const initialLecture = allLectures[0];

  const [currentLecture, setCurrentLecture] = useState(initialLecture);
  const [completed, setCompleted] = useState(() => ({})); // { lectureId: true }

  // mark as complete when user clicks complete or when they finish playback (you can hook to onEnded)
  const toggleComplete = (lectureId) => {
    setCompleted((prev) => ({ ...prev, [lectureId]: !prev[lectureId] }));
  };

  const handleSelectLecture = (lecture) => {
    // If you want to restrict previews when not enrolled, you would check enrollment here.
    setCurrentLecture(lecture);
  };

  return (
    <div className="learn-page">
      <div className="learn-hero">
        <div className="learn-hero-inner">
          <h1>{sampleCourse.title}</h1>
          <p className="learn-hero-meta">Created by {sampleCourse.instructor} · ⭐ {sampleCourse.rating} · {sampleCourse.language}</p>
        </div>
      </div>

      <div className="learn-main">
        <div className="learn-left">
          <div className="player-wrapper">
            <LearnVideoPlayer
              lecture={currentLecture}
              onEnded={() => toggleComplete(currentLecture.id)}
            />
          </div>

          <div className="learn-tabs">
            <nav className="tabs-nav">
              <button className="tab active">Overview</button>
              <button className="tab">Q&A</button>
              <button className="tab">Notes</button>
              <button className="tab">Reviews</button>
              <button className="tab">Learning tools</button>
            </nav>

            <div className="tabs-content">
              <h3>{currentLecture.title}</h3>
              <p>Duration: {currentLecture.duration}</p>
              <p>Resources: {currentLecture.resources?.length ? currentLecture.resources.join(", ") : "None"}</p>
            </div>
          </div>
        </div>

        <div className="learn-right">
          <LearnCurriculum
            curriculum={sampleCourse.curriculum}
            currentLectureId={currentLecture.id}
            onSelectLecture={handleSelectLecture}
            completed={completed}
            onToggleComplete={toggleComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default LearnCourse;
