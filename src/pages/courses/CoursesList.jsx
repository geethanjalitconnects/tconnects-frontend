import React, { useState } from "react";
import "./styles/CoursesList.css";
import CourseCard from "./components/CourseCard";

const CoursesList = () => {
  const [search, setSearch] = useState("");
  const [courseType, setCourseType] = useState("all");

  // 🔹 TEMPORARY SAMPLE DATA (Replace with backend later)
  const sampleCourses = [
    {
      id: 1,
      title: "Basics of Cybersecurity",
      instructor: "Dr. Sarah Chen",
      thumbnail: "https://img-c.udemycdn.com/course/240x135/625204_436a_4.jpg",
      rating: 4.8,
      price: "₹2,999",
      type: "video",
    },
    {
      id: 2,
      title: "Advanced Cyber Crime Investigation",
      instructor: "Michael Rodriguez",
      thumbnail: "https://img-c.udemycdn.com/course/240x135/1430746_2f43_10.jpg",
      rating: 4.9,
      price: "₹8,999",
      type: "video",
    },
  ];

  // 🔹 Slug function
  const slugify = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div className="courses-page">

      {/* ================= HERO ================= */}
      <div className="courses-hero">
        <h1>Risk Management Courses</h1>
        <p>Explore risk management programs designed for your career growth.</p>
      </div>

      {/* ================= SEARCH + FILTERS ================= */}
      <div className="courses-search-area">

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for courses..."
          className="courses-search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter Pills */}
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

      {/* ================= COURSES GRID ================= */}
      <div className="courses-grid">
        {sampleCourses
          .filter((course) =>
            courseType === "all" || course.type === courseType
          )
          .map((course) => {
            const slug = slugify(course.title);

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
