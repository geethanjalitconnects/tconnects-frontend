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
import CourseSidebar from "./components/CourseSidebar";

const CourseDetails = () => {
  const { slug, id } = useParams();

  const sampleCourse = {
    title: "Python Bootcamp: From Zero to Hero",
    instructor: "Dr. Angela Yu",
    rating: 4.7,
    language: "English",
    price: "₹499",

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
      duration: "12 hours on-demand video",
      resources: 18,
      access: "Full lifetime access"
    },

    requirements: [
      "No prior programming experience required",
      "A computer (Windows/Mac/Linux)",
      "Internet connection"
    ],

    description: `
      This Python course takes you from beginner to advanced level with hands-on projects.
      Learn the core programming concepts, apply them in real-world scenarios, and build
      confidence in solving programming challenges.
    `,

    curriculum: [
      {
        moduleTitle: "Working with Variables",
        lectures: [
          { title: "What you're going to get from this course", duration: "03:27", preview: true },
          { title: "START HERE", duration: "02:53" },
          { title: "Downloadable Resources & Tips", duration: "04:22", preview: true }
        ]
      },
      {
        moduleTitle: "Control Flow & Loops",
        lectures: [
          { title: "If/Else Statements", duration: "05:20" },
          { title: "For Loop Deep Dive", duration: "06:40" }
        ]
      }
    ]
  };

  return (
    <div className="course-details-page">
      <CourseBanner
        title={sampleCourse.title}
        instructor={sampleCourse.instructor}
        rating={sampleCourse.rating}
        language={sampleCourse.language}
      />

      <div className="course-main-layout">
        <div className="course-left">
          <WhatYouWillLearn points={sampleCourse.learnPoints} />
          <Description text={sampleCourse.description} />
          <Requirements requirements={sampleCourse.requirements} />
          <CourseIncludes includes={sampleCourse.includes} />
          <Curriculum curriculum={sampleCourse.curriculum} />
        </div>

        <div className="course-right">
          <CourseSidebar
            price={sampleCourse.price}
            includes={sampleCourse.includes}
            courseId={id}
            slug={slug}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
