import React, { useState } from "react";
import { Home, FileText, Briefcase, Bookmark, BookOpen, ChevronDown, ChevronRight, Menu, X, ArrowLeft } from "lucide-react";

const MAIN_LINKS = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "profile", label: "Profile", icon: FileText },
  { id: "applied-jobs", label: "Applied Jobs", icon: Briefcase },
  { id: "applied-internships", label: "Applied Internships", icon: Briefcase },
  { id: "saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { id: "saved-internships", label: "Saved Internships", icon: Bookmark },
  { id: "courses", label: "Courses", icon: BookOpen },
];

const FREELANCER_LINKS = [
  { id: "basic-info", label: "Basic Information" },
  { id: "professional", label: "Professional Details" },
  { id: "education", label: "Education" },
  { id: "availability", label: "Availability" },
  { id: "payment", label: "Payment Method" },
  { id: "social", label: "Social Links & Ratings" },
  { id: "preview", label: "Profile Preview" },
];

export default function CandidateDashboard() {
  const [activeLink, setActiveLink] = useState("overview");
  const [freelancerOpen, setFreelancerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // User info - in real app, this would come from authentication
  const userName = "Geethanjali";

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const handleLinkClick = (id) => {
    setActiveLink(id);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeLink) {
      case "overview":
        return <OverviewPage userName={userName} />;
      case "profile":
        return <ProfilePage />;
      case "applied-jobs":
        return <AppliedJobsPage />;
      case "applied-internships":
        return <AppliedInternshipsPage />;
      case "saved-jobs":
        return <SavedJobsPage />;
      case "saved-internships":
        return <SavedInternshipsPage />;
      case "courses":
        return <CoursesPage />;
      case "basic-info":
        return <BasicInformationPage />;
      case "professional":
        return <ProfessionalDetailsPage />;
      case "education":
        return <EducationPage />;
      case "availability":
        return <AvailabilityPage />;
      case "payment":
        return <PaymentMethodPage />;
      case "social":
        return <SocialLinksPage />;
      case "preview":
        return <ProfilePreviewPage />;
      default:
        return <OverviewPage userName={userName} />;
    }
  };

  return (
    <div className="cd-layout">
      {/* Mobile Hamburger */}
      <button 
        className="cd-hamburger" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="cd-sidebar-overlay show" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`cd-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="cd-sidebar-top">
          <div className="cd-logo">TConnects</div>
        </div>

        {/* Back to Home Button */}
        <button className="cd-back-home-btn" onClick={handleBackToHome}>
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>

        <nav className="cd-nav">
          {MAIN_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`cd-nav-link ${activeLink === item.id ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Freelancer Dropdown */}
          <div className={`cd-dropdown ${freelancerOpen ? 'open' : ''}`}>
            <button
              className="cd-dropdown-toggle"
              onClick={() => setFreelancerOpen(!freelancerOpen)}
            >
              <span>Freelancer</span>
              {freelancerOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className={`cd-dropdown-menu ${freelancerOpen ? 'show' : ''}`}>
              {FREELANCER_LINKS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`cd-dropdown-item ${activeLink === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="cd-main">
        <div className="cd-content">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="cd-bottom-nav">
        <div className="cd-bottom-nav-items">
          <button 
            className={`cd-bottom-nav-item ${activeLink === 'overview' ? 'active' : ''}`}
            onClick={() => handleLinkClick('overview')}
          >
            <Home className="cd-bottom-nav-icon" size={22} />
            <span>Overview</span>
          </button>
          <button 
            className={`cd-bottom-nav-item ${activeLink === 'profile' ? 'active' : ''}`}
            onClick={() => handleLinkClick('profile')}
          >
            <FileText className="cd-bottom-nav-icon" size={22} />
            <span>Profile</span>
          </button>
          <button 
            className={`cd-bottom-nav-item ${activeLink === 'applied-jobs' ? 'active' : ''}`}
            onClick={() => handleLinkClick('applied-jobs')}
          >
            <Briefcase className="cd-bottom-nav-icon" size={22} />
            <span>Applied</span>
          </button>
          <button 
            className={`cd-bottom-nav-item ${activeLink === 'courses' ? 'active' : ''}`}
            onClick={() => handleLinkClick('courses')}
          >
            <BookOpen className="cd-bottom-nav-icon" size={22} />
            <span>Courses</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

// Overview Page Component
function OverviewPage({ userName }) {
  return (
    <div className="cd-overview">
      <div className="cd-welcome-card">
        <h2 className="cd-welcome-title">Welcome, {userName}!</h2>
        <p className="cd-welcome-text">
          Track your job applications, manage your profile, and explore new opportunities.
        </p>
      </div>

      <div className="cd-stats-grid">
        <div className="cd-stat-card">
          <div className="cd-stat-icon">📋</div>
          <div>
            <div className="cd-stat-number">12</div>
            <div className="cd-stat-label">Applications</div>
          </div>
        </div>
        <div className="cd-stat-card">
          <div className="cd-stat-icon">💼</div>
          <div>
            <div className="cd-stat-number">5</div>
            <div className="cd-stat-label">Interviews</div>
          </div>
        </div>
        <div className="cd-stat-card">
          <div className="cd-stat-icon">⭐</div>
          <div>
            <div className="cd-stat-number">8</div>
            <div className="cd-stat-label">Saved Jobs</div>
          </div>
        </div>
        <div className="cd-stat-card">
          <div className="cd-stat-icon">📚</div>
          <div>
            <div className="cd-stat-number">3</div>
            <div className="cd-stat-label">Courses</div>
          </div>
        </div>
      </div>

      <div className="cd-section">
        <h3 className="cd-section-title">Recent Applications</h3>
        <div className="cd-application-card">
          <div>
            <h4 className="cd-job-title">Senior Frontend Developer</h4>
            <p className="cd-job-company">Tech Corp Inc.</p>
          </div>
          <span className="cd-status cd-status-reviewed">Reviewed</span>
        </div>
        <div className="cd-application-card">
          <div>
            <h4 className="cd-job-title">UX/UI Designer</h4>
            <p className="cd-job-company">Design Studio</p>
          </div>
          <span className="cd-status cd-status-pending">Pending</span>
        </div>
      </div>
    </div>
  );
}

// Profile Page Component
function ProfilePage() {
  return (
    <div className="cd-profile">
      <h1 className="cd-page-title">Manage Your Personal Information</h1>

      <div className="cd-profile-card">
        <h3 className="cd-section-title">Personal Information</h3>
        <div className="cd-form-grid">
          <div className="cd-form-group">
            <label className="cd-form-label">
              Full Name <span className="cd-required">*</span>
            </label>
            <input type="text" className="cd-input" placeholder="John Doe" />
          </div>
          <div className="cd-form-group">
            <label className="cd-form-label">
              Email <span className="cd-required">*</span>
            </label>
            <input type="email" className="cd-input" placeholder="john@example.com" />
          </div>
          <div className="cd-form-group">
            <label className="cd-form-label">Phone Number</label>
            <input type="tel" className="cd-input" placeholder="+1 234 567 8900" />
          </div>
          <div className="cd-form-group">
            <label className="cd-form-label">Location</label>
            <input type="text" className="cd-input" placeholder="New York, USA" />
          </div>
          <div className="cd-form-group cd-full-width">
            <label className="cd-form-label">Bio</label>
            <textarea className="cd-textarea" placeholder="Tell us about yourself..."></textarea>
          </div>
        </div>
        <button className="cd-save-btn">Save Changes</button>
      </div>
    </div>
  );
}

// Applied Jobs Page
function AppliedJobsPage() {
  return (
    <div className="cd-applied">
      <h1 className="cd-page-title">Track Your Job Applications</h1>

      <div className="cd-job-card">
        <div className="cd-job-info">
          <h3>Frontend Developer</h3>
          <p className="cd-job-company">Google</p>
          <p className="cd-job-date">Applied 2 days ago</p>
        </div>
        <span className="cd-status cd-status-reviewed">Under Review</span>
      </div>

      <div className="cd-job-card">
        <div className="cd-job-info">
          <h3>React Developer</h3>
          <p className="cd-job-company">Meta</p>
          <p className="cd-job-date">Applied 5 days ago</p>
        </div>
        <span className="cd-status cd-status-pending">Pending</span>
      </div>
    </div>
  );
}

// Applied Internships Page
function AppliedInternshipsPage() {
  return (
    <div className="cd-applied">
      <h1 className="cd-page-title">Track Your Internship Applications</h1>

      <div className="cd-job-card">
        <div className="cd-job-info">
          <h3>UX Design Intern</h3>
          <p className="cd-job-company">Adobe</p>
          <p className="cd-job-date">Applied 1 week ago</p>
        </div>
        <span className="cd-status cd-status-reviewed">Interview Scheduled</span>
      </div>
    </div>
  );
}

// Saved Jobs Page
function SavedJobsPage() {
  return (
    <div className="cd-saved">
      <h1 className="cd-page-title">Your Bookmarked Jobs</h1>

      <div className="cd-saved-card">
        <div className="cd-saved-info">
          <h3>Full Stack Developer</h3>
          <p className="cd-job-company">Amazon</p>
        </div>
        <button className="cd-remove-btn">Remove</button>
      </div>
    </div>
  );
}

// Saved Internships Page
function SavedInternshipsPage() {
  return (
    <div className="cd-saved">
      <h1 className="cd-page-title">Your Bookmarked Internships</h1>

      <div className="cd-saved-card">
        <div className="cd-saved-info">
          <h3>Marketing Intern</h3>
          <p className="cd-job-company">Netflix</p>
        </div>
        <button className="cd-remove-btn">Remove</button>
      </div>
    </div>
  );
}

// Courses Page
function CoursesPage() {
  return (
    <div className="cd-courses">
      <h1 className="cd-page-title">Continue Your Learning Journey</h1>

      <div className="cd-course-card">
        <div className="cd-course-info">
          <h3 className="cd-course-title">React Advanced Patterns</h3>
          <p className="cd-course-provider">Frontend Masters</p>
          <p className="cd-course-progress-text">Progress: 65%</p>
          <div className="cd-progress">
            <div className="cd-progress-bar" style={{ width: '65%' }}></div>
          </div>
        </div>
        <span className="cd-course-status cd-status-ongoing">Ongoing</span>
      </div>

      <div className="cd-course-card">
        <div className="cd-course-info">
          <h3 className="cd-course-title">JavaScript Algorithms</h3>
          <p className="cd-course-provider">Udemy</p>
          <p className="cd-course-progress-text">Progress: 100%</p>
          <div className="cd-progress">
            <div className="cd-progress-bar" style={{ width: '100%' }}></div>
          </div>
        </div>
        <span className="cd-course-status cd-status-completed">Completed</span>
      </div>
    </div>
  );
}

// Freelancer Pages
function BasicInformationPage() {
  return (
    <div className="fr-page">
      <div className="fr-card">
        <h1 className="cd-page-title">Basic Information</h1>
        <p className="fr-lead">Tell us about yourself</p>
        
        <div className="fr-row">
          <label className="fr-label">Full Name</label>
          <input type="text" className="fr-input" placeholder="Enter your full name" />
        </div>
        
        <div className="fr-row">
          <label className="fr-label">Professional Title</label>
          <input type="text" className="fr-input" placeholder="e.g. Full Stack Developer" />
        </div>
        
        <div className="fr-row">
          <label className="fr-label">Bio</label>
          <textarea className="fr-textarea" placeholder="Write a brief bio..."></textarea>
        </div>
        
        <div className="fr-actions">
          <button className="fr-btn fr-btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ProfessionalDetailsPage() {
  return (
    <div className="fr-page">
      <div className="fr-card">
        <h1 className="cd-page-title">Professional Details</h1>
        <p className="fr-lead">Share your expertise and skills</p>
        
        <div className="fr-row">
          <label className="fr-label">Years of Experience</label>
          <input type="number" className="fr-input" placeholder="e.g. 5" />
        </div>
        
        <div className="fr-row">
          <label className="fr-label">Skills</label>
          <input type="text" className="fr-input" placeholder="React, Node.js, MongoDB..." />
        </div>
        
        <div className="fr-row">
          <label className="fr-label">Hourly Rate ($)</label>
          <input type="number" className="fr-input" placeholder="e.g. 50" />
        </div>
        
        <div className="fr-actions">
          <button className="fr-btn fr-btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function EducationPage() {
  return (
    <div className="fr-page">
      <div className="fr-card">
        <h1 className="cd-page-title">Education</h1>
        <p className="fr-lead">Add your educational background</p>
        
        <div className="fr-row">
          <label className="fr-label">Degree</label>
          <input type="text" className="fr-input" placeholder="e.g. Bachelor of Science" />
        </div>
        
        <div className="fr-row">
          <label className="fr-label">Institution</label>
          <input type="text" className="fr-input" placeholder="University name" />
        </div>
        
        <div className="fr-two-col">
          <div className="fr-row">
            <label className="fr-label">Start Year</label>
            <input type="text" className="fr-input" placeholder="2018" />
          </div>
          <div className="fr-row">
            <label className="fr-label">End Year</label>
            <input type="text" className="fr-input" placeholder="2022" />
          </div>
        </div>
        
        <div className="fr-actions">
          <button className="fr-btn fr-btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function AvailabilityPage() {
  return (
    <div className="fr-page">
      <div className="fr-card">
        <h1 className="cd-page-title">Availability</h1>
        <p className="fr-lead">Set your working hours and availability</p>
        
        <div className="fr-row">
          <label className="fr-label">Available Hours per Week</label>
          <input type="number" className="fr-input" placeholder="e.g. 40" />
        </div>
        
        <div className="fr-row">
          <label className="fr-label">Time Zone</label>
          <select className="fr-select">
            <option>Select timezone</option>
            <option>EST (UTC-5)</option>
            <option>PST (UTC-8)</option>
            <option>IST (UTC+5:30)</option>
          </select>
        </div>
        
        <div className="fr-actions">
          <button className="fr-btn fr-btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodPage() {
  return (
    <div className="fr-page">
      <div className="fr-card">
        <h1 className="cd-page-title">Payment Method</h1>
        <p className="fr-lead">Add your payment details</p>
        
        <div className="fr-row">
          <label className="fr-label">Payment Type</label>
          <select className="fr-select">
            <option>Select payment method</option>
            <option>Bank Transfer</option>
            <option>PayPal</option>
            <option>Stripe</option>
          </select>
        </div>
        
        <div className="fr-row">
          <label className="fr-label">Account Details</label>
          <input type="text" className="fr-input" placeholder="Enter account details" />
        </div>
        
        <div className="fr-actions">
          <button className="fr-btn fr-btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function SocialLinksPage() {
  return (
    <div className="fr-page">
      <div className="fr-card">
        <h1 className="cd-page-title">Social Links & Ratings</h1>
        <p className="fr-lead">Connect your social profiles</p>
        
        <div className="fr-row">
          <label className="fr-label">LinkedIn</label>
          <input type="url" className="fr-input" placeholder="https://linkedin.com/in/username" />
        </div>
        
        <div className="fr-row">
          <label className="fr-label">GitHub</label>
          <input type="url" className="fr-input" placeholder="https://github.com/username" />
        </div>
        
        <div className="fr-row">
          <label className="fr-label">Portfolio Website</label>
          <input type="url" className="fr-input" placeholder="https://yourwebsite.com" />
        </div>
        
        <div className="fr-actions">
          <button className="fr-btn fr-btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function ProfilePreviewPage() {
  return (
    <div className="fr-page">
      <div className="fr-card">
        <h1 className="cd-page-title">Profile Preview</h1>
        <p className="fr-lead">This is how your profile appears to others</p>
        
        <div className="fr-preview-header">
          <div className="fr-avatar-placeholder-large">JD</div>
          <div className="fr-preview-basic">
            <h3>John Doe</h3>
            <p>Full Stack Developer</p>
            <p>5 years experience • $50/hr</p>
          </div>
        </div>
        
        <div className="fr-section">
          <h3 className="fr-section-title">About</h3>
          <p className="fr-bio">
            Experienced full-stack developer specializing in React and Node.js with a passion for creating elegant solutions to complex problems.
          </p>
        </div>
        
        <div className="fr-section">
          <h3 className="fr-section-title">Skills</h3>
          <div className="fr-tags">
            <span className="fr-tag">React</span>
            <span className="fr-tag">Node.js</span>
            <span className="fr-tag">MongoDB</span>
            <span className="fr-tag">TypeScript</span>
          </div>
        </div>
      </div>
    </div>
  );
}