import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeadCaptureModal from './components/LeadCaptureModal';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Internships from './pages/Internships';
import Placements from './pages/Placements';
import GetCertified from './pages/GetCertified';
import VerifyCertificate from './pages/VerifyCertificate';
import ReferAndEarn from './pages/ReferAndEarn';
import OurProgramme from './pages/OurProgramme';
import OurTeam from './pages/OurTeam';
import Careers from './pages/Careers';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';

import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminCourses from './pages/AdminCourses';
import AdminUsers from './pages/AdminUsers';
import AdminInternships from './pages/AdminInternships';
import AdminEnquiries from './pages/AdminEnquiries';
import AdminBlogs from './pages/AdminBlogs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import NotFound from './pages/NotFound';

// Helper component that automatically scrolls window to top on route change
const ScrollToTopOnRoute = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Strict Admin Route Guard - only verified Administrators can enter
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: window.location.hash }} />;
  }

  return children;
};

// Global Error Boundary to prevent crashes
class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Crash Protected:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-2xl">
            CD
          </div>
          <h2 className="text-2xl font-black">Something went wrong</h2>
          <p className="text-xs text-slate-400 max-w-md">
            The page encountered an unexpected state. Click below to refresh smoothly.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '#/';
            }}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
          >
            Return to Homepage
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { fetchLiveCoursesFromApi } from './services/api';

function App() {
  useEffect(() => {
    fetchLiveCoursesFromApi().catch(() => {});
  }, []);

  return (
    <GlobalErrorBoundary>
      <Router>
        <ScrollToTopOnRoute />
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <div className="flex flex-col min-h-screen bg-[#F8FAFD] text-slate-800">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    {/* Public Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:slug" element={<CourseDetails />} />
                    <Route path="/internships" element={<Internships />} />
                    <Route path="/placements" element={<Placements />} />
                    <Route path="/get-certified" element={<GetCertified />} />
                    <Route path="/verify-certificate" element={<VerifyCertificate />} />
                    <Route path="/refer-and-earn" element={<ReferAndEarn />} />
                    <Route path="/our-programme" element={<OurProgramme />} />
                    <Route path="/our-team" element={<OurTeam />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/reviews" element={<Testimonials />} />
                    <Route path="/student-testimonials" element={<Testimonials />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/projects" element={<Gallery />} />
                    <Route path="/projects-gallery" element={<Gallery />} />


                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsConditions />} />

                    {/* Student Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/*" element={<Dashboard />} />

                    {/* Protected Admin Portal - Strict Guard */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/courses" element={<AdminCourses />} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                    <Route path="/admin/internships" element={<AdminRoute><AdminInternships /></AdminRoute>} />
                    <Route path="/admin/enquiries" element={<AdminRoute><AdminEnquiries /></AdminRoute>} />
                    <Route path="/admin/blogs" element={<AdminRoute><AdminBlogs /></AdminRoute>} />

                    {/* 404 Not Found */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <LeadCaptureModal />
              </div>

            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </GlobalErrorBoundary>
  );
}

export default App;

