import React, { useRef } from "react";
import "../styles/LearnCourse.css";

/**
 * Simple HTML5 video player component.
 * If you prefer ReactPlayer (youtube/vimeo), swap this for ReactPlayer usage.
 */
const LearnVideoPlayer = ({ lecture, onEnded }) => {
  const videoRef = useRef(null);

  if (!lecture) return <div className="video-placeholder">No lecture selected</div>;

  return (
    <div className="video-player-container">
      <video
        ref={videoRef}
        src={lecture.videoUrl}
        controls
        width="100%"
        height="100%"
        onEnded={onEnded}
      >
        Your browser does not support the video tag.
      </video>

      <div className="video-lecture-info">
        <div className="video-title">{lecture.title}</div>
        <div className="video-duration">{lecture.duration}</div>
      </div>
    </div>
  );
};

export default LearnVideoPlayer;
