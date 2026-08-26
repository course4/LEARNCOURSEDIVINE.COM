import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Search,
  GraduationCap,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Award,
  Gift,
  Briefcase,
  Layers,
  Users,
  Sparkles,
  Star,
  MessageSquareQuote
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import ecellLogo from '../assets/ecell-iit-tirupati.png';
import SocialLinks from './SocialLinks';


const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const [showNavSearch, setShowNavSearch] = useState(false);


  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setMoreDropdownOpen(false);
    setBlogDropdownOpen(false);
  }, [location.pathname]);

  const moreLinks = [
    { name: 'Projects Gallery 🌟', path: '/gallery', icon: Sparkles, desc: '12+ Capstone Infographics' },
    { name: 'Student Testimonials', path: '/testimonials', icon: MessageSquareQuote, desc: 'Verified student feedback' },
    { name: 'Get Certified', path: '/get-certified', icon: Award, desc: 'Professional credentials' },
    { name: 'Verify Certificate', path: '/verify-certificate', icon: ShieldCheck, desc: 'Credential verification' },
    { name: 'Refer & Earn', path: '/refer-and-earn', icon: Gift, desc: 'Earn ₹500 per friend' },
    { name: 'Our Programme', path: '/our-programme', icon: Layers, desc: 'Curriculum roadmaps' },
    { name: 'Our Team', path: '/our-team', icon: Users, desc: 'Industry mentors' },
    { name: 'Careers', path: '/careers', icon: Briefcase, desc: 'Join our team' }
  ];

  const blogCategories = [

    { name: 'All Articles', path: '/blog' },
    { name: 'Career Guides', path: '/blog?category=Career+Guide' },
    { name: 'Development', path: '/blog?category=Development' },
    { name: 'Interview Prep', path: '/blog?category=Interview+Prep' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#071F3F] text-white shadow-md select-none border-b border-[#0D2F5D]">
      {/* Top Mini Utility Bar with Admissions hotline + all 5 Social Links */}
      <div className="bg-[#041226] text-slate-300 py-1.5 px-3 sm:px-6 lg:px-8 border-b border-[#0D2F5D]/60 text-xs hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px] text-slate-300/90 font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admissions & Hiring Open</span>
          </span>
          <span className="text-slate-600">•</span>
          <a href="tel:+919100348679" className="hover:text-white transition">
            📞 +91 91003 48679
          </a>
          <span className="text-slate-600">•</span>
          <a href="mailto:coursedivine@gmail.com" className="hover:text-white transition">
            ✉️ coursedivine@gmail.com
          </a>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-sky-300 font-bold uppercase tracking-wider text-[10px]">Follow Us:</span>
          <SocialLinks size="sm" />
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-[72px] gap-3 sm:gap-4">
          
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 mr-1 sm:mr-2 group">
            <img
              src={logoImg}
              alt="Course Divine Logo"
              className="h-8 sm:h-12 w-auto object-contain rounded-md sm:rounded-lg shadow-sm group-hover:scale-105 transition-transform"
            />
          </Link>



          {/* Center: Desktop Navigation Links (Single Line, Never Wraps) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[15px] font-medium tracking-wide">
            {/* 1. Home */}
            <Link
              to="/"
              className={`whitespace-nowrap transition-colors py-1 ${
                location.pathname === '/'
                  ? 'text-brand-400 font-semibold'
                  : 'text-white/90 hover:text-brand-300'
              }`}
            >
              Home
            </Link>

            {/* 2. About Us */}
            <Link
              to="/about"
              className={`whitespace-nowrap transition-colors py-1 ${
                location.pathname === '/about'
                  ? 'text-brand-400 font-semibold'
                  : 'text-white/90 hover:text-brand-300'
              }`}
            >
              About Us
            </Link>

            {/* 3. Learning Lounge */}
            <Link
              to="/courses"
              className={`whitespace-nowrap transition-colors py-1 ${
                location.pathname.startsWith('/courses')
                  ? 'text-brand-400 font-semibold'
                  : 'text-white/90 hover:text-brand-300'
              }`}
            >
              Learning Lounge
            </Link>

            {/* 4. Internship */}
            <Link
              to="/internships"
              className={`whitespace-nowrap transition-colors py-1 ${
                location.pathname === '/internships'
                  ? 'text-brand-400 font-semibold'
                  : 'text-white/90 hover:text-brand-300'
              }`}
            >
              Internship
            </Link>

            {/* 5. Placements */}
            <Link
              to="/placements"
              className={`whitespace-nowrap transition-colors py-1 ${
                location.pathname === '/placements'
                  ? 'text-brand-400 font-semibold'
                  : 'text-white/90 hover:text-brand-300'
              }`}
            >
              Placements
            </Link>

            {/* 6. More ▾ Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMoreDropdownOpen(true)}
              onMouseLeave={() => setMoreDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 whitespace-nowrap transition-colors py-1 ${
                  moreDropdownOpen || ['/testimonials', '/get-certified', '/verify-certificate', '/refer-and-earn', '/our-programme', '/our-team', '/careers'].includes(location.pathname)
                    ? 'text-brand-400 font-semibold'
                    : 'text-white/90 hover:text-brand-300'
                }`}

              >
                <span>More</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-slate-800">
                    {moreLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-brand-50 transition group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center shrink-0 transition">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 group-hover:text-brand-600 transition">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 7. Contact Us */}
            <Link
              to="/contact"
              className={`whitespace-nowrap transition-colors py-1 ${
                location.pathname === '/contact'
                  ? 'text-brand-400 font-semibold'
                  : 'text-white/90 hover:text-brand-300'
              }`}
            >
              Contact Us
            </Link>

            {/* 8. Blog ▾ Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBlogDropdownOpen(true)}
              onMouseLeave={() => setBlogDropdownOpen(false)}
            >
              <button
                className={`flex items-center gap-1 whitespace-nowrap transition-colors py-1 ${
                  blogDropdownOpen || location.pathname.startsWith('/blog')
                    ? 'text-brand-400 font-semibold'
                    : 'text-white/90 hover:text-brand-300'
                }`}
              >
                <span>Blog</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${blogDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {blogDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-48 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 text-slate-800">
                    {blogCategories.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Section: Search + Cart + User Profile / Login */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Quick Search Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (navSearch.trim()) {
                  navigate(`/courses?search=${encodeURIComponent(navSearch.trim())}`);
                  setNavSearch('');
                  setShowNavSearch(false);
                }
              }}
              className="relative hidden sm:flex items-center"
            >
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-36 lg:w-44 focus:w-60 pl-8 pr-3 py-1.5 rounded-full bg-[#0C2A52] hover:bg-[#0E3260] focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 text-xs border border-brand-400/20 focus:border-brand-500 transition-all duration-300 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              {navSearch && (
                <button
                  type="button"
                  onClick={() => setNavSearch('')}
                  className="absolute right-2 p-0.5 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-[#0C2A52] hover:bg-brand-700/50 text-white transition-all duration-200 border border-brand-400/20"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>


            {/* User Dropdown / Login Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#0C2A52] hover:bg-brand-700/50 border border-brand-400/20 transition duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-500 border border-brand-300/40 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {user?.name ? user.name.trim().charAt(0) : 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-white max-w-[90px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-300" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-800">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 mt-1 rounded-full uppercase ${
                        isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-brand-100 text-brand-700'
                      }`}>
                        {isAdmin ? 'Administrator' : 'Student'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-brand-600" />
                        Student Dashboard
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 font-medium transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          Admin Portal
                        </Link>
                      )}

                      <Link
                        to="/dashboard/certificates"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition"
                      >
                        <Award className="w-4 h-4 text-brand-600" />
                        My Certificates
                      </Link>

                      <Link
                        to="/refer-and-earn"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition"
                      >
                        <Gift className="w-4 h-4 text-brand-600" />
                        Referral Earnings
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-white/90 hover:text-white transition whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold shadow-md shadow-brand-500/30 transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </Link>

                {/* E-CELL | IIT TIRUPATI Logo Badge */}
                <div className="flex items-center pl-1 shrink-0" title="E-CELL | IIT TIRUPATI">
                  <img
                    src={ecellLogo}
                    alt="E-CELL | IIT TIRUPATI"
                    className="h-8 sm:h-9 w-auto object-contain rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer border border-white/40 bg-white"
                  />
                </div>
              </div>

            )}

            {/* Mobile Menu Toggle Button */}


            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 top-14 sm:top-[72px] bg-slate-900/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        >

          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#071F3F] text-white w-4/5 max-w-sm h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-brand-800"
          >

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-brand-800">
                <img
                  src={logoImg}
                  alt="Course Divine"
                  className="h-10 w-auto object-contain rounded-lg shadow-sm"
                />
              </div>


              <div className="flex flex-col gap-1 text-sm font-medium">
                <Link to="/" className="px-3 py-2.5 rounded-xl hover:bg-white/10 transition">
                  Home
                </Link>
                <Link to="/about" className="px-3 py-2.5 rounded-xl hover:bg-white/10 transition">
                  About Us
                </Link>
                <Link to="/courses" className="px-3 py-2.5 rounded-xl hover:bg-white/10 transition">
                  Learning Lounge
                </Link>
                <Link to="/internships" className="px-3 py-2.5 rounded-xl hover:bg-white/10 transition">
                  Internship
                </Link>
                <Link to="/placements" className="px-3 py-2.5 rounded-xl hover:bg-white/10 transition">
                  Placements
                </Link>

                {/* More dropdown accordion in mobile */}
                <div>
                  <button
                    onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 transition text-left"
                  >
                    <span>More</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileMoreOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileMoreOpen && (
                    <div className="pl-4 py-1 space-y-1 text-xs text-brand-200">
                      {moreLinks.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link to="/contact" className="px-3 py-2.5 rounded-xl hover:bg-white/10 transition">
                  Contact Us
                </Link>

                {/* Blog dropdown accordion in mobile */}
                <div>
                  <button
                    onClick={() => setMobileBlogOpen(!mobileBlogOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 transition text-left"
                  >
                    <span>Blog</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileBlogOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {mobileBlogOpen && (
                    <div className="pl-4 py-1 space-y-1 text-xs text-brand-200">
                      {blogCategories.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          className="block px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-800">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="w-full py-2.5 rounded-xl border border-brand-400 text-brand-200 text-center font-bold text-xs hover:bg-white/10 transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full py-2.5 rounded-xl bg-brand-500 text-white text-center font-bold text-xs shadow-md transition hover:bg-brand-400"
                  >
                    Get Started Free
                  </Link>
                  <div className="flex items-center justify-center gap-2 pt-3 border-t border-brand-800/80">
                    <img
                      src={ecellLogo}
                      alt="E-CELL | IIT TIRUPATI"
                      className="h-8 w-auto object-contain rounded-full border border-white/20 bg-white"
                    />
                    <span className="text-xs font-bold text-sky-200 tracking-wide">E-CELL | IIT TIRUPATI</span>
                  </div>
                </div>

              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/dashboard"
                    className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs text-center flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full py-2 text-rose-400 font-bold text-xs text-center hover:underline"
                  >
                    Log Out
                  </button>
                </div>
              )}

              {/* Mobile Social Links */}
              <div className="pt-4 mt-2 border-t border-brand-800/80 text-center space-y-2">
                <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block">
                  Follow Us On Social Media
                </span>
                <div className="flex justify-center">
                  <SocialLinks size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
