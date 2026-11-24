// Shared helpers for mentorship booking, My Mentorship, the mentor dashboard and the admin module.
import { mentorshipApi, apiError } from "../../../services/mentorshipApi";

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";
let razorpayPromise = null;

/** Load Razorpay Checkout once. Resolves true when window.Razorpay is ready. */
export function loadRazorpay() {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve(true);
  if (razorpayPromise) return razorpayPromise;
  razorpayPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SRC;
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => {
      razorpayPromise = null; // allow a retry later
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return razorpayPromise;
}

/**
 * Open Razorpay Checkout for a booking and verify the payment on the server.
 * Resolves with one of:
 *   { status: "confirmed", booking }
 *   { status: "refunding", booking, message }   paid, but the slot could not be kept: refund started
 *   { status: "dismissed" }                     the user closed the window (slot stays held until it expires)
 * Rejects with an Error whose message is safe to show.
 * Payment failures inside the window are recorded on the server; Razorpay lets the user retry there.
 */
export async function payWithRazorpay(checkout, { onFailure } = {}) {
  const ready = await loadRazorpay();
  if (!ready) throw new Error("Could not load the payment window. Check your connection and try again.");
  if (!checkout?.key_id || !checkout?.order_id) throw new Error("Payment is not available right now. Please try again shortly.");

  const bookingId = checkout.booking_id;

  return new Promise((resolve, reject) => {
    let settled = false;
    const done = (fn, value) => {
      if (settled) return;
      settled = true;
      fn(value);
    };

    const rzp = new window.Razorpay({
      key: checkout.key_id,
      order_id: checkout.order_id,
      amount: checkout.amount,
      currency: checkout.currency || "INR",
      name: checkout.name || "TConnects Mentorship",
      description: checkout.description || "Mentorship session",
      prefill: checkout.prefill || {},
      readonly: { email: true },
      notes: { booking_reference: checkout.reference || "" },
      theme: { color: "#0891b2" },
      retry: { enabled: true },
      handler: async (response) => {
        try {
          const result = await mentorshipApi.verifyPayment(bookingId, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          done(resolve, { status: "confirmed", booking: result.booking });
        } catch (err) {
          const data = err?.response?.data;
          if (err?.response?.status === 409 && data?.outcome === "refunding") {
            done(resolve, { status: "refunding", booking: data.booking, message: data.detail });
          } else {
            done(reject, new Error(
              apiError(err, "We could not confirm your payment yet. If money was deducted, it will be confirmed or refunded automatically.")
            ));
          }
        }
      },
      modal: {
        ondismiss: () => done(resolve, { status: "dismissed" }),
        confirm_close: true,
      },
    });

    rzp.on("payment.failed", (resp) => {
      const e = resp?.error || {};
      mentorshipApi
        .reportPaymentFailed(bookingId, {
          razorpay_order_id: e.metadata?.order_id || checkout.order_id,
          razorpay_payment_id: e.metadata?.payment_id || "",
          code: String(e.code || "").slice(0, 100),
          description: String(e.description || "").slice(0, 500),
        })
        .catch(() => {});
      if (onFailure) onFailure(e.description || "The payment did not go through. You can try again.");
    });

    rzp.open();
  });
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------
export const inr = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const fmtDate = (iso, opts = {}) => {
  if (!iso) return "—";
  const d = new Date(String(iso).length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", ...opts });
};

export const fmtDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export const browserZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
  } catch {
    return "Asia/Kolkata";
  }
};

/** "10:30" in the viewer's time zone for an ISO instant. */
export const localTime = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

/** Day, date and time of a booking, in the mentor's zone, plus the viewer's zone if it differs. */
export function sessionWhen(b) {
  if (!b) return { main: "—", alt: "" };
  const main = `${b.day || ""}, ${fmtDate(b.date)} · ${b.start_local}–${b.end_local}`;
  const zone = b.timezone || "Asia/Kolkata";
  const alt = zone !== browserZone() && b.start_at
    ? `${new Date(b.start_at).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} your time`
    : "";
  return { main, alt, zone };
}

export const ymd = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Calendar helpers
export const monthStart = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
export const monthEnd = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
export const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);

/** "Wednesday, 25 November 2026" for a YYYY-MM-DD value. */
export const longDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

export const listOf = (data) => (Array.isArray(data) ? data : data?.results || []);

// ---------------------------------------------------------------------------
// Status badges
// ---------------------------------------------------------------------------
export const REFUND_REASONS = {
  booker_cancelled: "Cancelled by the booker",
  mentor_cancelled: "Cancelled by the mentor",
  admin: "Issued by admin",
  slot_unavailable: "Slot no longer available",
  duplicate_payment: "Duplicate payment",
  amount_mismatch: "Paid amount did not match",
  issue: "Session problem",
};

export const myMentorshipPath = (role) =>
  role === "recruiter" ? "/recruiter-dashboard/my-mentorship" : "/candidate-dashboard/my-mentorship";

// Admin screens handle 401/403 themselves instead of redirecting to login.
export const ADMIN_CFG = { skipAuthRedirect: true };

export const isAuthError = (err) => err?.response?.status === 401;
export const isForbidden = (err) => err?.response?.status === 403;
