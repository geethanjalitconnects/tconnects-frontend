import React from "react";
import "./Freelancer.css";

export default function FreelancerProfilePreview() {
  // 📌 Temporary mock data (UI only)
  // Later, these values will be loaded from backend API.
  const data = {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    location: "Chennai, India",
    languages: "English, Tamil",

    profileImage: null,

    expertise: "Frontend Developer",
    experience: "3 Years",
    categories: "Web Development, UI/UX",
    bio: "Creative frontend developer passionate about building user-friendly interfaces.",

    education: [
      {
        degree: "B.Tech in Computer Science",
        school: "ABC Institute of Technology",
        year: "2022",
      },
    ],

    availability: {
      status: "Available",
      from: "2025-01-10",
      to: "2025-12-20",
      timezone: "Asia/Kolkata",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },

    payments: [
      { id: 1, method: "UPI", value: "john@upi" },
      { id: 2, method: "Bank Account", value: "HDFC **** 4321" },
    ],

    links: {
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      portfolio: "https://johndoe.dev",
    },

    ratings: [
      { stars: 5, badge: "Top Performer", date: "02/03/2025" },
      { stars: 4, badge: "Fast Delivery", date: "15/02/2025" },
    ],
  };

  return (
    <div className="fr-page">
      <div className="fr-card">
        <h2 className="fr-title">Freelancer Profile Preview</h2>

        {/* TOP SECTION */}
        <div className="fr-preview-header">
          <div className="fr-preview-img">
            {data.profileImage ? (
              <img src={data.profileImage} alt="profile" />
            ) : (
              <div className="fr-avatar-placeholder-large">
                {data.fullName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="fr-preview-basic">
            <h3>{data.fullName}</h3>
            <p>{data.expertise}</p>
            <p className="fr-small">{data.location}</p>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="fr-section">
          <h4 className="fr-section-title">Basic Information</h4>
          <div className="fr-info-row"><span>Email:</span> {data.email}</div>
          <div className="fr-info-row"><span>Phone:</span> {data.phone}</div>
          <div className="fr-info-row"><span>Location:</span> {data.location}</div>
          <div className="fr-info-row"><span>Languages:</span> {data.languages}</div>
        </div>

        {/* PROFESSIONAL DETAILS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Professional Details</h4>
          <div className="fr-info-row"><span>Expertise:</span> {data.expertise}</div>
          <div className="fr-info-row"><span>Experience:</span> {data.experience}</div>
          <div className="fr-info-row"><span>Categories:</span> {data.categories}</div>
          <p className="fr-bio">{data.bio}</p>
        </div>

        {/* EDUCATION */}
        <div className="fr-section">
          <h4 className="fr-section-title">Education</h4>

          {data.education.length === 0 ? (
            <p className="fr-empty">No education added</p>
          ) : (
            data.education.map((edu, i) => (
              <div key={i} className="fr-edu-item">
                <strong>{edu.degree}</strong>
                <p>{edu.school}</p>
                <span className="fr-small">{edu.year}</span>
              </div>
            ))
          )}
        </div>

        {/* AVAILABILITY */}
        <div className="fr-section">
          <h4 className="fr-section-title">Availability</h4>

          <div className="fr-info-row">
            <span>Status:</span> {data.availability.status}
          </div>

          <div className="fr-info-row">
            <span>Available From:</span> {data.availability.from}
          </div>

          <div className="fr-info-row">
            <span>Available To:</span> {data.availability.to}
          </div>

          <div className="fr-info-row">
            <span>Timezone:</span> {data.availability.timezone}
          </div>

          <div className="fr-info-row">
            <span>Working Days:</span> {data.availability.days.join(", ")}
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Payment Methods</h4>

          {data.payments.length === 0 ? (
            <p className="fr-empty">No payment methods added</p>
          ) : (
            data.payments.map((p) => (
              <div key={p.id} className="fr-info-row">
                <span>{p.method}:</span> {p.value}
              </div>
            ))
          )}
        </div>

        {/* SOCIAL LINKS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Social Profiles</h4>
          <div className="fr-info-row"><span>LinkedIn:</span> {data.links.linkedin}</div>
          <div className="fr-info-row"><span>GitHub:</span> {data.links.github}</div>
          <div className="fr-info-row"><span>Portfolio:</span> {data.links.portfolio}</div>
        </div>

        {/* RATINGS */}
        <div className="fr-section">
          <h4 className="fr-section-title">Ratings & Feedback</h4>

          {data.ratings.length === 0 ? (
            <p className="fr-empty">No ratings yet</p>
          ) : (
            data.ratings.map((r, i) => (
              <div key={i} className="fr-rating-item">
                <div className="fr-rating-stars">{"★".repeat(r.stars)}</div>
                <span className="fr-rating-date">({r.date})</span>
                {r.badge && <div className="fr-badge">{r.badge}</div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
