import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import WelcomeModal from "./components/WelcomeModal";
import PricingPage from "./pages/pricing/PricingPage";
import { Toaster } from "react-hot-toast";

/* AUTH CONTEXT */
import { AuthProvider } from "./context/AuthContext";
import { SavedJobsProvider } from "./context/SavedJobsContext";
import { SavedInternshipsProvider } from "./context/SavedInternshipsContext";

/* PUBLIC COMPONENTS */
import SiteHeader from "./components/SiteHeader"; // shared header (same design as the homepage header)
import Footer from "./components/Footer"; // shared footer, shown on every page except the ones listed in hideFooter
// The old hero's stylesheet stays loaded: other pages may rely on its global classes.
import "./components/HeroSection.css";
import NewHomePage from "./pages/home/HomePage"; // NEW homepage (hero and sections; header and footer come from App)
import { BrandLoader } from "./components/BrandLogo";
import RiskCategoryModal from "./components/RiskCategoryModal";
import AboutUs from "./components/AboutUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";

/* AUTH (new split-screen pages live in src/pages together with AuthLayout.jsx + Auth.css) */
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

/* ================= COURSES ================= */
import CoursesList from "./pages/courses/CoursesList";
import CourseDetails from "./pages/courses/CourseDetails";
import LearnCourse from "./pages/courses/LearnCourse";

import MockInterview from "./pages/mock-interview/MockInterview";
import AIResumeGenerator from "./pages/ai-resume/AIResumeGenerator";

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
/* import of city by ruchitha */
import CityJobs from "./pages/jobs/CityJobs";

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

import MentorshipHome from "./pages/mentorship/MentorshipHome";
import MentorDirectory from "./pages/mentorship/MentorDirectory";
import MentorProfile from "./pages/mentorship/MentorProfile";
import BecomeMentor from "./pages/mentorship/BecomeMentor";

import MentorReviewDashboard from "./pages/admin-dashboard/MentorReviewDashboard";
import MentorReviewDetail from "./pages/admin-dashboard/MentorReviewDetail";
import MentorshipAdmin from "./pages/admin-dashboard/MentorshipAdmin";
import MyMentorship from "./pages/mentorship/dashboard/MyMentorship";
import MentorDashboard from "./pages/mentorship/dashboard/MentorDashboard";
import DeleteAccount from "./components/DeleteAccount";

/* ================= API ================= */
import { checkAuth, logout as apiLogout } from "./config/api";

