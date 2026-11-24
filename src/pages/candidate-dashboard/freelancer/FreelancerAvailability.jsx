import React, { useState, useEffect } from "react";
import api from "../../../config/api";
import toast from "react-hot-toast";
import "./Freelancer.css";
import { useNavigate } from "react-router-dom";

export default function FreelancerAvailability() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Unified clean state shape
  const defaultState = {
    is_available: true,
    is_occupied: false,
    available_from: "",
    available_to: "",
    time_zone: "Asia/Kolkata",
    available_days: [],
  };

  const [state, setState] = useState(defaultState);

  const daysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ======================================================
  // 1️⃣ LOAD SAVED AVAILABILITY FROM BACKEND
  // ======================================================
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const res = await api.get("/api/profiles/freelancer/availability/");
        const data = res.data;

        // FIX: Map all fields explicitly (prevents missing timezone)
        setState({
          is_available: data.is_available ?? true,
          is_occupied: data.is_occupied ?? false,
          available_from: data.available_from || "",
          available_to: data.available_to || "",
          time_zone: data.time_zone || "Asia/Kolkata",
          available_days: Array.isArray(data.available_days)
            ? data.available_days
            : [],
        });
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
  // 2️⃣ TOGGLE WORKDAY LOGIC
  // ======================================================
  const toggleDay = (day) => {
    setState((prev) => ({
      ...prev,
      available_days: prev.available_days.includes(day)
        ? prev.available_days.filter((d) => d !== day)
        : [...prev.available_days, day],
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

        {/* AVAILABLE HOURS */}
        <div className="fr-row fr-two-col">
          <div>
            <label className="fr-label">Available from</label>
            <input
              type="time"
              className="fr-input"
              value={state.available_from}
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
              value={state.available_to}
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

        {/* WORKING DAYS */}
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

        {/* ACTION BUTTONS */}
        <div className="fr-actions">
          <button type="submit" className="fr-btn fr-btn-primary">
            Save Availability
          </button>

          <button
            type="button"
            className="fr-btn"
            onClick={() => setState(defaultState)}
          >
            Reset
          </button>
        </div>

        <div className="fr-actions" style={{ marginTop: 12 }}>
          <button
            type="button"
            className="fr-btn"
            onClick={() =>
              navigate("/candidate-dashboard/freelancer/education")
            }
          >
            Previous: Education
          </button>

          <button
            type="button"
            className="fr-btn fr-btn-primary"
            onClick={() =>
              navigate("/candidate-dashboard/freelancer/payment-method")
            }
          >
            Next: Payment Method
          </button>
        </div>
      </form>
    </div>
  );
}
