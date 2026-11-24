// Coloured status pill used across mentorship screens.
const TONES = {
  confirmed: "info", completed: "success", cancelled: "danger", expired: "muted", pending_payment: "warning",
  created: "warning", authorized: "info", captured: "success", failed: "danger", partially_refunded: "warning", refunded: "muted",
  pending: "warning", processed: "success",
  held: "muted", eligible: "info", processing: "warning", paid: "success",
  approved: "success", suspended: "danger",
};

export default function StatusBadge({ status, label }) {
  if (!status) return <span className="mb-badge tone-muted">—</span>;
  const text = label || String(status).replaceAll("_", " ").replace(/^./, (c) => c.toUpperCase());
  return <span className={`mb-badge tone-${TONES[status] || "muted"}`}>{text}</span>;
}

