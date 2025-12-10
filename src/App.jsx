import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import WelcomeModal from "./components/WelcomeModal";

import { Toaster } from "react-hot-toast";

/* AUTH CONTEXT */
import { AuthProvider } from "./context/AuthContext";
import { SavedJobsProvider } from "./context/SavedJobsContext";
import { SavedInternshipsProvider } from "./context/SavedInternshipsContext";

/* PUBLIC COMPONENTS */
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import RiskCategoryModal from "./components/RiskCategoryModal";
import AboutSection from "./components/AboutSection";
import AboutUs from "./components/AboutUs";
import WhyChoose from "./components/WhyChoose";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

/* AUTH */
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";

/* ================= COURSES ================= */
import CoursesList from "./pages/courses/CoursesList";
import CourseDetails from "./pages/courses/CourseDetails";
import LearnCourse from "./pages/courses/LearnCourse";

import MockInterview from "./pages/mock-interview/MockInterview";

/* ================= CANDIDATE DASHBOARD ================= */
import CandidateDashboardLayout from "./pages/candidate-dashboard/CandidateDashboardLayout";
import Overview from "./pages/candidate-dashboard/Overview";
import Profile from "./pages/candidate-dashboard/Profile";
import AppliedJobs from "./pages/candidate-dashboard/AppliedJobs";
import AppliedInternships from "./pages/candidate-dashboard/AppliedInternships";
import SavedJobs from "./pages/candidate-dashboard/SavedJobs";
import SavedInternships from "./pages/candidate-dashboard/SavedInternships";
import Courses from "./pages/candidate-dashboard/Courses";

/* Freelancer */
import FreelancerBasicInfo from "./pages/candidate-dashboard/freelancer/FreelancerBasicInfo";
import FreelancerProfessionalDetails from "./pages/candidate-dashboard/freelancer/FreelancerProfessionalDetails";
import FreelancerEducation from "./pages/candidate-dashboard/freelancer/FreelancerEducation";
import FreelancerAvailability from "./pages/candidate-dashboard/freelancer/FreelancerAvailability";
import FreelancerPayment from "./pages/candidate-dashboard/freelancer/FreelancerPayment";
import FreelancerSocialLinks from "./pages/candidate-dashboard/freelancer/FreelancerSocialLinks";
import FreelancerProfilePreview from "./pages/candidate-dashboard/freelancer/FreelancerProfilePreview";

/* ================= JOBS ================= */
import JobsListPage from "./pages/jobs/JobsListPage";
import JobDetailsPage from "./pages/jobs/JobDetailsPage";

/* ================= INTERNSHIPS ================= */
import InternshipsListPage from "./pages/internships/InternshipsListPage";
import InternshipDetailsPage from "./pages/internships/InternshipDetailsPage";

import FreelancerList from "./pages/freelancers/FreelancerList";
import FreelancerProfile from "./pages/freelancers/FreelancerProfile";

/* ================= APPLY PAGES ================= */
import ApplyJobPage from "./pages/apply/ApplyJobPage";
import ApplyInternshipPage from "./pages/apply/ApplyInternshipPage";

/* ================= RECRUITER DASHBOARD ================= */
import RecruiterDashboardLayout from "./pages/recruiter-dashboard/RecruiterDashboardLayout";
import RecruiterOverview from "./pages/recruiter-dashboard/Overview";

import BasicInformation from "./pages/recruiter-dashboard/profile/BasicInformation";
import CompanyProfile from "./pages/recruiter-dashboard/profile/CompanyProfile";

import PostJob from "./pages/recruiter-dashboard/jobs/PostJob";
import PostInternship from "./pages/recruiter-dashboard/jobs/PostInternship";
import ManageJobs from "./pages/recruiter-dashboard/jobs/ManageJobs";
import ManageInternships from "./pages/recruiter-dashboard/jobs/ManageInternships";

import JobApplications from "./pages/recruiter-dashboard/applications/JobApplications";
import InternshipApplications from "./pages/recruiter-dashboard/applications/InternshipApplications";
import EditJob from "./pages/recruiter-dashboard/jobs/EditJob";
import EditInternship from "./pages/recruiter-dashboard/jobs/EditInternship";

/* ================= AUTH CHECK HOOK ================= */
import api from "./config/api";

