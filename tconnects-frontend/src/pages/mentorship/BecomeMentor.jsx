import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { mentorshipApi } from "../../services/mentorshipApi";
import "./mentorship.css";
import "./booking/booking.css";

const initial = {
  full_name: "",
  city: "",
  country: "India",
  languages: ["English"],
  linkedin_url: "",
  employment_status: "working",
  job_title: "",
  company_name: "",
  hide_company: false,
  company_display_label: "",
  years_experience: "",
  risk_areas: [],
  highest_qualification: "",
  certifications: [],
  past_roles: [],
  topics: [],
  audiences: ["students", "freshers"],
  session_types: ["career_guidance"],
  help_summary: "",
  real_moment: "",
  common_mistake: "",
  session_durations: [30],
  hourly_rate: "",
  availability: {},
  timezone: "Asia/Kolkata",
  has_no_work_email: false,
  note_for_team: "",
  accept_code_of_conduct: false,
};

const defaultLimits = {
  max_topics: 5,
  max_hourly_rate: 100000,
  max_help_summary_chars: 300,
  max_common_mistake_chars: 200,
  max_real_moment_chars: 500,
  max_note_for_team_chars: 1000,
  min_real_moment_chars: 50,
  max_slots_per_day: 6,
};

// Draft kept in the browser while the visitor is signed out (no files, no passwords).
const DRAFT_KEY = "tconnects_mentor_draft_v1";
const SIGN_IN_URL = `/login?next=${encodeURIComponent("/mentorship/become-a-mentor")}`;

const DAY_LABELS = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
  fri: "Friday", sat: "Saturday", sun: "Sunday",
};

const TIMEZONES = [
  ["Asia/Kolkata", "India (IST, UTC+5:30)"],
  ["Asia/Dubai", "Dubai (GST, UTC+4)"],
  ["Asia/Singapore", "Singapore (SGT, UTC+8)"],
  ["Europe/London", "London (GMT/BST)"],
  ["America/New_York", "New York (ET)"],
  ["America/Los_Angeles", "Los Angeles (PT)"],
  ["Australia/Sydney", "Sydney (AET)"],
];

const FIELD_LABELS = {
  full_name: "Full name", photo: "Profile photo", city: "City", country: "Country", languages: "Languages",
  linkedin_url: "LinkedIn profile", job_title: "Job title", company_name: "Company",
  company_display_label: "Public company label", years_experience: "Years of experience",
  risk_areas: "Risk areas", highest_qualification: "Highest qualification",
  topics: "Topics", audiences: "Who you mentor", session_types: "Session formats",
  help_summary: "What a mentee can expect", real_moment: "Real-world challenge",
  common_mistake: "Common mistake", session_durations: "Session durations",
  hourly_rate: "Hourly rate", availability: "Weekly availability",
  work_email: "Verified work email", proof_document: "Proof document",
  code_of_conduct: "Code of conduct",
  registered_email: "Registered email verification",
  employment_status: "Employment status",
};

// The wizard has 5 screens, the API has 6 sections. Screen 3 covers sections 3 and 4.
const SCREEN_SECTIONS = { 1: [1], 2: [2], 3: [3, 4], 4: [5], 5: [6] };
const SECTION_TO_SCREEN = { 1: 1, 2: 2, 3: 3, 4: 3, 5: 4, 6: 5 };
const SCREEN_FIELDS = {
  1: ["full_name", "photo", "city", "country", "languages", "linkedin_url"],
  2: ["employment_status", "job_title", "company_name", "company_display_label", "years_experience", "risk_areas", "highest_qualification"],
  3: ["topics", "audiences", "session_types", "help_summary", "real_moment", "common_mistake"],
  4: ["hourly_rate", "session_durations", "availability"],
  5: ["registered_email", "work_email", "proof_document", "code_of_conduct"],
};

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

const defaultOptions = {
  risk_areas: [
    { value: "credit", label: "Credit risk" },
    { value: "market", label: "Market risk" },
    { value: "operational", label: "Operational risk" },
    { value: "compliance", label: "Compliance & regulatory" },
    { value: "fintech", label: "Fintech & digital risk" },
    { value: "audit", label: "Internal audit" },
    { value: "cyber", label: "Cyber & information risk" },
    { value: "insurance", label: "Insurance & actuarial risk" },
    { value: "other", label: "Other" },
  ],
  audiences: [
    { value: "students", label: "Students" },
    { value: "freshers", label: "Freshers" },
    { value: "career_switchers", label: "Career switchers" },
    { value: "working_professionals", label: "Working professionals" },
  ],
  session_types: [
    { value: "career_guidance", label: "Career guidance" },
    { value: "resume_review", label: "Resume review" },
    { value: "interview_prep", label: "Interview prep" },
    { value: "skill_learning", label: "Learning a skill" },
    { value: "project_help", label: "Project help" },
  ],
  session_durations: [30, 45, 60],
  topic_suggestions: [
    "Credit risk modelling",
    "Basel norms",
    "Operational risk & RCSA",
    "Fraud risk",
    "AML / KYC",
    "Model validation",
    "Market risk & VaR",
    "Liquidity risk & ALM",
    "RBI regulations",
    "Third-party risk",
    "Cyber risk",
    "Risk analytics (Python / SQL)",
    "Enterprise risk management",
    "Interview preparation",
    "Switching into risk",
  ],
  certification_suggestions: [
    "FRM", "PRM", "CRISC", "CAMS", "CISA", "CFA", "CA", "ACCA", "CIA",
  ],
  weekdays: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
};

function Field({ label, hint, required = false, error = "", name, children }) {
  return (
    <label
      className={`mentor-form-field${error ? " has-error" : ""}`}
      data-field={name}
    >
      <span>
        {label}
        {required && <b className="mentor-required" aria-hidden="true"> *</b>}
      </span>
      {children}
      {hint && <small>{hint}</small>}
      {error && <small className="mentor-field-error" role="alert">{error}</small>}
    </label>
  );
}

