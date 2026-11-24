// Mentor dashboard (inside the Candidate dashboard): sessions, availability, public profile, earnings and payouts.
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { mentorshipApi, apiError } from "../../../services/mentorshipApi";
import Pagination from "../../../components/Pagination";
import usePaged from "../booking/usePaged";
import { fmtDate, fmtDateTime, inr, longDate, monthStart, sessionWhen, ymd } from "../booking/bookingUtils";
import MiniCalendar from "../booking/MiniCalendar";
import CompletionConfirm from "../booking/CompletionConfirm";
import StatusBadge from "../booking/StatusBadge";
import "../mentorship.css";
import "../booking/booking.css";

const TABS = [
  { key: "sessions", label: "Sessions", icon: "bi-calendar-check" },
  { key: "availability", label: "Availability", icon: "bi-clock" },
  { key: "profile", label: "My profile", icon: "bi-person-badge" },
  { key: "earnings", label: "Earnings & payouts", icon: "bi-wallet2" },
];

const SESSION_FILTERS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "awaiting_completion", label: "Awaiting completion" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
];

const DAYS = [
  ["mon", "Monday"], ["tue", "Tuesday"], ["wed", "Wednesday"], ["thu", "Thursday"],
  ["fri", "Friday"], ["sat", "Saturday"], ["sun", "Sunday"],
];
const DURATIONS = [30, 45, 60];
const TIMEZONES = [
  "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Europe/London", "America/New_York", "America/Los_Angeles", "Australia/Sydney",
];
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export default function MentorDashboard() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.key === params.get("tab")) ? params.get("tab") : "sessions";
  const [app, setApp] = useState(null);
  const [gate, setGate] = useState("loading"); // loading | ok | not_mentor | error

  const loadApp = useCallback(() => {
    mentorshipApi
      .getApplication()
      .then((a) => {
        setApp(a);
        setGate(["approved", "suspended"].includes(a?.status) ? "ok" : "not_mentor");
      })
      .catch((e) => setGate(e?.response?.status === 403 ? "not_mentor" : "error"));
  }, []);

  useEffect(() => loadApp(), [loadApp]);

  if (gate === "loading") return <div className="mb-page"><p className="mb-muted">Loading mentor dashboard…</p></div>;

  if (gate !== "ok") {
    return (
      <div className="mb-page">
        <div className="mb-empty">
          <i className="bi bi-person-video3" />
          <h3>{gate === "error" ? "Could not load your mentor profile" : "Your mentor dashboard opens once you're approved"}</h3>
          <p>
            {gate === "error"
              ? "Please refresh the page and try again."
              : app?.status === "submitted"
                ? "Your application is with our review team. We'll email you when it's approved."
                : "Share your risk-management experience and earn by mentoring candidates and recruiters."}
          </p>
          <Link className="mb-btn primary" to="/mentorship/become-a-mentor">
            {app?.status && app.status !== "not_started" ? "View my application" : "Become a Mentor"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-page">
      <div className="mb-page-head">
        <div>
          <span className="mb-kicker">Mentor dashboard</span>
          <h1>Mentorship management</h1>
          <p>{app.full_name ? `${app.full_name} · ` : ""}Your bookings, schedule, profile and payouts in one place.</p>
        </div>
        {app?.slug && (
          <Link className="mb-btn" to={`/mentorship/mentors/${app.slug}`} target="_blank"><i className="bi bi-box-arrow-up-right" /> View public profile</Link>
        )}
      </div>

      {app.status === "suspended" && (
        <div className="mb-alert error">
          <i className="bi bi-pause-circle" />
          <span>Your profile is suspended: it is hidden from the directory and cannot take new bookings. Sessions already paid for still go ahead.{app.review_message ? ` Note from TConnects: ${app.review_message}` : ""}</span>
        </div>
      )}

      <div className="mb-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? "active" : ""} onClick={() => setParams({ tab: t.key })}>
            <i className={`bi ${t.icon}`} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "sessions" && <SessionsTab />}
      {tab === "availability" && <AvailabilityTab />}
      {tab === "profile" && <ProfileTab key={JSON.stringify(app)} app={app} onSaved={loadApp} />}
      {tab === "earnings" && <EarningsTab />}
    </div>
  );
}

