/**
 * AIResumeGenerator.jsx  — UPDATED ACCESS GATE
 * ----------------------------------------------
 * Change 1: Removed LockedOverlay from the form — form is always open.
 * Change 2: Access gate moved into handleGenerate — redirects to /pricing
 *           if user is not logged in or not paid, before any API call.
 * All other logic preserved exactly.
 */

import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { AuthContext } from "../../context/AuthContext";
import useAccessStatus from "../../hooks/useAccessStatus";
import api from "../../config/api";
import "./AIResumeGenerator.css";

const RESUME_API_URL = import.meta.env.VITE_RESUME_API_URL || "http://127.0.0.1:8000";

async function generateResume(payload) {
  const res = await fetch(`${RESUME_API_URL}/api/generate-resume/`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  const data = await res.json();
  return data.resume;
}

/* ─────────────────────────────────────────────────────────────
   PDF Download — unchanged
   ───────────────────────────────────────────────────────────── */
async function downloadAsPDF(resumeRef) {
  if (!resumeRef.current) return;

  const element = resumeRef.current;
  const clone   = element.cloneNode(true);

  clone.style.position   = "absolute";
  clone.style.top        = "-10000px";
  clone.style.left       = "0";
  clone.style.width      = "210mm";
  clone.style.height     = "auto";
  clone.style.maxHeight  = "none";
  clone.style.overflow   = "visible";
  clone.style.background = "#ffffff";

  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale:        2,
      useCORS:      true,
      windowWidth:  clone.scrollWidth,
      windowHeight: clone.scrollHeight,
    });

    const imgData   = canvas.toDataURL("image/png");
    const pdf       = new jsPDF("p", "mm", "a4");
    const pdfWidth  = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps  = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position   = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("resume.pdf");
  } catch (err) {
    console.error("PDF generation failed", err);
  } finally {
    if (document.body.contains(clone)) document.body.removeChild(clone);
  }
}

/* ─────────────────────────────────────────────────────────────
   ResumePreview — unchanged
   ───────────────────────────────────────────────────────────── */
