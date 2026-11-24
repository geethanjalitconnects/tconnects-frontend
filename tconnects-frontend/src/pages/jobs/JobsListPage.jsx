// JobsListPage.jsx - v3 (teal hero + new job card). If you do not see this line at the top of your file, the old file is still in place.
import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../config/api";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { AuthContext } from "../../context/AuthContext";
import Pagination from "../../components/Pagination";
import "./JobsListPage.css";

/* how many skill tags a card shows before it collapses the rest into "+N more" */
const MAX_TAGS = 5;

/* ------------------------------------------------------------------
   Small helpers. Some jobs arrive with raw values ("2-4", "4-6",
   "full_time") instead of the *_display versions, so we tidy them up.
------------------------------------------------------------------- */
const isNumeric = (v) => /^[\d\s.+\-–]+$/.test(String(v));
const fmtExperience = (v) => (isNumeric(v) ? `${String(v).trim()} years` : String(v));
const fmtSalary = (v) => (isNumeric(v) ? `${String(v).trim()} LPA` : String(v));
const fmtType = (v) => String(v).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/* ---------- icons ---------- */
const SearchIcon = () => (
  <svg className="jl-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v11H3z" /><path d="M9 8V5h6v3" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);

/* ------------------------------------------------------------------
   One job card. Kept in this file so the page stays easy to read.
------------------------------------------------------------------- */
function JobCard({ job, saved, onOpen, onSave }) {
  const experience =
    job.experience_range_display || (job.experience_range ? fmtExperience(job.experience_range) : "");
  const salary =
    job.salary_range_display || (job.salary_range ? fmtSalary(job.salary_range) : "");
  const type =
    job.employment_type_display || (job.employment_type ? fmtType(job.employment_type) : "");

  const skills = job.skills || [];
  const shownSkills = skills.slice(0, MAX_TAGS);
  const hiddenSkills = skills.slice(MAX_TAGS);

  const initial = (job.company_name || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="jl-card">
      <div className="jl-card-top">
        <div className="jl-logo" aria-hidden="true">{initial}</div>

        <div className="jl-card-head">
          <h2 className="jl-card-title">{job.title}</h2>
          <p className="jl-company">{job.company_name}</p>
        </div>

        <div className="jl-actions">
          <button type="button" className="jl-view" onClick={() => onOpen(job)}>
            View Details
          </button>
          <button
            type="button"
            className={`jl-save${saved ? " is-saved" : ""}`}
            aria-pressed={saved}
            onClick={() => onSave(job.id)}
          >
            {saved ? "Saved" : "Save Job"}
          </button>
        </div>
      </div>

      {(experience || salary || type) && (
        <ul className="jl-meta">
          {experience && <li><BriefcaseIcon />{experience}</li>}
          {salary && <li><span className="jl-rupee" aria-hidden="true">₹</span>{salary}</li>}
          {type && <li><ClockIcon />{type}</li>}
        </ul>
      )}

      <p className="jl-desc">
        {job.short_description || "Job description not provided."}
      </p>

      {skills.length > 0 && (
        <div className="jl-tags">
          {shownSkills.map((skill, idx) => (
            <span key={`${skill}-${idx}`}>{skill}</span>
          ))}
          {hiddenSkills.length > 0 && (
            <span className="jl-more" title={hiddenSkills.join(", ")}>
              +{hiddenSkills.length} more
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export default function JobsListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters can be set from the URL: /jobs?search=&location=&category=
  // (?q= is what the SearchAction in index.html's structured data sends.)
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") ?? searchParams.get("q") ?? "";
  const urlLocation = searchParams.get("location") ?? "";
  const urlCategory = searchParams.get("category") ?? "";

  const [search, setSearch] = useState(urlSearch);
  const [location, setLocation] = useState(urlLocation);
  const [category, setCategory] = useState(urlCategory);

  // Follows the URL when it changes while this page is open, such as a
  // homepage search followed by the plain Jobs link in the navbar.
  useEffect(() => {
    setSearch(urlSearch);
    setLocation(urlLocation);
    setCategory(urlCategory);
    setCurrentPage(1);
  }, [urlSearch, urlLocation, urlCategory]);

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
      {/* HERO: title, search bar and result count on the teal gradient panel */}
      <section className="jl-hero">
        <h1 className="jl-h1">Risk Management Jobs</h1>
        <p className="jl-subtitle">
          Discover exciting risk management opportunities across banking,
          insurance, and fintech sectors in India.
        </p>

        <form className="jl-toolbar" onSubmit={handleSearch}>
          <div className="jl-search">
            <SearchIcon />
            <input
              type="text"
              className="jl-field"
              placeholder="Search by title, company or keyword..."
              aria-label="Search jobs"
              value={search}
              onChange={handleFilterChange(setSearch)}
            />
          </div>

          <input
            type="text"
            className="jl-field"
            placeholder="Location"
            aria-label="Location"
            value={location}
            onChange={handleFilterChange(setLocation)}
          />

          <select
            className="jl-field jl-select"
            aria-label="Category"
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

          <button type="submit" className="jl-search-btn">
            Search<i><ArrowIcon /></i>
          </button>
        </form>

        <div className="jl-count-row">
          <p className="jl-count" aria-live="polite">
            Showing {jobs.length} of {totalCount} job opportunities
          </p>
          {hasActiveFilters && (
            <button type="button" className="jl-clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      </section>

      {loading && <p className="jl-state">Loading jobs…</p>}

      {!loading && jobs.length === 0 && (
        <p className="jl-state">No jobs found matching your filters.</p>
      )}

      {!loading && jobs.length > 0 && (
        <div className="jl-list">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              saved={isSaved(job.id)}
              onOpen={openDetails}
              onSave={handleSave}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}