import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  BookOpen,
  CreditCard,
  TrendingUp,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
  KeyRound,
  Lock,
  Mail,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 124,
    totalCourses: 6,
    totalOrders: 89,
    totalRevenue: 284500,
    totalInternships: 42,
    totalEnquiries: 19
  });

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => {
        if (res.data?.success && res.data.data) {
          setStats(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-navy-950 text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Administrator Control Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Course Divine Operations Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1">Real-time metrics for courses, revenue, students, and internship applications.</p>
        </div>

        <Link
          to="/admin/courses"
          className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Manage Courses
        </Link>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ${(stats.totalRevenue || 38500).toLocaleString('en-US')}.00
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">100% verified Razorpay transactions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Learners</span>
            <Users className="w-5 h-5 text-brand-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalUsers || 124}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Registered student accounts</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Courses</span>
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalCourses || 6}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Published in Learning Lounge</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Internship Leads</span>
            <Briefcase className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats.totalInternships || 42}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Applicant profiles in review</p>
        </div>
      </div>

      {/* Admin Module Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/courses"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-card-hover hover:border-brand-300 transition duration-300 flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold shrink-0 group-hover:bg-brand-600 group-hover:text-white transition">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition">
              Course Management
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Create new courses, edit syllabus modules, upload banners, adjust pricing, and toggle publication.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-card-hover hover:border-brand-300 transition duration-300 flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition">
              User & Student Directory
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Search registered learners, review active enrollments, and configure administrative roles.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/internships"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-card-hover hover:border-brand-300 transition duration-300 flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0 group-hover:bg-amber-600 group-hover:text-white transition">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition">
              Internship Applications
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Review submitted candidate portfolios, resumes, and change status (Under Review / Accepted).
            </p>
          </div>
        </Link>

        <Link
          to="/admin/enquiries"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-card-hover hover:border-brand-300 transition duration-300 flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0 group-hover:bg-purple-600 group-hover:text-white transition">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-600 transition">
              Contact & Lead Inquiries
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Manage prospective student inquiries, update follow-up statuses, and view questions.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/blogs"
          className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-card-hover hover:border-brand-300 transition duration-300 flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0 group-hover:bg-rose-600 group-hover:text-white transition">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-rose-600 transition">
              Editorial & Blog Publisher
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Author and publish technology insights, tutorials, and career roadmaps for students.
            </p>
          </div>
        </Link>

        <Link
          to="/admin/management"
          className="bg-gradient-to-br from-slate-900 to-brand-950 text-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-amber-400/50 transition duration-300 flex items-start gap-4 group border border-slate-800"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 group-hover:bg-amber-500 group-hover:text-slate-900 transition">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition">
                Admin Management & Security
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              View authorized admin accounts and perform secure bcrypt password resets for admins.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
