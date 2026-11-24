import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./InternshipsListPage.css";
import { useSavedInternships } from "../../context/SavedInternshipsContext";
import Pagination from "../../components/Pagination";

export default function InternshipsListPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter state
  const [search, setSearch] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");

  const navigate = useNavigate();
  const { savedIds, toggleSave } = useSavedInternships();

  const buildParams = (page) => {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search)   params.append("search", search);
    if (workMode) params.append("work_mode", workMode);
    if (location) params.append("location", location);
    if (duration) params.append("duration", duration);
    if (stipend)  params.append("stipend", stipend);
    return params.toString();
  };

  const loadInternships = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/internships/?${buildParams(page)}`);
      if (res.data && res.data.results) {
        setInternships(res.data.results);
        setTotalPages(res.data.total_pages || 1);
        setTotalCount(res.data.count || 0);
      } else {
        setInternships(res.data.results ? res.data.results : res.data);
        setTotalPages(1);
        setTotalCount(res.data.length);
      }
    } catch (err) {
      console.error("Failed to load internships:", err);
    } finally {
      setLoading(false);
    }
  }, [search, workMode, location, duration]);

  useEffect(() => {
    loadInternships(currentPage);
  }, [currentPage, loadInternships]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadInternships(1);
  };

  const clearFilters = () => {
    setSearch("");
    setWorkMode("");
    setLocation("");
    setDuration("");
    setStipend("");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isSaved = (id) => savedIds.includes(id);

  const openDetails = (id) => {
    navigate(`/internships/${id}`);
  };

  const hasActiveFilters = search || workMode || location || duration || stipend;

  return (
    <div className="internships-page">
      <div className="internships-header">
        <h1 className="internships-title">Risk Management Internships</h1>
        <p className="internships-subtitle">
          Discover exciting internship opportunities in risk management
          across banking, finance, and fintech sectors in India.
        </p>
      </div>

      {/* SEARCH BAR */}
      <form className="internships-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="internships-search-input"
          placeholder="Search by title, company or keyword..."
          value={search}
          onChange={handleFilterChange(setSearch)}
        />
        <button type="submit" className="internships-search-btn">Search</button>
      </form>

      {/* FILTERS */}
      <div className="internships-filters">
        <select
          className="internships-filter-select"
          value={workMode}
          onChange={handleFilterChange(setWorkMode)}
        >
          <option value="">Work Modes</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <input
          type="text"
          className="internships-filter-select"
          placeholder="Location"
          value={location}
          onChange={handleFilterChange(setLocation)}
        />

        <select
          className="internships-filter-select"
          value={duration}
          onChange={handleFilterChange(setDuration)}
        >
          <option value=""> Durations</option>
          <option value="1 month">1 month</option>
          <option value="2 months">2 months</option>
          <option value="3 months">3 months</option>
          <option value="6 months">6 months</option>
          <option value="12 months">12 months</option>
        </select>

        

        {hasActiveFilters && (
          <button className="internships-clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <p className="internships-count">
        Showing {internships.length} of {totalCount} internship opportunities
      </p>

      {loading && <div className="internships-loading">Loading internships…</div>}

      {!loading && internships.length === 0 && (
        <p className="internships-empty">No internships found matching your filters.</p>
      )}

      {internships.map((intern) => (
        <div className="job-card" key={intern.id}>
          <h2 className="job-title">{intern.title}</h2>
          <p className="company-name">{intern.company_name}</p>

          <div className="job-info">
            <span>{intern.location}</span> •
            <span>{intern.duration}</span> •
            <span>{intern.stipend}</span> •
            <span>{intern.work_mode}</span>
          </div>

          <p className="job-desc">
            {intern.short_description || "Internship description not added"}
          </p>

          <div className="tags">
            {intern.skills?.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>

          <div className="job-actions">
            <button className="view-btn" onClick={() => openDetails(intern.id)}>
              View Details
            </button>
            <button className="save-btn" onClick={() => toggleSave(intern.id)}>
              {isSaved(intern.id) ? "Saved" : "Save Internship"}
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