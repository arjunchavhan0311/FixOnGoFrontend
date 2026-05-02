import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// Customer Pages
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import CustomerIssue from "./pages/customer/CustomerIssuePage";
import CustomerProfilePage from "./pages/customer/CustomerProfilePage";
import CustomerServiceHistory from "./pages/customer/CustomerServiceHistory";
import FeedbackPage from "./pages/customer/FeedbackPage";
import Hero from "./pages/customer/Hero";
import Process from "./pages/customer/Process";
import ServicesPage from "./pages/customer/ServicePage";
import TrackService from "./pages/customer/Tracking";

//import BookingPreviewPage from "./pages/customer/BookingPreviewPage";

// Auth Components (Customer Modals)
import Login from "./auth/Login";
import Signup from "./auth/Signup";

import AdminLogin from "./auth/AdminLogin";
import AdminRegistration from "./auth/AdminRegistration";
import WorkerLogin from "./auth/WorkerLogin";
import WorkerRegistration from "./auth/WorkerRegst";
import AboutPage from "./components/About";
import WorkerHomeCTA from "./components/WorkerCta";
import MainPage from "./pages/admin/MainPage";
import Service from "./pages/customer/Service";
import WorkerDashboard from "./pages/worker/WorkerDashboard";

/* -------------------- SCROLL TO TOP -------------------- */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Routes where Navbar and Footer should be hidden
const HIDDEN_NAV_ROUTES = [
  "/adminpage", "/adminlogin", "/adminsignup",
  "/workerdashboard", "/workerlogin", "/workerregistration"
];

function App() {
  /* -------------------- AUTH STATE -------------------- */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar & footer on admin and worker routes
  const hideNav = HIDDEN_NAV_ROUTES.includes(location.pathname);

  /* -------------------- RESTORE LOGIN -------------------- */
  useEffect(() => {
  const user = localStorage.getItem("fixongo_auth");

  if (user) {
    try {
      const parsed = JSON.parse(user);

      if (parsed?.token) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("fixongo_auth");
        setIsLoggedIn(false);
      }
    } catch {
      localStorage.removeItem("fixongo_auth");
      setIsLoggedIn(false);
    }
  }
}, []);

  useEffect(() => {
    const openLogin = () => setShowLogin(true);

    window.addEventListener("open-login", openLogin);

    return () => {
      window.removeEventListener("open-login", openLogin);
    };
  }, []);

  /* -------------------- LOGIN HANDLER -------------------- */
  const handleLoginSuccess = (userData) => {
    
    setIsLoggedIn(true);
    setShowLogin(false);
    setShowSignup(false);
  };

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = () => {
    localStorage.removeItem("fixongo_auth");
    setIsLoggedIn(false);
    navigate("/");
     window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />

      {/* Navbar — hidden on admin and worker routes */}
      {!hideNav && (
        <Navigation
          isLoggedIn={isLoggedIn}
          onLoginClick={() => setShowLogin(true)}
          onLogout={handleLogout}
        />
      )}

      {/* MAIN CONTENT */}
      <div
        className={
          showLogin || showSignup
            ? "blurred filter blur-sm transition-all"
            : "transition-all duration-500"
        }
      >
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <ServicesPage
                  onLoginRequired={() => setShowLogin(true)}
                />
                <Process />
                {!isLoggedIn && <WorkerHomeCTA />}
              </>
            }
          />

          {/* CUSTOMER */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/service" element={<Service />} />
          <Route path="/customerissue" element={<CustomerIssue />} />
          {/* <Route path="/booking-preview" element={<BookingPreviewPage />} /> */}
          <Route path="/customerhistory" element={<CustomerServiceHistory />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/trackservice" element={<TrackService />} />
          <Route path="/customerprofile" element={<CustomerProfilePage />} />
         

          {/* WORKER */}
          <Route path="/workerlogin" element={<WorkerLogin />} />
          <Route
            path="/workerregistration"
            element={<WorkerRegistration />}
          />
          <Route path="/workerdashboard" element={<WorkerDashboard />} />

          {/* ADMIN */}
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/adminsignup" element={<AdminRegistration />} />
          <Route path="/adminpage" element={<MainPage />} />
         
        </Routes>

        {/* Footer — hidden on admin and worker routes */}
        {!hideNav && <Footer />}
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onLogin={handleLoginSuccess}
        />
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          onLogin={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;