import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="aboutus-wrapper">

      {/* HERO / BANNER */}
      <section className="aboutus-hero">
        <div className="aboutus-hero-content">
          <h1 className="aboutus-title">About TConnects</h1>
          <p className="aboutus-subtitle">
            Redefining opportunities in Risk Management with trust, innovation, and expertise.
          </p>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <div className="aboutus-container">

        {/* Parent Company */}
        <div className="aboutus-card">
          <h2 className="section-heading">Our Parent Company</h2>
          <p>
            TConnects proudly operates under the leadership of 
            <strong> Virtual Protect Security</strong>, an industry-recognized organization 
            specializing in <strong>risk management, cybersecurity, compliance, and 
            professional training services</strong>.
          </p>
          <p>
            With a strong foundation in verified processes, operational discipline, 
            and industry-standard security frameworks, Virtual Protect Security equips 
            TConnects with the expertise to deliver trusted, security-driven career 
            solutions for both individuals and organizations.
          </p>
        </div>

        {/* Mission */}
        <div className="aboutus-card">
          <h2 className="section-heading">Our Mission</h2>
          <p>
            To empower candidates and companies within the risk-management ecosystem 
            by enabling verified hiring, specialized skill development, and professional 
            growth through innovative, secure, and transparent digital solutions.
          </p>
        </div>

        {/* Values */}
        <div className="aboutus-card">
          <h2 className="section-heading">Our Values</h2>

          <ul className="premium-values-list">
            <li><strong>Integrity</strong> — We remain transparent, ethical, and reliable.</li>
            <li><strong>Excellence</strong> — We deliver secure, high-quality hiring and learning solutions.</li>
            <li><strong>Security</strong> — Our processes follow industry-standard cybersecurity and risk frameworks.</li>
            <li><strong>Innovation</strong> — We embrace modern tools to enable career advancement.</li>
            <li><strong>Client-Focused</strong> — We help organizations build safer, stronger, more competent teams.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
