import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="aboutus-wrapper">

      {/* ================= HERO SECTION ================= */}
      <section className="aboutus-hero">
        <div className="aboutus-hero-content">
          <h1 className="aboutus-title">About TConnects</h1>
          <p className="aboutus-subtitle">
            Empowering careers. Transforming opportunities. Connecting skilled
            professionals with trusted organizations across the country.
          </p>
        </div>
      </section>

      <div className="aboutus-container">
        {/* ================= PARENT COMPANY ================= */}
        <div className="aboutus-card">
          <h2 className="section-heading">Our Parent Company</h2>

          <p>
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

          <p>
            Built on strong foundations of verified processes, operational
            discipline, and globally aligned security frameworks, Virtual
            Protect Security enables TConnects to deliver trusted, security-driven
            career solutions tailored for both individuals and organizations.
          </p>
        </div>

        {/* ================= MISSION ================= */}
        <div className="aboutus-card">
          <h2 className="section-heading">Our Mission</h2>
          <p>
            To empower professionals and organizations by delivering reliable job
            opportunities, advanced skill development programs, and efficient
            recruitment solutions that support long-term career success in a
            continuously evolving professional landscape.
          </p>
        </div>

        {/* ================= VALUES ================= */}
        <div className="aboutus-card">
          <h2 className="section-heading">Our Values</h2>

          <ul className="premium-values-list">
            <li>
              <strong>Integrity & Trust —</strong> Building dependable, transparent
              relationships with professionals and employers.
            </li>

            <li>
              <strong>Excellence —</strong> Delivering high-quality services backed
              by experience, research, and industry best practices.
            </li>

            <li>
              <strong>Innovation —</strong> Continuously adopting modern tools,
              technologies, and methodologies to elevate the recruitment and
              career-support ecosystem.
            </li>

            <li>
              <strong>Commitment —</strong> Supporting each individual’s career
              journey through expert guidance, verified opportunities, and
              professional development resources.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
