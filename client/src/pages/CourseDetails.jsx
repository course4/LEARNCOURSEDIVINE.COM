import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Play,
  ShoppingCart,
  Share2,
  ShieldCheck,
  Globe,
  Users,
  Sparkles,
  ArrowRight,
  Lock,
  Unlock,
  Download,
  FileText,
  User,
  Mail,
  Phone,
  X,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import logoImg from '../assets/logo.png';
import api, { fallbackStore, getLiveCourses, getLiveCourseBySlug, saveCourseLive } from '../services/api';
import { getPdfFromDb, storePdfInDb } from '../services/pdfStorage';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { Upload } from 'lucide-react';
import CourseCard from '../components/CourseCard';

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { showToast } = useNotification();

  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [openModuleIndex, setOpenModuleIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  // Curriculum & Course Handout Lock State (Locked by default until student submits basic details)
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('cd_handout_unlocked') === 'true';
  });
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [unlockForm, setUnlockForm] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: ''
  });
  const [isSubmittingUnlock, setIsSubmittingUnlock] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCourseDetails();

    const handleUpdate = () => {
      fetchCourseDetails();
    };
    window.addEventListener('cd_courses_updated', handleUpdate);
    return () => window.removeEventListener('cd_courses_updated', handleUpdate);
  }, [slug]);

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/slug/${slug}`);
      if (res.data?.success && res.data.data) {
        setCourse(res.data.data);
        setRelatedCourses(res.data.relatedCourses || []);
      } else {
        const found = getLiveCourseBySlug(slug);
        setCourse(found);
        const allLive = getLiveCourses();
        setRelatedCourses(allLive.filter(c => c._id !== found?._id).slice(0, 3));
      }
    } catch (err) {
      const found = getLiveCourseBySlug(slug);
      setCourse(found);
      const allLive = getLiveCourses();
      setRelatedCourses(allLive.filter(c => c._id !== found?._id).slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!course) return;
    if (isInCart(course._id)) {
      navigate('/cart');
    } else {
      addToCart(course);
      showToast(`Added "${course.title}" to cart!`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (!course) return;
    if (!isInCart(course._id)) {
      addToCart(course);
    }
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Course link copied to clipboard!', 'info');
    }
  };

  const openPrintableSyllabus = (courseData) => {
    const c = courseData || course;
    if (!c) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const logoSrc = window.location.origin + '/logo.png';

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${c.title || 'Course Divine'} - Course Handout</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm 12mm 12mm;
            }
            * { box-sizing: border-box; }
            body {
              font-family: "Times New Roman", Times, Georgia, serif;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 15px;
              line-height: 1.5;
            }
            .page-frame {
              border: 2px solid #000;
              padding: 24px;
              min-height: 95vh;
              box-sizing: border-box;
              position: relative;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              border-bottom: 2px solid #000;
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            .brand-title {
              font-size: 26px;
              font-weight: 900;
              letter-spacing: 1px;
              color: #000;
              text-transform: uppercase;
              font-family: Arial, sans-serif;
            }
            .brand-tagline {
              font-size: 12px;
              font-style: italic;
              color: #222;
              margin-top: 2px;
              font-family: Arial, sans-serif;
            }
            .logo-img {
              height: 60px;
              width: auto;
              max-width: 160px;
              object-fit: contain;
              background: #071F3F;
              padding: 4px;
              border-radius: 4px;
            }
            .doc-main-title {
              text-align: center;
              margin: 22px 0 26px 0;
            }
            .doc-main-title h1 {
              font-size: 20px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #000;
              margin: 0;
              font-family: Arial, sans-serif;
              text-decoration: underline;
            }
            .course-meta-row {
              margin-bottom: 22px;
              font-size: 16px;
            }
            .meta-label {
              font-weight: bold;
              text-decoration: underline;
              color: #000;
              font-size: 16px;
            }
            .meta-value {
              font-weight: bold;
              font-size: 17px;
              color: #000;
              margin-left: 20px;
            }
            .section-block {
              margin-top: 22px;
            }
            .section-heading {
              font-size: 17px;
              font-weight: bold;
              color: #000;
              margin-bottom: 10px;
            }
            .description-text {
              font-size: 14px;
              line-height: 1.75;
              color: #111;
              text-align: justify;
              white-space: pre-line;
            }
            .list-item {
              margin-bottom: 6px;
              font-size: 14px;
            }
            .footer-note {
              margin-top: 35px;
              padding-top: 12px;
              border-top: 1px solid #666;
              font-size: 11px;
              color: #555;
              text-align: center;
              font-family: Arial, sans-serif;
            }
            .btn-print-floating {
              position: fixed;
              bottom: 25px;
              right: 25px;
              padding: 12px 24px;
              background: #0284c7;
              color: #fff;
              border: none;
              border-radius: 30px;
              cursor: pointer;
              font-weight: 800;
              font-size: 14px;
              font-family: Arial, sans-serif;
              box-shadow: 0 4px 14px rgba(0,0,0,0.3);
              z-index: 9999;
              transition: transform 0.2s, background 0.2s;
            }
            .btn-print-floating:hover {
              background: #0369a1;
              transform: scale(1.05);
            }
            @media print {
              .no-print { display: none !important; }
              body { padding: 0; background: #fff !important; }
              .page-frame { border: 2px solid #000 !important; min-height: 98vh; padding: 20px; }
              .btn-print-floating { display: none !important; }
            }
          </style>
        </head>
        <body>
          <button class="btn-print-floating no-print" onclick="window.print()">🖨️ Save as PDF / Print</button>

          <div class="page-frame">
            <table class="header-table">
              <tr>
                <td style="vertical-align: top; text-align: left;">
                  <div class="brand-title">COURSE DIVINE</div>
                  <div class="brand-tagline">DIVE INTO THE LEARNING POOL</div>
                </td>
                <td style="vertical-align: top; text-align: right;">
                  <img class="logo-img" src="${logoSrc}" alt="Course Divine Logo" onError="this.src='https://www.learncoursedivine.com/logo.png'" />
                </td>
              </tr>
            </table>

            <div class="doc-main-title">
              <h1>COURSE HANDOUT (COURSE CURRICULUM)</h1>
            </div>

            <div class="course-meta-row">
              <span class="meta-label">Course Title:</span>
              <span class="meta-value">${c.title}</span>
            </div>

            <div class="section-block">
              <div class="section-heading">Course Description:</div>
              <div class="description-text">${c.description || c.overview || 'Official Course Syllabus Content'}</div>
            </div>

            ${(c.learningOutcomes && c.learningOutcomes.length > 0) ? `
              <div class="section-block">
                <div class="section-heading">2. Skills You Will Gain:</div>
                <ul style="padding-left: 25px; margin-top: 8px;">
                  ${c.learningOutcomes.map(item => `<li class="list-item">${item}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            ${(c.curriculum && c.curriculum.length > 0) ? `
              <div class="section-block">
                <div class="section-heading">3. Curriculum Modules:</div>
                <div style="margin-top: 10px;">
                  ${c.curriculum.map((m, idx) => `
                    <div style="margin-bottom: 12px; font-size: 14px;">
                      <strong>Module ${idx + 1}: ${m.title}</strong>
                      ${m.description ? `<p style="margin: 3px 0 0 0; font-size: 13px; color: #333;">${m.description}</p>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="footer-note">
              Course Divine Technology Institute • Official Course Handout & Curriculum • Verified Document
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      showToast('Opening printable syllabus document...', 'success');
    }
  };

  const downloadHandout = () => {
    if (!isUnlocked) {
      setShowUnlockModal(true);
    } else {
      setShowSyllabusModal(true);
    }
  };

  const handleUnlockSubmit = async (e) => {
    e.preventDefault();
    if (!unlockForm.email || !unlockForm.phone) {
      showToast('Please enter your email and mobile number.', 'error');
      return;
    }

    setIsSubmittingUnlock(true);

    const payload = {
      name: unlockForm.name.trim() || 'Student',
      email: unlockForm.email.trim().toLowerCase(),
      phone: `${unlockForm.countryCode} ${unlockForm.phone.trim()}`,
      courseInterest: course?.title || 'General Course',
      subject: `Handout Request: ${course?.title || 'Course'}`,
      message: `Student requested official course syllabus handout for ${course?.title}. Mail notification sent to coursedivine@gmail.com.`
    };

    try {
      // 1. Submit lead to database enquiry API
      api.post('/enquiries', payload).catch(() => null);

      // 2. Dispatch email notification directly to coursedivine@gmail.com
      const formData = new FormData();
      formData.append('Student Name', payload.name);
      formData.append('Email', payload.email);
      formData.append('Phone Number', payload.phone);
      formData.append('Course Handout Requested', payload.courseInterest);
      formData.append('_subject', `Course Handout Request: ${payload.name} (${payload.courseInterest})`);
      formData.append('_captcha', 'false');

      fetch('https://formsubmit.co/ajax/coursedivine@gmail.com', {
        method: 'POST',
        body: formData
      }).catch(() => null);

      // 3. Persist locally & unlock
      localStorage.setItem('cd_handout_unlocked', 'true');
      setIsUnlocked(true);
      setShowUnlockModal(false);

      confetti({
        particleCount: 140,
        spread: 75,
        origin: { y: 0.6 }
      });

      showToast(`🎉 Handout unlocked! Notification sent to coursedivine@gmail.com`, 'success');
      setShowSyllabusModal(true);
    } catch (err) {
      setIsUnlocked(true);
      setShowUnlockModal(false);
      setShowSyllabusModal(true);
    } finally {
      setIsSubmittingUnlock(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading course curriculum...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-rose-200">
          <BookOpen className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">Course Not Found</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The course program you are looking for may have been updated, deactivated, or removed by the course administrator.
        </p>
        <div className="pt-2">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition"
          >
            Explore All Courses in Learning Lounge <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = course.price && course.discountPrice
    ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
    : 0;

  return (
    <div className="space-y-12 pb-20">
      {/* Course Header Banner */}
      <section className="bg-gradient-to-r from-brand-950 via-brand-900 to-navy-950 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-400/30">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-white/10 text-white">
                  {course.level || 'All Levels'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-brand-100/80 leading-relaxed max-w-3xl">
                {(() => {
                  const sub = course.subtitle;
                  if (sub && !sub.includes('2. Skills You Will Gain') && !sub.includes('SYLLABUS:') && sub !== course.description && sub.length <= 200) {
                    return sub;
                  }
                  return "Master industry-relevant skills with live practical projects, expert mentorship, and recognized certification.";
                })()}
              </p>

              {/* Ratings & Meta */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-brand-100/90 pt-2">
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{course.rating || 4.8}</span>
                  <span className="text-brand-300 font-normal">({course.numReviews || 120} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-400" />
                  <span>{course.enrolledCount || 350}+ Students Enrolled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>ISO & APSCHE Recognized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sticky Enroll Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details, Syllabus, Outcomes */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" /> Course Overview
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {(() => {
                  const ov = course.overview;
                  if (ov && !ov.includes('2. Skills You Will Gain') && !ov.includes('SYLLABUS:') && ov !== course.description && ov.length <= 250) {
                    return ov;
                  }
                  return "This comprehensive program is designed to take you from fundamentals to advanced industry application with hands-on projects and expert guidance. Click the handout button below to view and download the full official syllabus document.";
                })()}
              </p>

              {/* Key Highlights */}
              {course.highlights && course.highlights.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Highlights</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Curriculum Accordion with Locked Modules & Handout Download */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-600" /> Curriculum & Syllabus
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {course.curriculum && course.curriculum.length > 0
                      ? `${course.curriculum.length} Modules • ${course.totalLectures || 45} Practical Lectures`
                      : `${course.totalLectures || 45} Practical Lectures • Official Syllabus Handout`}
                  </p>
                </div>

                {/* Handout Download Action */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={downloadHandout}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 text-white text-xs font-black transition shadow-md shadow-blue-500/20 shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Course Handout</span>
                  </button>
                </div>
              </div>

              {course.curriculum && course.curriculum.length > 0 && (
                <div className="space-y-3">
                  {course.curriculum.map((module, idx) => {
                    const isOpen = openModuleIndex === idx;

                    return (
                      <div
                        key={idx}
                        className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
                      >
                        <button
                          onClick={() => setOpenModuleIndex(isOpen ? null : idx)}
                          className="w-full px-5 py-4 bg-slate-50 hover:bg-brand-50/50 flex items-center justify-between text-left transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center bg-brand-600 text-white">
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{module.title}</h4>
                              <span className="text-[11px] text-slate-500">{module.duration}</span>
                            </div>
                          </div>

                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="p-5 bg-white space-y-3 border-t border-slate-200">
                            {module.description && (
                              <p className="text-xs text-slate-500 italic mb-2">{module.description}</p>
                            )}
                            <div className="space-y-2">
                              {module.topics && module.topics.map((topic, tIdx) => (
                                <div
                                  key={tIdx}
                                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 text-xs font-medium text-slate-700"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Play className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                                    <span>{topic.title}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {topic.isFreePreview && (
                                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                        Free Preview
                                      </span>
                                    )}
                                    <span className="text-slate-400 font-mono text-[11px]">{topic.duration}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>


            {/* Learning Outcomes & Prerequisites */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-base">What You Will Learn</h3>
                <div className="space-y-2">
                  {course.learningOutcomes?.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-base">Prerequisites</h3>
                <div className="space-y-2">
                  {course.prerequisites?.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructor Profile */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'}
                alt={course.instructor?.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-brand-200 shadow-md shrink-0"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{course.instructor?.name || 'Senior Architect'}</h3>
                  <p className="text-xs font-semibold text-brand-600">{course.instructor?.title || 'Lead Industry Mentor'}</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {course.instructor?.bio || 'Experienced engineering architect dedicated to mentoring the next generation of software engineers.'}
                </p>
              </div>
            </div>

            {/* FAQs */}
            {course.faqs && course.faqs.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {course.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full px-4 py-3 bg-slate-50 text-left font-bold text-xs text-slate-800 flex justify-between items-center"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>
                        {isOpen && (
                          <div className="p-4 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Pricing Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 border border-brand-200 shadow-xl space-y-6">
              {/* Preview Thumbnail */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#071F3F] to-navy-950">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-brand-600 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-brand-600 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Pricing Section in US Dollars ($) */}
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-black text-slate-900">
                    ${Number(course.discountPrice || course.price || 499).toLocaleString('en-US')}.00
                  </span>
                  {course.discountPrice && Number(course.price || 0) > Number(course.discountPrice || 0) && (
                    <span className="text-sm text-slate-400 line-through">
                      ${Number(course.price || 0).toLocaleString('en-US')}.00
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="bg-rose-100 text-rose-700 font-bold text-xs px-2 py-0.5 rounded-md">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> 7-Day 100% Money-Back Guarantee
                </p>
              </div>



              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-600/30 transition duration-200 flex items-center justify-center gap-2"
                >
                  Buy Course Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3 rounded-2xl border font-bold text-xs transition duration-200 flex items-center justify-center gap-2 ${
                    isInCart(course._id)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isInCart(course._id) ? 'View in Cart' : 'Add to Cart'}
                </button>
              </div>

              {/* Perks List */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 font-medium">
                  <Award className="w-4 h-4 text-brand-600" />
                  <span>Course Divine Verified Professional Certificate</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <BookOpen className="w-4 h-4 text-brand-600" />
                  <span>Full Lifetime Access to Source Code & Updates</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Users className="w-4 h-4 text-brand-600" />
                  <span>Private Discord Developer Community Access</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share this course with peers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Special Offer</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900">
              ${Number(course.discountPrice || course.price || 499).toLocaleString('en-US')}.00
            </span>
            {course.discountPrice && Number(course.price || 0) > Number(course.discountPrice || 0) && (
              <span className="text-xs text-slate-400 line-through">
                ${Number(course.price || 0).toLocaleString('en-US')}.00
              </span>
            )}
          </div>

        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl border font-bold text-xs transition shrink-0 ${
              isInCart(course._id)
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={handleBuyNow}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition whitespace-nowrap"
          >
            Enroll Now
          </button>
        </div>
      </div>


      {/* Unlock Complete Handout & Syllabus Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-[#071F3F] text-white p-5 relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={logoImg}
                  alt="Course Divine"
                  className="h-8 w-auto bg-white/10 p-1 rounded-lg"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-300 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" /> Syllabus & Handout Access
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white line-clamp-1">
                    Unlock Course Syllabus Handout
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowUnlockModal(false)}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUnlockSubmit} className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900 pt-1">
                  Download Official Course Handout
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Fill in your details to view & download the complete course syllabus handout. Your enquiry will be sent directly to admissions at <strong className="text-slate-700">coursedivine@gmail.com</strong>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={unlockForm.name}
                      onChange={(e) => setUnlockForm({ ...unlockForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={unlockForm.email}
                      onChange={(e) => setUnlockForm({ ...unlockForm, email: e.target.value })}
                      placeholder="student@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={unlockForm.countryCode}
                      onChange={(e) => setUnlockForm({ ...unlockForm, countryCode: e.target.value })}
                      className="px-2.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-brand-500 focus:outline-none shrink-0"
                    >
                      <option value="+91">IN (+91)</option>
                      <option value="+1">US (+1)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+971">UAE (+971)</option>
                      <option value="+61">AU (+61)</option>
                      <option value="+65">SG (+65)</option>
                      <option value="+49">DE (+49)</option>
                    </select>

                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={unlockForm.phone}
                        onChange={(e) => setUnlockForm({ ...unlockForm, phone: e.target.value })}
                        placeholder="Phone number *"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingUnlock}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmittingUnlock ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Unlocking Syllabus...
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" /> Submit & View Syllabus Handout 🔓
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                🔒 Enquiry details automatically notified to coursedivine@gmail.com
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Official Interactive Syllabus & Handout Modal */}
      {showSyllabusModal && course && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in zoom-in-95 duration-200 flex flex-col my-auto">
            
            {/* Header bar */}
            <div className="bg-gradient-to-r from-[#071F3F] via-slate-900 to-brand-900 text-white p-5 sm:p-6 relative flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20">
                  <img src={logoImg} alt="Course Divine" className="h-full w-auto object-contain" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Official Syllabus Handout
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white line-clamp-1">
                    {course.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openPrintableSyllabus(course)}
                  className="px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-brand-500/20 cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowSyllabusModal(false)}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable Handout Document Preview */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 leading-relaxed text-sm bg-slate-100">
              
              {/* Printable Document Frame matching PDF template */}
              <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
                {/* Header Row */}
                <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-wider text-slate-900 uppercase font-sans">COURSE DIVINE</h2>
                    <p className="text-xs italic text-slate-700 font-sans mt-0.5">DIVE INTO THE LEARNING POOL</p>
                  </div>
                  <img
                    src="/logo.png"
                    alt="Course Divine Logo"
                    className="h-14 sm:h-16 w-auto object-contain bg-[#071F3F] p-1.5 rounded-lg shadow-sm"
                    onError={(e) => { e.target.src = 'https://www.learncoursedivine.com/logo.png'; }}
                  />
                </div>

                {/* Main Centered Title */}
                <div className="text-center py-2">
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900 underline font-sans">
                    COURSE HANDOUT (COURSE CURRICULUM)
                  </h3>
                </div>

                {/* Course Title */}
                <div className="text-sm sm:text-base">
                  <span className="font-bold underline text-slate-900 font-sans">Course Title:</span>
                  <span className="font-bold text-slate-900 font-sans ml-4">{course.title}</span>
                </div>

                {/* Course Description */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base font-sans">Course Description:</h4>
                  <div className="text-slate-900 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-justify bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                    {course.description || course.overview || 'Official Course Syllabus Content'}
                  </div>
                </div>

                {/* Skills / Outcomes */}
                {course.learningOutcomes && course.learningOutcomes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base font-sans">2. Skills You Will Gain:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm text-slate-900">
                      {course.learningOutcomes.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Curriculum Modules */}
                {course.curriculum && course.curriculum.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base font-sans">3. Curriculum Modules:</h4>
                    <div className="space-y-2">
                      {course.curriculum.map((m, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm">
                          <strong className="text-slate-900 font-sans">Module {idx + 1}: {m.title}</strong>
                          {m.description && <p className="text-slate-700 text-xs mt-1">{m.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer note */}
                <div className="pt-4 border-t border-slate-400 text-center text-[11px] text-slate-500 font-sans">
                  Course Divine Technology Institute • Official Course Handout & Curriculum • Verified Document
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500">
                Official Handout • Course Divine Technology Institute
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => openPrintableSyllabus(course)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowSyllabusModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;

