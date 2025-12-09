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
        return <OverviewPage />;
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
      default:
        return <div>Select a page from the sidebar</div>;
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
function OverviewPage() {
  return (
    <div className="cd-overview">
      <div className="cd-welcome-card">
        <h2 className="cd-welcome-title">Welcome back, John!</h2>
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
      <div className="cd-section-header">
        <h2 className="cd-profile-title">My Profile</h2>
        <p className="cd-profile-subtitle">Manage your personal information</p>
      </div>

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
      <h2 className="cd-section-title">Applied Jobs</h2>
      <p className="cd-section-subtitle">Track your job applications</p>

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
      <h2 className="cd-section-title">Applied Internships</h2>
      <p className="cd-section-subtitle">Track your internship applications</p>

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
      <h2 className="cd-section-title">Saved Jobs</h2>
      <p className="cd-section-subtitle">Jobs you've bookmarked</p>

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
      <h2 className="cd-section-title">Saved Internships</h2>
      <p className="cd-section-subtitle">Internships you've bookmarked</p>

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
      <h2 className="cd-section-title">My Courses</h2>
      <p className="cd-section-subtitle">Continue your learning journey</p>

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