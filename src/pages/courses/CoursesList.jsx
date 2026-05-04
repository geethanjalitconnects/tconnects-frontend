import React, { useState, useEffect } from "react";
import "./styles/CoursesList.css";
import CourseCard from "./components/CourseCard";
import api from "../../config/api";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [courseType, setCourseType] = useState("all");
  const [loading, setLoading] = useState(true);

  const slugify = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/courses/");
        const data = res.data.results ?? res.data;
        setCourses(data);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading courses...</p>;

  return (
    <div className="courses-page">

      {/* HERO */}
      <div className="courses-hero">
        <h1>Risk Management Courses</h1>
        <p>Explore risk management programs designed for your career growth.</p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="courses-search-area">
        <input
          type="text"
          placeholder="Search for courses..."
          className="courses-search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="courses-filter-pills">
          <button
            className={courseType === "all" ? "pill active" : "pill"}
            onClick={() => setCourseType("all")}
          >
            All Courses
          </button>

          <button
            className={courseType === "video" ? "pill active" : "pill"}
            onClick={() => setCourseType("video")}
          >
            Video Courses
          </button>

          <button
            className={courseType === "live" ? "pill active" : "pill"}
            onClick={() => setCourseType("live")}
          >
            Live Courses
          </button>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="courses-grid">
        {courses
          .filter((c) =>
            c.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((course) => {
            const slug = course.slug || slugify(course.title);

            return (
              <CourseCard
                key={course.id}
                id={course.id}
                slug={slug}
                title={course.title}
                instructor={course.instructor}
                thumbnail={course.thumbnail}
                price={course.price}
                rating={course.rating}
              />
            );
          })}
      </div>

    </div>
  );
};

export default CoursesList;