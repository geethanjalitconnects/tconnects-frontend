import React from 'react';
import './freelancer.css';


export default function FreelancerOverview() {
return (
<div className="fr-page">
<div className="fr-card">
<h2 className="fr-title">Freelancer Overview</h2>
<p className="fr-lead">A quick snapshot of your freelancer profile, availability and stats.</p>


<div className="fr-grid">
<div className="fr-stat">
<div className="fr-stat-value">4.8</div>
<div className="fr-stat-label">Average Rating</div>
</div>


<div className="fr-stat">
<div className="fr-stat-value">12</div>
<div className="fr-stat-label">Completed Projects</div>
</div>


<div className="fr-stat">
<div className="fr-stat-value">5+</div>
<div className="fr-stat-label">Years Experience</div>
</div>
</div>


<div className="fr-section">
<h3 className="fr-subtitle">Recent Activity</h3>
<ul className="fr-list">
<li>Proposal sent to <strong>UI/UX Designer</strong> job</li>
<li>Profile viewed by <strong>3 recruiters</strong> in last 7 days</li>
<li>Feedback request sent to <strong>client@example.com</strong></li>
</ul>
</div>
</div>
</div>
);
}