// ===========================================================================
// Sessions
// ===========================================================================
function SessionsTab() {
  const [filter, setFilter] = useState("upcoming");
  const [openId, setOpenId] = useState(null);
  const close = useCallback(() => setOpenId(null), []);
  const list = usePaged((p) => mentorshipApi.listMentorBookings(p), { status: filter }, filter);
  const s = list.extra?.summary;

  return (
    <>
      {s && (
        <div className="mb-stats">
          <div className="mb-stat"><span>Upcoming sessions</span><b>{s.upcoming}</b></div>
          <div className="mb-stat"><span>Completed</span><b>{s.completed}</b></div>
          <div className="mb-stat"><span>Held earnings</span><b>{inr(s.held)}</b><small>Released after you and your mentee both confirm</small></div>
          <div className="mb-stat"><span>Ready to release</span><b>{inr(s.ready_to_release)}</b></div>
          <div className="mb-stat"><span>Paid out</span><b>{inr(s.paid_out)}</b></div>
        </div>
      )}
      {s && !s.payout_account_added && (
        <div className="mb-alert warn">
          <i className="bi bi-bank" />
          <span>Add your bank or UPI details under <b>Earnings &amp; payouts</b> so we can pay you after your sessions.</span>
        </div>
      )}

      <div className="mb-toolbar">
        <div className="mb-pills">
          {SESSION_FILTERS.map((f) => (
            <button key={f.key} className={`mb-pill${filter === f.key ? " active" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>
      </div>

      {list.error && <div className="mb-alert error">{list.error} <button className="mb-link-btn" onClick={list.reload}>Retry</button></div>}
      {list.loading ? (
        <p className="mb-muted">Loading sessions…</p>
      ) : !list.error && list.rows.length === 0 ? (
        <div className="mb-empty">
          <i className="bi bi-calendar2-week" />
          <h3>No sessions here</h3>
          <p>{filter === "upcoming" ? "New bookings appear here as soon as they are paid." : "Nothing in this list yet."}</p>
        </div>
      ) : (
        <div className="mb-list">
          {list.rows.map((b) => {
            const when = sessionWhen(b);
            return (
              <div className="mb-card" key={b.id}>
                <div className="mb-avatar">{(b.booker?.name || "?").charAt(0)}</div>
                <div className="mb-card-main">
                  <h3>{b.booker?.name} <small className="mb-muted">({b.booker?.role})</small></h3>
                  <p>{b.booker?.email}</p>
                  <p><i className="bi bi-calendar-event" /> {when.main}</p>
                  <div className="mb-card-meta">
                    <StatusBadge status={b.status} label={b.status_label} />
                    {b.payout_status && <StatusBadge status={b.payout_status} label={`Payout: ${b.payout_status_label}`} />}
                    {b.issue && !b.issue.resolved_at && <span className="mb-badge tone-danger">Problem reported</span>}
                    {b.status === "confirmed" && b.completion?.can_confirm && <span className="mb-badge tone-warning">Confirm completion</span>}
                    {b.status === "confirmed" && b.completion?.you_confirmed && !b.completion?.other_confirmed && <span className="mb-badge tone-info">Waiting for mentee</span>}
                  </div>
                </div>
                <div className="mb-card-side">
                  <b>{inr(b.your_earning)}</b>
                  <button className="mb-btn" onClick={() => setOpenId(b.id)}>Manage</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Pagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} />
      {openId && <MentorBookingDrawer id={openId} onClose={close} onChanged={list.reload} />}
    </>
  );
}

function MentorBookingDrawer({ id, onClose, onChanged }) {
  const [b, setB] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [link, setLink] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    let active = true;
    mentorshipApi.getMentorBooking(id).then((d) => {
      if (!active) return;
      setB(d);
      setLink(d.meeting_link || "");
    }).catch((e) => active && setError(apiError(e)));
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      active = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [id, onClose]);

  const run = async (key, fn, okMsg) => {
    setBusy(key);
    setError("");
    try {
      const next = await fn();
      setB(next);
      setLink(next.meeting_link || "");
      onChanged();
      toast.success(okMsg);
      return true;
    } catch (e) {
      setError(apiError(e));
      return false;
    } finally {
      setBusy("");
    }
  };

  const saveLink = () => {
    if (link && !/^https:\/\//i.test(link.trim())) return setError("Use a secure https:// meeting link.");
    run("link", () => mentorshipApi.setMeetingLink(b.id, link.trim()), "Meeting link saved. The booker can see it now.");
  };

  const cancel = async () => {
    if (reason.trim().length < 5) return setError("Please give the booker a reason (at least 5 characters).");
    const ok = await run("cancel", () => mentorshipApi.cancelMentorBooking(b.id, reason.trim()), "Session cancelled. The booker gets a full refund.");
    if (ok) setCancelOpen(false);
  };

  const mailto = b
    ? `mailto:${b.booker.email}?subject=${encodeURIComponent(`Your TConnects mentorship session ${b.reference}`)}&body=${encodeURIComponent(`Hi ${b.booker.name},\n\n`)}`
    : "#";

  return (
    <div className="mb-overlay mb-scope" onClick={onClose}>
      <aside className="mb-drawer" role="dialog" aria-modal="true" aria-label="Session details" onClick={(e) => e.stopPropagation()}>
        <div className="mb-drawer-head">
          <div>
            <span className="mb-kicker">Booking {b?.reference}</span>
            <h2>{b ? `Session with ${b.booker.name}` : "Loading…"}</h2>
          </div>
          <button className="mb-close" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg" /></button>
        </div>
        {error && <div className="mb-alert error" role="alert">{error}</div>}
        {b && (
          <>
            <div className="mb-actions" style={{ marginBottom: 14 }}>
              <StatusBadge status={b.status} label={b.status_label} />
              <a className="mb-btn" href={mailto}><i className="bi bi-envelope" /> Email {b.booker.name.split(" ")[0]}</a>
              {b.can_cancel && <button className="mb-btn danger" disabled={!!busy} onClick={() => { setCancelOpen(true); setError(""); }}>Cancel session</button>}
            </div>

            <CompletionConfirm
              booking={b}
              role="mentor"
              onConfirm={async () => {
                setError("");
                try {
                  const next = await mentorshipApi.completeMentorBooking(b.id);
                  setB(next);
                  onChanged();
                  toast.success(next.status === "completed"
                    ? "Both of you confirmed. Session completed and your payout is ready for release."
                    : "Confirmed. Waiting for your mentee to confirm too.");
                } catch (e) {
                  setError(apiError(e));
                }
              }}
            />

            {cancelOpen && (
              <div className="mb-inline-form">
                <b>Cancel this session?</b>
                <span className="mb-muted">The booker receives a full refund and your payout for this session is cancelled. They will see your reason.</span>
                <textarea rows={2} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for the booker" style={{ border: "1px solid #cfe3ea", borderRadius: 8, padding: 8, font: "inherit" }} />
                <div className="mb-actions">
                  <button className="mb-btn" onClick={() => setCancelOpen(false)}>Keep session</button>
                  <button className="mb-btn danger" onClick={cancel} disabled={busy === "cancel"}>{busy === "cancel" ? "Cancelling…" : "Cancel and refund"}</button>
                </div>
              </div>
            )}

            {b.issue && (
              <div className={`mb-alert ${b.issue.resolved_at ? "info" : "error"}`} style={{ marginTop: 12 }}>
                <i className="bi bi-flag" />
                <span>
                  <b>{b.issue.resolved_at ? "Reported problem (resolved)" : "The booker reported a problem"}</b> · {fmtDateTime(b.issue.reported_at)}
                  <br />{b.issue.note}
                  {!b.issue.resolved_at && <><br /><small>Your payout for this session is paused until TConnects support resolves it.</small></>}
                </span>
              </div>
            )}

            <section className="mb-section">
              <h4>Booked by</h4>
              <dl className="mb-kv">
                <dt>Name</dt><dd>{b.booker.name}</dd>
                <dt>Registered email</dt><dd><a href={mailto}>{b.booker.email}</a></dd>
                <dt>Account type</dt><dd style={{ textTransform: "capitalize" }}>{b.booker.role}</dd>
              </dl>
              <h4 style={{ marginTop: 14 }}>Learning requirement</h4>
              <p className="mb-quote">{b.requirement}</p>
            </section>

            <section className="mb-section">
              <h4>Schedule</h4>
              <dl className="mb-kv">
                <dt>Date</dt><dd>{fmtDate(b.date)}</dd>
                <dt>Day</dt><dd>{b.day}</dd>
                <dt>Time</dt><dd>{b.start_local}–{b.end_local} ({b.timezone})</dd>
                <dt>Duration</dt><dd>{b.duration_minutes} minutes</dd>
                <dt>Confirmed</dt><dd>{fmtDateTime(b.confirmed_at)}</dd>
                {b.completed_at && (<><dt>Completed</dt><dd>{fmtDateTime(b.completed_at)}</dd></>)}
                {b.cancelled_at && (<><dt>Cancelled</dt><dd>{fmtDateTime(b.cancelled_at)} by {b.cancelled_by_role}{b.cancel_reason ? ` · ${b.cancel_reason}` : ""}</dd></>)}
              </dl>
              {b.status === "confirmed" && (
                <div className="mb-field" style={{ marginTop: 12 }}>
                  <span>Meeting link</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://meet.google.com/…" />
                    <button className="mb-btn primary" onClick={saveLink} disabled={busy === "link"}>{busy === "link" ? "Saving…" : "Save"}</button>
                  </div>
                  <small>Shared only with the booker. Use Google Meet, Zoom, Teams or similar (https only).</small>
                </div>
              )}
              {b.status !== "confirmed" && b.meeting_link && (
                <dl className="mb-kv" style={{ marginTop: 8 }}><dt>Meeting link</dt><dd>{b.meeting_link}</dd></dl>
              )}
            </section>

            <section className="mb-section">
              <h4>Payment &amp; payout</h4>
              <dl className="mb-kv">
                <dt>Booker paid</dt><dd>{inr(b.amount_paid)} <StatusBadge status={b.payment_status} label={b.payment_status_label} /></dd>
                <dt>Platform commission</dt><dd>{inr(b.platform_commission)} ({Number(b.commission_pct)}%)</dd>
                <dt>Your earning</dt><dd><b>{inr(b.your_earning)}</b></dd>
                <dt>Payout status</dt><dd>{b.payout_status ? <StatusBadge status={b.payout_status} label={b.payout_status_label} /> : "—"}</dd>
                {b.payout_paid_at && (<><dt>Paid out on</dt><dd>{fmtDateTime(b.payout_paid_at)}</dd></>)}
              </dl>
            </section>
          </>
        )}
        {!b && !error && <p className="mb-muted">Loading…</p>}
      </aside>
    </div>
  );
}

// ===========================================================================
// Availability
// ===========================================================================
function AvailabilityTab() {
  const [data, setData] = useState(null);
  const [week, setWeek] = useState({});
  const [durations, setDurations] = useState([]);
  const [zone, setZone] = useState("Asia/Kolkata");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [exc, setExc] = useState({ date: "", is_closed: true, windows: [["", ""]], note: "" });
  const [excBusy, setExcBusy] = useState(false);
  const [excMonth, setExcMonth] = useState(() => monthStart(new Date()));

  const apply = (d) => {
    setData(d);
    const w = {};
    DAYS.forEach(([k]) => {
      w[k] = (d.availability?.[k] || []).map((s) => s.split("-"));
    });
    setWeek(w);
    setDurations((d.session_durations || []).map(Number));
    setZone(d.timezone || "Asia/Kolkata");
  };

  useEffect(() => {
    mentorshipApi.getMentorAvailability().then(apply).catch((e) => setError(apiError(e)));
  }, []);

  const maxSlots = data?.max_slots_per_day || 6;
  const excMarks = Object.fromEntries((data?.exceptions || []).map((x) => [x.date, x.is_closed ? "closed" : "custom"]));

  const setDay = (day, slots) => setWeek((w) => ({ ...w, [day]: slots }));

  const validateWindows = (pairs, label) => {
    const out = [];
    for (const [a, b] of pairs) {
      if (!a && !b) continue;
      if (!HHMM.test(a || "") || !HHMM.test(b || "")) throw new Error(`${label}: choose a start and end time for every slot.`);
      if (a >= b) throw new Error(`${label}: the end time must be after the start time.`);
      out.push(`${a}-${b}`);
    }
    const sorted = [...new Set(out)].sort();
    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i].split("-")[0] < sorted[i - 1].split("-")[1]) throw new Error(`${label}: time slots must not overlap.`);
    }
    return sorted;
  };

  const save = async () => {
    setError("");
    let availability;
    try {
      availability = {};
      for (const [k, label] of DAYS) {
        const list = validateWindows(week[k] || [], label);
        if (list.length > maxSlots) throw new Error(`${label}: up to ${maxSlots} time slots per day.`);
        if (list.length) availability[k] = list;
      }
      if (!durations.length) throw new Error("Choose at least one session length.");
      if (!Object.keys(availability).length) throw new Error("Add at least one weekly time slot so people can book you.");
    } catch (e) {
      return setError(e.message);
    }
    setSaving(true);
    try {
      apply(await mentorshipApi.saveMentorAvailability({ availability, session_durations: durations, timezone: zone }));
      toast.success("Availability updated. New slots are live now.");
    } catch (e) {
      setError(apiError(e));
    } finally {
      setSaving(false);
    }
  };

  const addException = async (e) => {
    e.preventDefault();
    setError("");
    if (!exc.date) return setError("Choose a date for the exception.");
    let windows = [];
    if (!exc.is_closed) {
      try {
        windows = validateWindows(exc.windows, "Custom hours");
      } catch (err) {
        return setError(err.message);
      }
      if (!windows.length) return setError("Add at least one time window, or mark the day as closed.");
    }
    setExcBusy(true);
    try {
      const res = await mentorshipApi.addAvailabilityException({ date: exc.date, is_closed: exc.is_closed, windows, note: exc.note });
      if (res.confirmed_bookings_that_day > 0) {
        toast(`Saved. You still have ${res.confirmed_bookings_that_day} confirmed session(s) that day; they are not cancelled automatically.`, { icon: "⚠️", duration: 7000 });
      } else {
        toast.success("Date exception saved.");
      }
      setExc({ date: "", is_closed: true, windows: [["", ""]], note: "" });
      apply(await mentorshipApi.getMentorAvailability());
    } catch (err) {
      setError(apiError(err));
    } finally {
      setExcBusy(false);
    }
  };

  const removeException = async (id) => {
    try {
      await mentorshipApi.deleteAvailabilityException(id);
      setData((d) => ({ ...d, exceptions: d.exceptions.filter((x) => x.id !== id) }));
      toast.success("Exception removed.");
    } catch (err) {
      setError(apiError(err));
    }
  };

  if (!data) return error ? <div className="mb-alert error">{error}</div> : <p className="mb-muted">Loading availability…</p>;

  return (
    <>
      {error && <div className="mb-alert error" role="alert">{error}</div>}
      <div className="mb-panel">
        <h3>Weekly schedule</h3>
        <p>People can book any free slot inside these hours. Booked slots are blocked automatically; changes never affect sessions already confirmed.</p>
        <div className="mb-week">
          {DAYS.map(([k, label]) => {
            const slots = week[k] || [];
            const on = slots.length > 0;
            return (
              <div className="mb-day-row" key={k}>
                <label className="mb-day-toggle">
                  <input type="checkbox" checked={on} onChange={(e) => setDay(k, e.target.checked ? [["18:00", "20:00"]] : [])} />
                  {label}
                </label>
                <div className="mb-windows">
                  {!on && <span className="mb-muted" style={{ paddingTop: 6 }}>Unavailable</span>}
                  {slots.map(([a, b], i) => (
                    <div className="mb-window" key={i}>
                      <input type="time" value={a} onChange={(e) => setDay(k, slots.map((s, j) => (j === i ? [e.target.value, s[1]] : s)))} aria-label={`${label} start`} />
                      <span>to</span>
                      <input type="time" value={b} onChange={(e) => setDay(k, slots.map((s, j) => (j === i ? [s[0], e.target.value] : s)))} aria-label={`${label} end`} />
                      <button type="button" className="mb-icon-btn" aria-label="Remove slot" onClick={() => setDay(k, slots.filter((_, j) => j !== i))}><i className="bi bi-trash" /></button>
                    </div>
                  ))}
                  {on && slots.length < maxSlots && (
                    <button type="button" className="mb-link-btn" onClick={() => setDay(k, [...slots, ["", ""]])}><i className="bi bi-plus" /> Add hours</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-grid-2" style={{ marginTop: 16 }}>
          <div className="mb-field">
            <span>Session lengths offered</span>
            <div className="mb-pills">
              {DURATIONS.map((d) => (
                <button type="button" key={d} className={`mb-pill${durations.includes(d) ? " active" : ""}`} onClick={() => setDurations((x) => (x.includes(d) ? x.filter((y) => y !== d) : [...x, d].sort((p, q) => p - q)))}>{d} min</button>
              ))}
            </div>
            {data.hourly_rate ? <small>At {inr(data.hourly_rate)}/hour: {durations.map((d) => `${d} min = ${inr(Math.round((data.hourly_rate * d) / 60))}`).join(" · ")}</small> : null}
          </div>
          <label className="mb-field">
            <span>Time zone</span>
            <select value={zone} onChange={(e) => setZone(e.target.value)}>
              {[...new Set([zone, ...TIMEZONES])].map((z) => <option key={z} value={z}>{z}</option>)}
            </select>
          </label>
        </div>
        <div className="mb-actions" style={{ justifyContent: "flex-end", marginTop: 14 }}>
          <button className="mb-btn primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save schedule"}</button>
        </div>
      </div>

      <div className="mb-panel">
        <h3>Days off and special hours</h3>
        <p>Close a single date (holiday, travel) or set different hours for just that day.</p>
        <form onSubmit={addException} className="mb-grid-2">
          <div className="mb-field">
            <span>Pick a date</span>
            <MiniCalendar
              month={excMonth}
              onMonthChange={setExcMonth}
              value={exc.date || null}
              minDate={ymd(new Date())}
              marks={excMarks}
              label="Choose a date for a day off or special hours"
              onChange={(date) => {
                const existing = (data.exceptions || []).find((x) => x.date === date);
                setExc(existing
                  ? { date, is_closed: existing.is_closed, windows: existing.is_closed || !existing.windows.length ? [["", ""]] : existing.windows.map((w) => w.split("-")), note: existing.note || "" }
                  : { ...exc, date });
              }}
            />
            <div className="mb-cal-legend"><span className="l-closed">Closed</span><span className="l-custom">Special hours</span></div>
          </div>
          <div className="mb-field">
            <span>Selected date</span>
            {exc.date ? (
              <div className="mb-picked">
                <i className="bi bi-calendar-event" />
                <div>
                  <b>{longDate(exc.date)}</b>
                  <span>
                    Usual hours that day: {(() => {
                      const key = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date(`${exc.date}T00:00:00`).getDay()];
                      const usual = (week[key] || []).filter(([a, b]) => a && b).map(([a, b]) => `${a}–${b}`);
                      return usual.length ? usual.join(", ") : "none";
                    })()}
                  </span>
                </div>
              </div>
            ) : (
              <span className="mb-muted">Choose a date on the calendar.</span>
            )}
          </div>
          <div className="mb-field">
            <span>On that day</span>
            <div className="mb-pills">
              <button type="button" className={`mb-pill${exc.is_closed ? " active" : ""}`} onClick={() => setExc({ ...exc, is_closed: true })}>Closed</button>
              <button type="button" className={`mb-pill${!exc.is_closed ? " active" : ""}`} onClick={() => setExc({ ...exc, is_closed: false })}>Custom hours</button>
            </div>
          </div>
          {!exc.is_closed && (
            <div className="mb-field" style={{ gridColumn: "1 / -1" }}>
              <span>Hours</span>
              {exc.windows.map(([a, b], i) => (
                <div className="mb-window" key={i}>
                  <input type="time" value={a} onChange={(e) => setExc({ ...exc, windows: exc.windows.map((w, j) => (j === i ? [e.target.value, w[1]] : w)) })} />
                  <span>to</span>
                  <input type="time" value={b} onChange={(e) => setExc({ ...exc, windows: exc.windows.map((w, j) => (j === i ? [w[0], e.target.value] : w)) })} />
                  {exc.windows.length > 1 && <button type="button" className="mb-icon-btn" onClick={() => setExc({ ...exc, windows: exc.windows.filter((_, j) => j !== i) })}><i className="bi bi-trash" /></button>}
                </div>
              ))}
              {exc.windows.length < maxSlots && <button type="button" className="mb-link-btn" onClick={() => setExc({ ...exc, windows: [...exc.windows, ["", ""]] })}><i className="bi bi-plus" /> Add hours</button>}
            </div>
          )}
          <label className="mb-field" style={{ gridColumn: "1 / -1" }}>
            <span>Note (optional, private)</span>
            <input value={exc.note} maxLength={200} onChange={(e) => setExc({ ...exc, note: e.target.value })} placeholder="e.g. Diwali" />
          </label>
          <div className="mb-actions" style={{ gridColumn: "1 / -1", justifyContent: "flex-end" }}>
            <button className="mb-btn primary" type="submit" disabled={excBusy || !exc.date}>
              {excBusy ? "Saving…" : exc.date ? `Save for ${fmtDate(exc.date)}` : "Choose a date first"}
            </button>
          </div>
        </form>

        {(data.exceptions || []).length > 0 && (
          <div className="mb-list" style={{ marginTop: 14 }}>
            {data.exceptions.map((x) => (
              <div key={x.id} className="mb-card" style={{ gridTemplateColumns: "1fr auto" }}>
                <div className="mb-card-main">
                  <h3>{fmtDate(x.date, { weekday: "long" })}</h3>
                  <p>{x.is_closed ? "Closed all day" : `Custom hours: ${x.windows.join(", ")}`}{x.note ? ` · ${x.note}` : ""}</p>
                </div>
                <button className="mb-btn danger" onClick={() => removeException(x.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ===========================================================================
// Public profile: mentors manage everything about their own profile here.
// The name is the account name (one source for dashboard profile, mentor profile and bookings).
// Work details and the rate are checked by TConnects before going live; everything else is live at once.
// ===========================================================================
const PROFILE_FIELDS = [
  "city", "country", "languages", "linkedin_url",
  "topics", "audiences", "session_types", "help_summary", "real_moment", "common_mistake",
  "employment_status", "job_title", "company_name", "hide_company", "company_display_label",
  "years_experience", "risk_areas", "highest_qualification", "certifications", "hourly_rate",
];
const REVIEWED_FIELDS = new Set([
  "employment_status", "job_title", "company_name", "hide_company", "company_display_label",
  "years_experience", "risk_areas", "highest_qualification", "certifications", "hourly_rate",
]);
const LIST_FIELDS = new Set(["languages", "topics", "certifications"]);

const FALLBACK_OPTIONS = {
  risk_areas: [["credit", "Credit risk"], ["market", "Market risk"], ["operational", "Operational risk"], ["compliance", "Compliance & regulatory"], ["fintech", "Fintech & digital risk"], ["audit", "Internal audit"], ["cyber", "Cyber & information risk"], ["insurance", "Insurance & actuarial risk"], ["other", "Other"]],
  audiences: [["students", "Students"], ["freshers", "Freshers"], ["career_switchers", "Career switchers"], ["working_professionals", "Working professionals"]],
  session_types: [["career_guidance", "Career guidance"], ["resume_review", "Resume review"], ["interview_prep", "Interview prep"], ["skill_learning", "Learning a skill"], ["project_help", "Project help"]],
};
const toPairs = (list, fallback) =>
  Array.isArray(list) && list.length ? list.map((o) => (typeof o === "string" ? [o, o] : [o.value, o.label || o.value])) : fallback;

const csv = (v) => (Array.isArray(v) ? v.join(", ") : v || "");
const fromCsv = (t) => [...new Set(String(t).split(",").map((x) => x.trim()).filter(Boolean))];

function profileValues(app) {
  const pending = app.pending_changes || {};
  const v = {};
  PROFILE_FIELDS.forEach((k) => {
    const value = k in pending ? pending[k] : app[k];
    v[k] = LIST_FIELDS.has(k) ? csv(value) : value ?? (k === "hide_company" ? false : "");
  });
  v.employment_status = v.employment_status === "not_working" ? "not_working" : "working";
  return v;
}

function PillSet({ options, value = [], onChange, label }) {
  return (
    <div className="mb-pills" role="group" aria-label={label}>
      {options.map(([val, text]) => {
        const on = value.includes(val);
        return (
          <button type="button" key={val} aria-pressed={on} className={`mb-pill${on ? " active" : ""}`}
            onClick={() => onChange(on ? value.filter((x) => x !== val) : [...value, val])}>
            {text}
          </button>
        );
      })}
    </div>
  );
}

function ProfileTab({ app, onSaved }) {
  const { user, setUser } = useContext(AuthContext) || {};
  const [opts, setOpts] = useState(FALLBACK_OPTIONS);
  const [start] = useState(() => profileValues(app));
  const [f, setF] = useState(() => profileValues(app));
  const [name, setName] = useState(app.full_name || user?.full_name || "");
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photo, setPhoto] = useState(app.photo_url || null);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e }));
  const working = f.employment_status !== "not_working";

  useEffect(() => {
    mentorshipApi.getOptions().then((o) => setOpts({
      risk_areas: toPairs(o?.risk_areas, FALLBACK_OPTIONS.risk_areas),
      audiences: toPairs(o?.audiences, FALLBACK_OPTIONS.audiences),
      session_types: toPairs(o?.session_types, FALLBACK_OPTIONS.session_types),
    })).catch(() => {});
  }, []);

  const changePhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoBusy(true);
    setError("");
    try {
      const res = await mentorshipApi.uploadFile("photo", file);
      setPhoto(res?.photo_url || res?.url || URL.createObjectURL(file));
      toast.success("Profile photo updated.");
      onSaved();
    } catch (err) {
      setError(apiError(err, "Could not upload the photo."));
    } finally {
      setPhotoBusy(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const cleanName = name.trim();
    if (cleanName.length < 2) return setError("Enter your full name.");
    if (f.linkedin_url && !/^https:\/\/([a-z]+\.)?linkedin\.com\//i.test(f.linkedin_url.trim())) return setError("Enter a LinkedIn link starting with https://www.linkedin.com/");
    if (working && (!String(f.job_title).trim() || !String(f.company_name).trim())) return setError("Add your job title and company, or choose 'Not working right now'.");
    if (working && f.hide_company && !String(f.company_display_label).trim()) return setError("Add the label to show instead of your company name.");
    const rate = Number(f.hourly_rate);
    if (!Number.isFinite(rate) || rate < 1) return setError("Enter a valid hourly rate.");
    if (f.years_experience !== "" && f.years_experience != null && !(Number(f.years_experience) >= 0)) return setError("Enter your years of experience as a number.");

    // Send only what actually changed.
    const payload = {};
    PROFILE_FIELDS.forEach((k) => {
      if (JSON.stringify(f[k]) === JSON.stringify(start[k])) return;
      let v = f[k];
      if (LIST_FIELDS.has(k)) v = fromCsv(v);
      if (k === "topics") v = v.slice(0, 5);
      if (k === "hourly_rate") v = rate;
      if (k === "years_experience") v = v === "" ? null : Number(v);
      if (typeof v === "string") v = v.trim();
      payload[k] = v;
    });
    const nameChanged = cleanName !== (app.full_name || user?.full_name || "").trim();
    if (!Object.keys(payload).length && !nameChanged) return toast("Nothing has changed.", { icon: "ℹ️" });

    setBusy(true);
    try {
      if (nameChanged) {
        const me = await mentorshipApi.updateAccountName(cleanName);
        if (setUser) setUser((u) => (u ? { ...u, full_name: me?.full_name ?? cleanName } : u));
      }
      if (Object.keys(payload).length) await mentorshipApi.liveEdit(payload);
      const reviewed = Object.keys(payload).some((k) => REVIEWED_FIELDS.has(k));
      toast.success(reviewed ? "Saved. Work details and rate changes go live after TConnects checks them." : "Profile updated.");
      onSaved();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const reviewTag = <span className="mb-badge tone-info" style={{ marginLeft: 6 }}>Checked before going live</span>;

  return (
    <form onSubmit={save} noValidate>
      {app.has_pending_changes && (
        <div className="mb-alert info"><i className="bi bi-hourglass" /><span>Some of your changes are waiting for review. The form shows what you submitted; your public profile keeps the old values until they are approved.</span></div>
      )}
      {error && <div className="mb-alert error" role="alert">{error}</div>}

      <div className="mb-panel">
        <h3>Account</h3>
        <p>Your name is shared with your dashboard profile, so changing it here updates it everywhere.</p>
        <div className="mb-grid-2">
          <div style={{ display: "flex", gap: 14, alignItems: "center", gridColumn: "1 / -1" }}>
            {photo ? <img className="mb-avatar" style={{ width: 64, height: 64 }} src={photo} alt="" /> : <div className="mb-avatar" style={{ width: 64, height: 64 }}>{(name || "M").charAt(0)}</div>}
            <label className="mb-btn" style={{ cursor: photoBusy ? "wait" : "pointer" }}>
              <i className="bi bi-camera" /> {photoBusy ? "Uploading…" : "Change photo"}
              <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={changePhoto} disabled={photoBusy} />
            </label>
          </div>
          <label className="mb-field">
            <span>Full name</span>
            <input value={name} maxLength={200} autoComplete="name" onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="mb-field">
            <span>Email address</span>
            <div className="mb-locked">
              <input type="email" value={app.registered_email || user?.email || ""} readOnly aria-readonly="true" />
              <i className="bi bi-lock-fill" aria-hidden="true" />
            </div>
            <small>Your login email can't be changed.</small>
          </label>
          <label className="mb-field"><span>City</span><input value={f.city} maxLength={100} onChange={set("city")} /></label>
          <label className="mb-field"><span>Country</span><input value={f.country} maxLength={100} onChange={set("country")} /></label>
          <label className="mb-field"><span>Languages (comma separated)</span><input value={f.languages} onChange={set("languages")} /></label>
          <label className="mb-field"><span>LinkedIn profile</span><input type="url" value={f.linkedin_url} onChange={set("linkedin_url")} placeholder="https://www.linkedin.com/in/…" /></label>
        </div>
      </div>

      <div className="mb-panel">
        <h3>Expertise &amp; mentoring</h3>
        <p>What people see when they browse mentors. Live as soon as you save.</p>
        <div className="mb-grid-2">
          <label className="mb-field" style={{ gridColumn: "1 / -1" }}><span>Topics (up to 5, comma separated)</span><input value={f.topics} onChange={set("topics")} /></label>
          <div className="mb-field"><span>Best suited for</span><PillSet label="Audiences" options={opts.audiences} value={f.audiences || []} onChange={set("audiences")} /></div>
          <div className="mb-field"><span>Session formats</span><PillSet label="Session formats" options={opts.session_types} value={f.session_types || []} onChange={set("session_types")} /></div>
          <label className="mb-field" style={{ gridColumn: "1 / -1" }}>
            <span>What a mentee can expect</span>
            <textarea rows={3} maxLength={300} value={f.help_summary} onChange={set("help_summary")} />
            <small>{String(f.help_summary || "").length}/300</small>
          </label>
          <label className="mb-field" style={{ gridColumn: "1 / -1" }}><span>A real challenge you handled (not shown publicly)</span><textarea rows={3} maxLength={500} value={f.real_moment} onChange={set("real_moment")} /></label>
          <label className="mb-field" style={{ gridColumn: "1 / -1" }}><span>A common mistake you help people avoid</span><textarea rows={2} maxLength={200} value={f.common_mistake} onChange={set("common_mistake")} /></label>
        </div>
      </div>

      <div className="mb-panel">
        <h3>Work &amp; experience {reviewTag}</h3>
        <p>To keep mentors verified, changes here are checked by TConnects. Your current details stay live until then.</p>
        <div className="mb-grid-2">
          <div className="mb-field" style={{ gridColumn: "1 / -1" }}>
            <span>Employment status</span>
            <div className="mb-pills">
              <button type="button" className={`mb-pill${working ? " active" : ""}`} onClick={() => set("employment_status")("working")}>Currently working</button>
              <button type="button" className={`mb-pill${!working ? " active" : ""}`} onClick={() => set("employment_status")("not_working")}>Not working right now</button>
            </div>
          </div>
          {working && (
            <>
              <label className="mb-field"><span>Job title</span><input value={f.job_title} maxLength={120} onChange={set("job_title")} /></label>
              <label className="mb-field"><span>Company</span><input value={f.company_name} maxLength={120} onChange={set("company_name")} /></label>
              <label className="mb-field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <input type="checkbox" style={{ width: "auto" }} checked={Boolean(f.hide_company)} onChange={set("hide_company")} />
                <span>Keep my company name private</span>
              </label>
              {f.hide_company && <label className="mb-field"><span>Show this instead</span><input value={f.company_display_label} maxLength={80} onChange={set("company_display_label")} placeholder="e.g. Top 5 private bank" /></label>}
            </>
          )}
          <label className="mb-field"><span>Years of experience</span><input type="number" min="0" max="60" value={f.years_experience ?? ""} onChange={set("years_experience")} /></label>
          <label className="mb-field"><span>Highest qualification</span><input value={f.highest_qualification} maxLength={120} onChange={set("highest_qualification")} /></label>
          <label className="mb-field" style={{ gridColumn: "1 / -1" }}><span>Certifications (comma separated)</span><input value={f.certifications} onChange={set("certifications")} placeholder="FRM, PRM, CAMS" /></label>
          <div className="mb-field" style={{ gridColumn: "1 / -1" }}><span>Risk areas</span><PillSet label="Risk areas" options={opts.risk_areas} value={f.risk_areas || []} onChange={set("risk_areas")} /></div>
        </div>
      </div>

      <div className="mb-panel">
        <h3>Fee {reviewTag}</h3>
        <p>Session lengths, weekly hours and time zone are on the <b>Availability</b> tab.</p>
        <div className="mb-grid-2">
          <label className="mb-field">
            <span>Hourly rate (₹)</span>
            <input type="number" min="1" value={f.hourly_rate} onChange={set("hourly_rate")} />
            <small>Live rate: {inr(app.hourly_rate)}/hour · platform commission {Number(app.commission_pct)}%</small>
          </label>
        </div>
      </div>

      <div className="mb-actions" style={{ justifyContent: "flex-end" }}>
        <button className="mb-btn primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button>
      </div>
    </form>
  );
}

// ===========================================================================
// Earnings & payouts
// ===========================================================================
function EarningsTab() {
  const [acct, setAcct] = useState(undefined);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ kind: "vpa", account_holder_name: "", account_number: "", ifsc: "", vpa: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const payouts = usePaged((p) => mentorshipApi.listMentorPayouts(p), {}, "payouts");

  useEffect(() => {
    mentorshipApi.getPayoutAccount().then((d) => {
      setAcct(d.account);
      if (!d.account) setEditing(true);
    }).catch((e) => { setAcct(null); setError(apiError(e)); });
  }, []);

  const saveAccount = async (e) => {
    e.preventDefault();
    setError("");
    const p = { kind: form.kind, account_holder_name: form.account_holder_name.trim() };
    if (!p.account_holder_name) return setError("Enter the account holder's name.");
    if (form.kind === "bank_account") {
      p.account_number = form.account_number.replace(/\s/g, "");
      p.ifsc = form.ifsc.trim().toUpperCase();
      if (!/^\d{6,18}$/.test(p.account_number)) return setError("Enter a valid bank account number (6–18 digits).");
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(p.ifsc)) return setError("Enter a valid IFSC code, e.g. HDFC0001234.");
    } else {
      p.vpa = form.vpa.trim();
      if (!/^[\w.-]{2,64}@[A-Za-z]{2,32}$/.test(p.vpa)) return setError("Enter a valid UPI ID, e.g. name@okhdfcbank.");
    }
    setBusy(true);
    try {
      const d = await mentorshipApi.savePayoutAccount(p);
      setAcct(d.account);
      setEditing(false);
      setForm({ kind: "vpa", account_holder_name: "", account_number: "", ifsc: "", vpa: "" });
      toast.success("Payout details saved.");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="mb-panel">
        <h3>Payout account</h3>
        <p>Your share of each session is held until both you and your mentee swipe to confirm the session is completed, then released to this account by TConnects.</p>
        {error && <div className="mb-alert error">{error}</div>}
        {acct === undefined ? (
          <p className="mb-muted">Loading…</p>
        ) : acct && !editing ? (
          <div className="mb-card" style={{ gridTemplateColumns: "auto 1fr auto" }}>
            <div className="mb-avatar"><i className={`bi ${acct.kind === "vpa" ? "bi-phone" : "bi-bank"}`} /></div>
            <div className="mb-card-main">
              <h3>{acct.account_holder_name}</h3>
              <p>{acct.kind === "vpa" ? "UPI" : "Bank account"} · {acct.masked}{acct.ifsc ? ` · ${acct.ifsc}` : ""}</p>
              <p className="mb-muted">Updated {fmtDateTime(acct.updated_at)}</p>
            </div>
            <button className="mb-btn" onClick={() => setEditing(true)}>Change</button>
          </div>
        ) : (
          <form onSubmit={saveAccount} className="mb-grid-2">
            <div className="mb-field" style={{ gridColumn: "1 / -1" }}>
              <span>Receive payouts by</span>
              <div className="mb-pills">
                <button type="button" className={`mb-pill${form.kind === "vpa" ? " active" : ""}`} onClick={() => setForm({ ...form, kind: "vpa" })}>UPI ID</button>
                <button type="button" className={`mb-pill${form.kind === "bank_account" ? " active" : ""}`} onClick={() => setForm({ ...form, kind: "bank_account" })}>Bank account</button>
              </div>
            </div>
            <label className="mb-field">
              <span>Account holder name</span>
              <input value={form.account_holder_name} maxLength={200} onChange={(e) => setForm({ ...form, account_holder_name: e.target.value })} autoComplete="name" />
            </label>
            {form.kind === "vpa" ? (
              <label className="mb-field">
                <span>UPI ID</span>
                <input value={form.vpa} onChange={(e) => setForm({ ...form, vpa: e.target.value })} placeholder="name@okhdfcbank" autoComplete="off" />
              </label>
            ) : (
              <>
                <label className="mb-field">
                  <span>Account number</span>
                  <input inputMode="numeric" value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} autoComplete="off" />
                </label>
                <label className="mb-field">
                  <span>IFSC</span>
                  <input value={form.ifsc} onChange={(e) => setForm({ ...form, ifsc: e.target.value.toUpperCase() })} placeholder="HDFC0001234" autoComplete="off" />
                </label>
              </>
            )}
            <div className="mb-actions" style={{ gridColumn: "1 / -1", justifyContent: "flex-end" }}>
              {acct && <button type="button" className="mb-btn" onClick={() => setEditing(false)}>Cancel</button>}
              <button type="submit" className="mb-btn primary" disabled={busy}>{busy ? "Saving…" : "Save payout details"}</button>
            </div>
          </form>
        )}
      </div>

      <div className="mb-panel">
        <h3>Payout history</h3>
        <p>One payout per paid session.</p>
        {payouts.error && <div className="mb-alert error">{payouts.error}</div>}
        {payouts.loading ? (
          <p className="mb-muted">Loading…</p>
        ) : payouts.rows.length === 0 ? (
          <p className="mb-muted">No payouts yet. They appear here after your first paid booking.</p>
        ) : (
          <div className="mb-table-wrap">
            <table className="mb-table">
              <thead><tr><th>Booking</th><th className="mb-num">Amount</th><th>Status</th><th>Ready since</th><th>Paid</th><th>UTR / reference</th></tr></thead>
              <tbody>
                {payouts.rows.map((p) => (
                  <tr key={p.id}>
                    <td>{p.booking_reference}<small>Created {fmtDate(p.created_at)}</small></td>
                    <td className="mb-num"><b>{inr(p.amount)}</b></td>
                    <td><StatusBadge status={p.status} label={p.status_label} />{p.has_open_issue && <small>Paused: problem reported</small>}{p.failure_reason && <small>{p.failure_reason}</small>}</td>
                    <td>{fmtDate(p.eligible_at)}</td>
                    <td>{fmtDate(p.paid_at)}</td>
                    <td className="mb-mono">{p.utr || p.provider_ref || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination currentPage={payouts.page} totalPages={payouts.totalPages} onPageChange={payouts.setPage} />
      </div>
    </>
  );
}
