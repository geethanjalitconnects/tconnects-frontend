import React from "react";
import "../styles/LearnCourse.css";

const LearnVideoPlayer = ({ lecture, onEnded }) => {
  if (!lecture) {
    return <div className="video-placeholder">No lesson selected</div>;
  }

  return (
    <div className="video-player-container">
      <video
        src={lecture.videoUrl}
        controls
        width="100%"
        height="100%"
        onEnded={onEnded}
      />

      <div className="video-lecture-info">
        <div className="video-title">{lecture.title}</div>
        <div className="video-duration">{lecture.duration}</div>
      </div>
    </div>
  );
};

export default LearnVideoPlayer;
