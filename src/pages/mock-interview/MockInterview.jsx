/**
 * MockInterview.jsx
 * -----------------
 * All original UI preserved exactly.
 * Upgrade button  → redirect to /pricing (always)
 * Schedule button → redirect to /pricing (if no access)
 * Schedule button → open schedule modal  (if has access)
 * No payment modals in this page.
 */

import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Alert, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useAccessStatus from "../../hooks/useAccessStatus";
import api from "../../config/api";
import "./MockInterview.css";

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

  const btnColor = mockAllowed ? "#efbf04" : "#0d6efd";

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
    <div className="mock-container">

      <div style={{ position: "absolute", right: 30, top: 90 }}>
        <Button
          onClick={handleUpgradeClick}
          style={{ background: btnColor, border: "none", color: "#fff", fontWeight: 600 }}
        >
          {mockAllowed ? "✅ Active" : "Upgrade"}
        </Button>
      </div>

      <section className="mock-hero-section">
        <div className="mock-hero-content">
          <span className="mock-hero-badge">INTERVIEW PREPARATION</span>
          <h1 className="mock-hero-title">
            Master Your Career With Professional{" "}
            <span className="mock-highlight">Mock Interviews</span>
          </h1>
          <p className="mock-hero-sub">
            Practice real interview scenarios, gain expert feedback, and build
            the confidence needed to ace your next opportunity.
          </p>
          <Button
            onClick={handleScheduleClick}
            style={{ background: btnColor, border: "none", color: "#fff", fontWeight: 600 }}
          >
            Schedule Mock Interview
          </Button>
        </div>
      </section>

      <div className="mock-content">
        {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}
        {error   && <Alert variant="danger"  onClose={() => setError("")}   dismissible>{error}</Alert>}

        {!accessLoading && user && !mockAllowed && (
          <Alert variant="warning" style={{ borderRadius: 12 }}>
            🔒 {mockReason || "Purchase access to schedule mock interviews."}{" "}
            <Alert.Link onClick={() => navigate("/pricing")} style={{ fontWeight: 700, cursor: "pointer" }}>
              View Pricing →
            </Alert.Link>
          </Alert>
        )}

        <h3>Your Upcoming Interviews</h3>

        {loading ? (
          <p>Loading...</p>
        ) : upcoming.length === 0 ? (
          <p style={{ color: "#6c7a7a" }}>No interviews scheduled yet.</p>
        ) : (
          upcoming.map((i) => (
            <Card key={i.id} style={{ marginBottom: 15, borderRadius: 12 }}>
              <Card.Body>
                <h5>{i.job_role}</h5>
                <p style={{ marginBottom: 4 }}>📅 {i.scheduled_date} &nbsp; ⏰ {i.scheduled_time}</p>
                <a href={i.meeting_link} target="_blank" rel="noopener noreferrer"
                  style={{ color: "#0097a7", fontWeight: 600 }}>
                  Join Meeting →
                </a>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      {/* Schedule Modal — only opens when mockAllowed is true */}
      <Modal show={showSchedule} onHide={() => setShowSchedule(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Mock Interview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Job Role *</Form.Label>
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
              <Form.Label>Interviewer Preference</Form.Label>
              <Form.Select name="interviewer_preference" value={form.interviewer_preference} onChange={handleChange}>
                <option value="">No preference</option>
                <option value="industry-expert">Industry Expert</option>
                <option value="hr-professional">HR Professional</option>
                <option value="technical-lead">Technical Lead</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Special Requests</Form.Label>
              <Form.Control as="textarea" rows={3} name="special_requests"
                value={form.special_requests} onChange={handleChange} />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowSchedule(false)} className="me-2">Cancel</Button>
              <Button type="submit" style={{ background: btnColor, border: "none", color: "#fff" }}>Schedule</Button>
            </div>

          </Form>
        </Modal.Body>
      </Modal>

    </div>
  );
}