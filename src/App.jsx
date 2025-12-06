import { useState } from "react";
import { Routes, Route, useLocation,useNavigate} from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Toaster } from "react-hot-toast";   // ⭐ ADDED

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

function HomePage({ onCategoryClick }) {
  return (
    <>
      <HeroSection onCategoryClick={onCategoryClick} 
      navigateToJobsList={() => navigate("/jobs")}
        navigateToResumeMaking={() => window.open("https://tconnects.vercel.app/", "_blank")}
        />
      <AboutSection navigateToAboutUs={navigateToAboutUs} />
      <WhyChoose />
      <HowItWorks />
      <Footer />
    </>
  );
}

/* ================= MAIN APP ================= */
function App() {
  const [modalCategory, setModalCategory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const hideHeader = location.pathname.startsWith("/course/");

  return (
    <AuthProvider>
      <SavedJobsProvider>
        <SavedInternshipsProvider>
          <div>

            <Toaster position="top-right" />  {/* ⭐ ADDED HERE */}

            {!hideHeader && <Header />}

            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<HomePage onCategoryClick={setModalCategory} />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegistrationPage />} />

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

              <Route path="/candidate-dashboard/*" element={<CandidateDashboardLayout />}>
    <Route index element={<Overview />} />
    <Route path="overview" element={<Overview />} />
    <Route path="profile" element={<Profile />} />

    {/* ⭐ FIXED: Add missing pages */}
    <Route path="applied-jobs" element={<AppliedJobs />} />
    <Route path="applied-internships" element={<AppliedInternships />} />
    <Route path="saved-jobs" element={<SavedJobs />} />
    <Route path="saved-internships" element={<SavedInternships />} />

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

              <Route path="*" element={<HomePage />} />
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
