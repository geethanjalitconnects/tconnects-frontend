import { useEffect, useState } from "react";
import api from "../../config/api";
import "./MockInterview.css";

const MockInterview = () => {
  const [show, setShow] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    job_role: "",
    experience: "",
    email: "",
    scheduled_date: "",
    scheduled_time: "",
    interviewer_preference: "",
    special_requests: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  // Fetch upcoming interviews
  const loadInterviews = async () => {
    try {
      const res = await api.get("/api/mock-interview/my-interviews/");
      setInterviews(res.data || []);
    } catch (error) {
      console.error("Error loading interviews:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/mock-interview/schedule/", form);

      if (res.status === 201) {
        setSuccessMsg("Your mock interview has been successfully scheduled!");
        setShow(false);
        loadInterviews();
        setForm({
          job_role: "",
          experience: "",
          email: "",
          scheduled_date: "",
          scheduled_time: "",
          interviewer_preference: "",
          special_requests: "",
        });
      }
    } catch (err) {
      console.error("Error scheduling:", err);
      alert(err.response?.data?.error || "Failed to schedule interview.");
    }
  };

  const upcoming = interviews.filter((i) => i.meeting_link);

  return (
    <div className="mock-page">

      {/* HERO SECTION */}
      <div className="mock-hero">
        <h1>Schedule Your Mock Interview</h1>
        <p>
          Boost your confidence with expert-led mock interviews designed to
          prepare you for real job placements.
        </p>

        <button className="mock-primary-btn" onClick={() => setShow(true)}>
          Schedule Interview
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {successMsg && (
        <div className="mock-success">
          <p>{successMsg}</p>
        </div>
      )}

      {/* UPCOMING INTERVIEWS */}
      {upcoming.length > 0 && (
        <>
          <h3 className="mock-section-title">Your Upcoming Interviews</h3>

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
                    Scheduled on:{" "}
                    {new Date(i.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SCHEDULE MODAL */}
      {show && (
        <div className="mock-modal-overlay">
          <div className="mock-modal">
            <h2>Schedule a Mock Interview</h2>

            <form onSubmit={handleSubmit}>
              <label>Job Role *</label>
              <input
                type="text"
                value={form.job_role}
                onChange={(e) =>
                  setForm({ ...form, job_role: e.target.value })
                }
                required
              />

              <label>Experience *</label>
              <select
                value={form.experience}
                onChange={(e) =>
                  setForm({ ...form, experience: e.target.value })
                }
                required
              >
                <option value="">Select</option>
                <option value="entry">Entry (0–2 years)</option>
                <option value="mid">Mid (2–5 years)</option>
                <option value="senior">Senior (5+ years)</option>
              </select>

              <label>Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />

              <div className="mock-row">
                <div>
                  <label>Date *</label>
                  <input
                    type="date"
                    value={form.scheduled_date}
                    onChange={(e) =>
                      setForm({ ...form, scheduled_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label>Time *</label>
                  <input
                    type="time"
                    value={form.scheduled_time}
                    onChange={(e) =>
                      setForm({ ...form, scheduled_time: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <label>Interviewer Preference</label>
              <select
                value={form.interviewer_preference}
                onChange={(e) =>
                  setForm({ ...form, interviewer_preference: e.target.value })
                }
              >
                <option value="">No preference</option>
                <option value="industry-expert">Industry Expert</option>
                <option value="hr-professional">HR Professional</option>
                <option value="technical-lead">Technical Lead</option>
              </select>

              <label>Special Requests</label>
              <textarea
                rows={3}
                value={form.special_requests}
                onChange={(e) =>
                  setForm({ ...form, special_requests: e.target.value })
                }
              />

              <div className="mock-modal-actions">
                <button
                  type="button"
                  className="mock-cancel-btn"
                  onClick={() => setShow(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="mock-submit-btn">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MockInterview;
