import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, LogOut, Sparkles, Lock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const AuthStatusModal = ({ state, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(10);

  useEffect(() => {
    if (!state?.show) {
      setProgress(0);
      setSecondsRemaining(10);
      return;
    }

    // Trigger confetti for successful logins
    if (state.type === 'login' || state.type === 'admin_login' || state.type === 'register') {
      try {
        confetti({
          particleCount: state.type === 'admin_login' ? 50 : 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: state.type === 'admin_login' ? ['#F59E0B', '#10B981', '#3B82F6'] : ['#10B981', '#0EA5E9', '#6366F1']
        });
      } catch (e) {}
    }

    const DURATION_MS = 10000; // 10 seconds
    const STEP_MS = 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (DURATION_MS / STEP_MS));
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(next, 100);
      });
    }, STEP_MS);

    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, DURATION_MS);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
      clearTimeout(timer);
    };
  }, [state]);

  if (!state?.show) return null;

  const isAdmin = state.type === 'admin_login' || state.role === 'admin';
  const isLogout = state.type === 'logout';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-md bg-[#071F3F] border border-brand-500/30 rounded-3xl p-8 shadow-2xl text-center text-white overflow-hidden transform animate-in zoom-in-95 duration-300">
        
        {/* Ambient Top Glow */}
        <div className={`absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 ${
          isLogout ? 'bg-rose-500' : isAdmin ? 'bg-amber-400' : 'bg-emerald-400'
        }`} />

        {/* Official Animation Icon Badge */}
        <div className="relative mx-auto mb-6 flex items-center justify-center">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border shadow-xl relative ${
            isLogout
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
              : isAdmin
              ? 'bg-amber-500/15 border-amber-400/50 text-amber-400'
              : 'bg-emerald-500/15 border-emerald-400/50 text-emerald-400'
          }`}>
            {/* Animated Pulse Ring */}
            <div className={`absolute inset-0 rounded-2xl animate-ping opacity-30 ${
              isLogout ? 'bg-rose-500' : isAdmin ? 'bg-amber-400' : 'bg-emerald-400'
            }`} />

            {isLogout ? (
              <LogOut className="w-9 h-9 relative z-10 animate-bounce" />
            ) : isAdmin ? (
              <ShieldCheck className="w-10 h-10 relative z-10 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-10 h-10 relative z-10 animate-pulse" />
            )}
          </div>
        </div>

        {/* Header Tag */}
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shadow-sm ${
            isLogout
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              : isAdmin
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
          }`}>
            {isLogout ? (
              <>
                <Lock className="w-3 h-3" /> Secure Session Sign-Out
              </>
            ) : isAdmin ? (
              <>
                <ShieldCheck className="w-3 h-3" /> Verified Administrator Access
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" /> Verified Student Access
              </>
            )}
          </span>
        </div>

        {/* Main Title & Description */}
        <h3 className="text-2xl font-black tracking-tight text-white mb-1">
          {isLogout
            ? 'Signed Out Safely'
            : isAdmin
            ? `Welcome, Administrator`
            : `Welcome back, ${state.name || 'Student'}!`}
        </h3>

        <p className="text-xs text-slate-300/90 leading-relaxed mb-6">
          {isLogout
            ? 'Your active session has been securely closed. Redirecting to homepage...'
            : isAdmin
            ? 'Authentication verified. Launching Course Divine Admin Control Portal...'
            : 'Access granted. Initializing your student dashboard and learning courses...'}
        </p>

        {/* Animated Progress Track */}
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-150 ${
              isLogout
                ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                : isAdmin
                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400'
                : 'bg-gradient-to-r from-emerald-400 via-sky-400 to-brand-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Footer Status */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>{isLogout ? `Signing out in ${secondsRemaining}s...` : `Redirecting in ${secondsRemaining}s...`}</span>
          <span className="font-bold text-white flex items-center gap-1">
            {Math.round(progress)}% <ArrowRight className="w-3 h-3 text-brand-400 animate-pulse" />
          </span>
        </div>

        {/* Optional Fast-Forward Button */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-center">
          <button
            onClick={() => {
              if (onClose) onClose();
            }}
            className="text-[11px] font-semibold text-brand-300 hover:text-white transition flex items-center gap-1 opacity-70 hover:opacity-100"
          >
            <span>{isLogout ? 'Proceed immediately' : 'Enter portal now'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthStatusModal;
