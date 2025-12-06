import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import api from "../../config/api";
import "./MockInterview.css";

export default function MockInterview() {
  const [show, setShow] = useState(false);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    job_role: "",
    experience: "",
    scheduled_date: "",
    scheduled_time: "",
    email: "",
    interviewer_preference: "",
    special_requests: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch upcoming interviews
  useEffect(() => {
    loadUpcoming();
  }, []);

  const loadUpcoming = async () => {
    try {
      const res = await api.get("/api/mock-interview/my-interviews/");
      setUpcoming(res.data);
    } catch (err) {
      console.log("Error fetching interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input update
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/api/mock-interview/schedule/", form);
      setSuccess("Interview scheduled successfully!");

      // Refresh upcoming list
      loadUpcoming();

      // Close modal
      setShow(false);

      // Reset form
      setForm({
        job_role: "",
        experience: "",
        scheduled_date: "",
        scheduled_time: "",
        email: "",
        interviewer_preference: "",
        special_requests: "",
      });
    } catch (err) {
      console.log(err);
      const msg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})[0] ||
        "Failed to schedule interview";
      setError(msg);
    }
  };

  return (
    <div className="mock-container">

      {/* HERO SECTION */}
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

          <Button className="mock-hero-btn" onClick={() => setShow(true)}>
            Schedule Mock Interview
          </Button>
        </div>
      </section>

      {/* CONTENT AREA */}
      <div className="mock-content">

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* UPCOMING INTERVIEWS */}
        <h3 className="mock-section-title">Your Upcoming Interviews</h3>

        {loading ? (
          <p>Loading interviews...</p>
        ) : upcoming.length === 0 ? (
          <div className="mock-empty-box">
            <p>No interviews scheduled.</p>
          </div>
        ) : (
          <div className="mock-interview-list">
            {upcoming.map((i) => (
              <div key={i.id} className="mock-interview-card">
                <div className="mock-left">
                  <h4>{i.job_role}</h4>
                  <p className="mock-meta">
                    📅 {i.scheduled_date} &nbsp;&nbsp; ⏰ {i.scheduled_time}
                  </p>
                  <p className="mock-email">📧 {i.email}</p>
                </div>

                <div className="mock-right">
                  <a
                    href={i.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mock-join-btn"
                  >
                    Join Meeting
                  </a>
                  <p className="mock-created">
                    Scheduled:{" "}
                    {new Date(i.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOKING MODAL */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Mock Interview</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Job Role *</Form.Label>
              <Form.Control
                name="job_role"
                value={form.job_role}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience *</Form.Label>
              <Form.Select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                required
              >
                <option value="">Select level</option>
                <option value="entry">Entry (0–2 years)</option>
                <option value="mid">Mid (2–5 years)</option>
                <option value="senior">Senior (5+ years)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="row">
              <div className="col">
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="scheduled_date"
                    value={form.scheduled_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col">
                <Form.Group className="mb-3">
                  <Form.Label>Time *</Form.Label>
                  <Form.Control
                    type="time"
                    name="scheduled_time"
                    value={form.scheduled_time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Interviewer Preference</Form.Label>
              <Form.Select
                name="interviewer_preference"
                value={form.interviewer_preference}
                onChange={handleChange}
              >
                <option value="">No preference</option>
                <option value="industry-expert">Industry Expert</option>
                <option value="hr-professional">HR Professional</option>
                <option value="technical-lead">Technical Lead</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Special Requests</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="special_requests"
                value={form.special_requests}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={() => setShow(false)}>
                Cancel
              </Button>
              <Button type="submit" className="mock-submit-btn">
                Schedule
              </Button>
            </div>

          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
