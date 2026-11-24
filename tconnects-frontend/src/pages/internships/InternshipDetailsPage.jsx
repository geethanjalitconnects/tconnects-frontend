// InternshipDetailsPage.jsx - v3 (same design as the job details page, with recruiter apply restriction). If you do not see this line at the top of your file, the old file is still in place.

import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import "./InternshipDetailsPage.css";
import { useSavedInternships } from "../../context/SavedInternshipsContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

/* ------------------------------------------------------------------
   Small helpers
------------------------------------------------------------------- */
// "10000" -> "10,000", "0" -> "Unpaid", text stays as is. hasAmount decides whether we show the rupee sign.
const formatStipend = (v) => {
  if (v === null || v === undefined || String(v).trim() === "") return null;
  const raw = String(v).trim().replace(/^₹\s*/, "");
  if (/^0+$/.test(raw)) return { text: "Unpaid", hasAmount: false };
  if (/^\d+$/.test(raw)) return { text: Number(raw).toLocaleString("en-IN"), hasAmount: true };
  return { text: raw, hasAmount: /^\d/.test(raw) };
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const toUrl = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
const prettyUrl = (u) => String(u).replace(/^https?:\/\//i, "").replace(/\/$/, "");

/* ---------- icons (drawn by the stylesheet: teal outline) ---------- */
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
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h18v11H3z" /><path d="M9 8V5h6v3" /></svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 3v4" /><path d="M16 3v4" /></svg>
);
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16" /><path d="M14 10h5a1 1 0 011 1v10" /><path d="M8 8h2" /><path d="M8 12h2" /><path d="M8 16h2" /></svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>
);

/* one row in a sidebar list: icon tile + small label + value */
function Fact({ icon, label, children }) {
  return (
    <li>
      {icon}
      <div>
        <span>{label}</span>
        <strong>{children}</strong>
      </div>
    </li>
  );
}

const InternshipDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext); // logged-in user

  const [internship, setInternship] = useState(null);
  const [company, setCompany] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const { savedIds, toggleSave } = useSavedInternships();
  const saved = savedIds.includes(Number(id));

  const isRecruiter = user?.role === "recruiter";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/internships/${id}/`);
        setInternship(res.data.results ? res.data.results : res.data);

        const rid = res.data.recruiter_id;
        if (rid) {
          try {
            const companyRes = await api.get(`/api/profiles/company/${rid}/`);
            setCompany(companyRes.data);
          } catch (err) {
            console.warn("Company profile not found for recruiter:", rid);
          }
        }
      } catch (err) {
        console.error("Failed to load internship:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    // Only check applied status for candidates
    if (isRecruiter) return;

    const loadApplied = async () => {
      try {
        const res = await api.get("/api/applications/internship/applied/");
        const appliedList = res.data.results || res.data;
        const appliedIds = appliedList.map((a) => a.internship_id);
        setApplied(appliedIds.includes(Number(id)));
      } catch (err) {
        console.error("Failed to load applied status:", err);
      }
    };

    loadApplied();
  }, [id, isRecruiter]);

  const handleApplyNow = () => {
    if (!user) {
      toast.error("Please login to apply for this internship.");
      navigate("/login");
      return;
    }

    if (isRecruiter) {
      toast.error("Recruiters cannot apply for internships.");
      return;
    }

    navigate(`/apply-internship?internshipId=${id}`);
  };

  const handleToggleSave = () => {
    toggleSave(Number(id));
  };

  if (loading) return <div className="ind-state">Loading internship…</div>;
  if (!internship) return <div className="ind-state">Internship not found.</div>;

  const stipend = formatStipend(internship.stipend);
  const initial = (internship.company_name || "?").trim().charAt(0).toUpperCase() || "?";
  const coInitial = (company?.company_name || internship.company_name || "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="ind-page">

      {/* HEADER: company badge, title, company, and the two buttons */}
      <header className="ind-header">
        <div className="ind-header-main">
          <div className="ind-logo" aria-hidden="true">{initial}</div>
          <div className="ind-header-text">
            <h1 className="ind-title">{internship.title}</h1>
            <p className="ind-company">{internship.company_name}</p>
            <span className="ind-badge">{internship.category || "Internship"}</span>
          </div>
        </div>

        <div className="ind-actions">
          {/* Apply: disabled once applied, and always disabled for recruiters */}
          <button
            type="button"
            className={`ind-apply-btn${applied ? " is-applied" : ""}`}
            disabled={applied || isRecruiter}
            title={isRecruiter ? "Recruiters cannot apply for internships" : ""}
            onClick={handleApplyNow}
          >
            {applied ? "Applied ✓" : "Apply Now"}
          </button>

          {/* Save: disabled for recruiters */}
          <button
            type="button"
            className={`ind-save-btn${saved ? " is-saved" : ""}`}
            disabled={isRecruiter}
            aria-pressed={saved}
            title={isRecruiter ? "Recruiters cannot save internships" : ""}
            onClick={handleToggleSave}
          >
            {saved ? "Saved" : "Save Internship"}
          </button>
        </div>
      </header>

      {/* Recruiter notice */}
      {isRecruiter && (
        <div className="ind-notice">
          You are logged in as a <strong>Recruiter</strong>. To apply for internships, please login with a candidate account.
        </div>
      )}

      <div className="ind-layout">
        {/* MAIN COLUMN */}
        <div className="ind-main">
          <section className="ind-section">
            <h2 className="ind-section-title">About the Internship</h2>
            <p className="ind-description">
              {internship.full_description || "No description added."}
            </p>
          </section>

          {internship.responsibilities?.length > 0 && (
            <section className="ind-section">
              <h2 className="ind-section-title">Responsibilities</h2>
              <ul className="ind-list">
                {internship.responsibilities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {internship.requirements?.length > 0 && (
            <section className="ind-section">
              <h2 className="ind-section-title">Requirements</h2>
              <ul className="ind-list">
                {internship.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          )}

          {internship.skills?.length > 0 && (
            <section className="ind-section">
              <h2 className="ind-section-title">Skills Required</h2>
              <div className="ind-skills">
                {internship.skills.map((skill, i) => (
                  <span key={i} className="ind-skill">{skill}</span>
                ))}
              </div>
            </section>
          )}

          {internship.perks?.length > 0 && (
            <section className="ind-section">
              <h2 className="ind-section-title">Perks &amp; Benefits</h2>
              <ul className="ind-list">
                {internship.perks.map((perk, i) => (
                  <li key={i}>{perk}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="ind-side">
          <div className="ind-card">
            <h3 className="ind-side-title">Internship Overview</h3>
            <ul className="ind-facts">
              {internship.location && (
                <Fact icon={<PinIcon />} label="Location">{internship.location}</Fact>
              )}
              {internship.duration && (
                <Fact icon={<ClockIcon />} label="Duration">{internship.duration}</Fact>
              )}
              {stipend && (
                <Fact
                  icon={stipend.hasAmount ? <span className="ind-rupee" aria-hidden="true">₹</span> : <WalletIcon />}
                  label="Stipend"
                >
                  {stipend.text}
                </Fact>
              )}
              {internship.work_mode && (
                <Fact icon={<LaptopIcon />} label="Work mode">{internship.work_mode}</Fact>
              )}
              {internship.internship_type && (
                <Fact icon={<BriefcaseIcon />} label="Type">{internship.internship_type}</Fact>
              )}
              {internship.application_deadline && (
                <Fact icon={<CalendarIcon />} label="Apply by">{formatDate(internship.application_deadline)}</Fact>
              )}
            </ul>
          </div>

          {company && (
            <div className="ind-card">
              <h3 className="ind-side-title">About the Company</h3>

              <div className="ind-co-head">
                <div className="ind-co-logo" aria-hidden="true">{coInitial}</div>
                <div>
                  <p className="ind-co-name">{company.company_name}</p>
                  {company.industry_category && (
                    <p className="ind-co-industry">{company.industry_category}</p>
                  )}
                </div>
              </div>

              {(company.company_size || company.company_location || company.company_website) && (
                <ul className="ind-facts ind-facts-compact">
                  {company.company_size && (
                    <Fact icon={<BuildingIcon />} label="Company size">{company.company_size}</Fact>
                  )}
                  {company.company_location && (
                    <Fact icon={<PinIcon />} label="Location">{company.company_location}</Fact>
                  )}
                  {company.company_website && (
                    <Fact icon={<GlobeIcon />} label="Website">
                      <a href={toUrl(company.company_website)} target="_blank" rel="noreferrer">
                        {prettyUrl(company.company_website)}
                      </a>
                    </Fact>
                  )}
                </ul>
              )}

              {company.about_company && (
                <p className="ind-co-about">{company.about_company}</p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default InternshipDetailsPage;