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
  const [unlockForm, setUnlockForm] = useState({
    name: '',
    email: '',
    countryCode: '+1',
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

  const handleAdminDirectPdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !course) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      showToast('Please upload a valid PDF document (.pdf)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result;
      await storePdfInDb(course.slug, dataUrl, file.name);
      if (course._id) {
        await storePdfInDb(course._id, dataUrl, file.name);
      }
      const updated = {
        ...course,
        syllabusPdf: dataUrl,
        pdfFileName: file.name
      };
      setCourse(updated);
      await saveCourseLive(updated);
      showToast(`🎉 PDF "${file.name}" attached successfully! Now click "Download Course Handout" to download.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const downloadHandout = async () => {
    if (!course) return;

    let pdfData = course.syllabusPdf || course.curriculumPdf || '';

    // If PDF not directly attached or stored as reference, look up in high-capacity IndexedDB store
    if (!pdfData || pdfData === 'indexeddb_ref' || (!pdfData.startsWith('data:') && !pdfData.startsWith('http'))) {
      const storedPdf = (await getPdfFromDb(course.slug)) || (await getPdfFromDb(course._id));
      if (storedPdf && storedPdf.pdfData) {
        pdfData = storedPdf.pdfData;
      }
    }

    if (pdfData && pdfData.trim() && pdfData !== 'indexeddb_ref') {
      try {
        if (pdfData.startsWith('data:')) {
          // Robust Base64 Data URL to Blob converter (supports desktop & mobile browsers)
          const parts = pdfData.split(',');
          const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
          const byteCharacters = atob(parts[1]);
          const byteArrays = [];

          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
          }

          const blob = new Blob(byteArrays, { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          // 1. Open immediately in a new tab for instant reading in browser
          window.open(blobUrl, '_blank');

          // 2. Also trigger standard file download
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = `${(course.title || 'Course_Divine').replace(/[^a-zA-Z0-9]/g, '_')}_Official_Syllabus.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
          showToast('Opening and downloading official syllabus PDF...', 'success');
          return;
        } else {
          // Standard URL
          window.open(pdfData, '_blank');
          const link = document.createElement('a');
          link.href = pdfData;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.download = `${(course.title || 'Course_Divine').replace(/[^a-zA-Z0-9]/g, '_')}_Official_Syllabus.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('Opening official syllabus PDF...', 'success');
          return;
        }
      } catch (err) {
        console.error('PDF download error:', err);
      }
    }

    showToast('⚠️ No PDF file has been attached yet for this course.', 'info');
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
      course: course?.title || 'Course Details',
      action: 'Course Handout & Syllabus Unlock',
      submittedAt: new Date().toISOString()
    };

    try {
      // 1. Dispatch lead to coursedivine@gmail.com
      const formData = new FormData();
      formData.append('Student Name', payload.name);
      formData.append('Email', payload.email);
      formData.append('Phone Number', payload.phone);
      formData.append('Course Handout Requested', payload.course);
      formData.append('_subject', `Course Handout Request: ${payload.name} (${payload.course})`);
      formData.append('_captcha', 'false');

      fetch('https://formsubmit.co/ajax/coursedivine@gmail.com', {
        method: 'POST',
        body: formData
      }).catch(() => null);

      // 2. Persist locally
      localStorage.setItem('cd_handout_unlocked', 'true');
      setIsUnlocked(true);
      setShowUnlockModal(false);


      confetti({
        particleCount: 140,
        spread: 75,
        origin: { y: 0.6 }
      });

      showToast(`🎉 Syllabus & Handout Unlocked! Details sent to coursedivine@gmail.com`, 'success');
      downloadHandout();
    } catch (err) {
      setIsUnlocked(true);
      setShowUnlockModal(false);
      showToast('Unlocked successfully!', 'success');
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
                {course.subtitle || course.description}
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
                  <Globe className="w-4 h-4 text-brand-400" />
                  <span>{course.language || 'English & Hindi'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-400" />
                  <span>{course.duration}</span>
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
                {course.overview || course.description}
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

                {/* Handout Download & Admin Direct Attachment Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {isAdmin && (
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 text-xs font-bold transition shadow-xs">
                      <Upload className="w-4 h-4 text-amber-700" />
                      <span>{course.syllabusPdf ? 'Replace Attached PDF (Admin)' : 'Attach PDF File (Admin)'}</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleAdminDirectPdfUpload}
                        className="hidden"
                      />
                    </label>
                  )}

                  <button
                    onClick={downloadHandout}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 text-white text-xs font-black transition shadow-md shadow-blue-500/20 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Course Handout</span>
                  </button>
                </div>
              </div>

              {course.curriculum && course.curriculum.length > 0 ? (
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
              ) : (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0 shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Official Course Syllabus & Curriculum Document</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Click the handout button to view and download the complete curriculum syllabus.</p>
                    </div>
                  </div>
                  <button
                    onClick={downloadHandout}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Handout</span>
                  </button>
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
                    Unlock Full Curriculum & Handout
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowUnlockModal(false)}
                className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
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
                  Provide your basic contact details to unlock all module contents and receive the course syllabus.
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
                      placeholder="e.g. John Doe"
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
                      placeholder="john@example.com"
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
                      <option value="+1">US (+1)</option>
                      <option value="+91">IN (+91)</option>
                      <option value="+44">UK (+44)</option>
                      <option value="+971">UAE (+971)</option>
                      <option value="+61">AU (+61)</option>
                      <option value="+65">SG (+65)</option>
                      <option value="+1">CA (+1)</option>
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
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2"
                >
                  {isSubmittingUnlock ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Unlocking Syllabus...
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" /> Unlock Curriculum & Download Handout 🔓
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400">
                🔒 Official Course Divine Brochure will be automatically downloaded and emailed.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;