function CheckPills({ values = [], selected = [], onChange, max = null }) {
  return (
    <div className="mentor-select-pills">
      {values.map((item) => {
        const option =
          typeof item === "string"
            ? { value: item, label: item }
            : item;

        const checked = selected.includes(option.value);

        return (
          <button
            type="button"
            key={option.value}
            className={`mentor-select-pill ${checked ? "selected" : ""}`}
            aria-pressed={checked}
            disabled={!checked && max !== null && selected.length >= max}
            onClick={() =>
              onChange(
                checked
                  ? selected.filter((value) => value !== option.value)
                  : [...selected, option.value]
              )
            }
          >
            {checked ? "✓ " : "+ "}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const parseList = (text) => [...new Set(String(text).split(",").map((x) => x.trim()).filter(Boolean))];

function errorText(err) {
  const data = err?.response?.data;

  if (typeof data === "string") return data;
  if (data?.detail) {
    const missing = data.missing;
    if (missing && typeof missing === "object") {
      const fields = Object.values(missing).flat();
      return `${data.detail} ${fields.length ? `Missing: ${fields.join(", ")}.` : ""}`;
    }
    return data.detail;
  }

  if (data?.error && data?.detail) return data.detail;

  if (data && typeof data === "object") {
    return Object.entries(data)
      .map(([key, value]) => {
        const messages = Array.isArray(value) ? value.join(" ") : String(value);
        return `${key.replaceAll("_", " ")}: ${messages}`;
      })
      .join(" ");
  }

  if (err?.message) return err.message;
  return "Something went wrong. Please check your details and try again.";
}

function normaliseApplication(data = {}) {
  return {
    ...initial,
    ...data,
    full_name: data.full_name ?? data.prefill?.full_name ?? "",
    city: data.city ?? data.prefill?.city ?? "",
    country: data.country || "India",
    languages: Array.isArray(data.languages) ? data.languages : ["English"],
    risk_areas: Array.isArray(data.risk_areas) ? data.risk_areas : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    past_roles: Array.isArray(data.past_roles) ? data.past_roles : [],
    topics: Array.isArray(data.topics) ? data.topics : [],
    audiences: Array.isArray(data.audiences) ? data.audiences : [],
    session_types: Array.isArray(data.session_types) ? data.session_types : [],
    session_durations: Array.isArray(data.session_durations)
      ? data.session_durations.map(Number)
      : [30],
    availability:
      data.availability && typeof data.availability === "object"
        ? data.availability
        : {},
    timezone: data.timezone || "Asia/Kolkata",
    hourly_rate: data.hourly_rate ?? "",
    years_experience: data.years_experience ?? "",
    employment_status: data.employment_status === "not_working" ? "not_working" : "working",
    accept_code_of_conduct: Boolean(data.code_of_conduct_accepted),
    has_no_work_email: Boolean(data.has_no_work_email),
  };
}

// Browser storage can be blocked or empty, so every access is wrapped.
const DRAFT_FIELDS = [
  "full_name", "city", "country", "languages", "linkedin_url", "employment_status", "job_title", "company_name", "hide_company",
  "company_display_label", "years_experience", "risk_areas", "highest_qualification",
  "certifications", "topics", "audiences", "session_types", "help_summary", "real_moment",
  "common_mistake", "session_durations", "hourly_rate", "availability", "timezone",
  "note_for_team",
];

function readDraft() {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeDraft(form) {
  try {
    const draft = Object.fromEntries(DRAFT_FIELDS.map((key) => [key, form[key]]));
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // storage unavailable: the visitor just loses the convenience
  }
}

function clearDraft() {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}

const isAuthError = (err) => err?.response?.status === 401;

// The backend allows edits only in these states. "rejected" is NOT editable: the applicant
// must start a new application (after the wait period) first.
const isEditableStatus = (status) =>
  !status || ["not_started", "draft", "changes_requested"].includes(status);

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const isFutureDate = (value) => {
  if (!value) return false;
  const d = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !Number.isNaN(d.getTime()) && d > today;
};

/** Remove blank slots and sort. Returns { availability, error }. */
function cleanAvailability(availability, maxSlots) {
  const cleaned = {};
  for (const [day, slots] of Object.entries(availability || {})) {
    const good = [];
    for (const slot of Array.isArray(slots) ? slots : []) {
      const [start, end] = String(slot).split("-");
      if (!start && !end) continue;
      if (!HHMM.test(start || "") || !HHMM.test(end || "")) {
        return { availability: null, error: `${DAY_LABELS[day] || day}: choose a start and end time for every slot.` };
      }
      if (start >= end) {
        return { availability: null, error: `${DAY_LABELS[day] || day}: the end time must be after the start time.` };
      }
      good.push(`${start}-${end}`);
    }
    const unique = [...new Set(good)].sort();
    if (unique.length > maxSlots) {
      return { availability: null, error: `${DAY_LABELS[day] || day}: up to ${maxSlots} time slots per day.` };
    }
    // overlapping slots on the same day confuse learners
    for (let i = 1; i < unique.length; i += 1) {
      if (unique[i].split("-")[0] < unique[i - 1].split("-")[1]) {
        return { availability: null, error: `${DAY_LABELS[day] || day}: time slots must not overlap.` };
      }
    }
    if (unique.length) cleaned[day] = unique;
  }
  return { availability: cleaned, error: "" };
}

/** Client-side check of one wizard screen. Returns { field: message }. Mirrors the backend rules. */
function validateScreen(screen, { form, status, limits, workEmailVerified }) {
  const e = {};
  const blank = (v) => v === undefined || v === null || String(v).trim() === "";
  if (screen === 1) {
    const name = String(form.full_name || "").trim();
    if (name.length < 2) e.full_name = "Enter your full name.";
    else if (name.length > 200) e.full_name = "Keep your name under 200 characters.";
    if (!status?.photo_url) e.photo = "Please upload a profile photo.";
    if (blank(form.city)) e.city = "Enter your city.";
    if (blank(form.country)) e.country = "Enter your country.";
    if (!form.languages.length) e.languages = "Add at least one language.";
    if (blank(form.linkedin_url)) e.linkedin_url = "Enter your LinkedIn profile link.";
    else {
      try {
        const host = new URL(form.linkedin_url).hostname.toLowerCase();
        if (!(host === "linkedin.com" || host.endsWith(".linkedin.com"))) throw new Error();
      } catch {
        e.linkedin_url = "Enter a valid LinkedIn profile link (linkedin.com).";
      }
    }
  }
  if (screen === 2) {
    const working = form.employment_status !== "not_working";
    if (working && blank(form.job_title)) e.job_title = "Enter your job title.";
    if (working && blank(form.company_name)) e.company_name = "Enter your company.";
    if (working && form.hide_company && blank(form.company_display_label)) {
      e.company_display_label = "Add the label to show instead of your company name.";
    }
    const years = Number(form.years_experience);
    if (blank(form.years_experience) || !Number.isFinite(years) || years < 0 || years > 60) {
      e.years_experience = "Enter your years of experience (0 to 60).";
    }
    if (!form.risk_areas.length) e.risk_areas = "Choose at least one area.";
    if (blank(form.highest_qualification)) e.highest_qualification = "Enter your highest qualification.";
  }
  if (screen === 3) {
    if (!form.topics.length) e.topics = "Choose at least one topic.";
    if (form.topics.length > limits.max_topics) e.topics = `Choose at most ${limits.max_topics} topics.`;
    if (!form.audiences.length) e.audiences = "Choose at least one audience.";
    if (!form.session_types.length) e.session_types = "Choose at least one session format.";
    if (blank(form.help_summary)) e.help_summary = "Tell mentees what to expect.";
    if (form.help_summary.length > limits.max_help_summary_chars) {
      e.help_summary = `Keep this under ${limits.max_help_summary_chars} characters.`;
    }
    if (form.real_moment.trim().length < limits.min_real_moment_chars) {
      e.real_moment = `Write at least ${limits.min_real_moment_chars} characters.`;
    }
    if (blank(form.common_mistake)) e.common_mistake = "Describe a common mistake you help people avoid.";
    if (form.common_mistake.length > limits.max_common_mistake_chars) {
      e.common_mistake = `Keep this under ${limits.max_common_mistake_chars} characters.`;
    }
  }
  if (screen === 4) {
    const rate = Number(form.hourly_rate);
    if (blank(form.hourly_rate) || !Number.isFinite(rate) || rate < 1) e.hourly_rate = "Enter your hourly rate in rupees.";
    else if (rate > limits.max_hourly_rate) {
      e.hourly_rate = `The maximum rate is ₹${limits.max_hourly_rate.toLocaleString("en-IN")} per hour.`;
    }
    if (!form.session_durations.length) e.session_durations = "Choose at least one session length.";
    const { availability, error } = cleanAvailability(form.availability, limits.max_slots_per_day);
    if (error) e.availability = error;
    else if (!Object.keys(availability).length) e.availability = "Add at least one weekly time slot.";
  }
  if (screen === 5) {
    if (!status?.registered_email_verified) {
      e.registered_email = "Verify your registered email with the code we send you.";
    }
    // Work proof is asked only from mentors who are currently working.
    if (form.employment_status !== "not_working") {
      if (form.has_no_work_email) {
        if (!status?.proof_document_name) e.proof_document = "Upload a proof document.";
      } else if (!workEmailVerified) {
        e.work_email = "Verify your work email, or choose the no-work-email option.";
      }
    }
    if (!form.accept_code_of_conduct) e.code_of_conduct = "Please accept the code of conduct.";
  }
  return e;
}

/** Turn the API's { "3": ["topics"] } "missing" map into { topics: "..." } plus the first screen to open. */
function missingToErrors(missing) {
  const errors = {};
  let firstScreen = null;
  for (const [section, fields] of Object.entries(missing || {})) {
    const screen = SECTION_TO_SCREEN[Number(section)];
    if (screen && (firstScreen === null || screen < firstScreen)) firstScreen = screen;
    for (const field of fields) errors[field] = "This is required.";
  }
  return { errors, firstScreen };
}

function AvailabilityGrid({ value, onChange, maxSlots, timezone, onTimezone, error }) {
  const zones = TIMEZONES.some(([id]) => id === timezone)
    ? TIMEZONES
    : [[timezone, timezone], ...TIMEZONES];

  const setDay = (day, slots) => {
    const next = { ...value };
    if (slots === null) delete next[day];
    else next[day] = slots;
    onChange(next);
  };

  const splitSlot = (slot) => {
    const [start = "", end = ""] = String(slot).split("-");
    return [start, end];
  };

  return (
    <div className={`mentor-availability${error ? " has-error" : ""}`} data-field="availability">
      <div className="mentor-availability-zone">
        <label htmlFor="mentor-timezone">Times are in</label>
        <select id="mentor-timezone" value={timezone} onChange={(e) => onTimezone(e.target.value)}>
          {zones.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </div>

      {Object.entries(DAY_LABELS).map(([day, label]) => {
        const slots = value[day];
        const on = Array.isArray(slots);
        return (
          <div className="mentor-availability-day" key={day}>
            <label className="mentor-availability-toggle">
              <input
                type="checkbox"
                checked={on}
                onChange={(e) => setDay(day, e.target.checked ? ["18:00-20:00"] : null)}
              />
              <span>{label}</span>
            </label>
            {on && (
              <div className="mentor-availability-slots">
                {slots.map((slot, index) => {
                  const [start, end] = splitSlot(slot);
                  const change = (nextStart, nextEnd) => {
                    const copy = [...slots];
                    copy[index] = `${nextStart}-${nextEnd}`;
                    setDay(day, copy);
                  };
                  return (
                    <div className="mentor-availability-slot" key={index}>
                      <input type="time" aria-label={`${label} start time`} value={start} onChange={(e) => change(e.target.value, end)} />
                      <span>to</span>
                      <input type="time" aria-label={`${label} end time`} value={end} onChange={(e) => change(start, e.target.value)} />
                      <button
                        type="button"
                        className="mentor-slot-remove"
                        aria-label={`Remove ${label} slot`}
                        onClick={() => {
                          const copy = slots.filter((_, i) => i !== index);
                          setDay(day, copy.length ? copy : null);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                {slots.length < maxSlots && (
                  <button type="button" className="mentor-slot-add" onClick={() => setDay(day, [...slots, "09:00-10:00"])}>
                    + Add a time slot
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      {error && <small className="mentor-field-error" role="alert">{error}</small>}
    </div>
  );
}

export default function BecomeMentor() {
  const { user, setUser } = useContext(AuthContext) || {};
  const mentorDashboardPath =
    user?.role === "recruiter" ? "/recruiter-dashboard/mentor-dashboard" : "/candidate-dashboard/mentor-dashboard";
  const [form, setForm] = useState(initial);

  const [status, setStatus] = useState(null);
  // Login email and name come from the signed-in account; nobody types the email.
  const registeredEmail = status?.registered_email || user?.email || "";
  useEffect(() => {
    const accountName = (status?.full_name || user?.full_name || "").trim();
    if (!accountName) return;
    setForm((f) => (String(f.full_name || "").trim() ? f : { ...f, full_name: accountName }));
  }, [status?.full_name, user?.full_name]);
  const [options, setOptions] = useState(defaultOptions);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [workEmail, setWorkEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  // Registered (login) email OTP: the address is the account email and cannot be changed.
  const [loginOtp, setLoginOtp] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpBusy, setLoginOtpBusy] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  // Comma lists are typed as text so a trailing comma or space is not eaten while typing.
  const [languagesText, setLanguagesText] = useState("English");
  const [certificationsText, setCertificationsText] = useState("");
  const [topicsText, setTopicsText] = useState("");
  const [restarting, setRestarting] = useState(false);
  const [error, setError] = useState("");
  // Why the application could not be loaded: "auth" (401), "forbidden" (403), "other"
  const [errorType, setErrorType] = useState("");
  const [message, setMessage] = useState("");
  // Open directly on the first form section instead of the welcome/sign-in gate.
  const [currentStep, setCurrentStep] = useState(1);

  const limits = { ...defaultLimits, ...(options.limits || {}) };
  const timezone = form.timezone || options.default_timezone || "Asia/Kolkata";

  const steps = [
    { title: "Welcome", short: "Start" },
    { title: "Your profile", short: "Profile" },
    { title: "Your experience", short: "Experience" },
    { title: "Your mentoring", short: "Mentoring" },
    { title: "Sessions & pricing", short: "Sessions" },
    { title: "Verification", short: "Verify" },
  ];

  const screenCtx = () => ({
    form, status, limits, workEmailVerified: Boolean(status?.work_email_verified),
  });

  // Moving forward checks the current screen first; moving back is always allowed.
  const continueFrom = (screen) => {
    const found = validateScreen(screen, screenCtx());
    setFieldErrors((old) => {
      const next = { ...old };
      SCREEN_FIELDS[screen].forEach((key) => delete next[key]); // forget this screen's old errors
      return { ...next, ...found };
    });
    const keys = Object.keys(found);
    if (keys.length) {
      setError(`Please complete: ${keys.map((k) => FIELD_LABELS[k] || k).join(", ")}.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return false;
    }
    goToStep(screen + 1);
    return true;
  };

  const goToStep = (nextStep) => {
    setCurrentStep(Math.max(0, Math.min(steps.length - 1, nextStep)));
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const update = (key, value) => {
    setForm((old) => ({ ...old, [key]: value }));
    setFieldErrors((old) => {
      if (!(key in old) && !(key === "accept_code_of_conduct" && "code_of_conduct" in old)) return old;
      const next = { ...old };
      delete next[key];
      if (key === "accept_code_of_conduct") delete next.code_of_conduct;
      return next;
    });
  };

  // Keep the comma-list text boxes in step with changes made elsewhere (pills, restored draft, server data)
  // without eating the comma the user is typing.
  useEffect(() => {
    const same = (text, list) => JSON.stringify(parseList(text)) === JSON.stringify(list);
    if (!same(languagesText, form.languages)) setLanguagesText(form.languages.join(", "));
    if (!same(certificationsText, form.certifications)) setCertificationsText(form.certifications.join(", "));
    if (!same(topicsText, form.topics)) setTopicsText(form.topics.join(", "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.languages, form.certifications, form.topics]);

  // Server-confirmed items (photo, verified email, proof) resolve their own errors.
  useEffect(() => {
    setFieldErrors((old) => {
      const next = { ...old };
      if (status?.photo_url) delete next.photo;
      if (status?.work_email_verified) delete next.work_email;
      if (status?.registered_email_verified) delete next.registered_email;
      if (status?.proof_document_name) delete next.proof_document;
      return Object.keys(next).length === Object.keys(old).length ? old : next;
    });
  }, [status]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [optionsResult, applicationResult] = await Promise.allSettled([
          mentorshipApi.getOptions(),
          mentorshipApi.getApplication(),
        ]);

        if (!active) return;

        if (optionsResult.status === "fulfilled") {
          setOptions((old) => ({
            ...old,
            ...optionsResult.value,
          }));
        }

        if (applicationResult.status === "fulfilled") {
          const current = applicationResult.value;
          setStatus(current);
          let restored = normaliseApplication(current);
          // Bring back what the visitor typed before signing in (only onto a fresh application).
          if (["not_started", "draft"].includes(current.status)) {
            const draft = readDraft();
            if (draft) {
              restored = { ...restored, ...draft };
              setMessage("We restored the details you entered before signing in. Please review them and save.");
            }
          }
          setForm(restored);
          setWorkEmail("");
          setErrorType("");
        } else {
          const err = applicationResult.reason;
          const code = err?.response?.status;

          if (code === 401) {
            // Let visitors fill the form first. The existing backend still requires
            // a signed-in candidate or recruiter account for saving, uploads, OTP verification,
            // and final submission.
            setErrorType("auth");
            setError("");
            const draft = readDraft();
            if (draft) setForm((old) => ({ ...old, ...draft }));
            setMessage(
              "You can fill in the application form now. Please sign in with your candidate or recruiter account before saving, uploading files, verifying your work email, or submitting. Your entries are not saved until you sign in."
            );
          } else if (code === 403) {
            // Signed in, but this account is not allowed to apply
            setErrorType("forbidden");
            setError(
              err?.response?.data?.detail ||
                "This account can't apply as a mentor. Mentor applications are open to candidate and recruiter accounts."
            );
          } else {
            setErrorType("other");
            setError(errorText(err));
          }
        }

        if (optionsResult.status === "rejected") {
          console.error("Could not load mentor options:", optionsResult.reason);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  // While signed out, keep the typed answers in this tab so signing in does not lose them.
  useEffect(() => {
    if (errorType === "auth") writeDraft(form);
  }, [form, errorType]);

  function pickFrom(source, keys) {
    return Object.fromEntries(keys.map((key) => [key, source[key]]));
  }

  const save = async ({ quiet = false, sectionsOnly = null } = {}) => {
    setSaving(true);
    setError("");
    if (!quiet) setMessage("");

    try {
      let currentStatus = status;

      if (!currentStatus || currentStatus.status === "not_started") {
        currentStatus = await mentorshipApi.startApplication();
        setStatus(currentStatus);
      }

      if (currentStatus?.can_edit === false) {
        throw new Error("This application is locked and can no longer be edited.");
      }

      let availability = form.availability || {};
      if (!sectionsOnly || sectionsOnly.includes(5)) {
        const result = cleanAvailability(availability, limits.max_slots_per_day);
        if (result.error) throw new Error(result.error);
        availability = result.availability;
      }

      const data = { ...form, availability };

      // Name: saved on the account so the dashboard profile, mentor profile and bookings all show the same name.
      const newName = String(form.full_name || "").trim();
      if ((!sectionsOnly || sectionsOnly.includes(1)) && newName.length >= 2 && newName !== (user?.full_name || "").trim()) {
        const me = await mentorshipApi.updateAccountName(newName);
        if (setUser) setUser((u) => (u ? { ...u, full_name: me?.full_name ?? newName } : u));
      }

      const groups = [
        {
          section: 1,
          data: pickFrom(data, [
            "city", "country", "languages", "linkedin_url",
          ]),
        },
        {
          section: 2,
          data: pickFrom(data, [
            "employment_status", "job_title", "company_name", "hide_company",
            "company_display_label", "years_experience", "risk_areas",
            "highest_qualification", "certifications", "past_roles",
          ]),
        },
        {
          section: 3,
          data: pickFrom(data, [
            "topics", "audiences", "session_types", "help_summary",
          ]),
        },
        {
          section: 4,
          data: pickFrom(data, ["real_moment", "common_mistake"]),
        },
        {
          section: 5,
          data: pickFrom(data, [
            "session_durations", "hourly_rate", "availability", "timezone",
          ]),
        },
        {
          section: 6,
          data: pickFrom(data, [
            "has_no_work_email", "note_for_team",
            "accept_code_of_conduct",
          ]),
        },
      ];

      const groupsToSave = sectionsOnly
        ? groups.filter((group) => sectionsOnly.includes(group.section))
        : groups;
      let latest = currentStatus;

      for (const group of groupsToSave) {
        latest = await mentorshipApi.saveSection(group.section, group.data);
      }

      setStatus(latest);
      if (!sectionsOnly || sectionsOnly.includes(5)) update("availability", availability);
      clearDraft(); // the server now has this data
      if (!quiet) {
        setMessage("Your application draft has been saved.");
        toast.success("Application saved");
      }

      return latest;
    } catch (err) {
      if (isAuthError(err)) {
        writeDraft(form);
        setErrorType("auth");
        setStatus(null);
        const text = "Please sign in to save your application. What you have typed is kept in this browser tab.";
        setError(text);
        if (!quiet) toast.error("Please sign in first");
      } else {
        const text = errorText(err);
        setError(text);
        if (!quiet) toast.error(text);
      }
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Shared handler for the small actions (upload, OTP...). 401 means "sign in", not "something broke".
  const failAction = (err) => {
    if (isAuthError(err)) {
      writeDraft(form);
      setErrorType("auth");
      setError("Please sign in with your candidate or recruiter account to continue. What you have typed is kept in this browser tab.");
      toast.error("Please sign in first");
      return;
    }
    const text = errorText(err);
    setError(text);
    toast.error(text);
  };

  const handleUpload = async (kind, file) => {
    if (!file) return;

    setError("");
    setMessage("");
    setUploading(kind);

    try {
      const current = status;

      if (!current || current.status === "not_started") {
        const started = await mentorshipApi.startApplication();
        setStatus(started);
      }

      await mentorshipApi.uploadFile(kind, file);

      const updated = await mentorshipApi.getApplication();
      setStatus(updated);
      setMessage(
        kind === "photo"
          ? "Profile photo uploaded."
          : kind === "video"
            ? "Introduction video uploaded."
            : "Verification document uploaded."
      );
      toast.success("File uploaded successfully");
    } catch (err) {
      failAction(err);
    } finally {
      setUploading("");
    }
  };

  const removeUpload = async (kind) => {
    setError("");
    setUploading(kind);

    try {
      await mentorshipApi.removeFile(kind);
      const updated = await mentorshipApi.getApplication();
      setStatus(updated);
      setMessage("File removed.");
      toast.success("File removed");
    } catch (err) {
      failAction(err);
    } finally {
      setUploading("");
    }
  };

  const sendOtp = async () => {
    if (!workEmail.trim()) {
      setError("Enter your professional work email first.");
      return;
    }

    setSendingOtp(true);
    setError("");
    setMessage("");

    try {
      if (!status || status.status === "not_started") {
        const started = await mentorshipApi.startApplication();
        setStatus(started);
      }

      await mentorshipApi.sendWorkEmailOtp(workEmail.trim());
      setOtpSent(true);
      setMessage("Verification code sent. Check your work email.");
      toast.success("Verification code sent");
    } catch (err) {
      failAction(err);
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Enter the 6-digit code sent to your work email.");
      return;
    }

    setVerifyingOtp(true);
    setError("");
    setMessage("");

    try {
      await mentorshipApi.verifyWorkEmailOtp(otp.trim());
      const updated = await mentorshipApi.getApplication();
      setStatus(updated);
      setMessage("Your work email has been verified successfully.");
      setOtpSent(false);
      setOtp("");
      toast.success("Work email verified");
    } catch (err) {
      failAction(err);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const ensureStarted = async () => {
    if (!status || status.status === "not_started") {
      const started = await mentorshipApi.startApplication();
      setStatus(started);
    }
  };

  const sendLoginOtp = async () => {
    setLoginOtpBusy("send");
    setError("");
    setMessage("");
    try {
      await ensureStarted();
      const res = await mentorshipApi.sendRegisteredEmailOtp();
      setLoginOtpSent(true);
      setMessage(`Verification code sent to ${res?.email || status?.registered_email || "your registered email"}.`);
      toast.success("Verification code sent");
    } catch (err) {
      failAction(err);
    } finally {
      setLoginOtpBusy("");
    }
  };

  const verifyLoginOtp = async () => {
    if (!/^\d{6}$/.test(loginOtp.trim())) {
      setError("Enter the 6-digit code sent to your registered email.");
      return;
    }
    setLoginOtpBusy("verify");
    setError("");
    setMessage("");
    try {
      const updated = await mentorshipApi.verifyRegisteredEmailOtp(loginOtp.trim());
      setStatus(updated?.status ? updated : await mentorshipApi.getApplication());
      setLoginOtp("");
      setLoginOtpSent(false);
      setMessage("Your registered email has been verified.");
      toast.success("Registered email verified");
    } catch (err) {
      failAction(err);
    } finally {
      setLoginOtpBusy("");
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    // Pressing Enter inside a field on an earlier screen must not submit the application.
    if (currentStep < steps.length - 1) {
      continueFrom(currentStep);
      return;
    }

    // Check every screen first, then open the first incomplete one.
    const all = {};
    let firstScreen = null;
    for (let screen = 1; screen <= 5; screen += 1) {
      const found = validateScreen(screen, screenCtx());
      if (Object.keys(found).length && firstScreen === null) firstScreen = screen;
      Object.assign(all, found);
    }
    if (firstScreen !== null) {
      setFieldErrors(all);
      setCurrentStep(firstScreen);
      setMessage("");
      setError(`Please complete: ${Object.keys(all).map((k) => FIELD_LABELS[k] || k).join(", ")}.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");
    setFieldErrors({});

    try {
      await save({ quiet: true });

      const result = await mentorshipApi.submitApplication();
      clearDraft();
      setStatus(result);
      setMessage(result.message || "Your application has been submitted for review.");
      toast.success("Application submitted for review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const missing = err?.response?.data?.missing;
      if (missing && typeof missing === "object") {
        // The server disagrees with the browser check: show exactly what it says is missing.
        const { errors, firstScreen: screen } = missingToErrors(missing);
        setFieldErrors(errors);
        if (screen) setCurrentStep(screen);
        setError(`Please complete: ${Object.keys(errors).map((k) => FIELD_LABELS[k] || k).join(", ")}.`);
      } else if (!isAuthError(err)) {
        const text = errorText(err);
        setError(text);
        toast.error(text);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  // After a rejection (and once the wait period is over) the mentor starts a fresh application.
  const startAgain = async () => {
    setRestarting(true);
    setError("");
    try {
      const started = await mentorshipApi.startApplication();
      setStatus(started);
      setForm(normaliseApplication(started));
      setFieldErrors({});
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const text = errorText(err);
      setError(text);
      toast.error(text);
    } finally {
      setRestarting(false);
    }
  };

  if (loading) {
    return (
      <main className="mentorship-page">
        <p className="mentor-state">Loading your application…</p>
      </main>
    );
  }

  /* The application could not be loaded: show the right message for the cause */
  if (errorType && !status && errorType !== "auth") {
    const isAuth = errorType === "auth";
    const isForbidden = errorType === "forbidden";

    return (
      <main className="mentorship-page mentor-application-state">
        <div className="mentor-status-icon">!</div>
        <span className="mentor-eyebrow">MENTOR APPLICATION</span>
        <h1>
          {isAuth
            ? "Sign in to continue"
            : isForbidden
              ? "This account can't apply as a mentor"
              : "Something went wrong"}
        </h1>
        <p>{error}</p>

        {isForbidden && (
          <p>Admin accounts can't apply. Sign in with a candidate or recruiter account to continue.</p>
        )}

        {errorType === "other" && (
          <button
            type="button"
            className="mentor-btn mentor-btn-primary"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        )}

        <p style={{ marginTop: 16 }}>
          <Link to="/mentorship">Back to mentorship</Link>
        </p>
      </main>
    );
  }

  if (status?.status && !isEditableStatus(status.status)) {
    const state = status.status;
    const reapplyDate = formatDate(status.can_reapply_after);
    const mustWait = isFutureDate(status.can_reapply_after);

    return (
      <main className="mentorship-page mentor-application-state">
        <div className={`mentor-status-icon${state === "rejected" || state === "suspended" ? " is-warning" : ""}`}>
          {state === "rejected" || state === "suspended" ? "!" : "✓"}
        </div>
        <span className="mentor-eyebrow">MENTOR APPLICATION</span>

        {state === "approved" && (
          <>
            <h1>Your mentor profile is approved.</h1>
            <p>Your profile is live in the TConnects mentor directory.</p>
            {status.has_pending_changes && (
              <p className="mentor-state-note">
                You have changes waiting for review. Your previous details stay live until they are approved.
              </p>
            )}
            <div className="mentor-state-actions">
              <Link className="mentor-btn mentor-btn-primary" to={mentorDashboardPath}>
                Open my mentor dashboard
              </Link>
              {status.slug && (
                <Link className="mentor-btn mentor-btn-outline" to={`/mentorship/mentors/${status.slug}`}>
                  View my public profile
                </Link>
              )}
              <Link className="mentor-btn mentor-btn-outline" to="/mentorship">Back to mentorship</Link>
            </div>
          </>
        )}

        {state === "submitted" && (
          <>
            <h1>Your application is with our review team.</h1>
            <p>
              We usually reply within 3 to 5 days and will email you the result. Your profile will not be
              published or bookable until all checks are completed and approved.
            </p>
            <Link className="mentor-btn mentor-btn-primary" to="/mentorship">Back to mentorship</Link>
          </>
        )}

        {state === "rejected" && (
          <>
            <h1>We couldn't approve your application this time.</h1>
            {status.review_message && (
              <blockquote className="mentor-state-quote">{status.review_message}</blockquote>
            )}
            <p>
              {mustWait
                ? `You can apply again from ${reapplyDate}.`
                : "You are welcome to submit a new application."}
            </p>
            {error && <p className="mentor-error" role="alert">{error}</p>}
            <div className="mentor-state-actions">
              {!mustWait && (
                <button type="button" className="mentor-btn mentor-btn-primary" onClick={startAgain} disabled={restarting}>
                  {restarting ? "Starting…" : "Start a new application"}
                </button>
              )}
              <Link className="mentor-btn mentor-btn-outline" to="/mentorship">Back to mentorship</Link>
            </div>
          </>
        )}

        {state === "suspended" && (
          <>
            <h1>Your mentor profile is currently suspended.</h1>
            {status.review_message && (
              <blockquote className="mentor-state-quote">{status.review_message}</blockquote>
            )}
            <p>Your profile is hidden from the directory and you will not receive new bookings. Please contact TConnects support if you have questions.</p>
            <Link className="mentor-btn mentor-btn-outline" to="/mentorship">Back to mentorship</Link>
          </>
        )}

        {!["approved", "submitted", "rejected", "suspended"].includes(state) && (
          <>
            <h1>Your application status has been updated.</h1>
            <p>{status.review_message || "Please check back soon."}</p>
            <Link className="mentor-btn mentor-btn-primary" to="/mentorship">Back to mentorship</Link>
          </>
        )}
      </main>
    );
  }

  const photoUrl = status?.photo_url;
  const videoUrl = status?.intro_video_url;
  const proofName = status?.proof_document_name;
  const workEmailVerified = Boolean(status?.work_email_verified);

  return (
    <main className="mentorship-page become-mentor-page">
      {currentStep > 0 && (
        <section className="become-mentor-intro">
          <span className="mentor-eyebrow">
            TCONNECTS VERIFIED MENTOR NETWORK
          </span>
          <h1>Your experience can shape someone's future.</h1>
          <p>
            Tell us about your professional background and what you can help
            others learn. The application takes around 5–6 minutes. Final
            onboarding includes independent verification and a quality review.
          </p>
          <div className="mentor-review-points">
            <span><i className="bi bi-shield-check" /> Professional checks</span>
            <span><i className="bi bi-person-check" /> Human review</span>
            <span><i className="bi bi-patch-check" /> Approval before listing</span>
          </div>
        </section>
      )}

      {error && (
        <div className="mentor-form-alert error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="mentor-form-alert success" role="status">
          {message}
        </div>
      )}

      {errorType === "auth" && (
        <div className="mentor-form-alert error" role="status">
          <strong>Sign in to save your progress.</strong>{" "}
          <Link to={SIGN_IN_URL}>Sign in with your candidate or recruiter account</Link>. What you have typed stays in this
          browser tab and will be restored after you sign in.
        </div>
      )}

      {status?.status === "changes_requested" && status.review_message && (
        <div className="mentor-form-alert error" role="status">
          <strong>Changes requested by the review team:</strong>{" "}
          {status.review_message}
        </div>
      )}

      <form className="mentor-application-form" onSubmit={submit} noValidate>
        {currentStep > 0 && (
          <div className="mentor-wizard-top">
            <div className="mentor-wizard-topline">
              <span className="mentor-section-kicker">MENTOR APPLICATION</span>
              <span className="mentor-wizard-count">Step {currentStep} of {steps.length - 1}</span>
            </div>
            <div className="mentor-wizard-progress" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length - 1} aria-valuenow={currentStep}>
              <span style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
            </div>
            <div className="mentor-wizard-step-labels">
              {steps.slice(1).map((step, index) => (
                <button key={step.short} type="button" className={currentStep === index + 1 ? "active" : currentStep > index + 1 ? "complete" : SCREEN_SECTIONS[index + 1].every((sec) => status?.completion?.[sec]) ? "done" : ""} onClick={() => currentStep > index + 1 && goToStep(index + 1)} disabled={currentStep <= index + 1}>
                  <span>{currentStep > index + 1 ? "✓" : index + 1}</span>{step.short}
                  {Object.keys(fieldErrors).some((k) => SCREEN_FIELDS[index + 1]?.includes(k)) && <em className="mentor-step-flag" title="Needs attention">!</em>}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 0 && (
          <section className="mentor-welcome-step">
            <div className="mentor-welcome-copy">
              <span className="mentor-welcome-icon"><i className="bi bi-stars" /></span>
              <span className="mentor-section-kicker">TCONNECTS VERIFIED MENTOR NETWORK</span>
              <h2>Turn your experience into someone else's next opportunity.</h2>
              <p>Build your mentor profile in a few short steps. Choose from simple options, save your progress, and return whenever you're ready.</p>
              <div className="mentor-welcome-benefits">
                <div><i className="bi bi-clock" /><span><b>About 5–6 minutes</b><small>Complete it at your own pace</small></span></div>
                <div><i className="bi bi-cloud-check" /><span><b>Save and come back</b><small>Your draft can be continued later</small></span></div>
                <div><i className="bi bi-shield-check" /><span><b>Private verification</b><small>Your profile is reviewed before publishing</small></span></div>
              </div>
              <button type="button" className="mentor-btn mentor-btn-primary mentor-welcome-cta" onClick={() => goToStep(1)}>Build my profile <i className="bi bi-arrow-right" /></button>
              <p className="mentor-welcome-footnote">You can review your details before submitting. Your profile will not be public or bookable until TConnects approves it.</p>
            </div>
            <div className="mentor-welcome-art" aria-hidden="true">
              <div className="mentor-welcome-orbit orbit-a" /><div className="mentor-welcome-orbit orbit-b" />
              <div className="mentor-welcome-card"><span className="mentor-welcome-card-icon"><i className="bi bi-person-check" /></span><small>YOUR NEXT CHAPTER</small><strong>Share what you know.<br/>Help someone grow.</strong><div className="mentor-welcome-mini-tags"><span>Risk expertise</span><span>Career guidance</span><span>Real impact</span></div></div>
              <div className="mentor-welcome-floating"><i className="bi bi-patch-check-fill" /><span><b>Verified mentors</b><small>Trust comes first</small></span></div>
            </div>
          </section>
        )}

        {currentStep === 1 && (
          <section className="mentor-form-section">
          <div className="mentor-form-section-heading">
            <div>
              <span className="mentor-section-kicker">YOUR PROFILE</span>
              <h2>Let's get to know you</h2>
              <p>Use the details that match your professional records.</p>
            </div>
          </div>

          <div className="mentor-form-grid">
            <Field
              label="Full name"
              name="full_name"
              required
              error={fieldErrors.full_name}
              hint="Taken from your profile. Changing it here also updates your dashboard profile."
            >
              <input
                required
                maxLength={200}
                autoComplete="name"
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                placeholder="Your full name"
              />
            </Field>

            <Field
              label="Email address"
              hint={registeredEmail ? "Your login email, filled in from your account. It can't be changed; you will verify it with a code in the last step." : "Sign in to see your login email."}
            >
              <div className="mb-locked mb-scope">
                <input type="email" value={registeredEmail} readOnly aria-readonly="true" placeholder="Your account email" />
                <i className="bi bi-lock-fill" aria-hidden="true" />
              </div>
            </Field>

            <Field label="City" name="city" required error={fieldErrors.city}>
              <input
                required
                maxLength={100}
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="e.g. Chennai"
              />
            </Field>

            <Field label="Country" name="country" required error={fieldErrors.country}>
              <input
                required
                maxLength={100}
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
              />
            </Field>

            <Field
              label="LinkedIn profile"
              hint="Used to review your professional background."
              name="linkedin_url"
              required
              error={fieldErrors.linkedin_url}
            >
              <input
                type="url"
                required
                value={form.linkedin_url}
                onChange={(e) => update("linkedin_url", e.target.value)}
                placeholder="https://www.linkedin.com/in/your-name"
              />
            </Field>

            <Field
              label="Languages you can mentor in"
              hint="Separate languages with commas."
              name="languages"
              required
              error={fieldErrors.languages}
            >
              <input
                required
                value={languagesText}
                onChange={(e) => {
                  setLanguagesText(e.target.value);
                  update(
                    "languages",
                    parseList(e.target.value).slice(0, 8)
                  );
                }}
                placeholder="English, Tamil"
              />
            </Field>
          </div>

          <Field
            label="Professional profile photo"
            hint={`JPG, PNG or WebP. Maximum ${limits.max_photo_mb || 5} MB. A photo is required to submit.`}
            name="photo"
            required
            error={fieldErrors.photo}
          >
            {photoUrl && (
              <div style={{ marginBottom: 12 }}>
                <img
                  src={photoUrl}
                  alt="Current mentor profile"
                  style={{
                    width: 110,
                    height: 110,
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
                <p>
                  <button
                    type="button"
                    className="mentor-btn mentor-btn-outline"
                    disabled={Boolean(uploading)}
                    onClick={() => removeUpload("photo")}
                  >
                    Remove photo
                  </button>
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                handleUpload("photo", e.target.files?.[0]);
                e.target.value = "";
              }}
              disabled={Boolean(uploading)}
            />
            {uploading === "photo" && <small>Uploading photo…</small>}
          </Field>
        </section>
        )}

        {currentStep === 2 && (
          <section className="mentor-form-section">
          <div className="mentor-form-section-heading">
            <div>
              <span className="mentor-section-kicker">YOUR EXPERIENCE</span>
              <h2>What have you worked on?</h2>
              <p>We review professional experience as part of our quality checks.</p>
            </div>
          </div>

          <Field label="Employment status" name="employment_status" required error={fieldErrors.employment_status}>
            <div className="mentor-select-pills" role="radiogroup" aria-label="Employment status">
              {(options.employment_statuses?.length
                ? options.employment_statuses
                : [{ value: "working", label: "Currently working" }, { value: "not_working", label: "Not working" }]
              ).map((opt) => {
                const option = typeof opt === "string" ? { value: opt, label: opt } : opt;
                const label = option.value === "working" ? "Currently working" : option.value === "not_working" ? "Not working right now" : option.label;
                const checked = form.employment_status === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    role="radio"
                    aria-checked={checked}
                    className={`mentor-select-pill ${checked ? "selected" : ""}`}
                    onClick={() => update("employment_status", option.value)}
                  >
                    {checked ? "✓ " : ""}{label}
                  </button>
                );
              })}
            </div>
            <small>
              {form.employment_status === "not_working"
                ? "No current job details or work email are needed. Our team reviews your experience and personal details by hand."
                : "Add your current role. You will verify your work email (or upload a proof document) in the last step."}
            </small>
          </Field>

          <div className="mentor-form-grid">
            {form.employment_status !== "not_working" && (
            <>
            <Field label="Current job title" name="job_title" required error={fieldErrors.job_title}>
              <input
                required
                value={form.job_title}
                onChange={(e) => update("job_title", e.target.value)}
                placeholder="e.g. Senior Risk Analyst"
              />
            </Field>

            <Field label="Current company" name="company_name" required error={fieldErrors.company_name}>
              <input
                required
                value={form.company_name}
                onChange={(e) => update("company_name", e.target.value)}
                placeholder="Company or organisation"
              />
            </Field>
            </>
            )}

            <Field label="Years of relevant experience" name="years_experience" required error={fieldErrors.years_experience}>
              <input
                required
                type="number"
                min="0"
                max="60"
                value={form.years_experience}
                onChange={(e) => update("years_experience", e.target.value)}
                placeholder="e.g. 5"
              />
            </Field>

            <Field label="Highest qualification" name="highest_qualification" required error={fieldErrors.highest_qualification}>
              <input
                required
                value={form.highest_qualification}
                onChange={(e) => update("highest_qualification", e.target.value)}
                placeholder="Degree or professional qualification"
              />
            </Field>
          </div>

          <Field label="Risk-management areas you specialise in" name="risk_areas" required error={fieldErrors.risk_areas}>
            <CheckPills
              values={options.risk_areas}
              selected={form.risk_areas}
              onChange={(v) => update("risk_areas", v)}
            />
          </Field>

          <Field
            label="Certifications"
            hint="Separate multiple certifications with commas."
          >
            <input
              value={certificationsText}
              onChange={(e) => {
                setCertificationsText(e.target.value);
                update(
                  "certifications",
                  parseList(e.target.value).slice(0, 10)
                );
              }}
              placeholder="e.g. CISA, CRISC, FRM"
            />
            {options.certification_suggestions?.length > 0 && (
              <small>
                Suggestions: {options.certification_suggestions.join(", ")}
              </small>
            )}
          </Field>

          {form.employment_status !== "not_working" && (
          <Field label="Display company name publicly?">
            <div className="mentor-inline-choice">
              <label>
                <input
                  type="checkbox"
                  checked={form.hide_company}
                  onChange={(e) => update("hide_company", e.target.checked)}
                />
                Keep my company name private on my public profile
              </label>
            </div>
          </Field>
          )}

          {form.employment_status !== "not_working" && form.hide_company && (
            <Field
              label="Public company label"
              hint="For example: Leading financial services firm."
              name="company_display_label"
              required
              error={fieldErrors.company_display_label}
            >
              <input
                required
                value={form.company_display_label}
                onChange={(e) => update("company_display_label", e.target.value)}
                placeholder="A non-identifying description"
              />
            </Field>
          )}
        </section>
        )}

        {currentStep === 3 && (
          <section className="mentor-form-section">
          <div className="mentor-form-section-heading">
            <div>
              <span className="mentor-section-kicker">YOUR MENTORING</span>
              <h2>What can people learn from you?</h2>
              <p>Help candidates understand where your guidance is most useful.</p>
            </div>
          </div>

          <Field label="Topics you can help with" name="topics" required error={fieldErrors.topics}>
            <CheckPills
              values={options.topic_suggestions || []}
              selected={form.topics}
              onChange={(v) => update("topics", v)}
              max={limits.max_topics}
            />
            <small>Select up to {limits.max_topics} topics ({form.topics.length} chosen).</small>
          </Field>

          <Field
            label="Additional topics"
            hint={`Optional. Separate topics with commas; total topics must not exceed ${limits.max_topics}.`}
          >
            <input
              value={topicsText}
              onChange={(e) => {
                setTopicsText(e.target.value);
                update(
                  "topics",
                  parseList(e.target.value).map((x) => x.slice(0, 60)).slice(0, limits.max_topics)
                );
              }}
              placeholder="e.g. Risk reporting, stakeholder communication"
            />
          </Field>

          <div className="mentor-form-grid">
            <Field label="Who would you like to mentor?" name="audiences" required error={fieldErrors.audiences}>
              <CheckPills
                values={options.audiences}
                selected={form.audiences}
                onChange={(v) => update("audiences", v)}
              />
            </Field>

            <Field label="Session formats" name="session_types" required error={fieldErrors.session_types}>
              <CheckPills
                values={options.session_types}
                selected={form.session_types}
                onChange={(v) => update("session_types", v)}
              />
            </Field>
          </div>

          <Field
            label="What can a mentee expect from a session?"
            name="help_summary"
            required
            error={fieldErrors.help_summary}
            hint={`${form.help_summary.length}/${limits.max_help_summary_chars} characters`}
          >
            <textarea
              required
              rows={3}
              maxLength={limits.max_help_summary_chars}
              value={form.help_summary}
              onChange={(e) => update("help_summary", e.target.value)}
              placeholder="Describe the practical guidance or outcomes you can offer…"
            />
          </Field>

          <div className="mentor-form-grid">
            <Field
              label="Share a real-world risk challenge you handled"
              hint={`At least ${limits.min_real_moment_chars} characters (${form.real_moment.trim().length} so far). Do not include confidential company or client information.`}
              name="real_moment"
              required
              error={fieldErrors.real_moment}
            >
              <textarea
                required
                rows={4}
                maxLength={limits.max_real_moment_chars}
                value={form.real_moment}
                onChange={(e) => update("real_moment", e.target.value)}
                placeholder="Briefly describe the challenge, your approach, and the outcome…"
              />
            </Field>

            <Field
              label="What is a common mistake you help people avoid?"
              name="common_mistake"
              required
              error={fieldErrors.common_mistake}
              hint={`${form.common_mistake.length}/${limits.max_common_mistake_chars} characters`}
            >
              <textarea
                required
                rows={4}
                maxLength={limits.max_common_mistake_chars}
                value={form.common_mistake}
                onChange={(e) => update("common_mistake", e.target.value)}
                placeholder="Describe a practical lesson you teach…"
              />
            </Field>
          </div>

          <Field
            label="Introduction video (optional)"
            hint="MP4, MOV or WebM. Maximum 50 MB."
          >
            {videoUrl && (
              <p>
                <a href={videoUrl} target="_blank" rel="noreferrer">
                  View uploaded introduction video
                </a>{" "}
                <button
                  type="button"
                  className="mentor-btn mentor-btn-outline"
                  disabled={Boolean(uploading)}
                  onClick={() => removeUpload("video")}
                >
                  Remove
                </button>
              </p>
            )}
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={(e) => {
                handleUpload("video", e.target.files?.[0]);
                e.target.value = "";
              }}
              disabled={Boolean(uploading)}
            />
            {uploading === "video" && <small>Uploading video…</small>}
          </Field>
        </section>
        )}

        {currentStep === 4 && (
          <section className="mentor-form-section">
          <div className="mentor-form-section-heading">
            <div>
              <span className="mentor-section-kicker">SESSIONS & PRICING</span>
              <h2>Set your mentoring preferences</h2>
              <p>Proposed details are subject to TConnects review and approval.</p>
            </div>
          </div>

          <div className="mentor-form-grid">
            <Field
              label="Proposed hourly rate (₹)"
              name="hourly_rate"
              required
              error={fieldErrors.hourly_rate}
              hint={`Maximum ₹${limits.max_hourly_rate.toLocaleString("en-IN")} per hour.`}
            >
              <input
                required
                type="number"
                min="1"
                max={limits.max_hourly_rate}
                value={form.hourly_rate}
                onChange={(e) => update("hourly_rate", e.target.value)}
                placeholder="e.g. 5000"
              />
            </Field>

            <Field label="Session durations" name="session_durations" required error={fieldErrors.session_durations}>
              <CheckPills
                values={(options.session_durations || [30, 45, 60]).map((n) => ({
                  value: n,
                  label: `${n} minutes`,
                }))}
                selected={form.session_durations}
                onChange={(v) =>
                  update("session_durations", v.map(Number).sort((a, b) => a - b))
                }
              />
            </Field>
          </div>

          <div className="mentor-form-field" data-field="availability-wrap">
            <span>
              Weekly availability<b className="mentor-required" aria-hidden="true"> *</b>
            </span>
            <small>
              Switch on the days you can mentor and set your time slots. Learners will see these in your time zone
              converted to theirs.
            </small>
            <AvailabilityGrid
              value={form.availability || {}}
              onChange={(v) => update("availability", v)}
              maxSlots={limits.max_slots_per_day}
              timezone={timezone}
              onTimezone={(v) => update("timezone", v)}
              error={fieldErrors.availability}
            />
          </div>

        </section>
        )}

        {currentStep === 5 && (
          <section className="mentor-form-section">
          <div className="mentor-form-section-heading">
            <div>
              <span className="mentor-section-kicker">VERIFICATION & TRUST</span>
              <h2>Help us verify your profile</h2>
              <p>
                These checks protect learners and maintain the quality of our network.
              </p>
            </div>
          </div>

          <div className="mentor-verification-note">
            <i className="bi bi-shield-lock" />
            <div>
              <b>Verification is handled confidentially</b>
              <p>
                Our team may review professional documents, contact references
                and arrange an interview or in-person verification. Your
                application is not a public profile.
              </p>
            </div>
          </div>

          <Field label="Registered email verification" name="registered_email" required error={fieldErrors.registered_email}>
            {status?.registered_email_verified ? (
              <p>
                <i className="bi bi-patch-check-fill" /> {status.registered_email} verified
              </p>
            ) : (
              <>
                <div className="mb-locked mb-scope">
                  <input type="email" value={registeredEmail} readOnly aria-readonly="true" placeholder="Sign in to see your registered email" />
                  <i className="bi bi-lock-fill" aria-hidden="true" />
                </div>
                <small>We send a 6-digit code to the email you log in with. This email can't be changed.</small>
                {!loginOtpSent ? (
                  <button
                    type="button"
                    className="mentor-btn mentor-btn-outline"
                    disabled={Boolean(loginOtpBusy)}
                    onClick={sendLoginOtp}
                  >
                    {loginOtpBusy === "send" ? "Sending code…" : "Send code to my registered email"}
                  </button>
                ) : (
                  <>
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit code"
                    />
                    <div className="mentor-submit-actions">
                      <button
                        type="button"
                        className="mentor-btn mentor-btn-primary"
                        disabled={Boolean(loginOtpBusy) || loginOtp.length !== 6}
                        onClick={verifyLoginOtp}
                      >
                        {loginOtpBusy === "verify" ? "Verifying…" : "Verify email"}
                      </button>
                      <button
                        type="button"
                        className="mentor-btn mentor-btn-outline"
                        disabled={Boolean(loginOtpBusy)}
                        onClick={sendLoginOtp}
                      >
                        Resend code
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </Field>

          {form.employment_status === "not_working" ? (
            <div className="mentor-verification-note">
              <i className="bi bi-person-vcard" />
              <div>
                <b>No work verification needed</b>
                <p>
                  You told us you're not working right now, so we don't need a work email or employer proof.
                  Our team reviews your experience and LinkedIn profile by hand.
                </p>
              </div>
            </div>
          ) : (
          <>
          <Field label="Work email verification" name="work_email" error={fieldErrors.work_email}>
            {workEmailVerified ? (
              <p>
                <i className="bi bi-patch-check-fill" /> Work email verified
                {status?.work_email_masked
                  ? ` (${status.work_email_masked})`
                  : ""}
              </p>
            ) : (
              <>
                <input
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="name@company.com"
                  disabled={sendingOtp || verifyingOtp}
                />

                {!otpSent ? (
                  <button
                    type="button"
                    className="mentor-btn mentor-btn-outline"
                    disabled={sendingOtp || !workEmail.trim()}
                    onClick={sendOtp}
                  >
                    {sendingOtp ? "Sending code…" : "Send verification code"}
                  </button>
                ) : (
                  <>
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="Enter 6-digit code"
                    />
                    <div className="mentor-submit-actions">
                      <button
                        type="button"
                        className="mentor-btn mentor-btn-primary"
                        disabled={verifyingOtp || otp.length !== 6}
                        onClick={verifyOtp}
                      >
                        {verifyingOtp ? "Verifying…" : "Verify email"}
                      </button>
                      <button
                        type="button"
                        className="mentor-btn mentor-btn-outline"
                        disabled={sendingOtp}
                        onClick={sendOtp}
                      >
                        Resend code
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </Field>

          <label className="mentor-consent">
            <input
              type="checkbox"
              checked={form.has_no_work_email}
              disabled={workEmailVerified}
              onChange={(e) => update("has_no_work_email", e.target.checked)}
            />
            <span>
              I do not have access to a professional work email and will provide
              an alternative proof document.
            </span>
          </label>

          {form.has_no_work_email && (
            <Field
              label="Professional proof document"
              hint="PDF, JPG or PNG. Maximum 10 MB. Do not upload unnecessary personal information. Only our review team can open it."
              name="proof_document"
              required
              error={fieldErrors.proof_document}
            >
              {proofName && <p>Uploaded document: {proofName}</p>}
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png"
                onChange={(e) => {
                  handleUpload("proof", e.target.files?.[0]);
                  e.target.value = "";
                }}
                disabled={Boolean(uploading)}
              />
              {uploading === "proof" && <small>Uploading document…</small>}
              {proofName && (
                <button
                  type="button"
                  className="mentor-btn mentor-btn-outline"
                  disabled={Boolean(uploading)}
                  onClick={() => removeUpload("proof")}
                >
                  Remove document
                </button>
              )}
            </Field>
          )}
          </>
          )}

          <Field label="Anything our review team should know?">
            <textarea
              rows={3}
              maxLength={limits.max_note_for_team_chars}
              value={form.note_for_team}
              onChange={(e) => update("note_for_team", e.target.value)}
              placeholder="Optional context for the verification team"
            />
          </Field>

          <label className={`mentor-consent${fieldErrors.code_of_conduct ? " has-error" : ""}`} data-field="code_of_conduct">
            <input
              type="checkbox"
              required
              checked={form.accept_code_of_conduct}
              onChange={(e) =>
                update("accept_code_of_conduct", e.target.checked)
              }
            />
            <span>
              I confirm that the information provided is accurate, I will not
              share confidential employer or client information, and I agree to
              the TConnects mentor code of conduct and verification process.
            </span>
          </label>
        </section>
        )}

        {currentStep > 0 && (
          <div className="mentor-submit-bar mentor-wizard-footer">
            <div className="mentor-wizard-footer-copy">
              <b>{currentStep === steps.length - 1 ? "Almost there" : `Step ${currentStep} of ${steps.length - 1}`}</b>
              <span>{currentStep === steps.length - 1 ? "Submit when your details and verification are ready." : "Your answers stay on this page as you move between steps."}</span>
            </div>
            <div className="mentor-submit-actions">
              <button type="button" className="mentor-btn mentor-btn-outline" onClick={() => goToStep(currentStep - 1)} disabled={saving || submitting || Boolean(uploading)}>Back</button>
              <button type="button" className="mentor-btn mentor-btn-outline" disabled={saving || submitting || Boolean(uploading)} onClick={() => save({ sectionsOnly: ({ 1: [1], 2: [2], 3: [3, 4], 4: [5], 5: [6] })[currentStep] })}>
                {saving ? "Saving…" : "Save draft"}
              </button>
              {currentStep < steps.length - 1 ? (
                <button type="button" className="mentor-btn mentor-btn-primary" onClick={() => continueFrom(currentStep)} disabled={saving || submitting || Boolean(uploading)}>Continue <i className="bi bi-arrow-right" /></button>
              ) : (
                <button type="submit" className="mentor-btn mentor-btn-primary" disabled={saving || submitting || Boolean(uploading)}>
                  {submitting ? "Submitting…" : "Submit for verification →"}
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </main>
  );
}