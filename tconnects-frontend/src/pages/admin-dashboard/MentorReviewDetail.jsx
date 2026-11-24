// Admin: review one mentor application (approve / request changes / reject, suspend / reinstate, pending changes).
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { mentorshipApi, apiError } from "../../services/mentorshipApi";
import { ADMIN_CFG, fmtDateTime, inr } from "../mentorship/booking/bookingUtils";
import StatusBadge from "../mentorship/booking/StatusBadge";
import { AdminGate, AdminNav } from "./AdminShell";
import "../mentorship/booking/booking.css";

const STATUS_LABELS = {
  submitted: "Pending review", approved: "Verified", changes_requested: "Changes requested",
  rejected: "Not verified", suspended: "Suspended", draft: "Draft",
};
const DAY_NAMES = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
const pretty = (v) => String(v || "").replaceAll("_", " ").replace(/^./, (c) => c.toUpperCase());
const join = (v) => (Array.isArray(v) && v.length ? v.map(pretty).join(", ") : "—");

export default function MentorReviewDetail() {
  const { id } = useParams();
  const [m, setM] = useState(null);
  const [error, setError] = useState("");
  const [gate, setGate] = useState(null);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(() => {
    setError("");
    mentorshipApi
      .getReview(id, ADMIN_CFG)
      .then((d) => {
        setM(d);
        setNotes(d.internal_notes || "");
      })
      .catch((e) => {
        const s = e?.response?.status;
        if (s === 401 || s === 403) setGate(s);
        else setError(apiError(e, "Could not load this application."));
      });
  }, [id]);

  useEffect(() => load(), [load]);

  const act = async (key, fn, ok, needMessage = false) => {
    if (needMessage && !message.trim()) return setError("Write a message to the mentor explaining this decision.");
    setBusy(key);
    setError("");
    try {
      await fn();
      toast.success(ok);
      setMessage("");
      load();
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy("");
    }
  };

  const payload = { review_message: message.trim(), internal_notes: notes.trim() };

  return (
    <main className="mb-admin-page">
      <div className="mb-page">
        <AdminNav />
        {gate ? (
          <AdminGate status={gate} />
        ) : (
          <>
            <Link className="mb-link-btn" to="/admin-dashboard/mentors"><i className="bi bi-arrow-left" /> All applications</Link>
            {error && <div className="mb-alert error" style={{ marginTop: 12 }}>{error}</div>}
            {!m ? (
              !error && <p className="mb-muted">Loading application…</p>
            ) : (
              <>
                <div className="mb-page-head" style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    {m.files?.photo ? <img className="mb-avatar" style={{ width: 64, height: 64 }} src={m.files.photo} alt="" /> : <div className="mb-avatar" style={{ width: 64, height: 64 }}>{(m.full_name || "M").charAt(0)}</div>}
                    <div>
                      <span className="mb-kicker">Mentor application #{m.id}</span>
                      <h1>{m.full_name || "Unnamed applicant"}</h1>
                      <p>{m.email} · <StatusBadge status={m.status === "submitted" ? "pending" : m.status} label={STATUS_LABELS[m.status] || pretty(m.status)} /></p>
                    </div>
                  </div>
                </div>

                <div className="mb-grid-2" style={{ alignItems: "start" }}>
                  <div>
                    <div className="mb-panel">
                      <h3>Identity &amp; verification</h3>
                      <dl className="mb-kv">
                        <dt>Registered email</dt><dd>{m.email} {m.login_email_verified ? <span className="mb-badge tone-success">OTP verified</span> : <span className="mb-badge tone-warning">Not verified</span>}</dd>
                        <dt>Employment</dt><dd>{m.employment_status === "not_working" ? "Not currently working" : "Currently working"}</dd>
                        {m.employment_status !== "not_working" && (
                          <>
                            <dt>Work email</dt>
                            <dd>{m.work_email_masked || "—"} {m.work_email_verified ? <span className="mb-badge tone-success">Verified</span> : m.has_no_work_email ? <span className="mb-badge tone-muted">No work email</span> : <span className="mb-badge tone-warning">Not verified</span>}{m.domain_check_level ? <small className="mb-muted"> · domain check: {pretty(m.domain_check_level)}</small> : null}</dd>
                            <dt>Proof document</dt><dd>{m.proof_document_name ? (m.files?.proof ? <a href={m.files.proof} target="_blank" rel="noreferrer">{m.proof_document_name}</a> : m.proof_document_name) : "—"}</dd>
                          </>
                        )}
                        <dt>LinkedIn</dt><dd>{m.linkedin_url ? <a href={m.linkedin_url} target="_blank" rel="noreferrer">{m.linkedin_url}</a> : "—"}</dd>
                        <dt>Location</dt><dd>{[m.city, m.country].filter(Boolean).join(", ") || "—"}</dd>
                        <dt>Languages</dt><dd>{(m.languages || []).join(", ") || "—"}</dd>
                        <dt>Submitted</dt><dd>{fmtDateTime(m.submitted_at)}</dd>
                        {m.reviewed_at && (<><dt>Last reviewed</dt><dd>{fmtDateTime(m.reviewed_at)} by {m.reviewed_by || "—"}</dd></>)}
                      </dl>
                    </div>

                    <div className="mb-panel">
                      <h3>Experience</h3>
                      <dl className="mb-kv">
                        <dt>Job title</dt><dd>{m.job_title || "—"}</dd>
                        <dt>Company</dt><dd>{m.company_name || "—"}{m.hide_company ? <small className="mb-muted"> (hidden publicly)</small> : null}</dd>
                        <dt>Experience</dt><dd>{m.years_experience != null ? `${m.years_experience} years` : "—"}</dd>
                        <dt>Risk areas</dt><dd>{join(m.risk_areas)}</dd>
                        <dt>Qualification</dt><dd>{m.highest_qualification || "—"}</dd>
                        <dt>Certifications</dt><dd>{(m.certifications || []).join(", ") || "—"}</dd>
                        {(m.past_roles || []).length > 0 && (<><dt>Past roles</dt><dd>{m.past_roles.map((r, i) => <div key={i}>{r.job_title} · {r.company_name} · {r.years} yrs</div>)}</dd></>)}
                      </dl>
                    </div>

                    <div className="mb-panel">
                      <h3>Mentoring</h3>
                      <dl className="mb-kv">
                        <dt>Topics</dt><dd>{(m.topics || []).join(", ") || "—"}</dd>
                        <dt>Audiences</dt><dd>{join(m.audiences)}</dd>
                        <dt>Formats</dt><dd>{join(m.session_types)}</dd>
                        <dt>Rate</dt><dd>{m.hourly_rate ? `${inr(m.hourly_rate)}/hour` : "—"} · commission {m.commission_pct ? `${Number(m.commission_pct)}%` : "—"}</dd>
                        <dt>Durations</dt><dd>{(m.session_durations || []).map((d) => `${d} min`).join(", ") || "—"}</dd>
                        <dt>Availability</dt>
                        <dd>{Object.entries(m.availability || {}).map(([d, s]) => <div key={d}>{DAY_NAMES[d] || d}: {s.join(", ")}</div>)}{m.timezone && <small className="mb-muted">{m.timezone}</small>}</dd>
                      </dl>
                      {m.help_summary && (<><h4 className="mb-kicker" style={{ display: "block", marginTop: 12 }}>What mentees can expect</h4><p className="mb-quote">{m.help_summary}</p></>)}
                      {m.real_moment && (<><h4 className="mb-kicker" style={{ display: "block", marginTop: 12 }}>Real-world challenge</h4><p className="mb-quote">{m.real_moment}</p></>)}
                      {m.common_mistake && (<><h4 className="mb-kicker" style={{ display: "block", marginTop: 12 }}>Common mistake</h4><p className="mb-quote">{m.common_mistake}</p></>)}
                      {m.files?.video && <p style={{ marginTop: 10 }}><a href={m.files.video} target="_blank" rel="noreferrer"><i className="bi bi-play-circle" /> Intro video</a></p>}
                    </div>
                  </div>

                  <div>
                    <div className="mb-panel">
                      <h3>Decision</h3>
                      {m.note_for_team && (<><p className="mb-muted" style={{ marginBottom: 4 }}>Note from the applicant:</p><p className="mb-quote">{m.note_for_team}</p></>)}
                      <label className="mb-field" style={{ marginTop: 12 }}>
                        <span>Message to the mentor</span>
                        <textarea rows={3} value={message} maxLength={5000} onChange={(e) => setMessage(e.target.value)} placeholder="Required for changes, rejection and suspension. Emailed to the mentor." />
                      </label>
                      <label className="mb-field" style={{ marginTop: 10 }}>
                        <span>Internal notes (team only)</span>
                        <textarea rows={2} value={notes} maxLength={10000} onChange={(e) => setNotes(e.target.value)} />
                      </label>
                      <div className="mb-actions" style={{ marginTop: 12 }}>
                        {m.status === "submitted" && (
                          <>
                            <button className="mb-btn primary" disabled={!!busy} onClick={() => act("approve", () => mentorshipApi.decideReview(m.id, { decision: "approve", ...payload }, ADMIN_CFG), "Mentor approved and published.")}>{busy === "approve" ? "Saving…" : "Approve"}</button>
                            <button className="mb-btn" disabled={!!busy} onClick={() => act("changes", () => mentorshipApi.decideReview(m.id, { decision: "request_changes", ...payload }, ADMIN_CFG), "Changes requested.", true)}>Request changes</button>
                            <button className="mb-btn danger" disabled={!!busy} onClick={() => act("reject", () => mentorshipApi.decideReview(m.id, { decision: "reject", ...payload }, ADMIN_CFG), "Application rejected.", true)}>Reject</button>
                          </>
                        )}
                        {m.status === "approved" && (
                          <button className="mb-btn danger" disabled={!!busy} onClick={() => act("suspend", () => mentorshipApi.suspendMentor(m.id, payload, ADMIN_CFG), "Mentor suspended.", true)}>Suspend mentor</button>
                        )}
                        {m.status === "suspended" && (
                          <button className="mb-btn primary" disabled={!!busy} onClick={() => act("reinstate", () => mentorshipApi.reinstateMentor(m.id, payload, ADMIN_CFG), "Mentor reinstated.")}>Reinstate mentor</button>
                        )}
                        {!["submitted", "approved", "suspended"].includes(m.status) && <span className="mb-muted">No decision needed while the application is {STATUS_LABELS[m.status]?.toLowerCase() || m.status}.</span>}
                      </div>
                    </div>

                    {m.pending_changes && Object.keys(m.pending_changes).length > 0 && (
                      <div className="mb-panel">
                        <h3>Profile changes waiting for review</h3>
                        <dl className="mb-kv">
                          {Object.entries(m.pending_changes).map(([k, v]) => (
                            <div key={k} style={{ display: "contents" }}><dt>{pretty(k)}</dt><dd>{typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)} <small className="mb-muted">(now: {String(m[k] ?? "—")})</small></dd></div>
                          ))}
                        </dl>
                        <div className="mb-actions" style={{ marginTop: 12 }}>
                          <button className="mb-btn primary" disabled={!!busy} onClick={() => act("ch-ok", () => mentorshipApi.decidePendingChanges(m.id, { decision: "approve", ...payload }, ADMIN_CFG), "Changes approved and live.")}>Approve changes</button>
                          <button className="mb-btn danger" disabled={!!busy} onClick={() => act("ch-no", () => mentorshipApi.decidePendingChanges(m.id, { decision: "reject", ...payload }, ADMIN_CFG), "Changes rejected.", true)}>Reject changes</button>
                        </div>
                      </div>
                    )}

                    {(m.review_events || []).length > 0 && (
                      <div className="mb-panel">
                        <h3>History</h3>
                        {m.review_events.map((e, i) => (
                          <div key={i} style={{ padding: "8px 0", borderTop: i ? "1px solid #eef4f6" : 0 }}>
                            <b>{pretty(e.action)}</b> <small className="mb-muted">{fmtDateTime(e.at)} · {e.by || "system"}</small>
                            {e.message && <div className="mb-muted">{e.message}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
