import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="aboutus-container">

      {/* ==== HERO HEADER ==== */}
      <section className="aboutus-hero">
        <div className="aboutus-hero-content">
          <h1 className="aboutus-title">About TConnects</h1>
          <p className="aboutus-subtext">
            Empowering careers. Transforming opportunities. Connecting skilled
            professionals with trusted organizations across the country.
          </p>
        </div>
      </section>

      {/* ==== PARENT COMPANY SECTION ==== */}
      <section className="about-section-card">
        <h2 className="section-heading">Our Parent Company</h2>

        <p className="section-text">
          TConnects proudly operates under the leadership of{" "}
          <a
            href="https://www.vprotectsecurity.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="parent-company-link"
          >
            Virtual Protect Security
          </a>
          , an industry-recognized organization specializing in{" "}
          <strong>
            risk management, cybersecurity, compliance, and professional
            training services.
          </strong>
        </p>

        <p className="section-text">
          With a strong foundation in verified processes, operational discipline,
          and industry-standard security frameworks, Virtual Protect Security
          equips TConnects with the expertise to deliver trusted, security-driven
          career solutions for both individuals and organizations.
        </p>
      </section>

      {/* ==== MISSION SECTION ==== */}
      <section className="about-section-card">
        <h2 className="section-heading">Our Mission</h2>
        <p className="section-text">
          To empower professionals and organizations by delivering reliable job
          opportunities, skill development programs, and recruitment solutions
          that support long-term career growth in an ever-evolving professional
          landscape.
        </p>
      </section>

      {/* ==== VALUES SECTION ==== */}
      <section className="about-section-card">
        <h2 className="section-heading">Our Values</h2>

        <ul className="values-list">
          <li>
            <strong>Integrity & Trust —</strong> Building transparent and
            dependable relationships with professionals and companies.
          </li>
          <li>
            <strong>Excellence —</strong> Delivering high-quality services
            backed by industry expertise and verified recruitment methods.
          </li>
          <li>
            <strong>Innovation —</strong> Continuously evolving to meet the
            growing needs of the security and risk management ecosystem.
          </li>
          <li>
            <strong>Commitment —</strong> Supporting career success through
            skill development, mock interviews, and professional guidance.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
