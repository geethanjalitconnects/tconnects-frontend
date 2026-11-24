// src/pages/courses/components/LearnVideoPlayer.jsx

import React from "react";

const LearnVideoPlayer = ({ lecture, onEnded }) => {
  // If no lecture selected yet
  if (!lecture) {
    return (
      <div style={{
        width: "100%",
        height: "100%",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "18px"
      }}>
        No video available
      </div>
    );
  }

  const videoUrl = lecture.video_url; // FIXED field name from backend

  return (
    <div className="video-player-container" style={{ width: "100%", height: "100%" }}>
      <video
        key={lecture.id}
        src={videoUrl}
        controls
        onEnded={onEnded}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          background: "black"
        }}
      >
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
};

export default LearnVideoPlayer;
