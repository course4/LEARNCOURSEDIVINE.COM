import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  CreditCard,
  Briefcase,
  Gift,
  User,
  CheckCircle2,
  Clock,
  Play,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api, { fallbackStore } from '../services/api';

const Dashboard = () => {
  const { user, isAdmin, updateUserData } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState('courses');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileBio, setProfileBio] = useState(user?.bio || 'Passionate software developer.');

  const userEmail = (user?.email || 'guest@coursedivine.com').toLowerCase();
  const isDemoStudent = userEmail === 'student@coursedivine.com';

  useEffect(() => {
    fetchDashboardData();
  }, [userEmail]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Isolated Enrollments for this user
      const enrollStorageKey = 'cd_enrollments_' + userEmail;
      const localEnrollments = JSON.parse(localStorage.getItem(enrollStorageKey) || 'null');

      if (localEnrollments && Array.isArray(localEnrollments)) {
        setEnrolledCourses(localEnrollments);
      } else {
        const enrollRes = await api.get('/enrollments/my-courses');
        if (enrollRes.data?.success && enrollRes.data.data.length > 0) {
          setEnrolledCourses(enrollRes.data.data);
        } else if (isDemoStudent) {
          setEnrolledCourses([
            {
              _id: 'enr1',
              progressPercent: 45,
              status: 'active',
              enrolledAt: '2026-01-15T00:00:00.000Z',
              course: fallbackStore.courses[0]
            }
          ]);
        } else {
          // Fresh isolated state for any new user
          setEnrolledCourses([]);
        }
      }

      // 2. Fetch Isolated Orders for this user
      const orderStorageKey = 'cd_orders_' + userEmail;
      const localOrders = JSON.parse(localStorage.getItem(orderStorageKey) || 'null');
      if (localOrders && Array.isArray(localOrders)) {
        setOrders(localOrders);
      } else {
        const orderRes = await api.get('/orders/my-orders');
        if (orderRes.data?.success && orderRes.data.data.length > 0) {
          setOrders(orderRes.data.data);
        } else if (isDemoStudent) {
          setOrders([
            {
              _id: 'ORD_DEMO_2026',
              transactionId: 'TXN_DEMO_99881',
              createdAt: '2026-01-15T00:00:00.000Z',
              totalAmount: 499,
              items: [{ course: fallbackStore.courses[0], price: 499 }]
            }
          ]);
        } else {
          setOrders([]);
        }
      }

      // 3. Fetch Isolated Certificates for this user
      const certStorageKey = 'cd_certs_' + userEmail;
      const localCerts = JSON.parse(localStorage.getItem(certStorageKey) || 'null');
      if (localCerts && Array.isArray(localCerts)) {
        setCertificates(localCerts);
      } else if (isDemoStudent) {
        setCertificates(fallbackStore.certificates);
      } else {
        setCertificates([]);
      }

      // 4. Fetch Isolated Internships for this user
      const internStorageKey = 'cd_internships_' + userEmail;
      const localInternships = JSON.parse(localStorage.getItem(internStorageKey) || 'null');
      if (localInternships && Array.isArray(localInternships)) {
        setInternships(localInternships);
      } else if (isDemoStudent) {
        setInternships([
          {
            _id: 'app_1',
            domain: 'Full Stack Web Development',
            duration: '3 Months',
            status: 'Accepted',
            createdAt: '2026-02-01T00:00:00.000Z'
          }
        ]);
      } else {
        setInternships([]);
      }
    } catch (err) {
      if (isDemoStudent) {
        setEnrolledCourses([
          {
            _id: 'enr1',
            progressPercent: 45,
            status: 'active',
            enrolledAt: '2026-01-15T00:00:00.000Z',
            course: fallbackStore.courses[0]
          }
        ]);
        setCertificates(fallbackStore.certificates);
      } else {
        setEnrolledCourses([]);
        setCertificates([]);
        setOrders([]);
        setInternships([]);
      }
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', {
        name: profileName,
        phone: profilePhone,
        bio: profileBio
      });
      if (res.data?.success) {
        updateUserData(res.data.data);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      updateUserData({ name: profileName, phone: profilePhone, bio: profileBio });
      showToast('Profile updated locally!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">{user?.name || 'My Account'}</h1>
              {isAdmin && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/25 text-amber-300 border border-amber-400/30 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Administrator Account (Restricted Access)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" /> Admin Portal
              </Link>
            )}
            <Link
              to="/courses"
              className="px-5 py-2.5 rounded-xl bg-white text-brand-900 font-bold text-xs shadow-md hover:bg-brand-50 transition"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </div>

      {/* Tabbed Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition shrink-0 ${
            activeTab === 'courses'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Enrolled Courses ({enrolledCourses.length})
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition shrink-0 ${
            activeTab === 'certificates'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" /> Certificates ({certificates.length})
        </button>

        <button
          onClick={() => setActiveTab('internships')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition shrink-0 ${
            activeTab === 'internships'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Internship Applications ({internships.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition shrink-0 ${
            activeTab === 'orders'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Payment History
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition shrink-0 ${
            activeTab === 'profile'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" /> Profile Settings
        </button>
      </div>

      {/* TAB CONTENT: 1. ENROLLED COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-2xl">
                🎓
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Enrolled Courses Yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You haven't enrolled in any courses with <strong>{userEmail}</strong>. Explore our high-impact tech masterclasses with live mentorship & assured internships.
              </p>
              <div className="pt-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md transition"
                >
                  <BookOpen className="w-4 h-4" /> Explore Course Catalogue
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-card-hover transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={item.course?.thumbnail}
                        alt={item.course?.title}
                        className="w-20 h-14 rounded-xl object-cover border"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                          {item.course?.category || 'Tech Masterclass'}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                          {item.course?.title}
                        </h3>
                        {item.batch && (
                          <span className="text-[10px] text-slate-500 font-medium">Batch: {item.batch}</span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 my-4">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Course Progress</span>
                        <span className="text-brand-600">{item.progressPercent || 15}% Completed</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-600 rounded-full transition-all duration-500"
                          style={{ width: `${item.progressPercent || 15}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      {item.course?.duration || '8 Weeks'}
                    </span>
                    <Link
                      to={`/courses/${item.course?.slug || 'full-stack-web-development'}`}
                      className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Continue Learning
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 2. CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {certificates.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
                📜
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Certificates Earned Yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete all course modules and capstone projects to earn your APSCHE & ISO 9001:2015 accredited digital certificate.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert._id}
                  className="bg-white rounded-3xl p-8 border-2 border-brand-200 shadow-xl space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg">
                      {cert.certificateId}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{cert.courseTitle || cert.course?.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">Grade: <strong>{cert.grade || 'Distinction (A+)'}</strong></p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/verify-certificate?id=${cert.certificateId}`}
                      className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                    >
                      Verify Credential <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 3. INTERNSHIP APPLICATIONS */}
      {activeTab === 'internships' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Your Internship Submissions</h3>
            {internships.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-slate-500">You haven't submitted any corporate internship applications yet.</p>
                <Link
                  to="/internships"
                  className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
                >
                  Explore Internships
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {internships.map((app) => (
                  <div key={app._id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{app.domain}</h4>
                      <p className="text-xs text-slate-500">Track: {app.duration} • Submitted on {new Date(app.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status || 'Under Review'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. ORDER HISTORY */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Payment & Invoice History</h3>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No payment transactions recorded for this account.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order._id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Txn ID: {order.transactionId || order._id}</h4>
                    <p className="text-xs text-slate-500">
                      Date: {new Date(order.createdAt || Date.now()).toLocaleDateString()} • ₹{order.totalAmount || 499} Paid
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Paid & Verified
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 5. PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Update Profile Details</h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Headline</label>
              <textarea
                rows={3}
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
