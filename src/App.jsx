import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

/* Public website components */
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import RiskCategoryModal from "./components/RiskCategoryModal";
import AboutSection from "./components/AboutSection";
import AboutUs from "./components/AboutUs";
import WhyChoose from "./components/WhyChoose";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

/* Auth pages */
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";

/* Dashboard Layout */
import CandidateDashboardLayout from "./pages/candidate-dashboard/CandidateDashboardLayout";

/* Candidate Dashboard Pages */
import Overview from "./pages/candidate-dashboard/Overview";
import Profile from "./pages/candidate-dashboard/Profile";
import AppliedJobs from "./pages/candidate-dashboard/AppliedJobs";
import AppliedInternships from "./pages/candidate-dashboard/AppliedInternships";
import SavedJobs from "./pages/candidate-dashboard/SavedJobs";
import SavedInternships from "./pages/candidate-dashboard/SavedInternships";
import Messages from "./pages/candidate-dashboard/Messages";
import Courses from "./pages/candidate-dashboard/Courses";

/* Freelancer Pages */
import FreelancerOverview from "./pages/candidate-dashboard/freelancer/FreelancerOverview";
import FreelancerBasicInfo from "./pages/candidate-dashboard/freelancer/FreelancerBasicInfo";
import FreelancerProfessionalDetails from "./pages/candidate-dashboard/freelancer/FreelancerProfessionalDetails";
import FreelancerEducation from "./pages/candidate-dashboard/freelancer/FreelancerEducation";
import FreelancerAvailability from "./pages/candidate-dashboard/freelancer/FreelancerAvailability";
import FreelancerPayment from "./pages/candidate-dashboard/freelancer/FreelancerPayment";
import FreelancerSocialLinks from "./pages/candidate-dashboard/freelancer/FreelancerSocialLinks";
import FreelancerProfilePreview from "./pages/candidate-dashboard/freelancer/FreelancerProfilePreview";

/* ---------------- JOBS PAGES ---------------- */
import JobsListPage from "./pages/jobs/JobsListPage";
import JobDetailsPage from "./pages/jobs/JobDetailsPage";

/* ---------------- HOME PAGE ---------------- */
function HomePage({ onCategoryClick }) {
  return (
    <>
      <HeroSection onCategoryClick={onCategoryClick} />
      <AboutSection />
      <WhyChoose />
      <HowItWorks />
      <Footer />
    </>
  );
}

/* ---------------- APP ---------------- */
function App() {
  const [modalCategory, setModalCategory] = useState(null);

  return (
    <div>
      <Header />

      <Routes>
        {/* ---------- Public website routes ---------- */}
        <Route
          path="/"
          element={<HomePage onCategoryClick={setModalCategory} />}
        />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        {/* ---------- JOBS ROUTES ---------- */}
        <Route path="/jobs" element={<JobsListPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />

        {/* ---------- Candidate Dashboard with Nested Routes ---------- */}
        <Route
          path="/candidate-dashboard/*"
          element={<CandidateDashboardLayout />}
        >
          <Route index element={<Overview />} />

          {/* Main Sections */}
          <Route path="overview" element={<Overview />} />
          <Route path="profile" element={<Profile />} />
          <Route path="applied" element={<AppliedJobs />} />
          <Route path="applied-internships" element={<AppliedInternships />} />
          <Route path="saved" element={<SavedJobs />} />
          <Route
            path="saved-internships"
            element={<SavedInternships />}
          />
          <Route path="messages" element={<Messages />} />
          <Route path="courses" element={<Courses />} />

          {/* ---------- Freelancer Routes ---------- */}
          <Route path="freelancer/overview" element={<FreelancerOverview />} />
          <Route
            path="freelancer/basic-information"
            element={<FreelancerBasicInfo />}
          />
          <Route
            path="freelancer/professional-details"
            element={<FreelancerProfessionalDetails />}
          />
          <Route
            path="freelancer/education"
            element={<FreelancerEducation />}
          />
          <Route
            path="freelancer/availability"
            element={<FreelancerAvailability />}
          />
          <Route
            path="freelancer/payment-method"
            element={<FreelancerPayment />}
          />
          <Route
            path="freelancer/social-links"
            element={<FreelancerSocialLinks />}
          />
          <Route
            path="freelancer/profile-preview"
            element={<FreelancerProfilePreview />}
          />
        </Route>

        {/* ---------- Fallback ---------- */}
        <Route path="*" element={<HomePage />} />
      </Routes>

      {/* Risk Modal */}
      {modalCategory && (
        <RiskCategoryModal
          category={modalCategory}
          onClose={() => setModalCategory(null)}
        />
      )}
    </div>
  );
}

export default App;
