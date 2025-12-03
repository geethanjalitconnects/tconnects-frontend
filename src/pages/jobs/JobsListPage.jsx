// JobsListPage.jsx — ONLY FIELD NAMES FIXED, NO UI CHANGES

import React, { useEffect, useState } from "react";
import api from "../../config/api";
import "./JobsListPage.css";

const JobsListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await api.get("/api/jobs/");
        setJobs(res.data);
        setFilteredJobs(res.data);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const filterJobs = (category) => {
    setSelectedCategory(category);
    if (category === "all") setFilteredJobs(jobs);
    else setFilteredJobs(jobs.filter((job) => job.category === category));
  };

  const openDetails = (id) => {
    window.open(`/jobs/${id}`, "_blank");
  };

  if (loading) return <div className="jobs-loading">Loading jobs...</div>;

  return (
    <div className="jobs-page">
      <h2 className="jobs-title">Available Jobs</h2>

      {/* Category Filter */}
      <div className="jobs-categories">
        <button
          className={selectedCategory === "all" ? "active" : ""}
          onClick={() => filterJobs("all")}
        >
          All
        </button>
        <button
          className={selectedCategory === "IT" ? "active" : ""}
          onClick={() => filterJobs("IT")}
        >
          IT
        </button>
        <button
          className={selectedCategory === "Finance" ? "active" : ""}
          onClick={() => filterJobs("Finance")}
        >
          Finance
        </button>
        <button
          className={selectedCategory === "Marketing" ? "active" : ""}
          onClick={() => filterJobs("Marketing")}
        >
          Marketing
        </button>
      </div>

      {/* Jobs List */}
      <div className="jobs-list">
        {filteredJobs.length === 0 && (
          <p className="no-jobs">No jobs found in this category.</p>
        )}

        {filteredJobs.map((job) => (
          <div className="job-card" key={job.id}>
            <h3 className="job-title">{job.title}</h3>
            <p className="job-company">{job.company_name}</p>

            <div className="job-meta">
              <span>{job.location}</span> •
              {/* FIXED FIELDS BELOW */}
              <span>{job.experience_range}</span> •
              <span>{job.salary_range}</span> •
              <span>{job.employment_type}</span>
            </div>

            <button
              className="job-view-btn"
              onClick={() => openDetails(job.id)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsListPage;
