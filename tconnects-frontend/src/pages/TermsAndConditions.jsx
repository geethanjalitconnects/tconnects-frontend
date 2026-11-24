// src/pages/TermsAndConditions.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

export default function TermsAndConditions() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back-link">← Back to Home</Link>

        <h1 className="legal-title">Terms and Conditions</h1>
        <p className="legal-updated">Last Updated: 19 Jun 2026</p>

        <p className="legal-intro">
          These Terms and Conditions govern your use of the TConnects.in website.
          By accessing or using TConnects.in, you agree to comply with these terms.
        </p>

        <section className="legal-section">
          <h2>1. Platform Overview</h2>
          <p>TConnects.in provides:</p>
          <ul>
            <li>Job listings</li>
            <li>Internship opportunities</li>
            <li>Freelancer marketplace</li>
            <li>Mock interview scheduling</li>
            <li>Resume building services</li>
          </ul>
          <p>TConnects.in acts as an intermediary platform connecting users.</p>
        </section>

        <section className="legal-section">
          <h2>2. User Registration and Accounts</h2>
          <ul>
            <li>Users must provide accurate and complete information on TConnects.in</li>
            <li>Users are responsible for maintaining account confidentiality</li>
            <li>Unauthorized use of accounts on TConnects.in must be reported immediately</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. User Roles on TConnects.in</h2>

          <h3>Candidates</h3>
          <ul>
            <li>Can apply for jobs and internships through TConnects.in</li>
            <li>Must provide accurate and updated information</li>
          </ul>

          <h3>Recruiters</h3>
          <ul>
            <li>Can post job and internship opportunities on TConnects.in</li>
            <li>Must ensure authenticity of job listings</li>
          </ul>

          <h3>Freelancers</h3>
          <ul>
            <li>Can create profiles and showcase skills on TConnects.in</li>
            <li>Are responsible for accuracy of profile information</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Job and Internship Disclaimer</h2>
          <ul>
            <li>TConnects.in does not guarantee job placement</li>
            <li>Hiring decisions are made solely by recruiters using TConnects.in</li>
            <li>TConnects.in is not responsible for employer actions</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Freelancer Marketplace Disclaimer</h2>
          <p>TConnects.in provides only a platform for interaction. TConnects.in is not responsible for:</p>
          <ul>
            <li>Contracts between users</li>
            <li>Payments between users</li>
            <li>Quality of work delivered</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Payments</h2>
          <ul>
            <li>Payments for services on TConnects.in are processed via Razorpay</li>
            <li>Users agree to pay applicable charges</li>
            <li>Payments are non-refundable unless explicitly stated by TConnects.in</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Acceptable Use Policy</h2>
          <p>Users of TConnects.in must not:</p>
          <ul>
            <li>Provide false or misleading information</li>
            <li>Upload harmful, illegal, or abusive content</li>
            <li>Attempt to hack, disrupt, or misuse TConnects.in</li>
            <li>Violate any applicable laws</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>8. Intellectual Property</h2>
          <ul>
            <li>All content available on TConnects.in is owned by the platform</li>
            <li>Users may not copy, distribute, or reuse content without permission</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>9. Limitation of Liability</h2>
          <p>TConnects.in shall not be liable for:</p>
          <ul>
            <li>Job or hiring outcomes</li>
            <li>Freelancer agreements</li>
            <li>Third-party services</li>
            <li>Indirect or consequential damages</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>10. Account Suspension and Termination</h2>
          <p>TConnects.in reserves the right to:</p>
          <ul>
            <li>Suspend or terminate user accounts</li>
            <li>Remove content that violates platform policies</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>11. Service Availability</h2>
          <p>TConnects.in does not guarantee uninterrupted or error-free service.</p>
        </section>

        <section className="legal-section">
          <h2>12. Changes to Terms</h2>
          <p>
            TConnects.in may update these Terms and Conditions at any time.
            Continued use of the website indicates acceptance of updated terms.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Governing Law</h2>
          <p>These Terms are governed by the laws of India.</p>
        </section>

        <section className="legal-section">
          <h2>14. Contact Information</h2>
          <p>
            Email:{" "}
            <a href="mailto:tconnects@vprotectsecurity.com">
              tconnects@vprotectsecurity.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}