// Custom hook to check authentication on mount (fixes Safari issue)
const useAuthCheck = (onAuthChange) => {
  const [isChecking, setIsChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication...');
        const response = await api.get('/api/auth/me/');
        if (response.data) {
          setUser(response.data);
          onAuthChange?.(response.data);
        }
      } catch {
        setUser(null);
        onAuthChange?.(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    const handleLogout = () => {
      setUser(null);
      onAuthChange?.(null);
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  return { user, isChecking };
};

/* ================= HOME PAGE ================= */
function HomePage({ onCategoryClick, navigate }) {
  return (
    <>
      <HeroSection 
        onCategoryClick={onCategoryClick} 
        navigateToJobsList={() => navigate("/jobs")}
        navigateToResumeMaking={() => window.open("https://tconnects.vercel.app/", "_blank")}
      />

      <AboutSection navigateToAboutUs={() => navigate("/about-us")} />
      <WhyChoose />
      <HowItWorks />
      <Footer />
    </>
  );
}


/* ================= MAIN APP ================= */
function App() {
  const [modalCategory, setModalCategory] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine which pages should hide the header
  const hideHeader = 
    location.pathname.startsWith("/course/") ||
    location.pathname.startsWith("/candidate-dashboard") ||
    location.pathname.startsWith("/recruiter-dashboard");

  // Auto-check authentication on mount (fixes Safari issue)
  const { user: authUser, isChecking } = useAuthCheck((userData) => {
    console.log('🔄 Auth state changed:', userData);
    setCurrentUser(userData);
  });

  // Handle login success from LoginPage
  const handleLoginSuccess = (userData) => {
    console.log('✅ Login success:', userData);
    setCurrentUser(userData);
  };

  // Handle registration success from RegistrationPage
  const handleRegisterSuccess = (userData) => {
    console.log('✅ Registration success:', userData);
    setCurrentUser(userData);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout/');
      console.log('👋 Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCurrentUser(null);
      // Trigger global logout event
      window.dispatchEvent(new CustomEvent('auth:logout'));
      navigate('/');
    }
  };

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            marginBottom: '1rem',
            fontSize: '2rem'
          }}>⏳</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider value={{ user: currentUser, setUser: setCurrentUser }}>
      <SavedJobsProvider>
        <SavedInternshipsProvider>
          <div>
            <Toaster
              position="top-right"
              toastOptions={{
                // Default style for all toasts (teal)
                style: {
                  background: '#14b8a6',
                  color: '#ffffff',
                },
              }}
            />

            {/* Conditionally render Header */}
            {!hideHeader && (
              <Header 
                currentUser={currentUser} 
                onLogout={handleLogout}
              />
            )}

            <Routes>
              {/* PUBLIC ROUTES */}
              <Route 
                path="/" 
                element={
                  <>
                    <WelcomeModal currentUser={currentUser} />
                    <HomePage 
                      onCategoryClick={setModalCategory}
                      navigate={navigate}  
                    />
                  </>
                } 
              />
              <Route path="/about-us" element={<AboutUs />} />
              
              {/* AUTH ROUTES - Pass handlers */}
              <Route 
                path="/login" 
                element={
                  <LoginPage 
                    onLoginSuccess={handleLoginSuccess}
                  />
                } 
              />
              <Route 
                path="/register" 
                element={
                  <RegistrationPage 
                    onRegisterSuccess={handleRegisterSuccess}
                  />
                } 
              />

              {/* FREELANCERS PUBLIC PAGES */}
              <Route path="/freelancers" element={<FreelancerList />} />
              <Route path="/freelancers/:id" element={<FreelancerProfile />} />

              {/* COURSES */}
              <Route path="/course/learn/:slug/:id" element={<LearnCourse />} />
              <Route path="/course/:slug/:id" element={<CourseDetails />} />
              <Route path="/courses" element={<CoursesList />} />
              
              {/* MOCK INTERVIEW */}
              <Route path="/mock-interview" element={<MockInterview />} />

              {/* JOBS */}
              <Route path="/jobs" element={<JobsListPage />} />
              <Route path="/jobs/:slug" element={<JobDetailsPage />} />
              <Route path="/apply" element={<ApplyJobPage />} />

              {/* INTERNSHIPS */}
              <Route path="/internships" element={<InternshipsListPage />} />
              <Route path="/internships/:id" element={<InternshipDetailsPage />} />
              <Route path="/apply-internship" element={<ApplyInternshipPage />} />

              {/* CANDIDATE DASHBOARD */}
              <Route path="/candidate-dashboard/*" element={<CandidateDashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="overview" element={<Overview />} />
                <Route path="profile" element={<Profile />} />
                <Route path="applied-jobs" element={<AppliedJobs />} />
                <Route path="applied-internships" element={<AppliedInternships />} />
                <Route path="saved-jobs" element={<SavedJobs />} />
                <Route path="saved-internships" element={<SavedInternships />} />
                <Route path="courses" element={<Courses />} />

                
                {/* Freelancer Pages */}
                <Route path="freelancer/basic-information" element={<FreelancerBasicInfo />} />
                <Route path="freelancer/professional-details" element={<FreelancerProfessionalDetails />} />
                <Route path="freelancer/education" element={<FreelancerEducation />} />
                <Route path="freelancer/availability" element={<FreelancerAvailability />} />
                <Route path="freelancer/payment-method" element={<FreelancerPayment />} />
                <Route path="freelancer/social-links" element={<FreelancerSocialLinks />} />
                <Route path="freelancer/profile-preview" element={<FreelancerProfilePreview />} />
              </Route>

              {/* RECRUITER DASHBOARD */}
              <Route path="/recruiter-dashboard/*" element={<RecruiterDashboardLayout />}>
                <Route index element={<RecruiterOverview />} />
                <Route path="overview" element={<RecruiterOverview />} />
                <Route path="profile/basic-info" element={<BasicInformation />} />
                <Route path="profile/company-profile" element={<CompanyProfile />} />
                <Route path="jobs/post-job" element={<PostJob />} />
                <Route path="jobs/post-internship" element={<PostInternship />} />
                <Route path="jobs/manage-jobs" element={<ManageJobs />} />
                <Route path="jobs/manage-internships" element={<ManageInternships />} />
                <Route path="jobs/edit-job/:id" element={<EditJob />} />
                <Route path="jobs/edit-internship/:id" element={<EditInternship />} />
                <Route path="applications/jobs" element={<JobApplications />} />
                <Route path="applications/internships" element={<InternshipApplications />} />
              </Route>

              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>

            {/* MODAL */}
            {modalCategory && (
              <RiskCategoryModal
                category={modalCategory}
                onClose={() => setModalCategory(null)}
              />
            )}
          </div>
        </SavedInternshipsProvider>
      </SavedJobsProvider>
    </AuthProvider>
  );
}

export default App;