import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="aboutus-wrapper">

      {/* Top Banner */}
      <section className="aboutus-banner">
        <h1>About TConnects</h1>
        <p>Your trusted gateway to professional excellence in Risk Management.</p>
      </section>

      {/* Parent Company */}
      <section className="aboutus-section">
        <h2>Our Parent Company</h2>
        <p>
          TConnects operates under the guidance of 
          <strong> Virtual Protect Security</strong>, a professional organization 
          specializing in risk management, cybersecurity, compliance, and 
          industry-aligned training services.
        </p>
        <p>
          With a strong foundation in verified practices and operational discipline, 
          Virtual Protect Security enables TConnects to deliver reliable, 
          security-driven, and professionally validated opportunities for both 
          candidates and employers.
        </p>
      </section>

      {/* Mission */}
      <section className="aboutus-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to empower individuals and organizations within the 
          risk-management ecosystem by connecting verified talent with trusted 
          employers, supporting continuous learning, and promoting meaningful 
          professional growth.
        </p>
      </section>

      {/* Values */}
      <section className="aboutus-section">
        <h2>Our Values</h2>
        <ul className="values-list">
          <li><strong>Integrity:</strong> We maintain transparency, ethics, and trust.</li>
          <li><strong>Excellence:</strong> We commit to delivering reliable and high-quality solutions.</li>
          <li><strong>Security-Driven:</strong> We follow risk and cybersecurity best practices.</li>
          <li><strong>Innovation:</strong> We encourage modern learning and evolving skill development.</li>
          <li><strong>Client Success:</strong> We help businesses build strong and dependable teams.</li>
        </ul>
      </section>

    </div>
  );
};

export default AboutUs;
