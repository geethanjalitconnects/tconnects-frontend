/**
 * MockInterview.jsx  — v2 (white premium layout, logo colours)
 * ---------------------------------------------------------
 * Logic is unchanged from v1:
 *   Upgrade button  → redirect to /pricing (always)
 *   Schedule button → redirect to /pricing (if no access)
 *   Schedule button → open schedule modal  (if has access)
 *   No payment modals in this page.
 * Only the layout and class names changed. Buttons now use CSS classes instead of inline colours.
 */

import React, { useState, useEffect, useContext } from "react";
import { Modal, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useAccessStatus from "../../hooks/useAccessStatus";
import api from "../../config/api";
import "./MockInterview.css";

/* ---------- display helpers ---------- */
const parseDate = (d) => {
  if (!d) return null;
  const dt = new Date(`${d}T00:00:00`);
  return isNaN(dt.getTime()) ? null : dt;
};
const fmtTime = (t) => {
  if (!t) return "";
  const [h, m] = String(t).split(":");
  const hr = parseInt(h, 10);
  if (isNaN(hr)) return t;
  return `${hr % 12 || 12}:${(m || "00").slice(0, 2)} ${hr >= 12 ? "PM" : "AM"}`;
};

/* ---------- icons (same line style as the jobs pages) ---------- */
const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">{children}</svg>
);
const IconVideo = () => (<Icon><rect x="2.5" y="6" width="13" height="12" rx="2.5" /><path d="m15.5 10.5 6-3.5v10l-6-3.5" /></Icon>);
const IconChat = () => (<Icon><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z" /><path d="M8.5 11h7M8.5 14h4" /></Icon>);
const IconCalendar = () => (<Icon><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Icon>);
const IconClock = () => (<Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>);
const IconLock = () => (<Icon><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Icon>);
const IconCheck = () => (<Icon><path d="m5 12.5 4.5 4.5L19 7.5" /></Icon>);
const IconArrow = () => (<Icon><path d="M5 12h14M13 6l6 6-6 6" /></Icon>);

export default function MockInterview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const { status, loading: accessLoading, refresh } = useAccessStatus(user);
  const mockAllowed = status?.access?.mock_interview?.allowed === true;
  const mockReason  = status?.access?.mock_interview?.reason;
  const subActive   = status?.subscription?.is_currently_active;

  const [showSchedule, setShowSchedule] = useState(false);
  const [upcoming,     setUpcoming]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [success,      setSuccess]      = useState("");
  const [error,        setError]        = useState("");

  const [form, setForm] = useState({
    job_role: "", experience: "", scheduled_date: "", scheduled_time: "",
    ampm: "AM", email: "", interviewer_preference: "", special_requests: "",
  });

  useEffect(() => {
    if (user) loadUpcoming();
    else      setLoading(false);
  }, [user]);

  const requireLogin = () => {
    if (!user) { navigate("/login", { state: { from: location.pathname } }); return false; }
    return true;
  };

  const loadUpcoming = async () => {
    try {
      const res = await api.get("/api/mock-interview/my-interviews/");
      setUpcoming(res.data.results ? res.data.results : res.data);
    } catch { /* ok */ }
    finally { setLoading(false); }
  };

  // Upgrade → always go to /pricing
  const handleUpgradeClick = () => {
    if (!requireLogin()) return;
    navigate("/pricing");
  };

  // Schedule → /pricing if no access, schedule modal if has access
  const handleScheduleClick = () => {
    if (!requireLogin()) return;
    if (!mockAllowed) { navigate("/pricing"); return; }
    setShowSchedule(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAmPmChange = (e) => {
    const newAmPm = e.target.value;
    setForm((prev) => {
      if (!prev.scheduled_time) return { ...prev, ampm: newAmPm };
      const [hourStr, min] = prev.scheduled_time.split(":");
      let hour = parseInt(hourStr, 10);
      if (newAmPm === "AM") { if (hour >= 12) hour -= 12; }
      else                  { if (hour < 12)  hour += 12; }
      return { ...prev, ampm: newAmPm, scheduled_time: `${String(hour).padStart(2, "0")}:${min}` };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requireLogin()) return;
    if (!mockAllowed) { navigate("/pricing"); return; }
    try {
      const { ampm, ...payload } = form;
      await api.post("/api/mock-interview/schedule/", payload);

      if (!subActive) {
        try {
          await api.post("/api/payments/mark-used/", { feature: "mock_interview" });
          await refresh();
        } catch { /* ok */ }
      }

      setSuccess("Interview scheduled successfully! 🎉");
      setShowSchedule(false);
      loadUpcoming();
    } catch {
      setError("Scheduling failed. Please try again.");
    }
  };

  return (
    <div className="mock-page">

      {/* ===== HERO ===== */}
      <section className="mock-hero">
        {mockAllowed ? (
          <span className="mock-status"><IconCheck /> Active</span>
        ) : (
          <button type="button" className="mock-btn mock-btn-light mock-upgrade" onClick={handleUpgradeClick}>
            Upgrade
          </button>
        )}

        <div className="mock-hero-content">
          <span className="mock-hero-badge">Interview preparation</span>
          <h1 className="mock-hero-title">
            Master Your Career With Professional{" "}
            <span className="mock-highlight">Mock Interviews</span>
          </h1>
          <p className="mock-hero-sub">
            Practice real interview scenarios, gain expert feedback, and build
            the confidence needed to ace your next opportunity.
          </p>
          <button type="button" className="mock-btn mock-btn-primary mock-btn-lg" onClick={handleScheduleClick}>
            Schedule Mock Interview
            <i><IconArrow /></i>
          </button>
        </div>

        <ul className="mock-points">
          <li>
            <span className="mock-point-icon"><IconVideo /></span>
            <div><strong>Real scenarios</strong><span>Practice live, one-on-one</span></div>
          </li>
          <li>
            <span className="mock-point-icon"><IconChat /></span>
            <div><strong>Expert feedback</strong><span>Know exactly what to improve</span></div>
          </li>
          <li>
            <span className="mock-point-icon"><IconCalendar /></span>
            <div><strong>Your schedule</strong><span>Pick the date and time</span></div>
          </li>
        </ul>
      </section>

      {/* ===== CONTENT ===== */}
      <div className="mock-content">
        {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}
        {error   && <Alert variant="danger"  onClose={() => setError("")}   dismissible>{error}</Alert>}

        {!accessLoading && user && !mockAllowed && (
          <div className="mock-lock">
            <span className="mock-lock-icon"><IconLock /></span>
            <p>{mockReason || "Purchase access to schedule mock interviews."}</p>
            <button type="button" className="mock-btn mock-btn-soft" onClick={() => navigate("/pricing")}>
              View pricing
            </button>
          </div>
        )}

        <h2 className="mock-section-title">Your upcoming interviews</h2>

        {loading ? (
          <p className="mock-state">Loading…</p>
        ) : upcoming.length === 0 ? (
          <div className="mock-empty">
            <span className="mock-empty-icon"><IconCalendar /></span>
            <p className="mock-empty-title">No interviews scheduled yet</p>
            <p className="mock-empty-text">Book a session and it will show up here with your meeting link.</p>
            <button type="button" className="mock-btn mock-btn-primary" onClick={handleScheduleClick}>
              Schedule an interview
            </button>
          </div>
        ) : (
          <div className="mock-list">
            {upcoming.map((i) => {
              const dt = parseDate(i.scheduled_date);
              return (
                <article key={i.id} className="mock-card">
                  <div className="mock-date">
                    <b>{dt ? dt.getDate() : "–"}</b>
                    <span>{dt ? dt.toLocaleString("en-IN", { month: "short" }) : ""}</span>
                  </div>

                  <div className="mock-card-main">
                    <h3 className="mock-card-title">{i.job_role}</h3>
                    <ul className="mock-meta">
                      <li>
                        <IconCalendar />
                        {dt
                          ? dt.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                          : i.scheduled_date}
                      </li>
                      <li><IconClock />{fmtTime(i.scheduled_time)}</li>
                    </ul>
                  </div>

                  {i.meeting_link && (
                    <a className="mock-btn mock-btn-primary" href={i.meeting_link} target="_blank" rel="noopener noreferrer">
                      Join meeting
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule Modal — only opens when mockAllowed is true */}
      <Modal show={showSchedule} onHide={() => setShowSchedule(false)} centered dialogClassName="mock-modal">
        <Modal.Header closeButton>
          <Modal.Title>Schedule mock interview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Job role *</Form.Label>
              <Form.Control name="job_role" value={form.job_role} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience *</Form.Label>
              <Form.Select name="experience" value={form.experience} onChange={handleChange} required>
                <option value="">Select level</option>
                <option value="entry">Beginner (0–2 years)</option>
                <option value="mid">Intermediate (2–5 years)</option>
                <option value="senior">Senior (5+ years)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
            </Form.Group>

            <div className="row">
              <div className="col">
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control type="date" name="scheduled_date" value={form.scheduled_date}
                    onChange={handleChange} min={new Date().toISOString().split("T")[0]} required />
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group className="mb-3">
                  <Form.Label>Time *</Form.Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Form.Control type="time" name="scheduled_time" value={form.scheduled_time}
                      onChange={handleChange} required style={{ flex: 1 }} />
                    <Form.Select value={form.ampm} onChange={handleAmPmChange} style={{ width: 90 }}>
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </Form.Select>
                  </div>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Interviewer preference</Form.Label>
              <Form.Select name="interviewer_preference" value={form.interviewer_preference} onChange={handleChange}>
                <option value="">No preference</option>
                <option value="industry-expert">Industry Expert</option>
                <option value="hr-professional">HR Professional</option>
                <option value="technical-lead">Technical Lead</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Special requests</Form.Label>
              <Form.Control as="textarea" rows={3} name="special_requests"
                value={form.special_requests} onChange={handleChange} />
            </Form.Group>

            <div className="mock-modal-actions">
              <button type="button" className="mock-btn mock-btn-soft" onClick={() => setShowSchedule(false)}>Cancel</button>
              <button type="submit" className="mock-btn mock-btn-primary">Schedule</button>
            </div>

          </Form>
        </Modal.Body>
      </Modal>

    </div>
  );
}