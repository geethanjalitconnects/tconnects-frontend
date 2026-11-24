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

  if (loading)
    return (
      <div className="courses-page">
        <p className="courses-state">Loading courses…</p>
      </div>
    );

  // Same search filter as before (title only).
  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="courses-page">

      {/* HERO + SEARCH + FILTER (one white panel, same look as the jobs page) */}
      <section className="courses-hero">
        <h1>Risk Management Courses</h1>
        <p>Explore risk management programs designed for your career growth.</p>

        <div className="courses-search-area">
          <div className="courses-search-wrap">
            <svg className="courses-search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              placeholder="Search for courses..."
              className="courses-search-box"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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

        <div className="courses-count-row">
          <p className="course-count">
            Showing {filtered.length} of {courses.length} courses
          </p>
          {search && (
            <button className="courses-clear" onClick={() => setSearch("")}>
              Clear search
            </button>
          )}
        </div>
      </section>

      {/* CARDS GRID */}
      {filtered.length === 0 ? (
        <p className="courses-state">No courses match your search.</p>
      ) : (
        <div className="courses-grid">
          {filtered.map((course) => {
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
      )}

    </div>
  );
};

export default CoursesList;