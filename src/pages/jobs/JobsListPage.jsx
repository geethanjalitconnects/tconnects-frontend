import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { AuthContext } from "../../context/AuthContext";
import Pagination from "../../components/Pagination";
import "./JobsListPage.css";

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();
  const { savedIds, toggleSave } = useSavedJobs();
  const { user } = useContext(AuthContext);

  const buildParams = (page) => {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search.trim())   params.append("search", search.trim());
    if (location.trim()) params.append("location", location.trim());
    if (category)        params.append("category", category);
    return params.toString();
  };

  const loadJobs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/jobs/?${buildParams(page)}`);
      if (res.data && res.data.results) {
        setJobs(res.data.results);
        setTotalPages(res.data.total_pages || 1);
        setTotalCount(res.data.count || 0);
      } else {
        setJobs(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
        setTotalCount(Array.isArray(res.data) ? res.data.length : 0);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, location, category]);

  useEffect(() => {
    loadJobs(currentPage);
  }, [currentPage, loadJobs]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadJobs(1);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isSaved = (id) => savedIds.includes(id);
  const openDetails = (job) => navigate(`/jobs/${job.id}`);

  const handleSave = (jobId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleSave(jobId);
  };

  const hasActiveFilters = search || location || category;

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1 className="jobs-title">Risk Management Jobs</h1>
        <p className="jobs-subtitle">
          Discover exciting risk management opportunities across banking,
          insurance, and fintech sectors in India.
        </p>
      </div>

      {/* SEARCH BAR */}
      <form className="jobs-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="jobs-search-input"
          placeholder="Search by title, company or keyword..."
          value={search}
          onChange={handleFilterChange(setSearch)}
        />
        <button type="submit" className="jobs-search-btn">Search</button>
      </form>

      {/* FILTERS */}
      <div className="jobs-filters">
        <input
          type="text"
          className="jobs-filter-select"
          placeholder="Location"
          value={location}
          onChange={handleFilterChange(setLocation)}
        />

        <select
          className="jobs-filter-select"
          value={category}
          onChange={handleFilterChange(setCategory)}
        >
          <option value="">All Categories</option>
          <option value="Risk Management">Risk Management</option>
          <option value="Credit Risk">Credit Risk</option>
          <option value="Market Risk">Market Risk</option>
          <option value="Operational Risk">Operational Risk</option>
          <option value="Fraud Risk">Fraud Risk</option>
          <option value="Compliance & GRC">Compliance & GRC</option>
          <option value="Audit & Analytics">Audit & Analytics</option>
          <option value="Cybersecurity & IT Risk">Cybersecurity & IT Risk</option>
          <option value="Finance & Banking">Finance & Banking</option>
          <option value="Insurance">Insurance</option>
          <option value="Enterprise Risk Management">Enterprise Risk Management</option>
          <option value="Third Party Risk Management">Third Party Risk Management</option>
          <option value="Model Risk Management">Model Risk Management</option>
          <option value="Data Privacy & Technology Risk">Data Privacy & Technology Risk</option>
          <option value="Other">Other</option>
        </select>

        {hasActiveFilters && (
          <button className="jobs-clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <p className="jobs-count">
        Showing {jobs.length} of {totalCount} job opportunities
      </p>

      {loading && <div className="jobs-loading">Loading jobs…</div>}

      {!loading && jobs.length === 0 && (
        <p className="jobs-empty">No jobs found matching your filters.</p>
      )}

      {!loading && jobs.map((job) => (
        <div className="job-card" key={job.id}>
          <h2 className="job-title">{job.title}</h2>
          <p className="company-name">{job.company_name}</p>

          <div className="job-info">
            <span>{job.experience_range_display || job.experience_range}</span> •
            <span>{job.salary_range_display || job.salary_range}</span> •
            <span>{job.employment_type_display || job.employment_type}</span>
          </div>

          <p className="job-desc">
            {job.short_description || "Job description not provided."}
          </p>

          <div className="tags">
            {(job.skills || []).map((skill, idx) => (
              <span key={idx}>{skill}</span>
            ))}
          </div>

          <div className="job-actions">
            <button className="view-btn" onClick={() => openDetails(job)}>
              View Details
            </button>
            <button className="save-btn" onClick={() => handleSave(job.id)}>
              {isSaved(job.id) ? "Saved" : "Save Job"}
            </button>
          </div>
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}