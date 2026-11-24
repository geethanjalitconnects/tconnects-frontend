// Admin: mentorship bookings, payments, refunds, commission, mentor payouts and analytics.
import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { mentorshipApi, apiError } from "../../services/mentorshipApi";
import Pagination from "../../components/Pagination";
import usePaged from "../mentorship/booking/usePaged";
import { ADMIN_CFG, REFUND_REASONS, fmtDate, fmtDateTime, inr } from "../mentorship/booking/bookingUtils";
import StatusBadge from "../mentorship/booking/StatusBadge";
import { AdminGate, AdminNav } from "./AdminShell";
import "../mentorship/booking/booking.css";

const TABS = [
  { key: "overview", label: "Overview", icon: "bi-speedometer2" },
  { key: "bookings", label: "Bookings", icon: "bi-calendar-check" },
  { key: "payments", label: "Payments", icon: "bi-credit-card" },
  { key: "refunds", label: "Refunds", icon: "bi-arrow-counterclockwise" },
  { key: "payouts", label: "Mentor payouts", icon: "bi-wallet2" },
  { key: "mentors", label: "Mentors & commission", icon: "bi-people" },
];

const BOOKING_STATUSES = [["", "All statuses"], ["pending_payment", "Awaiting payment"], ["confirmed", "Confirmed"], ["completed", "Completed"], ["cancelled", "Cancelled"], ["expired", "Expired"]];
const PAYMENT_STATUSES = [["", "All payments"], ["created", "Awaiting payment"], ["authorized", "Authorized"], ["captured", "Paid"], ["failed", "Failed"], ["partially_refunded", "Partially refunded"], ["refunded", "Refunded"]];
const PAYOUT_STATUSES = [["", "All payouts"], ["held", "Held"], ["eligible", "Ready to release"], ["processing", "In progress"], ["paid", "Paid"], ["failed", "Failed"], ["cancelled", "Cancelled"]];
const REFUND_STATUSES = [["", "All refunds"], ["pending", "Pending"], ["processed", "Processed"], ["failed", "Failed"]];

const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== "" && v != null && v !== false));

export default function MentorshipAdmin() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.key === params.get("tab")) ? params.get("tab") : "overview";
  const [gate, setGate] = useState(null);
  const onAuth = useCallback((status) => (status === 401 || status === 403) && setGate(status), []);

  return (
    <main className="mb-admin-page">
      <div className="mb-page">
        <AdminNav />
        {gate ? (
          <AdminGate status={gate} />
        ) : (
          <>
            <div className="mb-page-head">
              <div>
                <span className="mb-kicker">TConnects admin</span>
                <h1>Mentorship</h1>
                <p>Bookings, Razorpay payments, refunds, platform commission and mentor payouts.</p>
              </div>
            </div>
            <div className="mb-tabs" role="tablist">
              {TABS.map((t) => (
                <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? "active" : ""} onClick={() => setParams({ tab: t.key })}>
                  <i className={`bi ${t.icon}`} /> {t.label}
                </button>
              ))}
            </div>
            {tab === "overview" && <Overview onAuth={onAuth} />}
            {tab === "bookings" && <Bookings onAuth={onAuth} />}
            {tab === "payments" && <Payments onAuth={onAuth} />}
            {tab === "refunds" && <Refunds onAuth={onAuth} />}
            {tab === "payouts" && <Payouts onAuth={onAuth} />}
            {tab === "mentors" && <Mentors onAuth={onAuth} />}
          </>
        )}
      </div>
    </main>
  );
}

function useAuthWatch(list, onAuth) {
  useEffect(() => {
    if (list.errorStatus) onAuth(list.errorStatus);
  }, [list.errorStatus, onAuth]);
}

function ErrorRow({ list }) {
  if (!list.error || [401, 403].includes(list.errorStatus)) return null;
  return <div className="mb-alert error">{list.error} <button className="mb-link-btn" onClick={list.reload}>Retry</button></div>;
}

