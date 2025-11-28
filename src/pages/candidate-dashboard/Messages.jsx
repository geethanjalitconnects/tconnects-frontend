import React from "react";
import "./CandidateDashboard.css";

export default function Messages() {
  return (
    <div className="cd-messages">

      {/* Page Header */}
      <h2 className="cd-section-title">Messages</h2>
      <p className="cd-section-subtitle">
        Communicate with recruiters about your applications.
      </p>

      {/* Message List */}
      <div className="cd-message-list">

        {/* Message 1 */}
        <div className="cd-message-item">
          <div className="cd-message-avatar">R</div>

          <div className="cd-message-content">
            <h4 className="cd-message-sender">Recruiter - Amazon</h4>
            <p className="cd-message-text">
              Hi John, we have reviewed your application. Can we schedule a call tomorrow?
            </p>
            <span className="cd-message-time">2 hours ago</span>
          </div>
        </div>

        {/* Message 2 */}
        <div className="cd-message-item">
          <div className="cd-message-avatar">G</div>

          <div className="cd-message-content">
            <h4 className="cd-message-sender">Google HR</h4>
            <p className="cd-message-text">
              Thanks for applying. Please share your availability for a quick discussion.
            </p>
            <span className="cd-message-time">1 day ago</span>
          </div>
        </div>

        {/* Message 3 */}
        <div className="cd-message-item">
          <div className="cd-message-avatar">Z</div>

          <div className="cd-message-content">
            <h4 className="cd-message-sender">Zoho Recruiter</h4>
            <p className="cd-message-text">
              Your resume looks great! We will get back to you soon.
            </p>
            <span className="cd-message-time">3 days ago</span>
          </div>
        </div>

      </div>
    </div>
  );
}
