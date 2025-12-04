import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../config/api";   // ⭐ ADD THIS
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
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ FETCH COURSE DETAILS FROM BACKEND
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/courses/${slug}/${id}/`);
        setCourse(res.data);
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, id]);

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="course-details-page">
      <CourseBanner
        title={course.title}
        instructor={course.instructor}
        rating={course.rating}
        language={course.language}
      />

      <div className="course-main-layout">
        <div className="course-left">
          <WhatYouWillLearn points={course.learnPoints || []} />
          <Description text={course.description} />
          <Requirements requirements={course.requirements || []} />
          <CourseIncludes includes={course.includes} />
          <Curriculum curriculum={course.modules} />
        </div>

        <div className="course-right">
          <CourseSidebar
            price={course.price}
            includes={course.includes}
            courseId={id}
            slug={slug}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
