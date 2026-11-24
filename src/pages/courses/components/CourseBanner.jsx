import React, { useState, useEffect } from "react";
import "../styles/CourseDetails.css";
import { FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/api";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const CourseBanner = ({ title, instructor, rating, language }) => {
  const navigate = useNavigate();
  const { slug, id } = useParams();
  const { user } = useContext(AuthContext);

  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) return; // no login, skip
      try {
        const res = await api.get(`/api/courses/${id}/is-enrolled/`);
        setEnrolled(res.data.enrolled);
      } catch (err) {
        console.log("Enrollment check failed");
      }
    };
    checkEnrollment();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login?next=/course/" + slug + "/" + id);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/api/courses/${id}/enroll/`);
      if (res.status === 201 || res.status === 200) {
        setEnrolled(true);
        navigate(`/course/${slug}/${id}/learn`);
      }
    } catch (error) {
      console.error("Enrollment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-banner">
      <div className="course-banner-content">
        {/* Title */}
        <h1 className="course-title">{title}</h1>

        {/* Instructor */}
        <p className="course-instructor">Created by {instructor}</p>

        {/* Rating + Language */}
        <div className="course-meta-row">
          <span className="course-rating">
            <FaStar className="star-icon" /> {rating}
          </span>
          <span className="course-language">{language}</span>
        </div>

        {/* ENROLL BUTTON */}
        {enrolled ? (
          <button
            className="course-enroll-btn"
            style={{ background: "#fff", color: "#0097a7" }}
            onClick={() => navigate(`/course/${slug}/${id}/learn`)}
          >
            Continue Learning ➜
          </button>
        ) : (
          <button
            className="course-enroll-btn"
            onClick={handleEnroll}
            disabled={loading}
          >
            {loading ? "Enrolling..." : "Enroll Now"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseBanner;
