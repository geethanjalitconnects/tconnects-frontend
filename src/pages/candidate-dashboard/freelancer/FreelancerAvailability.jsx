import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";

export default function FreelancerAvailability() {
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    is_available: true,
    is_occupied: false,
    available_from: "",
    available_to: "",
    time_zone: "Asia/Kolkata",
    available_days: [],
  });

  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ======================================================
  // 1️⃣ LOAD SAVED AVAILABILITY FROM BACKEND
  // ======================================================
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const res = await api.get("/api/profiles/freelancer/availability/");
        setState(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load availability.");
      } finally {
        setLoading(false);
      }
    };
    loadAvailability();
  }, []);

  // ======================================================
  // 2️⃣ TOGGLE DAY LOGIC
  // ======================================================
  const toggleDay = (day) => {
    setState((s) => ({
      ...s,
      available_days: s.available_days.includes(day)
        ? s.available_days.filter((d) => d !== day)
        : [...s.available_days, day],
    }));
  };

  // ======================================================
  // 3️⃣ SAVE AVAILABILITY (PATCH)
  // ======================================================
  const save = async (e) => {
    e.preventDefault();

    try {
      await api.patch("/api/profiles/freelancer/availability/", state);
      toast.success("Availability updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update availability.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="fr-page">
      <form className="fr-card fr-form" onSubmit={save}>
        <h2 className="fr-title">Availability</h2>

        {/* STATUS */}
        <div className="fr-row">
          <label className="fr-label">Status</label>
          <div className="fr-toggle-row">
            <label
              className={`fr-pill ${state.is_available ? "active" : ""}`}
              onClick={() =>
                setState({
                  ...state,
                  is_available: true,
                  is_occupied: false,
                })
              }
            >
              Available for work
            </label>

            <label
              className={`fr-pill ${state.is_occupied ? "active" : ""}`}
              onClick={() =>
                setState({
                  ...state,
                  is_available: false,
                  is_occupied: true,
                })
              }
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
              type="time"
              className="fr-input"
              value={state.available_from || ""}
              onChange={(e) =>
                setState({ ...state, available_from: e.target.value })
              }
            />
          </div>

          <div>
            <label className="fr-label">Available to</label>
            <input
              type="time"
              className="fr-input"
              value={state.available_to || ""}
              onChange={(e) =>
                setState({ ...state, available_to: e.target.value })
              }
            />
          </div>
        </div>

        {/* TIMEZONE */}
        <div className="fr-row">
          <label className="fr-label">Time zone</label>
          <select
            className="fr-input"
            value={state.time_zone}
            onChange={(e) =>
              setState({ ...state, time_zone: e.target.value })
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
                className={`fr-day ${
                  state.available_days.includes(day) ? "active" : ""
                }`}
                onClick={() => toggleDay(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="fr-actions">
          <button type="submit" className="fr-btn fr-btn-primary">
            Save Availability
          </button>

          <button
            type="button"
            className="fr-btn"
            onClick={() =>
              setState({
                is_available: true,
                is_occupied: false,
                available_from: "",
                available_to: "",
                time_zone: "Asia/Kolkata",
                available_days: [],
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
