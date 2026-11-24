// InternshipsListPage.jsx - v3 (teal hero + new internship card, matches the jobs page). If you do not see this line at the top of your file, the old file is still in place.
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./InternshipsListPage.css";
import { useSavedInternships } from "../../context/SavedInternshipsContext";
import Pagination from "../../components/Pagination";

/* how many skill tags a card shows before it collapses the rest into "+N more" */
const MAX_TAGS = 5;

/* ------------------------------------------------------------------
   Stipend helper: "10000" -> "10,000", "0" -> "Unpaid", text stays as is.
   hasAmount decides whether the card shows the rupee sign.
------------------------------------------------------------------- */
const formatStipend = (v) => {
  if (v === null || v === undefined || String(v).trim() === "") return null;
  const raw = String(v).trim().replace(/^₹\s*/, "");
  if (/^0+$/.test(raw)) return { text: "Unpaid", hasAmount: false };
  if (/^\d+$/.test(raw)) return { text: Number(raw).toLocaleString("en-IN"), hasAmount: true };
  return { text: raw, hasAmount: /^\d/.test(raw) };
};

/* ---------- icons ---------- */
const SearchIcon = () => (
  <svg className="il-search-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const WalletIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="14.5" r="1" /></svg>
);
const LaptopIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /></svg>
);

/* ------------------------------------------------------------------
   One internship card. Kept in this file so the page stays easy to read.
------------------------------------------------------------------- */
function InternshipCard({ internship, saved, onOpen, onSave }) {
  const stipend = formatStipend(internship.stipend);

  const skills = internship.skills || [];
  const shownSkills = skills.slice(0, MAX_TAGS);
  const hiddenSkills = skills.slice(MAX_TAGS);

  const initial = (internship.company_name || "?").trim().charAt(0).toUpperCase() || "?";
  const hasMeta = internship.location || internship.duration || stipend || internship.work_mode;

  return (
    <article className="il-card">
      <div className="il-card-top">
        <div className="il-logo" aria-hidden="true">{initial}</div>

        <div className="il-card-head">
          <h2 className="il-card-title">{internship.title}</h2>
          <p className="il-company">{internship.company_name}</p>
        </div>

        <div className="il-actions">
          <button type="button" className="il-view" onClick={() => onOpen(internship.id)}>
            View Details
          </button>
          <button
            type="button"
            className={`il-save${saved ? " is-saved" : ""}`}
            aria-pressed={saved}
            onClick={() => onSave(internship.id)}
          >
            {saved ? "Saved" : "Save Internship"}
          </button>
        </div>
      </div>

      {hasMeta && (
        <ul className="il-meta">
          {internship.location && <li><PinIcon />{internship.location}</li>}
          {internship.duration && <li><ClockIcon />{internship.duration}</li>}
          {stipend && (
            <li>
              {stipend.hasAmount ? <span className="il-rupee" aria-hidden="true">₹</span> : <WalletIcon />}
              {stipend.text}
            </li>
          )}
          {internship.work_mode && <li><LaptopIcon />{internship.work_mode}</li>}
        </ul>
      )}

      <p className="il-desc">
        {internship.short_description || "Internship description not added"}
      </p>

      {skills.length > 0 && (
        <div className="il-tags">
          {shownSkills.map((tag, index) => (
            <span key={`${tag}-${index}`}>{tag}</span>
          ))}
          {hiddenSkills.length > 0 && (
            <span className="il-more" title={hiddenSkills.join(", ")}>
              +{hiddenSkills.length} more
            </span>
          )}
        </div>
      )}
    </article>
  );
}

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
      setInternships([]);
    } finally {
      setLoading(false);
    }
  }, [search, workMode, location, duration, stipend]);

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
      {/* HERO: title, search bar and result count on the teal gradient panel */}
      <section className="il-hero">
        <h1 className="il-h1">Risk Management Internships</h1>
        <p className="il-subtitle">
          Discover exciting internship opportunities in risk management
          across banking, finance, and fintech sectors in India.
        </p>

        <form className="il-toolbar" onSubmit={handleSearch}>
          <div className="il-search">
            <SearchIcon />
            <input
              type="text"
              className="il-field"
              placeholder="Search by title, company or keyword..."
              aria-label="Search internships"
              value={search}
              onChange={handleFilterChange(setSearch)}
            />
          </div>

          <select
            className="il-field il-select"
            aria-label="Work mode"
            value={workMode}
            onChange={handleFilterChange(setWorkMode)}
          >
            <option value="">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <input
            type="text"
            className="il-field"
            placeholder="Location"
            aria-label="Location"
            value={location}
            onChange={handleFilterChange(setLocation)}
          />

          <select
            className="il-field il-select"
            aria-label="Duration"
            value={duration}
            onChange={handleFilterChange(setDuration)}
          >
            <option value="">All Durations</option>
            <option value="1 month">1 month</option>
            <option value="2 months">2 months</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="12 months">12 months</option>
          </select>

          <button type="submit" className="il-search-btn">
            Search<i><ArrowIcon /></i>
          </button>
        </form>

        <div className="il-count-row">
          <p className="il-count" aria-live="polite">
            Showing {internships.length} of {totalCount} internship opportunities
          </p>
          {hasActiveFilters && (
            <button type="button" className="il-clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      </section>

      {loading && <p className="il-state">Loading internships…</p>}

      {!loading && internships.length === 0 && (
        <p className="il-state">No internships found matching your filters.</p>
      )}

      {!loading && internships.length > 0 && (
        <div className="il-list">
          {internships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              saved={isSaved(internship.id)}
              onOpen={openDetails}
              onSave={toggleSave}
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