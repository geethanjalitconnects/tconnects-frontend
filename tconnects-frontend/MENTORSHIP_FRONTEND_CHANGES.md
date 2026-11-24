# Mentorship frontend – what changed

Works with the `tconnects-backend-mentorship` backend (all calls go to `/api/mentors/...`).
No new npm packages. Razorpay Checkout is loaded from `checkout.razorpay.com` at payment time,
and the Razorpay key comes from the backend, so no new `.env` value is needed.

## New files
| File | What it is |
|---|---|
| `src/pages/mentorship/booking/BookingPanel.jsx` | Booking on a mentor profile: session length, date, time slot, locked registered email, name, reason, Razorpay payment, held-slot retry |
| `src/pages/mentorship/booking/bookingUtils.js` | Razorpay loader + checkout/verify/failure flow, formatting helpers |
| `src/pages/mentorship/booking/StatusBadge.jsx`, `usePaged.js`, `booking.css` | Shared badge, pagination hook, styles |
| `src/pages/mentorship/dashboard/MyMentorship.jsx` | **My Mentorship** (candidate + recruiter): upcoming / awaiting payment / past / cancelled / history, mentor profile & email, schedule, payment + transaction IDs, refunds, pay now, cancel, report a problem |
| `src/pages/mentorship/dashboard/MentorDashboard.jsx` | **Mentor dashboard**: bookings with booker details and requirement, email booker, meeting link, mark completed, cancel; weekly availability, session lengths, time zone, days off; public profile edits; payout account (UPI/bank) and payout history |
| `src/pages/admin-dashboard/MentorshipAdmin.jsx` | **Admin mentorship**: analytics, bookings (complete / cancel / refund / resolve problem), payments, refunds (retry), mentor payouts (release with UTR), mentors & commission |
| `src/pages/admin-dashboard/MentorReviewDetail.jsx` | Application review page (approve / request changes / reject, suspend / reinstate, pending profile changes). The list page already linked here but the route was missing |
| `src/pages/admin-dashboard/AdminShell.jsx` | Admin nav + sign-in gate |

## Edited files
- `src/App.jsx`: routes `/candidate-dashboard/my-mentorship`, `/candidate-dashboard/mentor-dashboard`, `/recruiter-dashboard/my-mentorship`, `/admin-dashboard/mentorship`, `/admin-dashboard/mentors/:id`
- `src/services/mentorshipApi.js`: registered-email OTP, booking, mentor and admin endpoints, `apiError()` helper
- `src/pages/mentorship/BecomeMentor.jsx`: locked registered email, employment status (Currently working / Not working; work fields and work-email proof only when working), registered-email OTP before submit, link to mentor dashboard once approved
- `src/pages/mentorship/MentorProfile.jsx`: "Booking opens soon" replaced with the booking panel
- `src/pages/candidate-dashboard/CandidateDashboardLayout.jsx`: My Mentorship + Mentor Dashboard (approved mentors) or Become a Mentor
- `src/pages/recruiter-dashboard/RecruiterDashboardLayout.jsx`: My Mentorship
- `src/pages/admin-dashboard/MentorReviewDashboard.jsx`: admin nav at top
- `src/pages/LoginPage.jsx`: honours a safe `?next=/path` so "Sign in to book" returns to the mentor
- `src/components/SiteHeader.jsx`: Dashboard button sends admins to `/admin-dashboard/mentorship`

## Before going live
Run one full Razorpay **test-mode** booking: pay, close the window and pay again from My Mentorship,
cancel for a refund, mark complete as the mentor, and release the payout as admin.

## Update: recruiters can also become mentors
- Backend `mentors/permissions.py`: `IsMentorApplicant` lets candidate **and** recruiter accounts apply (admins still can't). Use the updated backend zip.
- Recruiter sidebar now shows **Become a Mentor**, or **Mentor Dashboard** once approved (`/recruiter-dashboard/mentor-dashboard`).
- Become a Mentor messages updated; the "Open my mentor dashboard" link goes to the right dashboard for the account type.
- Finding and booking mentors was already open to both candidates and recruiters (a mentor can't book their own profile).
