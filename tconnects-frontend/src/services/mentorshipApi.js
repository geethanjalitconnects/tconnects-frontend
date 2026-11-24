import api, { extractList } from "../config/api";

const ROOT = "/api/mentors/";

const UPLOAD_ENDPOINTS = {
  photo: "photo/",
  video: "video/",
  proof: "proof/",
};

// Per-upload timeouts (ms): photos and proofs are small, video can be large.
const UPLOAD_TIMEOUT_MS = {
  photo: 60000,
  proof: 60000,
  video: 180000,
};

const uploadEndpoint = (kind) => {
  const endpoint = UPLOAD_ENDPOINTS[kind];
  if (!endpoint) throw new Error("Unsupported mentor upload type.");
  return endpoint;
};

export const mentorshipApi = {
  // ---------------------------------------------------------------------
  // Public: options and the mentor directory
  // ---------------------------------------------------------------------
  getOptions: async () => (await api.get(`${ROOT}options/`)).data,

  /**
   * One page of the directory, with paging info: { results, count, total_pages, ... }.
   * Supported params: q, topic, risk_area, language, audience, session_type, min_years,
   * min_rate, max_rate, ordering (newest | rate_low | rate_high | experience),
   * page, page_size.
   */
  getMentorsPage: async (params = {}, config = {}) => {
    const data = (await api.get(ROOT, { ...config, params })).data;
    return Array.isArray(data)
      ? { results: data, count: data.length, total_pages: 1 }
      : { ...data, results: extractList(data) };
  },

  // Plain list of mentors (first page only). Kept so existing callers keep working.
  getMentors: async (params = {}) => extractList((await api.get(ROOT, { params })).data),

  getMentor: async (slug) => (await api.get(`${ROOT}${slug}/`)).data,

  // ---------------------------------------------------------------------
  // The signed-in mentor's own application
  // ---------------------------------------------------------------------
  getApplication: async () => (await api.get(`${ROOT}application/`)).data,

  // Starts an application, or restarts one after a rejection once the wait period is over.
  startApplication: async () => (await api.post(`${ROOT}application/`)).data,

  saveSection: async (section, payload) =>
    (await api.patch(`${ROOT}application/steps/${section}/`, payload)).data,

  // Uploads: kind must be "photo", "video", or "proof".
  // Sent as multipart/form-data. The shared axios instance strips any JSON
  // Content-Type for FormData, so the browser sets the boundary itself.
  // Video files are large, so uploads get a longer timeout than normal calls.
  uploadFile: async (kind, file) => {
    const endpoint = uploadEndpoint(kind);
    const formData = new FormData();
    formData.append("file", file);
    return (
      await api.post(`${ROOT}application/${endpoint}`, formData, {
        timeout: UPLOAD_TIMEOUT_MS[kind] || 60000,
      })
    ).data;
  },

  removeFile: async (kind) =>
    (await api.delete(`${ROOT}application/${uploadEndpoint(kind)}`)).data,

  // Backend expects { email } when sending and { code } when verifying.
  sendWorkEmailOtp: async (email) =>
    (await api.post(`${ROOT}application/work-email/send-otp/`, { email })).data,

  verifyWorkEmailOtp: async (code) =>
    (await api.post(`${ROOT}application/work-email/verify/`, { code })).data,

  // Registered login email OTP. The address is always the account email: nothing is sent in the body.
  sendRegisteredEmailOtp: async () =>
    (await api.post(`${ROOT}application/registered-email/send-otp/`, {})).data,

  verifyRegisteredEmailOtp: async (code) =>
    (await api.post(`${ROOT}application/registered-email/verify/`, { code })).data,

  // The mentor's name is the account name (shared with the dashboard profile). Email can never change.
  updateAccountName: async (full_name) => (await api.patch("/api/auth/me/", { full_name })).data,

  // Submit for admin review
  submitApplication: async () => (await api.post(`${ROOT}application/submit/`)).data,

  // Approved mentors: low-risk fields apply at once; company, job title and rate wait for review.
  liveEdit: async (payload) => (await api.patch(`${ROOT}application/live/`, payload)).data,

  // ---------------------------------------------------------------------
  // Reviewer (admin) API. Every call needs a signed-in admin.
  // Pass { skipAuthRedirect: true } as `config` from an admin screen that handles 401/403 itself.
  // ---------------------------------------------------------------------
  listReviews: async (params = {}, config = {}) =>
    (await api.get(`${ROOT}review/`, { ...config, params })).data,

  getReview: async (id, config = {}) => (await api.get(`${ROOT}review/${id}/`, config)).data,

  // payload: { decision: "approve" | "request_changes" | "reject", review_message, internal_notes }
  decideReview: async (id, payload, config = {}) =>
    (await api.post(`${ROOT}review/${id}/decision/`, payload, config)).data,

  // payload: { review_message (required), internal_notes }
  suspendMentor: async (id, payload, config = {}) =>
    (await api.post(`${ROOT}review/${id}/suspend/`, payload, config)).data,

  // payload: { review_message, internal_notes } (both optional)
  reinstateMentor: async (id, payload = {}, config = {}) =>
    (await api.post(`${ROOT}review/${id}/reinstate/`, payload, config)).data,

  // payload: { decision: "approve" | "reject", review_message (required for reject), internal_notes }
  decidePendingChanges: async (id, payload, config = {}) =>
    (await api.post(`${ROOT}review/${id}/changes/`, payload, config)).data,

  // ---------------------------------------------------------------------
  // Public: what can be booked
  // ---------------------------------------------------------------------
  getAvailableDates: async (slug) => (await api.get(`${ROOT}${slug}/available-dates/`)).data,

  // params: { duration, date_from, date_to } (dates as YYYY-MM-DD, at most 31 days)
  getSlots: async (slug, params = {}) => (await api.get(`${ROOT}${slug}/slots/`, { params })).data,

  // ---------------------------------------------------------------------
  // Booker (candidate / recruiter): book, pay, My Mentorship
  // ---------------------------------------------------------------------
  getBookingPrefill: async () => (await api.get(`${ROOT}bookings/prefill/`)).data,

  // payload: { mentor_slug, start (ISO), duration, name, note }  ->  { booking, checkout }
  createBooking: async (payload) => (await api.post(`${ROOT}bookings/`, payload)).data,

  // params: { status: upcoming | past | confirmed | cancelled | pending_payment, page }
  listMyBookings: async (params = {}) => (await api.get(`${ROOT}bookings/`, { params })).data,

  getMyBooking: async (id) => (await api.get(`${ROOT}bookings/${id}/`)).data,

  // Reopen Razorpay Checkout for an unpaid booking whose hold is still running.
  reopenCheckout: async (id) => (await api.post(`${ROOT}bookings/${id}/checkout/`)).data,

  // payload: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
  verifyPayment: async (id, payload) =>
    (await api.post(`${ROOT}bookings/${id}/verify-payment/`, payload)).data,

  // payload: { razorpay_order_id, razorpay_payment_id?, code?, description? }
  reportPaymentFailed: async (id, payload) =>
    (await api.post(`${ROOT}bookings/${id}/payment-failed/`, payload)).data,

  cancelMyBooking: async (id, reason = "") =>
    (await api.post(`${ROOT}bookings/${id}/cancel/`, { reason })).data,

  reportIssue: async (id, note) =>
    (await api.post(`${ROOT}bookings/${id}/report-issue/`, { note })).data,

  // ---------------------------------------------------------------------
  // Mentor dashboard (approved or suspended mentors)
  // ---------------------------------------------------------------------
  // params: { status: upcoming | completed | cancelled | awaiting_completion | all, page }  (+ summary)
  listMentorBookings: async (params = {}) =>
    (await api.get(`${ROOT}mentor/bookings/`, { params })).data,

  getMentorBooking: async (id) => (await api.get(`${ROOT}mentor/bookings/${id}/`)).data,

  setMeetingLink: async (id, meeting_link) =>
    (await api.patch(`${ROOT}mentor/bookings/${id}/`, { meeting_link })).data,

  completeMentorBooking: async (id) =>
    (await api.post(`${ROOT}mentor/bookings/${id}/complete/`)).data,

  cancelMentorBooking: async (id, reason) =>
    (await api.post(`${ROOT}mentor/bookings/${id}/cancel/`, { reason })).data,

  listMentorPayouts: async (params = {}) =>
    (await api.get(`${ROOT}mentor/payouts/`, { params })).data,

  getPayoutAccount: async () => (await api.get(`${ROOT}mentor/payout-account/`)).data,

  // payload: { kind: bank_account | vpa, account_holder_name, account_number?, ifsc?, vpa? }
  savePayoutAccount: async (payload) =>
    (await api.put(`${ROOT}mentor/payout-account/`, payload)).data,

  getMentorAvailability: async () => (await api.get(`${ROOT}mentor/availability/`)).data,

  // payload: { availability, session_durations, timezone }
  saveMentorAvailability: async (payload) =>
    (await api.put(`${ROOT}mentor/availability/`, payload)).data,

  // payload: { date, is_closed, windows?: ["10:00-12:00"], note? }
  addAvailabilityException: async (payload) =>
    (await api.post(`${ROOT}mentor/availability/exceptions/`, payload)).data,

  deleteAvailabilityException: async (id) =>
    (await api.delete(`${ROOT}mentor/availability/exceptions/${id}/`)).data,

  // ---------------------------------------------------------------------
  // Admin: mentorship business. Pass { skipAuthRedirect: true } from admin screens.
  // ---------------------------------------------------------------------
  adminAnalytics: async (params = {}, config = {}) =>
    (await api.get(`${ROOT}admin/analytics/`, { ...config, params })).data,

  // params: { status, payment_status, mentor, role, has_issue, q, date_from, date_to, page }
  adminBookings: async (params = {}, config = {}) =>
    (await api.get(`${ROOT}admin/bookings/`, { ...config, params })).data,

  adminBooking: async (id, config = {}) =>
    (await api.get(`${ROOT}admin/bookings/${id}/`, config)).data,

  // action: cancel {reason, refund} | complete | refund {amount?, note} | resolve-issue {resolution, refund}
  adminBookingAction: async (id, action, payload = {}, config = {}) =>
    (await api.post(`${ROOT}admin/bookings/${id}/${action}/`, payload, config)).data,

  adminPayments: async (params = {}, config = {}) =>
    (await api.get(`${ROOT}admin/payments/`, { ...config, params })).data,

  adminRefunds: async (params = {}, config = {}) =>
    (await api.get(`${ROOT}admin/refunds/`, { ...config, params })).data,

  adminRetryRefund: async (id, config = {}) =>
    (await api.post(`${ROOT}admin/refunds/${id}/retry/`, {}, config)).data,

  adminPayouts: async (params = {}, config = {}) =>
    (await api.get(`${ROOT}admin/payouts/`, { ...config, params })).data,

  adminReleasePayout: async (id, utr = "", config = {}) =>
    (await api.post(`${ROOT}admin/payouts/${id}/release/`, { utr }, config)).data,

  adminMentors: async (params = {}, config = {}) =>
    (await api.get(`${ROOT}admin/mentors/`, { ...config, params })).data,

  adminSetCommission: async (id, commission_pct, config = {}) =>
    (await api.patch(`${ROOT}admin/mentors/${id}/`, { commission_pct }, config)).data,
};

/** Readable message from any API error (DRF field errors, {detail}, {error, detail}). */
export function apiError(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data;
  if (!data) return err?.message && !/status code/i.test(err.message) ? err.message : fallback;
  if (typeof data === "string") return data.length < 300 ? data : fallback;
  if (data.detail) return String(data.detail);
  if (Array.isArray(data.non_field_errors)) return data.non_field_errors.join(" ");
  if (typeof data === "object") {
    const parts = Object.entries(data).map(([k, v]) =>
      `${k === "non_field_errors" ? "" : `${k.replaceAll("_", " ")}: `}${Array.isArray(v) ? v.join(" ") : typeof v === "object" ? JSON.stringify(v) : v}`
    );
    if (parts.length) return parts.join(" ");
  }
  return fallback;
}