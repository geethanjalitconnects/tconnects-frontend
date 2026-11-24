
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import "./MentorReviewDashboard.css";
import { AdminNav } from "./AdminShell";

const EMPTY_COUNTS = {
  pending: 0,
  verified: 0,
  changes_requested: 0,
  not_verified: 0,
};

const STATUS_LABELS = {
  submitted: "Pending Review",
  approved: "Verified",
  changes_requested: "Changes Requested",
  rejected: "Not Verified",
  suspended: "Suspended",
  draft: "Draft",
};

const STATUS_OPTIONS = [
  { value: "submitted", label: "Pending Review" },
  { value: "approved", label: "Verified" },
  { value: "changes_requested", label: "Changes Requested" },
  { value: "rejected", label: "Not Verified" },
  { value: "suspended", label: "Suspended" },
];

export default function MentorReviewDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("submitted");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/api/mentors/review/", {
          params: {
            status: statusFilter,
            q: search.trim() || undefined,
          },
           skipAuthRedirect: true,
        });

        if (cancelled) return;

        const data = response.data;

        const results = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];

        setApplications(results);

        if (data?.counts) {
          setCounts((previous) => ({
            ...previous,
            ...data.counts,
          }));
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.detail ||
            "Could not load mentor applications. Check your Django backend and API configuration."
        );

        setApplications([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, [search, statusFilter, refreshKey]);

  const cards = [
    {
      label: "Pending Review",
      value: counts.pending,
      icon: "bi-hourglass-split",
      status: "submitted",
    },
    {
      label: "Verified",
      value: counts.verified,
      icon: "bi-patch-check",
      status: "approved",
    },
    {
      label: "Changes Requested",
      value: counts.changes_requested,
      icon: "bi-arrow-repeat",
      status: "changes_requested",
    },
    {
      label: "Not Verified",
      value: counts.not_verified,
      icon: "bi-shield-x",
      status: "rejected",
    },
  ];

  return (
    <main className="mentor-review-dashboard">
      <div className="mb-scope"><AdminNav /></div>
      <header className="review-page-header">
        <div>
          <span className="review-eyebrow">VConnects admin</span>
          <h1>Mentor Verification</h1>
          <p>
            Review professional profiles and manage mentor applications.
          </p>
        </div>

        <button
          className="review-refresh-button"
          onClick={() => setRefreshKey((key) => key + 1)}
          type="button"
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise" />
          {loading ? " Loading..." : " Refresh"}
        </button>
      </header>

      <section className="review-stat-grid">
        {cards.map((card) => (
          <button
            className={`review-stat-card ${
              statusFilter === card.status ? "selected" : ""
            }`}
            key={card.status}
            type="button"
            onClick={() => setStatusFilter(card.status)}
            aria-pressed={statusFilter === card.status}
          >
            <span className="review-stat-icon">
              <i className={`bi ${card.icon}`} />
            </span>

            <span className="review-stat-label">{card.label}</span>
            <strong>{counts[Object.keys(EMPTY_COUNTS)[cards.indexOf(card)]]}</strong>
          </button>
        ))}
      </section>

      <section className="review-applications-panel">
        <div className="review-panel-heading">
          <div>
            <h2>Mentor Applications</h2>
            <p>Search applications and open a profile to review it.</p>
          </div>

          <span className="review-result-count">
            {applications.length} shown
          </span>
        </div>

        <div className="review-toolbar">
          <label className="review-search">
            <i className="bi bi-search" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, company..."
              aria-label="Search mentor applications"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter applications by status"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="review-error" role="alert">
            <i className="bi bi-exclamation-circle" />
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="review-empty-state" role="status">
            <span className="review-spinner" />
            <p>Loading mentor applications...</p>
          </div>
        ) : !error && applications.length === 0 ? (
          <div className="review-empty-state">
            <i className="bi bi-inbox" />
            <h3>No applications found</h3>
            <p>Try another status or search term.</p>
          </div>
        ) : !error ? (
          <div className="review-table-wrapper">
            <table className="review-table">
              <thead>
                <tr>
                  <th>Mentor</th>
                  <th>Professional Details</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <strong>
                        {application.full_name || "Unnamed applicant"}
                      </strong>
                      <small>{application.email || "No email provided"}</small>
                    </td>

                    <td>
                      <strong>
                        {application.job_title || "Not provided"}
                      </strong>
                      <small>
                        {application.company_name || "Company not provided"}
                      </small>
                    </td>

                    <td>
                      {application.submitted_at
                        ? new Date(
                            application.submitted_at
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <span
                        className={`review-status review-status-${application.status}`}
                      >
                        {STATUS_LABELS[application.status] ||
                          application.status ||
                          "Unknown"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="review-open-button"
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin-dashboard/mentors/${application.id}`
                          )
                        }
                      >
                        Review <i className="bi bi-arrow-up-right" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
