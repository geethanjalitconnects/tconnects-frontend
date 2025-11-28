import React, { useState } from "react";
import "./freelancer.css";

export default function FreelancerAvailability() {
  const [state, setState] = useState({
    status: "available",
    from: "",
    to: "",
    timezone: "Asia/Kolkata",
    days: [],
  });

  const toggleDay = (day) => {
    setState((s) => ({
      ...s,
      days: s.days.includes(day)
        ? s.days.filter((d) => d !== day)
        : [...s.days, day],
    }));
  };

  const save = (e) => {
    e.preventDefault();
    console.log("Availability:", state);
    alert("Availability saved (UI only, no backend)");
  };

  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="fr-page">
      <form className="fr-card fr-form" onSubmit={save}>
        <h2 className="fr-title">Availability</h2>

        {/* STATUS */}
        <div className="fr-row">
          <label className="fr-label">Status</label>
          <div className="fr-toggle-row">
            <label
              className={`fr-pill ${
                state.status === "available" ? "active" : ""
              }`}
              onClick={() => setState((s) => ({ ...s, status: "available" }))}
            >
              Available for work
            </label>
            <label
              className={`fr-pill ${
                state.status === "occupied" ? "active" : ""
              }`}
              onClick={() => setState((s) => ({ ...s, status: "occupied" }))}
            >
              Currently occupied
            </label>
          </div>
        </div>

        {/* AVAILABLE FROM / TO */}
        <div className="fr-row fr-two-col">
          <div>
            <label className="fr-label">Available from</label>
            <input
              type="date"
              className="fr-input"
              value={state.from}
              onChange={(e) =>
                setState((s) => ({ ...s, from: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="fr-label">Available to</label>
            <input
              type="date"
              className="fr-input"
              value={state.to}
              onChange={(e) =>
                setState((s) => ({ ...s, to: e.target.value }))
              }
            />
          </div>
        </div>

        {/* TIMEZONE */}
        <div className="fr-row">
          <label className="fr-label">Time zone</label>
          <select
            className="fr-input"
            value={state.timezone}
            onChange={(e) =>
              setState((s) => ({ ...s, timezone: e.target.value }))
            }
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
          </select>
        </div>

        {/* AVAILABLE DAYS */}
        <div className="fr-row">
          <label className="fr-label">Available days</label>
          <div className="fr-days-grid">
            {daysList.map((day) => (
              <div
                key={day}
                className={`fr-day ${state.days.includes(day) ? "active" : ""}`}
                onClick={() => toggleDay(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="fr-actions">
          <button type="submit" className="fr-btn fr-btn-primary">
            Save Availability
          </button>

          <button
            type="button"
            className="fr-btn"
            onClick={() =>
              setState({
                status: "available",
                from: "",
                to: "",
                timezone: "Asia/Kolkata",
                days: [],
              })
            }
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
