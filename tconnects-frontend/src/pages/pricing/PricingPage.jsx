/**
 * PricingPage.jsx  — v2 (white premium layout, logo colours)
 * ---------------------------------------------------------
 * Unified pricing page for TConnects.
 * - One-time: Resume (₹99), Mock Interview (₹3499)
 * - Subscriptions: Monthly / 3-Month / Yearly
 * - Secure 3-step Razorpay flow (UNCHANGED):
 *     1. POST /api/payments/create-order/  → get order_id + key_id from backend
 *     2. Open Razorpay popup with order_id
 *     3. POST /api/payments/verify/        → backend verifies HMAC signature → writes DB
 *
 * Only the layout, icons and class names changed. All classes start with "pr-".
 */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useAccessStatus from "../../hooks/useAccessStatus";
import api from "../../config/api";
import "./PricingPage.css";

// ── Icons (same line style as the jobs pages) ─────────────────────────────────
const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">{children}</svg>
);
const IconFile = () => (<Icon><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Icon>);
const IconMic = () => (<Icon><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></Icon>);
const IconCalendar = () => (<Icon><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Icon>);
const IconZap = () => (<Icon><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></Icon>);
const IconCrown = () => (<Icon><path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5z" /></Icon>);
const IconCheck = () => (<Icon><path d="m5 12.5 4.5 4.5L19 7.5" /></Icon>);
const IconMinus = () => (<Icon><path d="M6 12h12" /></Icon>);
const IconShield = () => (<Icon><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" /><path d="m9 12 2.2 2.2L15.5 10" /></Icon>);

// ── Plans config ──────────────────────────────────────────────────────────────
const ONE_TIME = [
  {
    type:     "resume",
    name:     "Resume Builder",
    price:    99,
    badge:    "One-time access",
    duration: "Single use",
    Icon:     IconFile,
    features: [
      { text: "AI-powered resume generation",  ok: true },
      { text: "Tailored to job description",    ok: true },
      { text: "ATS-optimised output",           ok: true },
      { text: "PDF download",                   ok: true },
      { text: "Single use — repurchase to reuse", ok: true },
    ],
  },
  {
    type:     "mock",
    name:     "Mock Interview",
    price:    3499,
    badge:    "One-time access",
    duration: "Single session",
    Icon:     IconMic,
    features: [
      { text: "1-on-1 with industry expert",    ok: true },
      { text: "Real interview scenarios",        ok: true },
      { text: "Detailed feedback report",        ok: true },
      { text: "Flexible scheduling",             ok: true },
      { text: "Single session — repurchase for more", ok: true },
    ],
  },
];

const SUBSCRIPTIONS = [
  {
    plan:      "monthly",
    name:      "1 Month",
    price:     1499,
    originalPrice: 3000,
    days:      30,
    badge:     null,
    cardClass: "",
    Icon:      IconCalendar,
    features: [
      { text: "Unlimited resume creation",  ok: true  },
      { text: "Edit your resume as many times as you like",              ok: true },
      { text: "Unlimited PDF downloads",               ok: true  },
      { text: "ATS-optimised, tailored to each job",            ok: true},
      { text: "30-day full access",            ok: true},
    ],
  },
  {
    plan:      "3_month",
    name:      "3 Months",
    price:     6799,
    originalPrice: 13500,
    days:      90,
    badge:     "Most popular",
    cardClass: "is-popular",
    Icon:      IconZap,
    features: [
      { text: "Unlimited resume creation, edits and downloads",  ok: true  },
      { text: "3 one-on-one mock interviews with industry experts",  ok: true  },
      { text: "1 mock interview every month (1 hour each)",               ok: true  },
      { text: "Detailed feedback after every session",            ok: true },
      { text: "90-day full access",            ok: true },
    ],
  },
  {
    plan:      "yearly",
    name:      "Yearly",
    price:     40499,
    originalPrice: 81000,
    days:      365,
    badge:     "Best value",
    cardClass: "is-best",
    Icon:      IconCrown,
    features: [
      { text: "12 one-on-one mock interviews with industry experts",  ok: true },
      { text: "1 free course included",  ok: true },
      { text: "Unlimited resume creation, edits and downloads",              ok: true },
      { text: "Detailed feedback after every session",            ok: true },
      { text: "365-day full access",            ok: true },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(expiry) {
  return Math.max(0, Math.ceil((new Date(expiry) - new Date()) / 86400000));
}

// Discount % calculated from original vs. discounted price
function discountPercent(original, price) {
  return Math.round(((original - price) / original) * 100);
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FeatureItem({ text, ok }) {
  return (
    <li className={ok ? "" : "is-off"}>
      <span className={ok ? "pr-tick" : "pr-tick pr-tick-off"}>{ok ? <IconCheck /> : <IconMinus />}</span>
      <span>{text}</span>
    </li>
  );
}

function ActiveBanner({ status }) {
  const sub = status?.subscription;
  if (!sub?.is_currently_active) return null;
  const planLabel = { monthly: "Monthly", "3_month": "3-Month", yearly: "Yearly" }[sub.plan] || sub.plan;
  return (
    <div className="pr-banner">
      <span className="pr-banner-icon"><IconShield /></span>
      <div>
        <strong>{planLabel} plan is active — expires {fmtDate(sub.expiry_date)}</strong>
        <small>
          {daysLeft(sub.expiry_date)} days remaining ·{" "}
          {sub.can_use_resume ? "Resume included" : "Resume not included"} ·{" "}
          {sub.can_use_mock_interview ? "Mock interview included" : "Mock interview not included"}
        </small>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PricingPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useContext(AuthContext);
  const { status, loading, refresh } = useAccessStatus(user);
  const [toast, setToast] = useState(null);

  // Load Razorpay script once
  useEffect(() => {
    if (window.Razorpay) return;
    if (document.getElementById("rzp-script")) return;
    const s   = document.createElement("script");
    s.id      = "rzp-script";
    s.src     = "https://checkout.razorpay.com/v1/checkout.js";
    s.async   = true;
    s.onerror = () => showToast("⚠️ Failed to load payment gateway. Check your connection.", "warning");
    document.body.appendChild(s);
  }, []);

  const requireLogin = () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return false;
    }
    return true;
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Secure 3-step Razorpay flow ───────────────────────────────────────────
  const openPayment = async ({ type, plan, price, name }) => {
    if (!requireLogin()) return;

    if (!window.Razorpay) {
      showToast("⚠️ Payment gateway is loading, please try again in a second.", "warning");
      return;
    }

    // ── Step 1: Create order on backend ──────────────────────────────────────
    let orderData;
    try {
      const res = await api.post("/api/payments/create-order/", {
        type,
        plan:   type === "subscription" ? plan : undefined,
        amount: price,
      });
      orderData = res.data;
    } catch (err) {
      const msg = err?.response?.data?.error || "Could not create payment order. Please try again.";
      showToast(`⚠️ ${msg}`, "warning");
      return;
    }

    const { order_id, amount, currency, key_id } = orderData;

    // ── Step 2: Open Razorpay popup with order_id from backend ───────────────
    const options = {
      key:         key_id,      // comes from backend — no hardcoded key in frontend
      amount,                   // in paise, as returned by backend
      currency,
      order_id,
      name:        "TConnects",
      description: name,

      // ── Step 3: Verify signature on backend after payment ──────────────────
      handler: async function (razorpayResponse) {
        try {
          await api.post("/api/payments/verify/", {
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_order_id:   razorpayResponse.razorpay_order_id,
            razorpay_signature:  razorpayResponse.razorpay_signature,
            type,
            plan:   type === "subscription" ? plan : undefined,
            amount: price,
          });
          await refresh();
          showToast(`✅ Payment successful! ${name} unlocked.`);
        } catch (err) {
          const msg = err?.response?.data?.error || "Payment verification failed. Contact support.";
          showToast(`⚠️ ${msg}`, "warning");
        }
      },

      theme: { color: "#0088a6" },   // logo teal for the Razorpay popup
    };

    new window.Razorpay(options).open();
  };

  // ── Check if a one-time item is already available ─────────────────────────
  const sub       = status?.subscription;
  const subActive = sub?.is_currently_active;

  const getOneTimeStatus = (type) => {
    const fa = status?.feature_access;
    if (!fa) return null;
    if (type === "resume")  return fa.resume_purchased && !fa.resume_used  ? "ready"   : fa.resume_purchased ? "used" : null;
    if (type === "mock")    return fa.mock_interview_purchased_count > fa.mock_interview_used_count ? "ready" : null;
    return null;
  };

  return (
    <div className="pr-page">
      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && <div className={`pr-toast pr-toast-${toast.type}`} role="status">{toast.msg}</div>}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pr-hero">
        <h1 className="pr-hero-title">Simple, transparent pricing</h1>
        <p className="pr-hero-sub">
          Pay once for what you need, or subscribe for unlimited access to power up your career.
        </p>
      </section>

      {/* ── Active plan banner ─────────────────────────────────────────── */}
      {!loading && <ActiveBanner status={status} />}

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — ONE-TIME PURCHASES
      ══════════════════════════════════════════════════════════════════ */}
      <section className="pr-section">
        <h2 className="pr-section-title">One-time purchases</h2>
        <p className="pr-section-sub">
          Pay per use — buy again after each use, or subscribe for unlimited access and save more.
        </p>

        <div className="pr-grid pr-grid-2">
          {ONE_TIME.map((item) => {
            const otStatus = !loading && user ? getOneTimeStatus(item.type) : null;
            const alreadyHave =
              (item.type === "resume" && subActive && sub?.can_use_resume) ||
              (item.type === "mock"   && subActive && sub?.can_use_mock_interview);

            return (
              <article key={item.type} className="pr-card">
                <span className="pr-badge pr-badge-soft">{item.badge}</span>
                <span className="pr-plan-icon"><item.Icon /></span>
                <h3 className="pr-plan-name">{item.name}</h3>
                <p className="pr-price">₹{item.price.toLocaleString("en-IN")}</p>
                <p className="pr-duration">{item.duration}</p>

                <ul className="pr-features">
                  {item.features.map((f) => <FeatureItem key={f.text} {...f} />)}
                </ul>

                {/* Status tags */}
                {otStatus === "ready" && !alreadyHave && (
                  <p className="pr-note pr-note-ok">Purchased and ready to use</p>
                )}
                {otStatus === "used" && !alreadyHave && (
                  <p className="pr-note">Used — purchase again to re-enable</p>
                )}
                {alreadyHave && (
                  <p className="pr-note pr-note-ok">Covered by your active subscription</p>
                )}

                <button
                  type="button"
                  className={`pr-btn ${alreadyHave ? "pr-btn-disabled" : "pr-btn-primary"}`}
                  disabled={alreadyHave || loading}
                  onClick={() => openPayment({ type: item.type, price: item.price, name: item.name })}
                >
                  {alreadyHave
                    ? "Included in plan"
                    : otStatus === "ready"
                    ? "Purchase again"
                    : `Buy for ₹${item.price.toLocaleString("en-IN")}`}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — SUBSCRIPTION PLANS
      ══════════════════════════════════════════════════════════════════ */}
      <section className="pr-section">
        <h2 className="pr-section-title">Subscription plans</h2>
        <p className="pr-section-sub">
          Unlimited access during your plan period. Subscription overrides one-time usage tracking.
        </p>

        <div className="pr-grid pr-grid-3">
          {SUBSCRIPTIONS.map((item) => {
            const isCurrentPlan = subActive && sub?.plan === item.plan;

            return (
              <article
                key={item.plan}
                className={`pr-card ${item.cardClass} ${isCurrentPlan ? "is-current" : ""}`}
              >
                {item.badge && <span className="pr-badge pr-badge-grad">{item.badge}</span>}
                <span className="pr-plan-icon"><item.Icon /></span>
                <h3 className="pr-plan-name">{item.name}</h3>
                <div className="pr-original-row">
                  <span className="pr-original-price">
                    ₹{item.originalPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="pr-discount-tag">
                    {discountPercent(item.originalPrice, item.price)}% OFF
                  </span>
                </div>
                <p className="pr-price">
                  ₹{item.price.toLocaleString("en-IN")}
                  <span> / {item.plan === "monthly" ? "mo" : item.plan === "3_month" ? "3 mo" : "yr"}</span>
                </p>
                <p className="pr-duration">{item.days} days</p>

                <ul className="pr-features">
                  {item.features.map((f) => <FeatureItem key={f.text} {...f} />)}
                </ul>

                {isCurrentPlan && (
                  <p className="pr-note pr-note-ok">Your current plan · {daysLeft(sub.expiry_date)} days left</p>
                )}

                <button
                  type="button"
                  className="pr-btn pr-btn-primary"
                  disabled={loading}
                  onClick={() =>
                    openPayment({
                      type:  "subscription",
                      plan:  item.plan,
                      price: item.price,
                      name:  `${item.name} Subscription`,
                    })
                  }
                >
                  {isCurrentPlan ? "Renew / Upgrade" : `Get ${item.name}`}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Footer note ───────────────────────────────────────────────── */}
      <p className="pr-foot">
        All prices inclusive of applicable taxes · Powered by Razorpay · Secure payments
      </p>
    </div>
  );
} 