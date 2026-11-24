import { Link } from "react-router-dom";
import "./mentorship.css";

const benefits = [
  ["shield-check", "Carefully verified professionals", "Every mentor is reviewed before their profile becomes bookable."],
  ["people", "Practical industry guidance", "Learn from people with real risk-management experience."],
  ["calendar-check", "Clear session pricing", "Explore approved mentor profiles and their available session options."],
];

export default function MentorshipHome() {
  return (
    <main className="mentorship-page">
      <section className="mentor-hero">
        <div className="mentor-hero-copy">
          <span className="mentor-eyebrow">VCONNECTS · VERIFIED MENTOR NETWORK</span>
          <h1>Real experience.<br /><span>Guidance that moves you forward.</span></h1>
          <p>Connect with experienced risk-management professionals for focused, practical career guidance.</p>
          <div className="mentor-hero-actions">
            <Link className="mentor-btn mentor-btn-primary" to="/mentorship/mentors">Find a mentor <span aria-hidden="true">→</span></Link>
            <Link className="mentor-btn mentor-btn-outline" to="/mentorship/become-a-mentor">Become a mentor</Link>
          </div>
          <div className="mentor-trust-line"><span className="mentor-check">✓</span> Mentor profiles are published only after VConnects approval</div>
        </div>

        <div className="mentor-hero-art">
          <img
            className="mentor-hero-img"
            src="/assets/mentorship-hero.jpg"
            alt="A mentor guiding a professional on their career"
          />
          <div className="mentor-float-note">
            <span className="mentor-float-check">✓</span>
            <span><b>Quality first</b><small>Human-reviewed mentors</small></span>
          </div>
        </div>
      </section>

      <section className="mentor-benefits">
        {benefits.map(([icon, title, description]) => (
          <article className="mentor-benefit" key={title}>
            <div className="mentor-benefit-icon"><i className={`bi bi-${icon}`} aria-hidden="true" /></div>
            <h2>{title}</h2><p>{description}</p>
          </article>
        ))}
      </section>

      <section className="mentor-join-banner">
        <div><span className="mentor-eyebrow">FOR INDUSTRY PROFESSIONALS</span><h2>Turn your experience into someone's next opportunity.</h2><p>Apply to join the VConnects mentor network. Final onboarding includes professional verification and a quality review.</p></div>
        <Link className="mentor-btn mentor-btn-light" to="/mentorship/become-a-mentor">Apply to become a mentor <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}