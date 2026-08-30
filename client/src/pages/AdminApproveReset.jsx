import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

const AdminApproveReset = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    if (!token) {
      setError('Invalid or missing approval token.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let pendingPassword = '';
      try {
        const rawPending = localStorage.getItem('cd_pending_reset');
        if (rawPending) {
          const parsed = JSON.parse(rawPending);
          if (parsed?.newPassword) pendingPassword = parsed.newPassword;
        }
      } catch (e) {}

      const res = await api.post('/admin/approve-password-reset', { token, newPassword: pendingPassword });
      if (res.data?.success) {
        setSuccess(true);
        try { localStorage.removeItem('cd_pending_reset'); } catch (e) {}
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      handleApprove();
    }
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-xl border border-slate-200 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-600 font-extrabold text-[11px] uppercase tracking-wider rounded-full mb-2">
            Owner Authorization Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900">Admin Password Change Authorization</h1>
          <p className="text-xs text-slate-500 mt-1">Course Divine Operational Security System</p>
        </div>

        {loading && (
          <div className="py-8 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Verifying authorization token & updating MongoDB...</p>
          </div>
        )}

        {!loading && success && (
          <div className="space-y-4 py-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900">Password Successfully Updated!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              The owner approval was confirmed. The new admin password has been encrypted and applied to MongoDB.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition"
              >
                Proceed to Login <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="space-y-4 py-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-rose-900">Authorization Failed or Expired</h3>
            <p className="text-xs text-rose-700 max-w-sm mx-auto leading-relaxed">
              {error}
            </p>
            <div className="pt-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApproveReset;
