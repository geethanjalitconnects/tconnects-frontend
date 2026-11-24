// JobDetailsPage.jsx — v2 (white premium layout, two columns). Logic is unchanged from v1:
// recruiter restriction + auth check for save/apply.

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./JobDetailsPage.css";

/* ---------- small display helpers (the API sends "2-4", "4-6", "full_time") ---------- */
const fmtExperience = (v) => (v ? (/year|yr/i.test(v) ? v : `${v} years`) : "");
const fmtSalary = (v) => (v ? (/lpa|₹|rs|inr|lakh/i.test(v) ? v : `${v} LPA`) : "");
const fmtType = (v) =>
  v ? String(v).replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

/* ---------- icons (same line style as the jobs list page) ---------- */
const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
);
const IconTag = () => (<Icon><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.2" /></Icon>);
const IconPin = () => (<Icon><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></Icon>);
const IconBriefcase = () => (<Icon><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></Icon>);
const IconClock = () => (<Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>);
const IconCalendar = () => (<Icon><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Icon>);
const IconGlobe = () => (<Icon><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></Icon>);

const JobDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const { savedIds, toggleSave } = useSavedJobs();
  const saved = savedIds.includes(Number(id));

  const isRecruiter = user?.role === "recruiter";

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}/`);
        setJob(res.data);

        if (res.data.recruiter_id) {
          try {
            const companyRes = await api.get(
              `/api/profiles/company/${res.data.recruiter_id}/`
            );
            setCompany(companyRes.data);
          } catch (err) {
            console.warn("No public company profile");
          }
        }
      } catch (err) {
        console.error("Failed to load job:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  useEffect(() => {
    if (!user || isRecruiter) return;

    const loadApplied = async () => {
      try {
        const res = await api.get("/api/applications/job/applied/");
        const appliedList = res.data.results || res.data; // paginated fix

        const isApplied = appliedList.some(
          (a) =>
            a.job_id === Number(id) ||
            a.job === Number(id) ||
            a.job_details?.id === Number(id)
        );
        setApplied(isApplied);
      } catch (err) {
        console.error("Failed to load applied status:", err);
      }
    };

    loadApplied();
  }, [id, isRecruiter, user]);

  const handleApplyNow = () => {
    if (!user) {
      toast.error("Please login to apply for this job.");
      navigate("/login");
      return;
    }
    if (isRecruiter) {
      toast.error("Recruiters cannot apply for jobs. Please use a candidate account.");
      return;
    }
    navigate(`/apply?jobId=${id}`);
  };

  const handleToggleSave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isRecruiter) return;
    await toggleSave(Number(id));
  };

  if (loading) return <div className="jd-state">Loading job…</div>;
  if (!job) return <div className="jd-state">Job not found.</div>;

  const initial = (job.company_name || job.title || "?").trim().charAt(0).toUpperCase();
  const deadline = job.application_deadline
    ? new Date(job.application_deadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="jd-page">
      {/* ===== HEADER ===== */}
      <header className="jd-header">
        <div className="jd-header-main">
          <div className="jd-logo">{initial}</div>
          <div className="jd-header-text">
            <h1 className="jd-title">{job.title}</h1>
            <p className="jd-company">{job.company_name}</p>
            {job.category && <span className="jd-badge">{job.category}</span>}
          </div>
        </div>

        <div className="jd-actions">
          <button
            type="button"
            className={`jd-apply-btn${applied ? " is-applied" : ""}`}
            disabled={applied || isRecruiter}
            title={isRecruiter ? "Recruiters cannot apply for jobs" : ""}
            onClick={handleApplyNow}
          >
            {applied ? "Applied ✓" : "Apply Now"}
          </button>

          <button
            type="button"
            className={`jd-save-btn${saved ? " is-saved" : ""}`}
            disabled={isRecruiter}
            onClick={handleToggleSave}
            title={isRecruiter ? "Recruiters cannot save jobs" : ""}
          >
            {saved ? "Saved" : "Save Job"}
          </button>
        </div>
      </header>

      {/* Recruiter notice banner */}
      {isRecruiter && (
        <div className="jd-notice">
          You are logged in as a <strong>Recruiter</strong>. To apply for jobs, please log in
          with a candidate account.
        </div>
      )}

      <div className="jd-layout">
        {/* ===== MAIN COLUMN ===== */}
        <main className="jd-main">
          <section className="jd-section">
            <h2 className="jd-section-title">About the job</h2>
            <p className="jd-description">{job.full_description}</p>
          </section>

          {job.responsibilities?.length > 0 && (
            <section className="jd-section">
              <h2 className="jd-section-title">Responsibilities</h2>
              <ul className="jd-list">
                {job.responsibilities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements?.length > 0 && (
            <section className="jd-section">
              <h2 className="jd-section-title">Requirements</h2>
              <ul className="jd-list">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {job.skills?.length > 0 && (
            <section className="jd-section">
              <h2 className="jd-section-title">Skills required</h2>
              <div className="jd-skills">
                {job.skills.map((skill, i) => (
                  <span key={i} className="jd-skill">{skill}</span>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ===== SIDEBAR ===== */}
        <aside className="jd-side">
          <section className="jd-card">
            <h2 className="jd-side-title">Job overview</h2>
            <ul className="jd-facts">
              {job.location && (
                <li>
                  <IconPin />
                  <div><span>Location</span><strong>{job.location}</strong></div>
                </li>
              )}
              {job.experience_range && (
                <li>
                  <IconBriefcase />
                  <div><span>Experience</span><strong>{fmtExperience(job.experience_range)}</strong></div>
                </li>
              )}
              {job.salary_range && (
                <li>
                  <b className="jd-rupee" aria-hidden="true">₹</b>
                  <div><span>Salary</span><strong>{fmtSalary(job.salary_range)}</strong></div>
                </li>
              )}
              {job.employment_type && (
                <li>
                  <IconClock />
                  <div><span>Job type</span><strong>{fmtType(job.employment_type)}</strong></div>
                </li>
              )}
              {job.category && (
                <li>
                  <IconTag />
                  <div><span>Category</span><strong>{job.category}</strong></div>
                </li>
              )}
              {deadline && (
                <li>
                  <IconCalendar />
                  <div><span>Apply before</span><strong>{deadline}</strong></div>
                </li>
              )}
            </ul>
          </section>

          {company && (
            <section className="jd-card">
              <h2 className="jd-side-title">About the company</h2>
              <div className="jd-co-head">
                <div className="jd-co-logo">
                  {(company.company_name || "?").trim().charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="jd-co-name">{company.company_name}</p>
                  <p className="jd-co-industry">{company.industry_category || "Industry not specified"}</p>
                </div>
              </div>

              <ul className="jd-facts jd-facts-compact">
                <li>
                  <IconBriefcase />
                  <div><span>Company size</span><strong>{company.company_size || "Not specified"}</strong></div>
                </li>
                <li>
                  <IconPin />
                  <div><span>Location</span><strong>{company.company_location || "Not specified"}</strong></div>
                </li>
                {company.company_website && (
                  <li>
                    <IconGlobe />
                    <div>
                      <span>Website</span>
                      <strong>
                        <a href={company.company_website} target="_blank" rel="noreferrer">
                          {company.company_website.replace(/^https?:\/\//, "")}
                        </a>
                      </strong>
                    </div>
                  </li>
                )}
              </ul>

              {company.about_company && <p className="jd-co-about">{company.about_company}</p>}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default JobDetailsPage;