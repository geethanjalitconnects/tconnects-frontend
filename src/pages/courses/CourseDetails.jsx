import React from "react";
import { useParams } from "react-router-dom";
import "./styles/CourseDetails.css";

/* Components */
import CourseBanner from "./components/CourseBanner";
import WhatYouWillLearn from "./components/WhatYouWillLearn";
import CourseIncludes from "./components/CourseIncludes";
import Requirements from "./components/Requirements";
import Description from "./components/Description";
import Curriculum from "./components/Curriculum";

const CourseDetails = () => {
  const { slug, id } = useParams();

  // TODO: Later fetch from backend using id
  // For now, temporary sample data:
  const sampleCourse = {
    title: "Python Bootcamp: From Zero to Hero",
    instructor: "Dr. Angela Yu",
    rating: 4.7,
    language: "English",
    learnPoints: [
      "Build real Python projects",
      "Master variables, loops, functions",
      "Understand Object-Oriented Programming",
      "Work with files and error handling",
      "Create Python automation scripts"
    ],
    includes: {
      modules: 12,
      videos: 58,
      duration: "12 hours",
      resources: 18,
      access: "Full lifetime access"
    },
    requirements: [
      "No prior experience required",
      "A computer (Windows/Mac/Linux)",
      "Internet connection"
    ],
    description: `
      This Python course takes you from beginner to advanced level with hands-on projects. 
      Learn the core programming concepts, apply them in real-world scenarios, and build confidence 
      in solving programming challenges. This course is perfect for beginners and intermediate 
      developers who want to upgrade their skills.
    `,
    curriculum: [
      {
        moduleTitle: "Day 1 - Working With Variables in Python",
        lectures: [
          { title: "What you're going to get from this course", duration: "03:27", preview: true },
          { title: "START HERE", duration: "02:53", preview: false },
          { title: "Downloadable Resources & Tips", duration: "04:22", preview: true },
          { title: "Day 1 Goals", duration: "02:30", preview: false }
        ]
      },
      {
        moduleTitle: "Day 2 - Control Flow & Loops",
        lectures: [
          { title: "If/Else Statements", duration: "05:20" },
          { title: "For Loop Deep Dive", duration: "06:40" },
        ]
      }
    ]
  };

  return (
    <div className="course-details-page">

      {/* =================== BANNER =================== */}
      <CourseBanner
        title={sampleCourse.title}
        instructor={sampleCourse.instructor}
        rating={sampleCourse.rating}
        language={sampleCourse.language}
      />

      <div className="course-details-container">
        
        {/* =================== WHAT YOU WILL LEARN =================== */}
        <WhatYouWillLearn points={sampleCourse.learnPoints} />

        {/* =================== COURSE INCLUDES =================== */}
        <CourseIncludes includes={sampleCourse.includes} />

        {/* =================== REQUIREMENTS =================== */}
        <Requirements requirements={sampleCourse.requirements} />

        {/* =================== DESCRIPTION =================== */}
        <Description text={sampleCourse.description} />

        {/* =================== CURRICULUM =================== */}
        <Curriculum curriculum={sampleCourse.curriculum} />

      </div>
    </div>
  );
};

export default CourseDetails;
