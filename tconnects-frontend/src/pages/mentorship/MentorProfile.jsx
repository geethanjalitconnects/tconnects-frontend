import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { mentorshipApi } from "../../services/mentorshipApi";
import BookingPanel from "./booking/BookingPanel";
import "./mentorship.css";

const DAYS = [
  ["mon", "Monday"], ["tue", "Tuesday"], ["wed", "Wednesday"], ["thu", "Thursday"],
  ["fri", "Friday"], ["sat", "Saturday"], ["sun", "Sunday"],
];

const prettify = (code) =>
  String(code || "")
    .replaceAll("_", " ")
    .replace(/^./, (c) => c.toUpperCase());

const rupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const labelMap = (list = []) =>
  Object.fromEntries(list.map((item) => [item.value || item, item.label || item]));

export default function MentorProfile() {
  const { slug } = useParams();
  const [mentor, setMentor] = useState(null);
  const [options, setOptions] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setMentor(null);
    setError("");
    mentorshipApi
      .getMentor(slug)
      .then((data) => active && setMentor(data))
      .catch(() => active && setError("This mentor profile could not be found."));
    mentorshipApi
      .getOptions()
      .then((opts) => active && setOptions(opts || {}))
      .catch(() => {
        // labels fall back to prettified codes
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (error) {
    return (
      <main className="mentorship-page">
        <p className="mentor-error">{error}</p>
        <Link to="/mentorship/mentors">Back to mentors</Link>
      </main>
    );
  }
  if (!mentor) {
    return (
      <main className="mentorship-page">
        <p className="mentor-state" role="status">Loading mentor profile…</p>
      </main>
    );
  }

  const areas = labelMap(options.risk_areas);
  const audiences = labelMap(options.audiences);
  const formats = labelMap(options.session_types);
  const label = (map, code) => map[code] || prettify(code);

  const prices = Object.entries(mentor.session_prices || {})
    .map(([minutes, price]) => [Number(minutes), price])
    .sort((a, b) => a[0] - b[0]);
  const schedule = DAYS.filter(([day]) => (mentor.availability?.[day] || []).length > 0);

  return (
    <main className="mentorship-page mentor-detail-page">
      <Link className="mentor-back-link" to="/mentorship/mentors">← All mentors</Link>
      <section className="mentor-detail-card">
        <div className="mentor-detail-main">
          {mentor.photo_url ? (
            <img className="mentor-detail-avatar" src={mentor.photo_url} alt="" />
          ) : (
            <div className="mentor-detail-avatar mentor-avatar-fallback">{(mentor.full_name || "M").charAt(0)}</div>
          )}
          <span className="mentor-verified"><i className="bi bi-patch-check-fill" /> VConnects verified</span>
          <h1>{mentor.full_name}</h1>
          <p className="mentor-card-role">
            {mentor.job_title}
            {mentor.company ? ` · ${mentor.company}` : ""}
          </p>
          <p className="mentor-card-location">{[mentor.city, mentor.country].filter(Boolean).join(", ")}</p>
          <div className="mentor-chip-row">
            {(mentor.risk_areas || []).map((item) => (
              <span className="mentor-chip" key={item}>{label(areas, item)}</span>
            ))}
          </div>

          <h2>About</h2>
          <p className="mentor-long-copy">{mentor.help_summary || "This mentor has not added a public summary yet."}</p>

          {mentor.common_mistake && (
            <>
              <h2>Mentor's take</h2>
              <blockquote className="mentor-take">
                <span>A common mistake I help people avoid</span>
                {mentor.common_mistake}
              </blockquote>
            </>
          )}

          {mentor.intro_video_url && (
            <>
              <h2>Meet {String(mentor.full_name || "your mentor").split(" ")[0]}</h2>
              <video className="mentor-intro-video" controls preload="none" playsInline src={mentor.intro_video_url}>
                Your browser can't play this video.
              </video>
            </>
          )}

          {(mentor.topics || []).length > 0 && (
            <>
              <h2>Topics</h2>
              <div className="mentor-chip-row">
                {mentor.topics.map((item) => <span className="mentor-chip" key={item}>{item}</span>)}
              </div>
            </>
          )}

          {((mentor.session_types || []).length > 0 || (mentor.audiences || []).length > 0) && (
            <div className="mentor-detail-columns">
              {(mentor.session_types || []).length > 0 && (
                <div>
                  <h2>Session formats</h2>
                  <ul className="mentor-plain-list">
                    {mentor.session_types.map((item) => <li key={item}>{label(formats, item)}</li>)}
                  </ul>
                </div>
              )}
              {(mentor.audiences || []).length > 0 && (
                <div>
                  <h2>Best suited for</h2>
                  <ul className="mentor-plain-list">
                    {mentor.audiences.map((item) => <li key={item}>{label(audiences, item)}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {(mentor.languages || []).length > 0 && (
            <>
              <h2>Languages</h2>
              <p className="mentor-long-copy">{mentor.languages.join(", ")}</p>
            </>
          )}

          {(mentor.highest_qualification || (mentor.certifications || []).length > 0) && (
            <>
              <h2>Qualifications</h2>
              <p className="mentor-long-copy">
                {[mentor.highest_qualification, ...(mentor.certifications || [])].filter(Boolean).join(" · ")}
              </p>
            </>
          )}

          {mentor.past_roles?.length > 0 && (
            <>
              <h2>Professional experience</h2>
              <div className="mentor-experience-list">
                {mentor.past_roles.map((role, i) => (
                  <div key={`${role.job_title}-${i}`}>
                    <b>{role.job_title}</b>
                    <span>{[role.company_name, `${role.years} year${role.years === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="mentor-booking-panel">
          <span className="mentor-eyebrow">MENTORING RATE</span>
          <div className="mentor-rate">{rupees(mentor.hourly_rate)}<small> / hour</small></div>

          {prices.length > 0 && (
            <ul className="mentor-price-list" aria-label="Session prices">
              {prices.map(([minutes, price]) => (
                <li key={minutes}><span>{minutes} minutes</span><b>{rupees(price)}</b></li>
              ))}
            </ul>
          )}

          {schedule.length > 0 && (
            <div className="mentor-schedule">
              <h3>Usually available</h3>
              <dl>
                {schedule.map(([day, name]) => (
                  <div key={day}>
                    <dt>{name}</dt>
                    <dd>{mentor.availability[day].join(", ")}</dd>
                  </div>
                ))}
              </dl>
              <small>Times are in {mentor.timezone || "Asia/Kolkata"}.</small>
            </div>
          )}

          <BookingPanel mentor={mentor} />
        </aside>
      </section>
    </main>
  );
}
