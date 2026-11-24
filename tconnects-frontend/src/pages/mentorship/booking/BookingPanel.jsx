// Booking side panel on a mentor's public profile: pick a date and slot, add details, pay with Razorpay.
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { mentorshipApi, apiError } from "../../../services/mentorshipApi";
import { browserZone, fmtDate, inr, localTime, longDate, monthEnd, monthStart, myMentorshipPath, payWithRazorpay, ymd } from "./bookingUtils";
import MiniCalendar from "./MiniCalendar";
import "./booking.css";

const MIN_NOTE = 10;

export default function BookingPanel({ mentor }) {
  const { user } = useContext(AuthContext) || {};
  const location = useLocation();
  const slug = mentor.slug;

  const durations = useMemo(() => {
    const list = (mentor.session_durations || Object.keys(mentor.session_prices || {})).map(Number).filter(Boolean);
    return [...new Set(list)].sort((a, b) => a - b);
  }, [mentor]);

  const [duration, setDuration] = useState(durations[0] || 60);
  const [month, setMonth] = useState(() => monthStart(new Date()));
  const [bookable, setBookable] = useState(null); // dates with free slots across the whole booking window
  const [slotData, setSlotData] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotError, setSlotError] = useState("");
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);

  const [step, setStep] = useState("pick"); // pick | details | held | done
  const [prefill, setPrefill] = useState(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [booking, setBooking] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [refundNote, setRefundNote] = useState("");

  const role = user?.role;
  const canBook = role === "candidate" || role === "recruiter";
  const loginLink = `/login?next=${encodeURIComponent(location.pathname)}`;

  const loadSlots = useCallback(async () => {
    setLoadingSlots(true);
    setSlotError("");
    try {
      const todayStr = ymd(new Date());
      const from = ymd(month) < todayStr ? todayStr : ymd(month);
      const data = await mentorshipApi.getSlots(slug, { duration, date_from: from, date_to: ymd(monthEnd(month)) });
      setSlotData(data);
      setDay((current) => {
        const days = data.days || [];
        return days.find((d) => d.date === current?.date) || days[0] || null;
      });
    } catch (err) {
      setSlotData(null);
      setSlotError(apiError(err, "Could not load available times."));
    } finally {
      setLoadingSlots(false);
    }
  }, [slug, duration, month]);

  // The whole booking window (how far ahead the calendar can go, and the next free date).
  useEffect(() => {
    let active = true;
    mentorshipApi
      .getAvailableDates(slug)
      .then((d) => active && setBookable((d.dates || []).map((x) => x.date)))
      .catch(() => active && setBookable([]));
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    loadSlots();
    setSlot(null);
  }, [loadSlots]);

  // Registered email and name for the form (email is locked).
  useEffect(() => {
    if (!canBook || step !== "details" || prefill) return;
    mentorshipApi
      .getBookingPrefill()
      .then((p) => {
        setPrefill(p);
        setName((n) => n || p.name || "");
      })
      .catch(() => setPrefill({ email: user?.email || "", name: user?.full_name || "" }));
  }, [canBook, step, prefill, user]);

  const price = slotData?.prices?.[String(duration)] ?? mentor.session_prices?.[String(duration)];
  const days = slotData?.days || [];
  const zone = slotData?.timezone || mentor.timezone || "Asia/Kolkata";
  const viewerZone = browserZone();
  const dayMap = Object.fromEntries(days.map((d) => [d.date, d]));
  const todayStr = ymd(new Date());
  const lastBookable = bookable?.length ? bookable[bookable.length - 1] : null;
  const maxDate = lastBookable && lastBookable > ymd(monthEnd(new Date())) ? lastBookable : ymd(monthEnd(month));
  const nextFree = !days.length && bookable ? bookable.find((d) => d > ymd(monthEnd(month))) : null;
  const marks = Object.fromEntries(days.map((d) => [d.date, "available"]));

  const startPayment = async (co, bk) => {
    try {
      const result = await payWithRazorpay(co, { onFailure: (msg) => toast.error(msg) });
      if (result.status === "confirmed") {
        setBooking(result.booking || bk);
        setStep("done");
        toast.success("Payment successful. Your session is booked!");
      } else if (result.status === "refunding") {
        setBooking(result.booking || bk);
        setRefundNote(result.message || "Your payment was received but the slot could not be kept. A full refund has been started.");
        setStep("done");
      } else {
        setStep("held");
      }
    } catch (err) {
      setFormError(err.message);
      setStep("held");
    }
  };

  const book = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) return setFormError("Please enter your name.");
    if (note.trim().length < MIN_NOTE) {
      return setFormError(`Tell the mentor briefly why you need mentorship (at least ${MIN_NOTE} characters).`);
    }
    setBusy(true);
    try {
      const res = await mentorshipApi.createBooking({
        mentor_slug: slug,
        start: slot.start,
        duration,
        name: name.trim(),
        note: note.trim(),
      });
      setBooking(res.booking);
      setCheckout(res.checkout);
      await startPayment(res.checkout, res.booking);
    } catch (err) {
      const code = err?.response?.data?.error;
      const msg = apiError(err, "Could not create the booking.");
      setFormError(msg);
      toast.error(msg);
      if (code === "slot_unavailable") {
        setStep("pick");
        setSlot(null);
        loadSlots();
      }
    } finally {
      setBusy(false);
    }
  };

  const payAgain = async () => {
    if (!booking) return;
    setBusy(true);
    setFormError("");
    try {
      const co = await mentorshipApi.reopenCheckout(booking.id);
      setCheckout(co);
      await startPayment(co, booking);
    } catch (err) {
      const msg = apiError(err, "This booking can no longer be paid. Please choose a slot again.");
      setFormError(msg);
      if (err?.response?.data?.error === "hold_expired") {
        setStep("pick");
        setSlot(null);
        setBooking(null);
        loadSlots();
      }
    } finally {
      setBusy(false);
    }
  };

  // -------------------------------------------------------------------------
  if (!durations.length || !mentor.hourly_rate) {
    return <p className="mb-muted">This mentor has not opened bookings yet.</p>;
  }

  if (step === "done" && booking) {
    return (
      <div className="mb-scope mb-done">
        <div className={`mb-done-icon${refundNote ? " warn" : ""}`}>
          <i className={`bi ${refundNote ? "bi-arrow-counterclockwise" : "bi-check2"}`} />
        </div>
        <h3>{refundNote ? "Refund started" : "Session booked"}</h3>
        {refundNote ? (
          <p>{refundNote}</p>
        ) : (
          <>
            <p>
              {booking.day}, {fmtDate(booking.date)} · {booking.start_local}–{booking.end_local}
              <small> ({booking.timezone})</small>
            </p>
            <p className="mb-muted">
              Reference <b>{booking.reference}</b>. A confirmation email is on its way to {booking.booker_email}.
              {booking.mentor_email && <> You can reach the mentor at <a href={`mailto:${booking.mentor_email}`}>{booking.mentor_email}</a>.</>}
            </p>
          </>
        )}
        <Link className="mentor-btn mentor-btn-primary" to={myMentorshipPath(role)}>Go to My Mentorship</Link>
      </div>
    );
  }

  if (step === "held" && booking) {
    const until = booking.hold_expires_at || checkout?.hold_expires_at;
    return (
      <div className="mb-scope mb-held">
        <h3>Complete your payment</h3>
        <p>
          Your slot on <b>{booking.day}, {fmtDate(booking.date)} at {booking.start_local}</b> is held for you
          {until ? <> until <b>{localTime(until)}</b></> : null}. It is released if payment is not completed in time.
        </p>
        {formError && <div className="mentor-form-alert error" role="alert">{formError}</div>}
        <button type="button" className="mentor-btn mentor-btn-primary" onClick={payAgain} disabled={busy}>
          {busy ? "Opening payment…" : `Pay ${inr(booking.amount)} securely`}
        </button>
        <button type="button" className="mb-link-btn" onClick={() => { setStep("pick"); setSlot(null); }}>
          Choose a different time
        </button>
      </div>
    );
  }

  if (step === "details" && slot) {
    return (
      <form className="mb-scope mb-details" onSubmit={book} noValidate>
        <button type="button" className="mb-link-btn" onClick={() => setStep("pick")}>
          <i className="bi bi-arrow-left" /> Change time
        </button>
        <div className="mb-summary">
          <div><span>Date</span><b>{fmtDate(day?.date)}</b></div>
          <div><span>Day</span><b>{day?.day}</b></div>
          <div><span>Time</span><b>{slot.start_local}–{slot.end_local}</b><small>{zone}</small></div>
          <div><span>Duration</span><b>{duration} minutes</b></div>
          <div><span>Fee</span><b>{inr(price)}</b></div>
        </div>

        <label className="mb-field">
          <span>Registered email</span>
          <div className="mb-locked">
            <input type="email" value={prefill?.email || user?.email || ""} readOnly aria-readonly="true" />
            <i className="bi bi-lock-fill" aria-hidden="true" />
          </div>
          <small>Your login email is used for the booking and cannot be changed here.</small>
        </label>

        <label className="mb-field">
          <span>Your name</span>
          <input value={name} maxLength={200} onChange={(e) => setName(e.target.value)} placeholder="Full name" required />
        </label>

        <label className="mb-field">
          <span>Why do you need mentorship?</span>
          <textarea
            rows={4}
            maxLength={1000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. I'm preparing for credit risk analyst interviews and want feedback on my approach."
            required
          />
          <small>{note.trim().length}/1000 · shared only with your mentor</small>
        </label>

        {formError && <div className="mentor-form-alert error" role="alert">{formError}</div>}

        <button type="submit" className="mentor-btn mentor-btn-primary" disabled={busy}>
          {busy ? "Starting payment…" : <>Pay {inr(price)} &amp; confirm</>}
        </button>
        <small className="mb-secure"><i className="bi bi-shield-lock" /> Secure payment by Razorpay. The slot is reserved for you while you pay.</small>
      </form>
    );
  }

  // step === "pick"
  return (
    <div className="mb-scope mb-pick">
      <h3 className="mb-panel-title">Book a session</h3>

      {durations.length > 1 && (
        <div className="mb-seg" role="radiogroup" aria-label="Session length">
          {durations.map((d) => (
            <button
              type="button"
              key={d}
              role="radio"
              aria-checked={duration === d}
              className={duration === d ? "active" : ""}
              onClick={() => setDuration(d)}
            >
              {d} min
            </button>
          ))}
        </div>
      )}

      <MiniCalendar
        month={month}
        onMonthChange={(m) => { setMonth(m); setSlot(null); }}
        value={day?.date || null}
        onChange={(date) => { setDay(dayMap[date] || null); setSlot(null); }}
        minDate={todayStr}
        maxDate={maxDate}
        isEnabled={(date) => Boolean(dayMap[date])}
        marks={marks}
        loading={loadingSlots}
        label="Choose a date for your session"
      />

      {loadingSlots ? (
        <p className="mb-muted" role="status">Loading available times…</p>
      ) : slotError ? (
        <div className="mentor-form-alert error" role="alert">
          {slotError} <button type="button" className="mb-link-btn" onClick={loadSlots}>Retry</button>
        </div>
      ) : days.length === 0 ? (
        <p className="mb-muted">
          No free slots in this month.{" "}
          {nextFree && (
            <button type="button" className="mb-link-btn" onClick={() => setMonth(monthStart(new Date(`${nextFree}T00:00:00`)))}>
              Next available: {fmtDate(nextFree)}
            </button>
          )}
        </p>
      ) : !day ? (
        <p className="mb-muted">Choose a highlighted date to see the times.</p>
      ) : (
        <>
          <div className="mb-picked">
            <i className="bi bi-calendar-event" />
            <div>
              <b>{longDate(day.date)}</b>
              <span>{slot ? `${slot.start_local}–${slot.end_local} (${zone})` : "Now pick a time"}</span>
            </div>
          </div>
          <div className="mb-slots" role="listbox" aria-label={`Times on ${day.day}`}>
            {day.slots.map((s) => (
              <button
                type="button"
                key={s.start}
                role="option"
                aria-selected={slot?.start === s.start}
                className={slot?.start === s.start ? "active" : ""}
                onClick={() => setSlot(s)}
                title={zone !== viewerZone ? `${localTime(s.start)} your time` : undefined}
              >
                {s.start_local}
              </button>
            ))}
          </div>
          <small className="mb-muted">
            Times shown in the mentor's time zone ({zone}).
            {zone !== viewerZone && slot ? ` That's ${localTime(slot.start)} for you.` : ""}
          </small>
        </>
      )}

      <div className="mb-price-line">
        <span>{duration} min session</span>
        <b>{inr(price)}</b>
      </div>

      {!user ? (
        <Link className="mentor-btn mentor-btn-primary" to={loginLink}>Sign in to book</Link>
      ) : !canBook ? (
        <p className="mb-muted">Bookings are available to candidate and recruiter accounts.</p>
      ) : (
        <button
          type="button"
          className="mentor-btn mentor-btn-primary"
          disabled={!slot}
          onClick={() => { setFormError(""); setStep("details"); }}
        >
          {slot ? `Continue: ${day?.day?.slice(0, 3)} ${fmtDate(day?.date, { year: undefined })}, ${slot.start_local}` : "Select a date and time"}
        </button>
      )}
    </div>
  );
}
