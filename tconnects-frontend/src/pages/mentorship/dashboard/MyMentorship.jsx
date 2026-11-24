// "My Mentorship" section, shared by the Candidate and Recruiter dashboards.
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { mentorshipApi, apiError } from "../../../services/mentorshipApi";
import Pagination from "../../../components/Pagination";
import usePaged from "../booking/usePaged";
import { REFUND_REASONS, fmtDate, fmtDateTime, inr, localTime, payWithRazorpay, sessionWhen } from "../booking/bookingUtils";
import StatusBadge from "../booking/StatusBadge";
import CompletionConfirm from "../booking/CompletionConfirm";
import "../mentorship.css";
import "../booking/booking.css";

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "pending_payment", label: "Awaiting payment" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
  { key: "", label: "All history" },
];

function Avatar({ mentor }) {
  return mentor?.photo_url ? (
    <img className="mb-avatar" src={mentor.photo_url} alt="" />
  ) : (
    <div className="mb-avatar">{(mentor?.full_name || "M").charAt(0)}</div>
  );
}

export default function MyMentorship() {
  const [tab, setTab] = useState("upcoming");
  const [openId, setOpenId] = useState(null);
  const closeDrawer = useCallback(() => setOpenId(null), []);

  const list = usePaged((p) => mentorshipApi.listMyBookings(p), { status: tab || undefined }, tab);

  return (
    <div className="mb-page">
      <div className="mb-page-head">
        <div>
          <span className="mb-kicker">Mentorship</span>
          <h1>My Mentorship</h1>
          <p>Your mentor sessions, payments and booking history.</p>
        </div>
        <Link className="mb-btn primary" to="/mentorship/mentors"><i className="bi bi-search" /> Find a mentor</Link>
      </div>

      <div className="mb-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key || "all"} role="tab" aria-selected={tab === t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {list.error && (
        <div className="mb-alert error" role="alert">
          <i className="bi bi-exclamation-circle" />
          <span>
            {list.errorStatus === 403 ? "Mentor bookings are available to candidate and recruiter accounts." : list.error}{" "}
            <button className="mb-link-btn" onClick={list.reload}>Try again</button>
          </span>
        </div>
      )}

      {list.loading ? (
        <p className="mb-muted" role="status">Loading your sessions…</p>
      ) : !list.error && list.rows.length === 0 ? (
        <div className="mb-empty">
          <i className="bi bi-calendar2-heart" />
          <h3>{tab === "upcoming" ? "No upcoming sessions" : "Nothing here yet"}</h3>
          <p>Book a session with a verified risk-management mentor.</p>
          <Link className="mb-btn primary" to="/mentorship/mentors">Browse mentors</Link>
        </div>
      ) : (
        <div className="mb-list">
          {list.rows.map((b) => {
            const when = sessionWhen(b);
            return (
              <div className="mb-card" key={b.id}>
                <Avatar mentor={b.mentor} />
                <div className="mb-card-main">
                  <h3>{b.mentor?.full_name}</h3>
                  <p>{[b.mentor?.job_title, b.mentor?.company].filter(Boolean).join(" · ")}</p>
                  <p><i className="bi bi-calendar-event" /> {when.main} <small>({when.zone})</small></p>
                  <div className="mb-card-meta">
                    <StatusBadge status={b.status} label={b.status_label} />
                    <StatusBadge status={b.payment?.status} label={`Payment: ${b.payment?.status_label || "—"}`} />
                    {b.status === "confirmed" && b.completion?.can_confirm && <span className="mb-badge tone-warning">Confirm completion</span>}
                    {b.status === "confirmed" && b.completion?.you_confirmed && !b.completion?.other_confirmed && <span className="mb-badge tone-info">Waiting for mentor</span>}
                    <span className="mb-muted">Ref {b.reference}</span>
                  </div>
                </div>
                <div className="mb-card-side">
                  <b>{inr(b.amount)}</b>
                  <button className="mb-btn" onClick={() => setOpenId(b.id)}>View details</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} />

      {openId && (
        <BookingDrawer
          id={openId}
          onClose={closeDrawer}
          onChanged={list.reload}
        />
      )}
    </div>
  );
}

function BookingDrawer({ id, onClose, onChanged }) {
  const [b, setB] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [mode, setMode] = useState(""); // cancel | issue
  const [text, setText] = useState("");

  useEffect(() => {
    let active = true;
    mentorshipApi.getMyBooking(id).then((d) => active && setB(d)).catch((e) => active && setError(apiError(e)));
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      active = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [id, onClose]);

  const refresh = (next) => {
    if (next) setB(next);
    onChanged();
  };

  const pay = async () => {
    setBusy("pay");
    setError("");
    try {
      const co = await mentorshipApi.reopenCheckout(b.id);
      const result = await payWithRazorpay(co, { onFailure: (m) => toast.error(m) });
      if (result.status === "confirmed") {
        toast.success("Payment successful. Your session is confirmed.");
        refresh(result.booking);
      } else if (result.status === "refunding") {
        toast(result.message || "Refund started.", { icon: "↩️" });
        refresh(result.booking);
      }
    } catch (e) {
      setError(e.message || apiError(e));
    } finally {
      setBusy("");
    }
  };

  const cancel = async () => {
    setBusy("cancel");
    setError("");
    try {
      const res = await mentorshipApi.cancelMyBooking(b.id, text.trim());
      toast.success(res.refund_started ? "Booking cancelled. Your refund has been started." : "Booking cancelled.");
      setMode("");
      setText("");
      refresh(res.booking);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy("");
    }
  };

  const report = async () => {
    if (text.trim().length < 10) return setError("Please describe the problem (at least 10 characters).");
    setBusy("issue");
    setError("");
    try {
      const res = await mentorshipApi.reportIssue(b.id, text.trim());
      toast.success("Thanks. Our team will look into it and email you.");
      setMode("");
      setText("");
      refresh(res.booking);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy("");
    }
  };

  const when = sessionWhen(b);
  const pay_ = b?.payment || {};

  return (
    <div className="mb-overlay mb-scope" onClick={onClose}>
      <aside className="mb-drawer" role="dialog" aria-modal="true" aria-label="Booking details" onClick={(e) => e.stopPropagation()}>
        <div className="mb-drawer-head">
          <div>
            <span className="mb-kicker">Booking {b?.reference}</span>
            <h2>{b ? `Session with ${b.mentor?.full_name}` : "Loading…"}</h2>
          </div>
          <button className="mb-close" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg" /></button>
        </div>

        {error && <div className="mb-alert error" role="alert">{error}</div>}
        {!b ? (
          !error && <p className="mb-muted">Loading booking…</p>
        ) : (
          <>
            <div className="mb-actions" style={{ marginBottom: 14 }}>
              <StatusBadge status={b.status} label={b.status_label} />
              {b.can_pay && (
                <button className="mb-btn primary" onClick={pay} disabled={!!busy}>
                  {busy === "pay" ? "Opening…" : `Pay ${inr(b.amount)}`}
                </button>
              )}
              {b.meeting_link && (
                <a className="mb-btn primary" href={b.meeting_link} target="_blank" rel="noreferrer"><i className="bi bi-camera-video" /> Join session</a>
              )}
              {b.mentor_email && (
                <a className="mb-btn" href={`mailto:${b.mentor_email}?subject=${encodeURIComponent(`Mentorship session ${b.reference}`)}`}><i className="bi bi-envelope" /> Email mentor</a>
              )}
              {b.can_cancel && <button className="mb-btn danger" onClick={() => { setMode("cancel"); setText(""); setError(""); }} disabled={!!busy}>Cancel booking</button>}
              {b.can_report_issue && <button className="mb-btn" onClick={() => { setMode("issue"); setText(""); setError(""); }} disabled={!!busy}>Report a problem</button>}
            </div>

            <CompletionConfirm
              booking={b}
              role="booker"
              onConfirm={async () => {
                setError("");
                try {
                  const res = await mentorshipApi.confirmCompletion(b.id);
                  refresh(res.booking);
                  toast.success(res.booking?.status === "completed"
                    ? "Both of you confirmed. Session completed."
                    : "Confirmed. Waiting for your mentor to confirm too.");
                } catch (e) {
                  setError(apiError(e));
                }
              }}
            />

            {b.can_pay && b.hold_expires_at && (
              <div className="mb-alert warn">
                <i className="bi bi-hourglass-split" />
                <span>This slot is held for you until <b>{localTime(b.hold_expires_at)}</b>. Complete the payment to confirm it.</span>
              </div>
            )}

            {mode === "cancel" && (
              <div className="mb-inline-form">
                <b>Cancel this booking?</b>
                <span className="mb-muted">
                  {b.status === "pending_payment"
                    ? "Nothing has been charged. The slot will be released."
                    : b.refund_on_cancel
                      ? `You are cancelling at least ${b.free_cancel_hours} hours before the session, so you get a full refund of ${inr(b.payment?.amount)}.`
                      : `The session starts in less than ${b.free_cancel_hours} hours, so this cancellation is not refundable.`}
                </span>
                <textarea rows={2} maxLength={500} value={text} onChange={(e) => setText(e.target.value)} placeholder="Reason (optional)" style={{ border: "1px solid #cfe3ea", borderRadius: 8, padding: 8, font: "inherit" }} />
                <div className="mb-actions">
                  <button className="mb-btn" onClick={() => setMode("")}>Keep booking</button>
                  <button className="mb-btn danger" onClick={cancel} disabled={busy === "cancel"}>{busy === "cancel" ? "Cancelling…" : "Yes, cancel"}</button>
                </div>
              </div>
            )}

            {mode === "issue" && (
              <div className="mb-inline-form">
                <b>What went wrong?</b>
                <span className="mb-muted">Tell us about the problem with this session. The mentor's payout is paused while we review it.</span>
                <textarea rows={3} maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. The mentor did not join the call." style={{ border: "1px solid #cfe3ea", borderRadius: 8, padding: 8, font: "inherit" }} />
                <div className="mb-actions">
                  <button className="mb-btn" onClick={() => setMode("")}>Back</button>
                  <button className="mb-btn primary" onClick={report} disabled={busy === "issue"}>{busy === "issue" ? "Sending…" : "Report problem"}</button>
                </div>
              </div>
            )}

            <section className="mb-section">
              <h4>Mentor</h4>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar mentor={b.mentor} />
                <div>
                  <b>{b.mentor?.full_name}</b>
                  <div className="mb-muted">{[b.mentor?.job_title, b.mentor?.company].filter(Boolean).join(" · ")}</div>
                  {b.mentor?.years_experience != null && <div className="mb-muted">{b.mentor.years_experience} years' experience</div>}
                </div>
              </div>
              {(b.mentor?.topics || []).length > 0 && (
                <div className="mb-pills" style={{ marginTop: 10 }}>
                  {b.mentor.topics.map((t) => <span key={t} className="mb-badge tone-muted">{t}</span>)}
                </div>
              )}
              <dl className="mb-kv" style={{ marginTop: 12 }}>
                <dt>Contact email</dt>
                <dd>{b.mentor_email ? <a href={`mailto:${b.mentor_email}`}>{b.mentor_email}</a> : <span className="mb-muted">Shown once the booking is paid</span>}</dd>
              </dl>
              {b.mentor?.slug && <Link className="mb-link-btn" to={`/mentorship/mentors/${b.mentor.slug}`}>View mentor profile <i className="bi bi-arrow-up-right" /></Link>}
            </section>

            <section className="mb-section">
              <h4>Session</h4>
              <dl className="mb-kv">
                <dt>Date</dt><dd>{fmtDate(b.date)}</dd>
                <dt>Day</dt><dd>{b.day}</dd>
                <dt>Time</dt><dd>{b.start_local}–{b.end_local} ({b.timezone}){when.alt && <><br /><small className="mb-muted">{when.alt}</small></>}</dd>
                <dt>Duration</dt><dd>{b.duration_minutes} minutes</dd>
                <dt>Meeting link</dt>
                <dd>{b.meeting_link ? <a href={b.meeting_link} target="_blank" rel="noreferrer">{b.meeting_link}</a> : <span className="mb-muted">{["confirmed"].includes(b.status) ? "Your mentor will share it before the session" : "—"}</span>}</dd>
              </dl>
            </section>

            <section className="mb-section">
              <h4>Your request</h4>
              <dl className="mb-kv">
                <dt>Name</dt><dd>{b.booker_name}</dd>
                <dt>Registered email</dt><dd>{b.booker_email}</dd>
                <dt>Booked on</dt><dd>{fmtDateTime(b.created_at)}</dd>
              </dl>
              <p className="mb-quote" style={{ marginTop: 10 }}>{b.note}</p>
            </section>

            <section className="mb-section">
              <h4>Payment</h4>
              <dl className="mb-kv">
                <dt>Amount</dt><dd><b>{inr(pay_.amount ?? b.amount)}</b> {pay_.currency || b.currency}</dd>
                <dt>Status</dt><dd><StatusBadge status={pay_.status} label={pay_.status_label} /></dd>
                <dt>Method</dt><dd>{pay_.method ? pay_.method.toUpperCase() : "—"}</dd>
                <dt>Transaction ID</dt><dd className="mb-mono">{pay_.transaction_id || "—"}</dd>
                <dt>Order ID</dt><dd className="mb-mono">{pay_.order_id || "—"}</dd>
                <dt>Paid on</dt><dd>{fmtDateTime(pay_.paid_at)}</dd>
                {Number(pay_.refunded_amount) > 0 && (<><dt>Refunded</dt><dd>{inr(pay_.refunded_amount)}</dd></>)}
                {pay_.failure_description && (<><dt>Last failure</dt><dd>{pay_.failure_description}</dd></>)}
              </dl>
              {(b.refunds || []).length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {b.refunds.map((r) => (
                    <div key={r.id} className="mb-alert info" style={{ marginBottom: 8 }}>
                      <i className="bi bi-arrow-counterclockwise" />
                      <span>
                        Refund of <b>{inr(r.amount)}</b> · <StatusBadge status={r.status} /> · {REFUND_REASONS[r.reason] || r.reason}
                        <br /><small>Started {fmtDateTime(r.created_at)}{r.processed_at ? ` · processed ${fmtDateTime(r.processed_at)}` : ""}{r.razorpay_refund_id ? ` · ${r.razorpay_refund_id}` : ""}</small>
                      </span>
                    </div>
                  ))}
                  <small className="mb-muted">Refunds usually reach your account in 5–7 working days.</small>
                </div>
              )}
            </section>

            {(b.status === "cancelled" || b.issue) && (
              <section className="mb-section">
                <h4>{b.issue ? "Reported problem" : "Cancellation"}</h4>
                {b.status === "cancelled" && (
                  <dl className="mb-kv">
                    <dt>Cancelled</dt><dd>{fmtDateTime(b.cancelled_at)} {b.cancelled_by_role ? `by ${b.cancelled_by_role}` : ""}</dd>
                    {b.cancel_reason && (<><dt>Reason</dt><dd>{b.cancel_reason}</dd></>)}
                  </dl>
                )}
                {b.issue && (
                  <dl className="mb-kv">
                    <dt>Reported</dt><dd>{fmtDateTime(b.issue.reported_at)}</dd>
                    <dt>Details</dt><dd>{b.issue.note}</dd>
                    <dt>Status</dt><dd>{b.issue.resolved_at ? `Resolved ${fmtDateTime(b.issue.resolved_at)}` : "Under review"}</dd>
                    {b.issue.resolution && (<><dt>Resolution</dt><dd>{b.issue.resolution}</dd></>)}
                  </dl>
                )}
              </section>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
