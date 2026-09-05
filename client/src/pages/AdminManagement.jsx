import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Loader2,
  Search,
  UserCheck,
  Lock,
  ArrowLeft,
  Mail,
  User as UserIcon
} from 'lucide-react';
import api from '../services/api';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset Password Modal State
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Super Admin Passcode Lock State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [lockPassword, setLockPassword] = useState('');
  const [showLockPass, setShowLockPass] = useState(false);
  const [lockError, setLockError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setLockError('');
    setIsUnlocking(true);

    const inputPass = lockPassword.trim();

    // 1. Check Master Super Admin Passcode
    if (inputPass === 'RAMESHMANAGER@CD') {
      try {
        let res;
        try {
          res = await axios.post('https://coursedivinewebsite.onrender.com/api/auth/login', {
            email: 'admin@coursedivine.com',
            password: inputPass
          });
        } catch (e1) {
          // If active password was reset, login fallback is fine
        }
        if (res?.data?.data?.token) {
          localStorage.setItem('cd_token', res.data.data.token);
          localStorage.setItem('cd_user', JSON.stringify(res.data.data));
        }
      } catch (err) {
        console.error('Unlock token fetch:', err);
      }

      setIsUnlocked(true);
      setLockPassword('');
      setIsUnlocking(false);
      return;
    }

    // 2. Try logging in with entered password directly via API
    try {
      const res = await axios.post('https://coursedivinewebsite.onrender.com/api/auth/login', {
        email: 'admin@coursedivine.com',
        password: inputPass
      });

      if (res.data?.success && res.data?.data?.token) {
        localStorage.setItem('cd_token', res.data.data.token);
        localStorage.setItem('cd_user', JSON.stringify(res.data.data));
        setIsUnlocked(true);
        setLockPassword('');
      } else {
        setLockError('Invalid Super Admin password. Enter master password RAMESHMANAGER@CD');
      }
    } catch (err) {
      setLockError('Invalid Super Admin password. Enter master password RAMESHMANAGER@CD');
    } finally {
      setIsUnlocking(false);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      let res;
      try {
        res = await api.get('/admin/users');
      } catch (e1) {
        res = await axios.get('https://coursedivinewebsite.onrender.com/api/admin/users');
      }

      if (res.data?.success && Array.isArray(res.data.data)) {
        // Filter users with admin role or admin email
        const adminUsers = res.data.data.filter(
          (u) => u.role === 'admin' || (u.email && u.email.toLowerCase().includes('admin'))
        );
        setAdmins(adminUsers.length > 0 ? adminUsers : res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      setError('Unable to load admin accounts list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchAdmins();
    }
  }, [isUnlocked]);

  const handleOpenResetModal = (adminUser) => {
    setSelectedAdmin(adminUser);
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPass(false);
    setShowConfirmPass(false);
    setModalError('');
  };

  const handleCloseResetModal = () => {
    setSelectedAdmin(null);
    setNewPassword('');
    setConfirmPassword('');
    setModalError('');
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    // Client-side validations
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setModalError('Please provide both New Password and Confirm Password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalError('New password and Confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setModalError('Password must be at least 6 characters long.');
      return;
    }

    setModalLoading(true);

    try {
      let res;
      let updatedSuccessfully = false;
      let lastErrorMessage = '';

      const payload = { newPassword, confirmPassword };
      const endpoint = `/admin/users/${selectedAdmin._id}/reset-password`;

      const token = localStorage.getItem('cd_token');
      const authHeaders = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      // 1. Try Primary Endpoint (PUT /api/admin/users/:id/reset-password)
      try {
        res = await api.put(`/admin/users/${selectedAdmin._id}/reset-password`, payload);
        if (res.data?.success || res.status === 200) {
          updatedSuccessfully = true;
        }
      } catch (err1) {
        lastErrorMessage = err1.response?.data?.message || err1.message;
        // 2. Try Render Cloud User Update Endpoint (PUT /api/admin/users/:id)
        try {
          res = await axios.put(
            `https://coursedivinewebsite.onrender.com/api/admin/users/${selectedAdmin._id}`,
            { password: newPassword, newPassword, confirmPassword },
            authHeaders
          );
          if (res.data?.success || res.status === 200) {
            updatedSuccessfully = true;
          }
        } catch (err2) {
          lastErrorMessage = err2.response?.data?.message || err2.message;
          // 3. Try Secondary Auth Reset Endpoint (POST /api/auth/approve-password-reset)
          try {
            res = await api.post('/auth/approve-password-reset', { email: selectedAdmin.email, newPassword });
            if (res.data?.success || res.status === 200) {
              updatedSuccessfully = true;
            }
          } catch (err3) {
            lastErrorMessage = err3.response?.data?.message || err3.message;
          }
        }
      }

      if (updatedSuccessfully) {
        setSuccessMsg(`Admin password reset successfully for ${selectedAdmin.email}.`);
        handleCloseResetModal();
        fetchAdmins();

        setTimeout(() => {
          setSuccessMsg('');
        }, 4000);
      } else {
        setModalError(
          lastErrorMessage || 'Failed to update database. Please ensure server backend zip is extracted on Bluehost cPanel.'
        );
      }
    } catch (err) {
      setModalError('Network error while connecting to server. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-in fade-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner border border-amber-200">
          <Lock className="w-8 h-8" />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Super Admin Security Lock</h2>
          <p className="text-xs text-slate-500">
            Enter master admin password to access Admin Management & Password Resets.
          </p>
        </div>

        {lockError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold text-center">
            {lockError}
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Super Admin Password
            </label>
            <div className="relative">
              <input
                type={showLockPass ? 'text' : 'password'}
                required
                value={lockPassword}
                onChange={(e) => setLockPassword(e.target.value)}
                placeholder="Enter password (e.g. RAMESHMANAGER@CD)"
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-sm outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowLockPass(!showLockPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showLockPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUnlocking}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-slate-900 via-brand-950 to-amber-950 hover:from-slate-800 hover:to-amber-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUnlocking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" /> Verifying Credentials...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-300" /> Unlock Admin Management
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link to="/admin" className="text-xs text-slate-400 hover:text-slate-600 font-semibold transition">
            ← Back to Operations Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-navy-950 text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white font-semibold mb-3 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Operations Dashboard
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Owner / Super Admin Authorization
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Authorized Admin Accounts</h1>
          <p className="text-xs text-slate-300 mt-1">
            View authorized administrator accounts and credentials status.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
          <X className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Admin Accounts Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search Bar & Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-600" /> Authorized Admin Accounts ({filteredAdmins.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Super Admin panel for password administration and credentials control.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-xs outline-none transition"
            />
          </div>
        </div>

        {/* Table List */}
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            <span>Loading admin accounts list...</span>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No admin accounts found matching your search query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Admin User</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Role / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredAdmins.map((adminItem) => (
                  <tr key={adminItem._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-50 text-brand-600 font-bold text-xs flex items-center justify-center border border-brand-200 shrink-0">
                        {adminItem.name ? adminItem.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{adminItem.name || 'Admin User'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">ID: {adminItem._id}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{adminItem.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        {adminItem.role || 'Admin'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminManagement;
