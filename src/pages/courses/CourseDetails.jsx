import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/api";
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

  // FETCH COURSE DETAILS
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

      {/* TOP BANNER */}
      <CourseBanner
        title={course.title}
        instructor={course.instructor}
        rating={course.rating}
        language={course.language}
      />

      <div className="course-main-layout">

        {/* LEFT SIDE CONTENT */}
        <div className="course-left">

          {/* WHAT YOU WILL LEARN */}
          <WhatYouWillLearn points={course.what_you_will_learn || []} />

          {/* DESCRIPTION */}
          <Description text={course.description} />

          {/* REQUIREMENTS */}
          <Requirements requirements={course.requirements || []} />


          {/* THIS COURSE INCLUDES */}
          <CourseIncludes includes={course.includes || {}} />

          {/* CURRICULUM */}
          <Curriculum curriculum={course.modules || []} />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="course-right">
          <CourseSidebar
            price={course.price}
            includes={course.includes || {}}
            courseId={course.id}
            slug={slug}
          />
        </div>

      </div>
    </div>
  );
};

export default CourseDetails;