// ===========================================================================
// Overview / analytics
// ===========================================================================
function Overview({ onAuth }) {
  const [days, setDays] = useState(30);
  const [d, setD] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    mentorshipApi.adminAnalytics({ days }, ADMIN_CFG).then((x) => { if (active) { setD(x); setError(""); } }).catch((e) => {
      if (!active) return;
      onAuth(e?.response?.status);
      setError(apiError(e));
    });
    return () => { active = false; };
  }, [days, onAuth]);

  return (
    <>
      <div className="mb-toolbar">
        <select value={days} onChange={(e) => { setD(null); setError(""); setDays(Number(e.target.value)); }} aria-label="Date range">
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last 12 months</option>
        </select>
        {d && <span className="mb-muted" style={{ alignSelf: "center" }}>{fmtDate(d.range.from)} – {fmtDate(d.range.to)}</span>}
      </div>
      {error && <div className="mb-alert error">{error}</div>}
      {!d ? (!error && <p className="mb-muted">Loading analytics…</p>) : (
        <>
          <div className="mb-stats">
            <div className="mb-stat"><span>Gross collected</span><b>{inr(d.payments.gross)}</b><small>{d.payments.count} payments</small></div>
            <div className="mb-stat"><span>Refunded</span><b>{inr(d.payments.refunded)}</b></div>
            <div className="mb-stat"><span>Net</span><b>{inr(d.payments.net)}</b></div>
            <div className="mb-stat"><span>Commission collected</span><b>{inr(d.commission.collected)}</b><small>Excludes fully refunded</small></div>
            <div className="mb-stat"><span>Commission earned</span><b>{inr(d.commission.earned_on_completed_sessions)}</b><small>On completed sessions</small></div>
            <div className="mb-stat"><span>Open problems</span><b style={{ color: d.open_issues ? "#b03a3a" : undefined }}>{d.open_issues}</b></div>
            <div className="mb-stat"><span>Failed refunds</span><b style={{ color: d.failed_refunds ? "#b03a3a" : undefined }}>{d.failed_refunds}</b></div>
          </div>

          <div className="mb-grid-2" style={{ alignItems: "start" }}>
            <div className="mb-panel">
              <h3>Bookings created</h3>
              <dl className="mb-kv">
                {Object.entries(d.bookings).map(([k, v]) => (<div key={k} style={{ display: "contents" }}><dt><StatusBadge status={k} /></dt><dd><b>{v}</b></dd></div>))}
              </dl>
            </div>
            <div className="mb-panel">
              <h3>Mentor payouts (all time)</h3>
              <dl className="mb-kv">
                {Object.entries(d.payouts).map(([k, v]) => (<div key={k} style={{ display: "contents" }}><dt><StatusBadge status={k} /></dt><dd><b>{inr(v)}</b></dd></div>))}
              </dl>
            </div>
          </div>

          <div className="mb-grid-2" style={{ alignItems: "start" }}>
            <div className="mb-panel">
              <h3>Daily revenue</h3>
              {d.daily.length === 0 ? <p className="mb-muted">No payments in this period.</p> : (
                <div className="mb-table-wrap">
                  <table className="mb-table" style={{ minWidth: 0 }}>
                    <thead><tr><th>Date</th><th className="mb-num">Payments</th><th className="mb-num">Gross</th><th className="mb-num">Commission</th></tr></thead>
                    <tbody>{[...d.daily].reverse().map((r) => (<tr key={r.date}><td>{fmtDate(r.date)}</td><td className="mb-num">{r.payments}</td><td className="mb-num">{inr(r.gross)}</td><td className="mb-num">{inr(r.commission)}</td></tr>))}</tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="mb-panel">
              <h3>Top mentors</h3>
              {d.top_mentors.length === 0 ? <p className="mb-muted">No completed sessions in this period.</p> : (
                <div className="mb-table-wrap">
                  <table className="mb-table" style={{ minWidth: 0 }}>
                    <thead><tr><th>Mentor</th><th className="mb-num">Sessions</th><th className="mb-num">Revenue</th></tr></thead>
                    <tbody>{d.top_mentors.map((r) => (<tr key={r.mentor_id}><td>{r.name}</td><td className="mb-num">{r.sessions}</td><td className="mb-num">{inr(r.revenue)}</td></tr>))}</tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ===========================================================================
// Bookings
// ===========================================================================
function Bookings({ onAuth }) {
  const [f, setF] = useState({ q: "", status: "", payment_status: "", role: "", has_issue: false, date_from: "", date_to: "" });
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState(null);
  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    const t = setTimeout(() => setF((x) => ({ ...x, q })), 350);
    return () => clearTimeout(t);
  }, [q]);

  const params = clean({ ...f, has_issue: f.has_issue ? "true" : "" });
  const list = usePaged((p) => mentorshipApi.adminBookings(p, ADMIN_CFG), params, JSON.stringify(params));
  useAuthWatch(list, onAuth);

  return (
    <>
      <div className="mb-toolbar">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Reference, booker, mentor, Razorpay ID…" aria-label="Search bookings" />
        <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} aria-label="Booking status">{BOOKING_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <select value={f.payment_status} onChange={(e) => setF({ ...f, payment_status: e.target.value })} aria-label="Payment status">{PAYMENT_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} aria-label="Booked by"><option value="">Candidates &amp; recruiters</option><option value="candidate">Candidates</option><option value="recruiter">Recruiters</option></select>
        <input type="date" value={f.date_from} onChange={(e) => setF({ ...f, date_from: e.target.value })} aria-label="Session from" />
        <input type="date" value={f.date_to} onChange={(e) => setF({ ...f, date_to: e.target.value })} aria-label="Session to" />
        <label className="mb-pill" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <input type="checkbox" checked={f.has_issue} onChange={(e) => setF({ ...f, has_issue: e.target.checked })} /> Open problems
        </label>
      </div>
      <ErrorRow list={list} />
      <div className="mb-table-wrap">
        <table className="mb-table">
          <thead><tr><th>Booking</th><th>Session</th><th>Booker</th><th>Mentor</th><th className="mb-num">Amount</th><th className="mb-num">Commission</th><th>Status</th><th>Payout</th></tr></thead>
          <tbody>
            {list.loading ? <tr><td colSpan={8} className="mb-muted">Loading…</td></tr> : list.rows.length === 0 ? <tr><td colSpan={8} className="mb-muted">No bookings match these filters.</td></tr> : list.rows.map((b) => (
              <tr key={b.id} className="clickable" onClick={() => setOpenId(b.id)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setOpenId(b.id)}>
                <td><b>{b.reference}</b><small>{fmtDate(b.created_at)}</small></td>
                <td>{b.day?.slice(0, 3)}, {fmtDate(b.date)}<small>{b.start_local}–{b.end_local} · {b.duration_minutes}m</small></td>
                <td>{b.booker?.name}<small>{b.booker?.email} · {b.booker?.role}</small></td>
                <td>{b.mentor?.full_name}<small>{b.mentor?.email}</small></td>
                <td className="mb-num">{inr(b.amount)}</td>
                <td className="mb-num">{inr(b.commission)}<small>{Number(b.commission_pct)}%</small></td>
                <td><StatusBadge status={b.status} label={b.status_label} /><small><StatusBadge status={b.payment?.status} label={b.payment?.status_label} /></small>{b.issue && !b.issue.resolved_at && <small><span className="mb-badge tone-danger">Problem</span></small>}</td>
                <td>{b.payout ? <StatusBadge status={b.payout.status} label={b.payout.status_label} /> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mb-muted" style={{ marginTop: 8 }}>{list.count} booking{list.count === 1 ? "" : "s"}</p>
      <Pagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} />
      {openId && <AdminBookingDrawer id={openId} onClose={close} onChanged={list.reload} />}
    </>
  );
}

function AdminBookingDrawer({ id, onClose, onChanged }) {
  const [b, setB] = useState(null);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ reason: "", refund: true, amount: "", note: "", resolution: "" });

  useEffect(() => {
    let active = true;
    mentorshipApi.adminBooking(id, ADMIN_CFG).then((d) => active && setB(d)).catch((e) => active && setError(apiError(e)));
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { active = false; window.removeEventListener("keydown", onKey); };
  }, [id, onClose]);

  const open = (m, defaults = {}) => {
    setMode(m);
    setError("");
    setForm({ reason: "", refund: true, amount: "", note: "", resolution: "", ...defaults });
  };

  const run = async (action, payload, ok) => {
    setBusy(true);
    setError("");
    try {
      const next = await mentorshipApi.adminBookingAction(b.id, action, payload, ADMIN_CFG);
      setB(next);
      setMode("");
      onChanged();
      toast.success(ok);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy(false);
    }
  };

  const paid = b && ["captured", "partially_refunded"].includes(b.payment?.status);
  const refundable = b ? Math.max(0, Number(b.payment?.amount || 0) - Number(b.payment?.refunded_amount || 0)) : 0;
  const openIssue = b?.issue && !b.issue.resolved_at;

  return (
    <div className="mb-overlay mb-scope" onClick={onClose}>
      <aside className="mb-drawer" role="dialog" aria-modal="true" aria-label="Booking" onClick={(e) => e.stopPropagation()}>
        <div className="mb-drawer-head">
          <div>
            <span className="mb-kicker">Booking {b?.reference}</span>
            <h2>{b ? `${b.booker.name} → ${b.mentor.full_name}` : "Loading…"}</h2>
          </div>
          <button className="mb-close" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg" /></button>
        </div>
        {error && <div className="mb-alert error" role="alert">{error}</div>}
        {b && (
          <>
            <div className="mb-actions" style={{ marginBottom: 12 }}>
              <StatusBadge status={b.status} label={b.status_label} />
              {b.status === "confirmed" && <button className="mb-btn primary" disabled={busy} onClick={() => run("complete", {}, "Marked completed. Payout is now ready to release.")}>Mark completed</button>}
              {["confirmed", "pending_payment"].includes(b.status) && <button className="mb-btn danger" disabled={busy} onClick={() => open("cancel")}>Cancel booking</button>}
              {paid && refundable > 0 && <button className="mb-btn" disabled={busy} onClick={() => open("refund")}>Refund</button>}
              {openIssue && <button className="mb-btn" disabled={busy} onClick={() => open("resolve", { refund: false })}>Resolve problem</button>}
            </div>

            {mode === "cancel" && (
              <div className="mb-inline-form">
                <b>Cancel as TConnects support</b>
                <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason (shown to booker and mentor)" style={{ border: "1px solid #cfe3ea", borderRadius: 8, padding: 8 }} />
                {paid && <label><input type="checkbox" checked={form.refund} onChange={(e) => setForm({ ...form, refund: e.target.checked })} /> Refund the booker in full ({inr(refundable)})</label>}
                <div className="mb-actions"><button className="mb-btn" onClick={() => setMode("")}>Back</button><button className="mb-btn danger" disabled={busy} onClick={() => run("cancel", { reason: form.reason || "Cancelled by TConnects support", refund: form.refund }, "Booking cancelled.")}>{busy ? "Working…" : "Cancel booking"}</button></div>
              </div>
            )}
            {mode === "refund" && (
              <div className="mb-inline-form">
                <b>Refund through Razorpay</b>
                <span className="mb-muted">Leave the amount empty for a full refund of the remaining {inr(refundable)}.</span>
                <input type="number" min="1" max={refundable} step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder={`Amount in ₹ (max ${refundable})`} style={{ border: "1px solid #cfe3ea", borderRadius: 8, padding: 8 }} />
                <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Internal note" style={{ border: "1px solid #cfe3ea", borderRadius: 8, padding: 8 }} />
                <div className="mb-actions"><button className="mb-btn" onClick={() => setMode("")}>Back</button><button className="mb-btn primary" disabled={busy} onClick={() => run("refund", { amount: form.amount === "" ? null : Number(form.amount), note: form.note }, "Refund started.")}>{busy ? "Working…" : "Issue refund"}</button></div>
              </div>
            )}
            {mode === "resolve" && (
              <div className="mb-inline-form">
                <b>Resolve the reported problem</b>
                <textarea rows={2} value={form.resolution} onChange={(e) => setForm({ ...form, resolution: e.target.value })} placeholder="Resolution (shown to the booker)" style={{ border: "1px solid #cfe3ea", borderRadius: 8, padding: 8, font: "inherit" }} />
                <label><input type="checkbox" checked={form.refund} onChange={(e) => setForm({ ...form, refund: e.target.checked })} /> Refund the booker (mentor payout is cancelled)</label>
                <div className="mb-actions"><button className="mb-btn" onClick={() => setMode("")}>Back</button><button className="mb-btn primary" disabled={busy} onClick={() => run("resolve-issue", { resolution: form.resolution, refund: form.refund }, "Problem resolved.")}>{busy ? "Working…" : "Resolve"}</button></div>
              </div>
            )}

            {b.issue && (
              <div className={`mb-alert ${openIssue ? "error" : "info"}`} style={{ marginTop: 12 }}>
                <i className="bi bi-flag" />
                <span><b>{openIssue ? "Open problem" : "Resolved problem"}</b> · reported {fmtDateTime(b.issue.reported_at)}<br />{b.issue.note}{b.issue.resolution && <><br /><small>Resolution: {b.issue.resolution}</small></>}</span>
              </div>
            )}

            <section className="mb-section">
              <h4>Session</h4>
              <dl className="mb-kv">
                <dt>When</dt><dd>{b.day}, {fmtDate(b.date)} · {b.start_local}–{b.end_local} ({b.timezone})</dd>
                <dt>Duration</dt><dd>{b.duration_minutes} minutes</dd>
                <dt>Meeting link</dt><dd>{b.meeting_link || "—"}</dd>
                <dt>Created</dt><dd>{fmtDateTime(b.created_at)}</dd>
                <dt>Confirmed</dt><dd>{fmtDateTime(b.confirmed_at)}</dd>
                <dt>Completed</dt><dd>{fmtDateTime(b.completed_at)}</dd>
                {b.cancelled_at && (<><dt>Cancelled</dt><dd>{fmtDateTime(b.cancelled_at)} by {b.cancelled_by_role}{b.cancel_reason ? ` · ${b.cancel_reason}` : ""}</dd></>)}
              </dl>
            </section>
            <section className="mb-section">
              <h4>People</h4>
              <dl className="mb-kv">
                <dt>Booker</dt><dd>{b.booker.name} · <a href={`mailto:${b.booker.email}`}>{b.booker.email}</a> · {b.booker.role}</dd>
                <dt>Mentor</dt><dd>{b.mentor.full_name} · <a href={`mailto:${b.mentor.email}`}>{b.mentor.email}</a>{b.mentor.slug && <> · <Link to={`/mentorship/mentors/${b.mentor.slug}`} target="_blank">profile</Link></>}</dd>
              </dl>
              <p className="mb-quote" style={{ marginTop: 10 }}>{b.note}</p>
            </section>
            <section className="mb-section">
              <h4>Money</h4>
              <dl className="mb-kv">
                <dt>Fee paid</dt><dd><b>{inr(b.amount)}</b></dd>
                <dt>Commission</dt><dd>{inr(b.commission)} ({Number(b.commission_pct)}%)</dd>
                <dt>Mentor share</dt><dd>{inr(b.mentor_amount)}</dd>
                <dt>Payment</dt><dd><StatusBadge status={b.payment.status} label={b.payment.status_label} /> {b.payment.method && `· ${b.payment.method.toUpperCase()}`}</dd>
                <dt>Payment ID</dt><dd className="mb-mono">{b.payment.transaction_id || "—"}</dd>
                <dt>Order ID</dt><dd className="mb-mono">{b.payment.order_id || "—"}</dd>
                <dt>Paid at</dt><dd>{fmtDateTime(b.payment.paid_at)}</dd>
                <dt>Refunded</dt><dd>{inr(b.payment.refunded_amount)}</dd>
                {b.payment.failure_count > 0 && (<><dt>Failed attempts</dt><dd>{b.payment.failure_count} · {b.payment.failure_code} {b.payment.failure_description}</dd></>)}
                <dt>Payout</dt><dd>{b.payout ? <><StatusBadge status={b.payout.status} label={b.payout.status_label} /> {inr(b.payout.amount)}{b.payout.utr ? ` · UTR ${b.payout.utr}` : ""}</> : "—"}</dd>
              </dl>
              {(b.refunds || []).map((r) => (
                <div key={r.id} className="mb-alert info" style={{ marginTop: 8 }}>
                  <i className="bi bi-arrow-counterclockwise" />
                  <span>{inr(r.amount)} · <StatusBadge status={r.status} /> · {REFUND_REASONS[r.reason] || r.reason}<br /><small className="mb-mono">{r.razorpay_refund_id || "not yet created"} · {fmtDateTime(r.created_at)}</small></span>
                </div>
              ))}
            </section>
          </>
        )}
        {!b && !error && <p className="mb-muted">Loading…</p>}
      </aside>
    </div>
  );
}

// ===========================================================================
// Payments
// ===========================================================================
function Payments({ onAuth }) {
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  useEffect(() => { const t = setTimeout(() => setQuery(q), 350); return () => clearTimeout(t); }, [q]);
  const params = clean({ status, q: query });
  const list = usePaged((p) => mentorshipApi.adminPayments(p, ADMIN_CFG), params, JSON.stringify(params));
  useAuthWatch(list, onAuth);

  return (
    <>
      <div className="mb-toolbar">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Payment / order ID, booking ref, booker email" aria-label="Search payments" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Payment status">{PAYMENT_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </div>
      <ErrorRow list={list} />
      <div className="mb-table-wrap">
        <table className="mb-table">
          <thead><tr><th>Created</th><th>Booking</th><th>Razorpay IDs</th><th className="mb-num">Amount</th><th className="mb-num">Commission</th><th className="mb-num">Mentor share</th><th className="mb-num">Refunded</th><th>Status</th></tr></thead>
          <tbody>
            {list.loading ? <tr><td colSpan={8} className="mb-muted">Loading…</td></tr> : list.rows.length === 0 ? <tr><td colSpan={8} className="mb-muted">No payments found.</td></tr> : list.rows.map((p) => (
              <tr key={p.id}>
                <td>{fmtDateTime(p.created_at)}<small>Paid {fmtDateTime(p.paid_at)}</small></td>
                <td>{p.booking_reference}<small>{p.booker_email} → {p.mentor}</small></td>
                <td className="mb-mono">{p.transaction_id || "—"}<small>{p.order_id}</small></td>
                <td className="mb-num">{inr(p.amount)}</td>
                <td className="mb-num">{inr(p.commission)}</td>
                <td className="mb-num">{inr(p.mentor_amount)}</td>
                <td className="mb-num">{inr(p.refunded_amount)}</td>
                <td><StatusBadge status={p.status} label={p.status_label} />{p.method && <small>{p.method.toUpperCase()}</small>}{p.failure_count > 0 && <small>{p.failure_count} failed attempt{p.failure_count > 1 ? "s" : ""}</small>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} />
    </>
  );
}

// ===========================================================================
// Refunds
// ===========================================================================
function Refunds({ onAuth }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(null);
  const params = clean({ status });
  const list = usePaged((p) => mentorshipApi.adminRefunds(p, ADMIN_CFG), params, JSON.stringify(params));
  useAuthWatch(list, onAuth);

  const retry = async (id) => {
    setBusy(id);
    try {
      const r = await mentorshipApi.adminRetryRefund(id, ADMIN_CFG);
      if (r.status === "failed") toast.error(r.error || "The refund failed again.");
      else toast.success("Refund sent to Razorpay.");
      list.reload();
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="mb-toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Refund status">{REFUND_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </div>
      <ErrorRow list={list} />
      <div className="mb-table-wrap">
        <table className="mb-table">
          <thead><tr><th>Created</th><th>Booking</th><th className="mb-num">Amount</th><th>Reason</th><th>Razorpay</th><th>Status</th><th /></tr></thead>
          <tbody>
            {list.loading ? <tr><td colSpan={7} className="mb-muted">Loading…</td></tr> : list.rows.length === 0 ? <tr><td colSpan={7} className="mb-muted">No refunds.</td></tr> : list.rows.map((r) => (
              <tr key={r.id}>
                <td>{fmtDateTime(r.created_at)}<small>{r.processed_at ? `Processed ${fmtDateTime(r.processed_at)}` : ""}</small></td>
                <td>{r.booking_reference}</td>
                <td className="mb-num">{inr(r.amount)}</td>
                <td>{REFUND_REASONS[r.reason] || r.reason}{r.note && <small>{r.note}</small>}</td>
                <td className="mb-mono">{r.razorpay_refund_id || "—"}<small>{r.razorpay_payment_id}</small></td>
                <td><StatusBadge status={r.status} />{r.error && <small style={{ color: "#b03a3a" }}>{r.error}</small>}</td>
                <td>{r.status !== "processed" && <button className="mb-btn" disabled={busy === r.id} onClick={() => retry(r.id)}>{busy === r.id ? "Retrying…" : "Retry"}</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} />
    </>
  );
}

// ===========================================================================
// Mentor payouts
// ===========================================================================
function Payouts({ onAuth }) {
  const [status, setStatus] = useState("eligible");
  const [releasing, setReleasing] = useState(null);
  const [utr, setUtr] = useState("");
  const [busy, setBusy] = useState(false);
  const params = clean({ status });
  const list = usePaged((p) => mentorshipApi.adminPayouts(p, ADMIN_CFG), params, JSON.stringify(params));
  useAuthWatch(list, onAuth);
  const totals = list.extra?.totals || {};

  const release = async (p) => {
    const manual = !p.provider || p.provider === "manual";
    if (manual && !utr.trim()) return toast.error("Enter the bank/UPI reference (UTR) of the transfer you made.");
    setBusy(true);
    try {
      const r = await mentorshipApi.adminReleasePayout(p.id, utr.trim(), ADMIN_CFG);
      toast.success(r.status === "paid" ? "Payout recorded as paid." : `Payout ${r.status_label?.toLowerCase() || r.status}.`);
      setReleasing(null);
      setUtr("");
      list.reload();
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="mb-stats">
        {PAYOUT_STATUSES.slice(1).map(([k, l]) => (
          <button key={k} type="button" className="mb-stat" style={{ textAlign: "left", cursor: "pointer", outline: status === k ? "2px solid #0891b2" : "none" }} onClick={() => setStatus(k)}>
            <span>{l}</span><b>{inr(totals[k])}</b>
          </button>
        ))}
      </div>
      <div className="mb-toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Payout status">{PAYOUT_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </div>
      <div className="mb-alert info"><i className="bi bi-info-circle" /><span>Payouts stay <b>held</b> until the session is completed, then become <b>ready to release</b>. In manual mode, pay the mentor by bank/UPI and enter the UTR here. A payout cannot be released while a problem is open or after a refund.</span></div>
      <ErrorRow list={list} />
      <div className="mb-table-wrap">
        <table className="mb-table">
          <thead><tr><th>Mentor</th><th>Booking</th><th className="mb-num">Amount</th><th>Pay to</th><th>Status</th><th>Dates</th><th /></tr></thead>
          <tbody>
            {list.loading ? <tr><td colSpan={7} className="mb-muted">Loading…</td></tr> : list.rows.length === 0 ? <tr><td colSpan={7} className="mb-muted">No payouts in this list.</td></tr> : list.rows.map((p) => (
              <tr key={p.id}>
                <td>{p.mentor.name}<small>{p.mentor.email}</small></td>
                <td>{p.booking_reference}</td>
                <td className="mb-num"><b>{inr(p.amount)}</b></td>
                <td>{p.payout_account ? (p.payout_account.kind === "vpa"
                  ? <span className="mb-mono">UPI {p.payout_account.vpa}</span>
                  : <span className="mb-mono">{p.payout_account.account_number} · {p.payout_account.ifsc}</span>) : <span className="mb-badge tone-warning">No account added</span>}
                  {p.payout_account && <small>{p.payout_account.account_holder_name}</small>}
                </td>
                <td><StatusBadge status={p.status} label={p.status_label} />{p.has_open_issue && <small><span className="mb-badge tone-danger">Problem open</span></small>}{p.failure_reason && <small style={{ color: "#b03a3a" }}>{p.failure_reason}</small>}{p.utr && <small className="mb-mono">UTR {p.utr}</small>}</td>
                <td><small>Ready {fmtDate(p.eligible_at)}</small><small>Paid {fmtDate(p.paid_at)}</small></td>
                <td>
                  {["eligible", "failed"].includes(p.status) && !p.has_open_issue && (
                    releasing === p.id ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 180 }}>
                        {(!p.provider || p.provider === "manual") && <input value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="UTR / reference" style={{ border: "1px solid #cfe3ea", borderRadius: 8, padding: 6 }} />}
                        <div className="mb-actions"><button className="mb-btn" onClick={() => setReleasing(null)}>Cancel</button><button className="mb-btn primary" disabled={busy} onClick={() => release(p)}>{busy ? "…" : "Confirm"}</button></div>
                      </div>
                    ) : (
                      <button className="mb-btn primary" onClick={() => { setReleasing(p.id); setUtr(""); }}>{p.status === "failed" ? "Retry" : "Release"}</button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} />
    </>
  );
}

// ===========================================================================
// Mentors & commission
// ===========================================================================
function Mentors({ onAuth }) {
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [edit, setEdit] = useState({});
  const [busy, setBusy] = useState(null);
  useEffect(() => { const t = setTimeout(() => setQuery(q), 350); return () => clearTimeout(t); }, [q]);
  const params = clean({ q: query });
  const list = usePaged((p) => mentorshipApi.adminMentors(p, ADMIN_CFG), params, JSON.stringify(params));
  useAuthWatch(list, onAuth);

  const save = async (m) => {
    const v = Number(edit[m.id]);
    if (!Number.isFinite(v) || v < 0 || v > 100) return toast.error("Commission must be between 0 and 100.");
    setBusy(m.id);
    try {
      const r = await mentorshipApi.adminSetCommission(m.id, v, ADMIN_CFG);
      toast.success(r.note || "Commission updated.");
      setEdit((e) => { const n = { ...e }; delete n[m.id]; return n; });
      list.reload();
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="mb-toolbar">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search mentor name or email" aria-label="Search mentors" />
      </div>
      <ErrorRow list={list} />
      <div className="mb-table-wrap">
        <table className="mb-table">
          <thead><tr><th>Mentor</th><th>Status</th><th className="mb-num">Rate / hr</th><th>Commission</th><th className="mb-num">Upcoming</th><th className="mb-num">Completed</th><th className="mb-num">Paid out</th><th /></tr></thead>
          <tbody>
            {list.loading ? <tr><td colSpan={8} className="mb-muted">Loading…</td></tr> : list.rows.length === 0 ? <tr><td colSpan={8} className="mb-muted">No live mentors.</td></tr> : list.rows.map((m) => (
              <tr key={m.id}>
                <td>{m.full_name || "—"}<small>{m.email}</small></td>
                <td><StatusBadge status={m.status} /></td>
                <td className="mb-num">{inr(m.hourly_rate)}</td>
                <td>
                  {edit[m.id] !== undefined ? (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input type="number" min="0" max="100" step="0.5" value={edit[m.id]} onChange={(e) => setEdit({ ...edit, [m.id]: e.target.value })} style={{ width: 80, border: "1px solid #cfe3ea", borderRadius: 8, padding: 6 }} />%
                      <button className="mb-btn primary" disabled={busy === m.id} onClick={() => save(m)}>Save</button>
                      <button className="mb-btn" onClick={() => setEdit((e) => { const n = { ...e }; delete n[m.id]; return n; })}>×</button>
                    </div>
                  ) : (
                    <button className="mb-link-btn" onClick={() => setEdit({ ...edit, [m.id]: Number(m.commission_pct) })}>{Number(m.commission_pct)}% <i className="bi bi-pencil" /></button>
                  )}
                </td>
                <td className="mb-num">{m.upcoming_sessions}</td>
                <td className="mb-num">{m.completed_sessions}</td>
                <td className="mb-num">{inr(m.paid_out)}</td>
                <td><div className="mb-actions"><Link className="mb-btn" to={`/admin-dashboard/mentors/${m.id}`}>Review</Link>{m.slug && <Link className="mb-btn" to={`/mentorship/mentors/${m.slug}`} target="_blank">Profile</Link>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mb-muted" style={{ marginTop: 8 }}>Commission changes apply to new bookings only.</p>
      <Pagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} />
    </>
  );
}
