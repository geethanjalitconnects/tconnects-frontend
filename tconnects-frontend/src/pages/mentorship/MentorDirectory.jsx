import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { mentorshipApi } from "../../services/mentorshipApi";
import "./mentorship.css";

const PAGE_SIZE = 12;

const SORTS = [
  ["newest", "Newest"],
  ["rate_low", "Price: low to high"],
  ["rate_high", "Price: high to low"],
  ["experience", "Most experienced"],
];

const prettify = (code) =>
  String(code || "")
    .replaceAll("_", " ")
    .replace(/^./, (c) => c.toUpperCase());

export default function MentorDirectory() {
  const [mentors, setMentors] = useState([]);
  const [options, setOptions] = useState({});
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState(""); // debounced copy that is sent to the API
  const [area, setArea] = useState("");
  const [ordering, setOrdering] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  // Labels for the specialisation codes (credit -> "Credit risk").
  useEffect(() => {
    mentorshipApi.getOptions().then((opts) => setOptions(opts || {})).catch(() => {
      // Labels fall back to prettified codes; the directory still works.
    });
  }, []);

  const areaLabels = Object.fromEntries(
    (options.risk_areas || []).map((item) => [item.value || item, item.label || item])
  );
  const areaLabel = (code) => areaLabels[code] || prettify(code);

  // Wait until the visitor stops typing before asking the server.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchText.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const id = requestId.current + 1;
    requestId.current = id;
    setLoading(true);
    setError("");

    const params = { page, page_size: PAGE_SIZE, ordering };
    if (search) params.q = search;
    if (area) params.risk_area = area;

    mentorshipApi
      .getMentorsPage(params)
      .then((data) => {
        if (id !== requestId.current) return; // a newer search already replaced this one
        setMentors(data.results || []);
        setCount(Number(data.count ?? (data.results || []).length));
        setTotalPages(Math.max(1, Number(data.total_pages) || 1));
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        // Asking for a page past the end: go back to the first page.
        if (err?.response?.status === 404 && page > 1) {
          setPage(1);
          return;
        }
        setMentors([]);
        setError("We couldn't load mentors right now. Please refresh and try again.");
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, [search, area, ordering, page]);

  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const goToPage = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mentorship-page mentor-directory-page">
      <section className="mentor-directory-heading">
        <span className="mentor-eyebrow">TCONNECTS MENTOR NETWORK</span>
        <h1>Find guidance from people who've done the work.</h1>
        <p>Explore approved professionals across risk management and related specializations.</p>
        <div className="mentor-filters">
          <label className="mentor-search">
            <i className="bi bi-search" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by name, role or expertise"
              aria-label="Search mentors"
            />
          </label>
          <select aria-label="Filter by expertise" value={area} onChange={(e) => resetPage(setArea)(e.target.value)}>
            <option value="">All specializations</option>
            {(options.risk_areas || []).map((item) => (
              <option key={item.value || item} value={item.value || item}>{item.label || item}</option>
            ))}
          </select>
          <select aria-label="Sort mentors" value={ordering} onChange={(e) => resetPage(setOrdering)(e.target.value)}>
            {SORTS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </section>

      {loading && <p className="mentor-state" role="status">Loading verified mentors…</p>}
      {error && <p className="mentor-error" role="alert">{error}</p>}
      {!loading && !error && mentors.length === 0 && (
        <div className="mentor-empty">
          <h2>No mentors found</h2>
          <p>Try another search or filter, or check back as our verified network grows.</p>
        </div>
      )}
      {!loading && !error && count > 0 && (
        <p className="mentor-result-count">{count} mentor{count === 1 ? "" : "s"}</p>
      )}

      <section className="mentor-card-grid" aria-busy={loading}>
        {mentors.map((mentor) => (
          <article className="mentor-profile-card" key={mentor.slug}>
            <div className="mentor-card-top">
              {mentor.photo_url ? (
                <img className="mentor-avatar" src={mentor.photo_url} alt="" loading="lazy" />
              ) : (
                <div className="mentor-avatar mentor-avatar-fallback">{(mentor.full_name || "M").charAt(0)}</div>
              )}
              <span className="mentor-verified"><i className="bi bi-patch-check-fill" /> Verified</span>
            </div>
            <h2>{mentor.full_name}</h2>
            <p className="mentor-card-role">
              {mentor.job_title || "Risk Management Professional"}
              {mentor.company ? ` · ${mentor.company}` : ""}
            </p>
            <p className="mentor-card-location">{[mentor.city, mentor.country].filter(Boolean).join(", ")}</p>
            <div className="mentor-card-meta">
              <span>{mentor.years_experience ?? "—"} years' experience</span>
              <span>₹{Number(mentor.hourly_rate || 0).toLocaleString("en-IN")}/hr</span>
            </div>
            <div className="mentor-chip-row">
              {(mentor.risk_areas || []).slice(0, 3).map((item) => (
                <span className="mentor-chip" key={item}>{areaLabel(item)}</span>
              ))}
            </div>
            <Link className="mentor-card-link" to={`/mentorship/mentors/${mentor.slug}`}>
              View profile <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>

      {totalPages > 1 && (
        <nav className="mentor-pager" aria-label="Mentor pages">
          <button type="button" className="mentor-btn mentor-btn-outline" disabled={page <= 1 || loading} onClick={() => goToPage(page - 1)}>
            ← Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" className="mentor-btn mentor-btn-outline" disabled={page >= totalPages || loading} onClick={() => goToPage(page + 1)}>
            Next →
          </button>
        </nav>
      )}
    </main>
  );
}
