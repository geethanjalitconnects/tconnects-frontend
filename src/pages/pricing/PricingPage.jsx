/**
 * PricingPage.jsx
 * ---------------
 * Unified pricing page for TConnects.
 * - One-time: Resume (₹99), Mock Interview (₹3499)
 * - Subscriptions: Monthly / 3-Month / Yearly
 * - Secure 3-step Razorpay flow:
 *     1. POST /api/payments/create-order/  → get order_id + key_id from backend
 *     2. Open Razorpay popup with order_id
 *     3. POST /api/payments/verify/        → backend verifies HMAC signature → writes DB
 */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import useAccessStatus from "../../hooks/useAccessStatus";
import api from "../../config/api";
import "./PricingPage.css";

// ── Plans config ──────────────────────────────────────────────────────────────
const ONE_TIME = [
  {
    type:        "resume",
    name:        "Resume Builder",
    price:       99,
    badge:       "ONE-TIME ACCESS",
    badgeClass:  "badge-onetime",
    btnClass:    "btn-blue",
    duration:    "Single use",
    icon:        "📄",
    features: [
      { text: "AI-powered resume generation",  ok: true },
      { text: "Tailored to job description",    ok: true },
      { text: "ATS-optimised output",           ok: true },
      { text: "PDF download",                   ok: true },
      { text: "Single use — repurchase to reuse", ok: true },
    ],
  },
  {
    type:        "mock",
    name:        "Mock Interview",
    price:       3499,
    badge:       "ONE-TIME ACCESS",
    badgeClass:  "badge-onetime",
    btnClass:    "btn-teal",
    duration:    "Single session",
    icon:        "🎙️",
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
    plan:       "monthly",
    name:       "1 Month",
    price:      1299,
    days:       30,
    badge:      null,
    badgeClass: "",
    btnClass:   "btn-blue",
    cardClass:  "",
    icon:       "📅",
    features: [
      { text: "Resume Builder (unlimited)",  ok: true  },
      { text: "Mock Interview",              ok: false },
      { text: "30-day access",               ok: true  },
      { text: "Priority support",            ok: false },
    ],
  },
  {
    plan:       "3_month",
    name:       "3 Months",
    price:      1999,
    days:       90,
    badge:      "Most Popular",
    badgeClass: "badge-popular",
    btnClass:   "btn-gold",
    cardClass:  "popular",
    icon:       "🚀",
    features: [
      { text: "Resume Builder (unlimited)",  ok: true  },
      { text: "Mock Interview (unlimited)",  ok: true  },
      { text: "90-day access",               ok: true  },
      { text: "Priority support",            ok: false },
    ],
  },
  {
    plan:       "yearly",
    name:       "Yearly",
    price:      2999,
    days:       365,
    badge:      "⭐ BEST VALUE",
    badgeClass: "badge-best",
    btnClass:   "btn-green",
    cardClass:  "best-value",
    icon:       "👑",
    features: [
      { text: "Resume Builder (unlimited)",  ok: true },
      { text: "Mock Interview (unlimited)",  ok: true },
      { text: "365-day access",              ok: true },
      { text: "Priority support",            ok: true },
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

// ── Sub-components ────────────────────────────────────────────────────────────
function FeatureItem({ text, ok }) {
  return (
    <li>
      <span className={ok ? "feat-check" : "feat-cross"}>{ok ? "✓" : "✗"}</span>
      <span style={{ color: ok ? undefined : "#aaa" }}>{text}</span>
    </li>
  );
}

function ActiveBanner({ status }) {
  const sub = status?.subscription;
  if (!sub?.is_currently_active) return null;
  const planLabel = { monthly: "Monthly", "3_month": "3-Month", yearly: "Yearly" }[sub.plan] || sub.plan;
  return (
    <div className="active-status-banner">
      <span className="banner-icon">✅</span>
      <div>
        <div>{planLabel} plan is active — expires {fmtDate(sub.expiry_date)}</div>
        <small>
          {daysLeft(sub.expiry_date)} days remaining ·&nbsp;
          {sub.can_use_resume ? "Resume ✅" : "Resume ❌"} ·&nbsp;
          {sub.can_use_mock_interview ? "Mock Interview ✅" : "Mock Interview ❌"}
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
      name:        "VConnects",
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

      theme: { color: "#0097a7" },
    };

    new window.Razorpay(options).open();
  };

  // ── Check if a one-time item is already available ─────────────────────────
  const resumeAvailable = status?.access?.resume?.allowed;
  const mockAvailable   = status?.access?.mock_interview?.allowed;
  const sub             = status?.subscription;
  const subActive       = sub?.is_currently_active;

  const getOneTimeStatus = (type) => {
    const fa = status?.feature_access;
    if (!fa) return null;
    if (type === "resume")  return fa.resume_purchased && !fa.resume_used  ? "ready"   : fa.resume_purchased ? "used" : null;
    if (type === "mock")    return fa.mock_interview_purchased_count > fa.mock_interview_used_count ? "ready" : null;
    return null;
  };

  return (
    <>
      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: toast.type === "success" ? "#28a745" : "#ff6600",
          color: "#fff", padding: "14px 22px", borderRadius: 12,
          fontWeight: 600, boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
          animation: "fadeIn .25s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="pricing-hero">
        <h1>Simple, Transparent Pricing</h1>
        <p>Pay once for what you need, or subscribe for unlimited access to power up your career.</p>
      </div>

      <div className="pricing-page">

        {/* ── Active plan banner ─────────────────────────────────────────── */}
        {!loading && <ActiveBanner status={status} />}

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 1 — ONE-TIME PURCHASES
        ══════════════════════════════════════════════════════════════════ */}
        <h2 className="pricing-section-title">One-Time Purchases</h2>
        <p className="pricing-section-sub">
          Pay per use — Buy again after each use or subscribe for unlimited access and save more.
        </p>

        <div className="pricing-grid-2">
          {ONE_TIME.map((item) => {
            const otStatus = !loading && user ? getOneTimeStatus(item.type) : null;
            const blockedByPlan =
              item.type === "mock" && subActive && sub?.plan === "monthly";
            const alreadyHave =
              (item.type === "resume" && subActive && sub?.can_use_resume) ||
              (item.type === "mock"   && subActive && sub?.can_use_mock_interview);

            return (
              <div key={item.type} className="pricing-card">
                <span className={`pricing-badge ${item.badgeClass}`}>{item.badge}</span>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{item.icon}</div>
                <div className="pricing-plan-name">{item.name}</div>
                <div className="pricing-price">₹{item.price.toLocaleString("en-IN")}</div>
                <div className="pricing-duration">{item.duration}</div>
                <ul className="pricing-features">
                  {item.features.map((f) => <FeatureItem key={f.text} {...f} />)}
                </ul>

                {/* Status tags */}
                {otStatus === "ready" && !alreadyHave && (
                  <div style={{ marginBottom: 10, color: "#28a745", fontWeight: 600, fontSize: 13 }}>
                    ✅ Purchased & ready to use
                  </div>
                )}
                {otStatus === "used" && !alreadyHave && (
                  <div style={{ marginBottom: 10, color: "#999", fontSize: 13 }}>
                    Used — purchase again to re-enable
                  </div>
                )}
                {alreadyHave && (
                  <div style={{ marginBottom: 10, color: "#0097a7", fontWeight: 600, fontSize: 13 }}>
                    ✅ Covered by your active subscription
                  </div>
                )}

                <button
                  className={`pricing-btn ${alreadyHave ? "btn-disabled" : item.btnClass}`}
                  disabled={alreadyHave || loading}
                  onClick={() => openPayment({ type: item.type, price: item.price, name: item.name })}
                >
                  {alreadyHave
                    ? "Included in plan"
                    : otStatus === "ready"
                    ? "Purchase Again"
                    : `Buy for ₹${item.price.toLocaleString("en-IN")}`}
                </button>
              </div>
            );
          })}
        </div>

        <hr className="pricing-divider" />

        {/* ══════════════════════════════════════════════════════════════════
            SECTION 2 — SUBSCRIPTION PLANS
        ══════════════════════════════════════════════════════════════════ */}
        <h2 className="pricing-section-title">Subscription Plans</h2>
        <p className="pricing-section-sub">
          Unlimited access during your plan period. Subscription overrides one-time usage tracking.
        </p>

        <div className="pricing-grid-3">
          {SUBSCRIPTIONS.map((item) => {
            const isCurrentPlan = subActive && sub?.plan === item.plan;

            return (
              <div key={item.plan} className={`pricing-card ${item.cardClass} ${isCurrentPlan ? "active-plan" : ""}`}>
                {item.badge && (
                  <span className={`pricing-badge ${item.badgeClass}`}>{item.badge}</span>
                )}
                <div style={{ fontSize: 36, marginBottom: 8 }}>{item.icon}</div>
                <div className="pricing-plan-name">{item.name}</div>
                <div className="pricing-price">
                  ₹{item.price.toLocaleString("en-IN")}
                  <span> / {item.plan === "monthly" ? "mo" : item.plan === "3_month" ? "3 mo" : "yr"}</span>
                </div>
                <div className="pricing-duration">{item.days} days</div>

                <ul className="pricing-features">
                  {item.features.map((f) => <FeatureItem key={f.text} {...f} />)}
                </ul>

                {isCurrentPlan && (
                  <div style={{ marginBottom: 10, color: "#0097a7", fontWeight: 600, fontSize: 13 }}>
                    ✅ Your current plan · {daysLeft(sub.expiry_date)} days left
                  </div>
                )}

                <button
                  className={`pricing-btn ${item.btnClass}`}
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
              </div>
            );
          })}
        </div>

        {/* ── Footer note ───────────────────────────────────────────────── */}
        <p style={{ textAlign: "center", color: "#8a9a9a", marginTop: 48, fontSize: 13 }}>
          All prices inclusive of applicable taxes · Powered by Razorpay · Secure payments
        </p>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </>
  );
}