/* ================= MAIN APP ================= */
function App() {
  const [modalCategory, setModalCategory] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // The shared header shows on every page (homepage, login, register, jobs...)
  // except these, which have their own layout / navigation.
  const hideHeader =
    location.pathname.startsWith("/course/") ||
    location.pathname.startsWith("/candidate-dashboard") ||
    location.pathname.startsWith("/recruiter-dashboard") ||
    location.pathname.startsWith("/admin-dashboard");

  // The shared footer is hidden on the same pages as the header, plus the
  // split-screen login / register pages. Add more paths here if needed.
  const hideFooter =
    hideHeader ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  useEffect(() => {
    const initAuth = async () => {
      try {
        const authData = await checkAuth();
        if (authData.authenticated && authData.user) {
          setCurrentUser(authData.user);
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setIsChecking(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setCurrentUser(null);
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleRegisterSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = async () => {
    await apiLogout();
    setCurrentUser(null);
    navigate("/");
  };

  // The homepage paints straight away. Other routes wait for the login check,
  // because their content can depend on who is logged in.
  if (isChecking && location.pathname !== "/") return <BrandLoader />;

  return (
    <AuthProvider value={{ user: currentUser, setUser: setCurrentUser }}>
      <SavedJobsProvider enabled={!isChecking}>
        <SavedInternshipsProvider enabled={!isChecking}>
          <div>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#14b8a6",
                  color: "#ffffff",
                },
              }}
            />

            {!hideHeader && (
              <SiteHeader currentUser={currentUser} onLogout={handleLogout} />
            )}

            <Routes>
              {/* PUBLIC ROUTES */}
              <Route
                path="/"
                element={
                  <>
                    {!isChecking && <WelcomeModal currentUser={currentUser} />}
                    <NewHomePage currentUser={currentUser} />
                  </>
                }
              />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/delete-account" element={<DeleteAccount />} />

              {/* AUTH ROUTES */}
              <Route
                path="/login"
                element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
              />
              <Route
                path="/register"
                element={
                  <RegistrationPage onRegisterSuccess={handleRegisterSuccess} />
                }
              />

              {/* FREELANCERS */}
              <Route path="/freelancers" element={<FreelancerList />} />
              <Route path="/freelancers/:id" element={<FreelancerProfile />} />

              {/* COURSES */}
              <Route path="/course/learn/:slug/:id" element={<LearnCourse />} />
              <Route path="/course/:slug/:id" element={<CourseDetails />} />
              <Route path="/courses" element={<CoursesList />} />

              {/* MOCK INTERVIEW */}
              <Route path="/mock-interview" element={<MockInterview />} />
              <Route path="/resume" element={<AIResumeGenerator />} />

              {/* JOBS: :id instead of :slug */}
              <Route path="/jobs" element={<JobsListPage />} />
              {/* Job city  */}
              <Route path="/jobs/city/:city" element={<CityJobs />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/apply" element={<ApplyJobPage />} />

              {/* INTERNSHIPS */}
              <Route path="/internships" element={<InternshipsListPage />} />
              <Route path="/internships/:id" element={<InternshipDetailsPage />} />
              <Route path="/apply-internship" element={<ApplyInternshipPage />} />

              {/* CANDIDATE DASHBOARD */}
              <Route
                path="/candidate-dashboard/*"
                element={<CandidateDashboardLayout />}
              >
                <Route index element={<Overview />} />
                <Route path="overview" element={<Overview />} />
                <Route path="profile" element={<Profile />} />
                <Route path="applied-jobs" element={<AppliedJobs />} />
                <Route path="applied-internships" element={<AppliedInternships />} />
                <Route path="saved-jobs" element={<SavedJobs />} />
                <Route path="saved-internships" element={<SavedInternships />} />
                <Route path="courses" element={<Courses />} />
                <Route path="freelancer/basic-information" element={<FreelancerBasicInfo />} />
                <Route path="freelancer/professional-details" element={<FreelancerProfessionalDetails />} />
                <Route path="freelancer/education" element={<FreelancerEducation />} />
                <Route path="freelancer/availability" element={<FreelancerAvailability />} />
                <Route path="freelancer/payment-method" element={<FreelancerPayment />} />
                <Route path="freelancer/social-links" element={<FreelancerSocialLinks />} />
                <Route path="freelancer/profile-preview" element={<FreelancerProfilePreview />} />
                <Route path="my-mentorship" element={<MyMentorship />} />
                <Route path="mentor-dashboard" element={<MentorDashboard />} />
              </Route>

              {/* RECRUITER DASHBOARD */}
              <Route
                path="/recruiter-dashboard/*"
                element={<RecruiterDashboardLayout />}
              >
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
                <Route path="my-mentorship" element={<MyMentorship />} />
                <Route path="mentor-dashboard" element={<MentorDashboard />} />
              </Route>

              {/* MENTORSHIP */}
              <Route path="/mentorship" element={<MentorshipHome />} />
              <Route path="/mentorship/mentors" element={<MentorDirectory />} />
              <Route path="/mentorship/mentors/:slug" element={<MentorProfile />} />
              <Route path="/mentorship/become-a-mentor" element={<BecomeMentor />} />

              {/* ADMIN: MENTOR VERIFICATION */}
              <Route
                path="/admin-dashboard/mentors"
                element={<MentorReviewDashboard />}
              />
              <Route
                path="/admin-dashboard/mentors/:id"
                element={<MentorReviewDetail />}
              />
              {/* ADMIN: MENTORSHIP BOOKINGS, PAYMENTS, COMMISSION, PAYOUTS, ANALYTICS */}
              <Route
                path="/admin-dashboard/mentorship"
                element={<MentorshipAdmin />}
              />

              {/* 404 */}
              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>

            {/* SHARED FOOTER: one footer for every page (see hideFooter above) */}
            {!hideFooter && (
              <Footer currentUser={currentUser} onLogout={handleLogout} />
            )}

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