function ResumePreview({ resume }) {
  const {
    name, headline, contact, summary,
    skills, experience, projects, education,
  } = resume;

  return (
    <div>
      <div className="resume-header">
        <div className="resume-name">{name || "Your Name"}</div>
        {headline && <div className="resume-headline">{headline}</div>}
        <div className="resume-contact">
          {contact?.location && <span>{contact.location}</span>}
          {contact?.email    && <span>{contact.email}</span>}
          {contact?.phone    && <span>{contact.phone}</span>}
          {contact?.linkedin && <span>{contact.linkedin}</span>}
          {contact?.github   && <span>{contact.github}</span>}
        </div>
      </div>

      {summary && (
        <div className="resume-section">
          <div className="resume-section-title">Summary</div>
          <div className="resume-summary">{summary}</div>
        </div>
      )}

      {skills && (
        <div className="resume-section">
          <div className="resume-section-title">Skills</div>
          <div className="resume-skills-row">
            {skills.primary?.map((s, i)   => <span key={`p-${i}`} className="resume-tag">{s}</span>)}
            {skills.secondary?.map((s, i) => <span key={`s-${i}`} className="resume-tag">{s}</span>)}
            {skills.tools?.map((s, i)     => <span key={`t-${i}`} className="resume-tag">{s}</span>)}
          </div>
        </div>
      )}

      {experience?.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Experience</div>
          {experience.map((exp, i) => (
            <div key={i} className="resume-entry">
              <div className="resume-entry-title-row">
                <span><strong>{exp.title}</strong> · {exp.company}</span>
                <span className="resume-entry-sub">{exp.startDate} – {exp.endDate || "Present"}</span>
              </div>
              {exp.location && <div className="resume-entry-sub">{exp.location}</div>}
              {exp.bullets && (
                <ul className="resume-bullets">
                  {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {projects?.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Projects</div>
          {projects.map((p, i) => (
            <div key={i} className="resume-entry">
              <div className="resume-entry-title-row">
                <span><strong>{p.name}</strong></span>
              </div>
              {p.techStack?.length > 0 && (
                <div className="resume-entry-sub">Tech: {p.techStack.join(", ")}</div>
              )}
              {p.bullets && (
                <ul className="resume-bullets">
                  {p.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education?.length > 0 && (
        <div className="resume-section">
          <div className="resume-section-title">Education</div>
          {education.map((e, i) => (
            <div key={i} className="resume-entry">
              <div className="resume-entry-title-row">
                <span><strong>{e.degree}</strong> · {e.school}</span>
                <span className="resume-entry-sub">{e.startYear} – {e.endYear}</span>
              </div>
              {e.location && <div className="resume-entry-sub">{e.location}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page Component
   ───────────────────────────────────────────────────────────── */
export default function AIResumeGenerator() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ── Access gate ──────────────────────────────────────────────────────────
  const { status, loading: accessLoading, refresh } = useAccessStatus(user);
  const accessAllowed = !user ? false : status?.access?.resume?.allowed === true;

  // Subscription active means usage isn't consumed (unlimited)
  const subActive = status?.subscription?.is_currently_active;

  // ── Form state (unchanged) ───────────────────────────────────────────────
  const [jobTitle,        setJobTitle]        = useState("");
  const [jobDescription,  setJobDescription]  = useState("");
  const [userInfo,        setUserInfo]         = useState("");
  const [experienceLevel, setExperienceLevel]  = useState("mid");
  const [loading,         setLoading]          = useState(false);
  const [resume,          setResume]           = useState(null);
  const [error,           setError]            = useState("");

  const resumeRef = useRef();

  // ── CHANGE 2: Gate moved here — redirect to /pricing if not paid ─────────
  const handleGenerate = async () => {
    if (!user || !accessAllowed) {
      navigate("/pricing");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const data = await generateResume({
        jobTitle, jobDescription, userInfo, experienceLevel,
      });
      setResume(data);

      // ── Mark as used for one-time purchases (subscriptions skip) ────────
      if (!subActive) {
        try {
          await api.post("/api/payments/mark-used/", { feature: "resume" });
          await refresh();
        } catch (markErr) {
          console.warn("mark-used failed:", markErr);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate resume. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = () => {
    setJobTitle("Junior Full Stack Developer");
    setJobDescription(
      "We are looking for a junior full stack developer with experience in React, Node.js, REST APIs, and SQL. " +
      "The candidate should have good understanding of Git, CI/CD, and cloud basics (AWS/Azure). " +
      "Responsibilities include building features, fixing bugs, and collaborating with the product team."
    );
    setUserInfo(
      "Name: Badhrinath S\n" +
      "Email: s.badhinath2k03@gmail.com\n" +
      "Phone: +91-XXXXXXXXXX\n" +
      "Location: Chennai\n" +
      "LinkedIn: linkedin.com/in/badhrinath-s-509645323\n" +
      "GitHub: github.com/Badhrinath03\n\n" +
      "Education: BE Computer Science, DMI College of Engineering, 2021-2025, CGPA 7.6\n\n" +
      "Experience:\n" +
      "- Intern, ICD Power Solutions: Built web applications using React and Node.\n" +
      "- DevOps/Cloud projects: CI/CD pipelines with GitHub Actions, Docker, Kubernetes, Terraform.\n\n" +
      "Projects:\n" +
      "- MedChain: Cloud-based health record system using AWS, Lambda, API Gateway, React.\n" +
      "- Automated DevOps Pipeline: E2E CI/CD with monitoring and Terraform.\n\n" +
      "Skills: React, Node.js, JavaScript, TypeScript, HTML, CSS, Git, GitHub, Docker, Kubernetes, AWS, Azure, Terraform, Python."
    );
  };

  return (
    <div className="ai-resume-page">
      <div className="ai-resume-shell">

        {/* ── LEFT: FORM — no overlay, always accessible ── */}
        {/* CHANGE 1: Removed position:relative wrapper and LockedOverlay block */}
        <div className="ai-resume-left">

          <div className="ai-resume-page-header">
            <div>
              <div className="ai-resume-page-title">AI Resume Generator</div>
              <div className="ai-resume-page-subtitle">
                Paste your job description + details and let AI build a tailored resume.
              </div>
            </div>
            <span className="ai-resume-badge">Powered by GPT</span>
          </div>

          {/* Job Details */}
          <div className="ai-resume-card">
            <div className="ai-resume-card-title">Job details</div>

            <div className="ai-resume-field-group">
              <div className="ai-resume-label-row">
                <label className="ai-resume-label">Job title (optional)</label>
                <span className="ai-resume-label-hint">e.g. Full Stack Developer</span>
              </div>
              <input
                className="ai-resume-input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Full Stack Developer"
              />
            </div>

            <div className="ai-resume-field-group">
              <div className="ai-resume-label-row">
                <label className="ai-resume-label">Job description</label>
                <span className="ai-resume-label-hint">Paste from Naukri, LinkedIn, etc.</span>
              </div>
              <textarea
                className="ai-resume-textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the JD here..."
              />
            </div>

            <div className="ai-resume-field-group">
              <div className="ai-resume-label-row">
                <label className="ai-resume-label">Your experience level</label>
              </div>
              <select
                className="ai-resume-select"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="fresher">Fresher / Intern</option>
                <option value="junior">0–2 years</option>
                <option value="intermediate">2–5 years</option>
                <option value="senior">5+ years</option>
              </select>
            </div>
          </div>

          {/* Your Profile */}
          <div className="ai-resume-card">
            <div className="ai-resume-card-title">Your profile</div>

            <div className="ai-resume-field-group">
              <div className="ai-resume-label-row">
                <label className="ai-resume-label">Details</label>
                <span className="ai-resume-label-hint">
                  Paste your old resume or write bullet points.
                </span>
              </div>
              <textarea
                className="ai-resume-textarea"
                value={userInfo}
                onChange={(e) => setUserInfo(e.target.value)}
                placeholder="Name, contact, education, skills, internships, projects, etc..."
              />
            </div>

            <div className="ai-resume-actions-row">
              <button
                className="ai-resume-btn-primary"
                onClick={handleGenerate}
                disabled={loading || accessLoading}
              >
                {loading ? "Generating..." : "Generate AI Resume"}
              </button>
              <button
                className="ai-resume-btn-secondary"
                onClick={handleFillSample}
              >
                Fill with sample data
              </button>
            </div>

            {error && <div className="ai-resume-status-error">{error}</div>}
            {!error && loading && (
              <div className="ai-resume-status-text">
                Thinking like a recruiter… tailoring keywords, impact and skills.
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="ai-resume-card">
            <div className="ai-resume-card-title">Tips for better results</div>
            <div className="ai-resume-chip-row">
              <span className="ai-resume-chip">Paste full job description</span>
              <span className="ai-resume-chip">Include your key projects</span>
              <span className="ai-resume-chip">Mention tools &amp; tech</span>
              <span className="ai-resume-chip">Add internships clearly</span>
            </div>
          </div>

        </div>

        {/* ── RIGHT: PREVIEW — unchanged ── */}
        <div className="ai-resume-right">
          <div className="ai-resume-card">
            <div className="ai-resume-card-title">Live Resume Preview</div>
            {resume && (
              <button
                className="ai-resume-btn-primary"
                onClick={() => downloadAsPDF(resumeRef)}
                style={{ marginTop: 10 }}
              >
                Download PDF
              </button>
            )}
          </div>

          <div className="ai-resume-preview-wrapper" ref={resumeRef}>
            {resume ? (
              <ResumePreview resume={resume} />
            ) : (
              <div className="ai-resume-status-text">
                No resume yet. Fill the form on the left and click{" "}
                <strong>Generate AI Resume</strong> to see a tailored version here.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}