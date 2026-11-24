// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./LegalPages.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back-link">← Back to Home</Link>

        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last Updated: 19 Jun 2026</p>

        <p className="legal-intro">
          TConnects.in ("we", "our", "us") operates an online platform that connects
          job seekers, recruiters, and freelancers through its website,{" "}
          <a href="https://www.tconnects.in">https://www.tconnects.in</a>. This Privacy
          Policy explains how TConnects.in collects, uses, discloses, and safeguards
          your information when you use the TConnects.in website. By accessing or
          using TConnects.in, you agree to the terms outlined in this Privacy Policy.
        </p>

        <section className="legal-section">
          <h2>1. Information We Collect</h2>
          <p>
            TConnects.in collects different types of information depending on how
            users interact with the platform.
          </p>

          <h3>1.1 Information from Candidates on TConnects.in</h3>
          <p>When candidates register or apply for jobs/internships, we may collect:</p>
          <ul>
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>Education Details</li>
            <li>Work Experience</li>
            <li>Skills and Certifications</li>
            <li>Location</li>
            <li>Resume (uploaded files or generated content via VConnects.in)</li>
          </ul>

          <h3>1.2 Information from Recruiters on v-connects.com </h3>
          <p>When recruiters create an account, we may collect:</p>
          <ul>
            <li>Name of recruiter</li>
            <li>Email address (including company email)</li>
            <li>Phone number</li>
            <li>Company name</li>
            <li>Company description and related details</li>
          </ul>

          <h3>1.3 Information from Freelancers on TConnects.in</h3>
          <p>Freelancers using TConnects.in may provide:</p>
          <ul>
            <li>Personal and contact information</li>
            <li>Skills and experience</li>
            <li>Portfolio links (LinkedIn, GitHub, etc.)</li>
            <li>Educational background</li>
          </ul>

          <h3>1.4 Automatically Collected Information</h3>
          <p>When you use the TConnects.in website, we may automatically collect:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Pages visited on TConnects.in</li>
            <li>Time spent on the platform</li>
            <li>Log and usage data</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. How We Use Your Information</h2>
          <p>TConnects.in uses the collected data to:</p>
          <ul>
            <li>Create and manage user accounts on TConnects.in</li>
            <li>Connect candidates with recruiters through TConnects.in</li>
            <li>Process job and internship applications submitted via TConnects.in</li>
            <li>Display freelancer profiles to recruiters browsing TConnects.in</li>
            <li>Schedule and manage mock interviews</li>
            <li>Provide resume-building services through TConnects.in</li>
            <li>Improve platform performance and user experience</li>
            <li>Communicate updates, notifications, and support</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Data Sharing and Disclosure</h2>
          <p>
            TConnects.in is committed to protecting user data and does not sell
            personal information. However, data may be shared in the following
            situations:
          </p>

          <h3>3.1 Within TConnects.in Platform</h3>
          <ul>
            <li>Candidate data is shared with recruiters when applying through TConnects.in</li>
            <li>Freelancer profiles are visible to recruiters on TConnects.in</li>
          </ul>

          <h3>3.2 Service Providers</h3>
          <p>TConnects.in may share limited data with:</p>
          <ul>
            <li>Payment processors such as Razorpay</li>
            <li>Hosting and infrastructure providers supporting TConnects.in</li>
          </ul>

          <h3>3.3 Legal Requirements</h3>
          <p>
            TConnects.in may disclose information if required by applicable laws
            or government authorities.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Payments and Financial Information</h2>
          <ul>
            <li>All payments on TConnects.in are processed securely via Razorpay</li>
            <li>TConnects.in does not store credit or debit card details</li>
            <li>Payment information is handled directly by authorized third-party providers</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Cookies and Tracking Technologies</h2>
          <p>TConnects.in uses cookies and similar technologies to:</p>
          <ul>
            <li>Maintain login sessions</li>
            <li>Enhance functionality of the TConnects.in website</li>
            <li>Analyze user behavior and improve services</li>
          </ul>
          <p>Users can control cookie settings through their browser.</p>
        </section>

        <section className="legal-section">
          <h2>6. AI Resume Builder on TConnects.in</h2>
          <p>TConnects.in offers an AI-powered resume builder feature.</p>
          <ul>
            <li>User-provided data is used solely for resume generation</li>
            <li>TConnects.in does not sell or externally distribute this data</li>
            <li>Resume content remains under the control of the user</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>7. Data Retention</h2>
          <p>TConnects.in retains user data:</p>
          <ul>
            <li>As long as the account is active on TConnects.in</li>
            <li>As necessary to provide services</li>
            <li>As required by applicable laws</li>
          </ul>
          <p>Users may request deletion of their data from TConnects.in.</p>
        </section>

        <section className="legal-section">
          <h2>8. Data Security</h2>
          <p>
            TConnects.in implements appropriate technical and organizational
            security measures to protect user data. However, no system is
            completely secure, and TConnects.in cannot guarantee absolute security.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. User Rights</h2>
          <p>Users of TConnects.in have the right to:</p>
          <ul>
            <li>Access their personal data</li>
            <li>Request corrections or updates</li>
            <li>Request deletion of their account and associated data</li>
          </ul>
          <p>Requests can be made via email.</p>
        </section>

        <section className="legal-section">
          <h2>10. Third-Party Links</h2>
          <p>
            The TConnects.in website may contain links to third-party websites.
            TConnects.in is not responsible for the privacy practices of such
            external platforms.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Children's Privacy</h2>
          <p>TConnects.in is not intended for individuals under the age of 18.</p>
        </section>

        <section className="legal-section">
          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            TConnects.in reserves the right to update this Privacy Policy at any
            time. Changes will be posted on this page of the TConnects.in website.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Contact Information</h2>
          <p>
            For any questions regarding this Privacy Policy, email:{" "}
            <a href="mailto:tconnects@vprotectsecurity.com">
              tconnects@vprotectsecurity.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}