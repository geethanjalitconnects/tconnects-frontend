import React, { useState } from "react";
import "./styles/CoursesList.css";
import CourseCard from "./components/CourseCard";


const CoursesList = () => {
  const [search, setSearch] = useState("");
  const [courseType, setCourseType] = useState("all");
  const [level, setLevel] = useState("all");

  return (
    <div className="courses-container">

      {/* 🔎 TOP FILTER BAR */}
      <div className="courses-top-bar">

        {/* Search */}
        <input
          type="text"
          placeholder="Search courses..."
          className="courses-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Course Type Dropdown */}
        <select
          className="courses-dropdown"
          value={courseType}
          onChange={(e) => setCourseType(e.target.value)}
        >
          <option value="all">All Courses</option>
          <option value="video">Video Courses</option>
          <option value="live">Live Courses</option>
        </select>

        {/* Level Dropdown */}
        <select
          className="courses-dropdown"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {/* TEMPORARY SAMPLE DATA (delete later when backend ready) */}
<div className="courses-grid">
  <CourseCard
    title="Python Bootcamp"
    instructor="Dr. Angela Yu"
    thumbnail="https://img-c.udemycdn.com/course/240x135/2776760_f176_10.jpg"
    price="₹499"
  />
  <CourseCard
    title="Full Stack Development"
    instructor="John Doe"
    thumbnail="https://img-c.udemycdn.com/course/240x135/625204_436a_4.jpg"
    price="₹799"
  />
  <CourseCard
    title="Risk Management Basics"
    instructor="TConnects Team"
    thumbnail="https://img-c.udemycdn.com/course/240x135/1430746_2f43_10.jpg"
    price="Free"
  />
</div>


      </div>

    </div>
    
  );
};

export default CoursesList;
