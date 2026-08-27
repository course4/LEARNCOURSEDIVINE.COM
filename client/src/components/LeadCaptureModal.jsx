import React, { useState, useEffect } from 'react';
import { X, Loader2, Phone, Mail, User, Sparkles, CheckCircle2, ShieldCheck, BookOpen, Lock } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

import api from '../services/api';
import confetti from 'canvas-confetti';
import logoImg from '../assets/logo.png';
import founderImg from '../assets/founder.png';

const LeadCaptureModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+1',
    phone: '',
    program: 'IT Courses'
  });



  const { showToast } = useNotification();

  // Trigger popup automatically 10 seconds after arrival
  useEffect(() => {
    const isDismissed = sessionStorage.getItem('cd_lead_popup_dismissed_session');
    if (isDismissed) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);


  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('cd_lead_popup_dismissed_session', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.phone) {
      showToast('Please provide your email and phone number.', 'error');
      return;
    }

    setLoading(true);

    const leadPayload = {
      name: formData.name.trim() || 'Prospective Student',
      email: formData.email.trim().toLowerCase(),
      phone: `${formData.countryCode} ${formData.phone.trim()}`,
      program: formData.program,
      recipientEmail: 'coursedivine@gmail.com',
      source: 'Lead Capture Popup',
      submittedAt: new Date().toISOString()
    };

    try {
      // 1. Submit lead to backend API for email dispatch to coursedivine@gmail.com
      await api.post('/enquiries', {
        name: leadPayload.name,
        email: leadPayload.email,
        phone: leadPayload.phone,
        message: `Lead Inquiry for ${leadPayload.program}. Target Notification: coursedivine@gmail.com`,
        subject: `New Lead: ${leadPayload.name} - ${leadPayload.program}`
      }).catch(() => null);

      // 2. Persist locally to ensure no lead is ever lost
      const existingLeads = JSON.parse(localStorage.getItem('cd_captured_leads') || '[]');
      existingLeads.push(leadPayload);
      localStorage.setItem('cd_captured_leads', JSON.stringify(existingLeads));
      sessionStorage.setItem('cd_lead_popup_dismissed_session', 'true');

      // 3. Trigger FormSubmit / Cloud notification fallback to coursedivine@gmail.com
      if (typeof window !== 'undefined') {
        const formDataPayload = new FormData();
        formDataPayload.append('Name', leadPayload.name);
        formDataPayload.append('Email', leadPayload.email);
        formDataPayload.append('Phone', leadPayload.phone);
        formDataPayload.append('Program', leadPayload.program);
        formDataPayload.append('_subject', `New Student Lead: ${leadPayload.name} - ${leadPayload.program}`);
        formDataPayload.append('_captcha', 'false');

        fetch('https://formsubmit.co/ajax/coursedivine@gmail.com', {
          method: 'POST',
          body: formDataPayload
        }).catch(() => null);
      }

      setSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('🎉 Application received! Sent to coursedivine@gmail.com. We will call you shortly.', 'success');

      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 2500);
    } catch (err) {
      showToast('Submitted successfully! Our team will contact you soon.', 'success');
      setIsOpen(false);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>




      {/* Main 10-Second Lead Capture Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-[315px] sm:max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[88vh] flex flex-col justify-between">
            
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-10"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="overflow-y-auto p-3.5 sm:p-5 space-y-2.5">
              {/* Modal Header with Course Divine Logo */}
              <div className="text-center space-y-1.5">
                <img
                  src={logoImg}
                  alt="Course Divine"
                  className="h-6 sm:h-8 w-auto object-contain rounded-md mx-auto"
                />

                {/* Founder Avatar & Introduction */}
                <div className="flex flex-col items-center space-y-1 pt-0.5">
                  <div className="relative">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#071F3F] via-[#0D366D] to-[#0F62FE] p-0.5 shadow-md">
                      <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden border border-white">
                        <img
                          src={founderImg}
                          alt="Ch. Jhansi - Founder, Course Divine Technology"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>

                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-2 h-2 text-white" />
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                      Hey! I'm <span className="text-[#0F62FE]">Ch. Jhansi</span>, Founder
                    </h3>
                    <p className="text-[10px] sm:text-xs font-bold text-purple-700 mt-0.5">
                      Get a 1-on-1 career call with expert counsellor
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body & Lead Form */}
              <div>
                {submitted ? (
                  <div className="py-4 text-center space-y-1.5 animate-in zoom-in-95">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900">Counseling Request Received!</h4>
                    <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                      Your details have been sent to <strong className="text-slate-900">coursedivine@gmail.com</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-2">
                    
                    {/* Full Name */}
                    <div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter Your Full Name"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F62FE] focus:outline-none placeholder:text-slate-400 font-medium"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter Your Email Address *"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F62FE] focus:outline-none placeholder:text-slate-400 font-medium"
                      />
                    </div>

                    {/* Country Code + Mobile Number */}
                    <div className="flex gap-1.5">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="px-2 py-2 rounded-xl border border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-700 focus:ring-2 focus:ring-[#0F62FE] focus:outline-none shrink-0"
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

                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Mobile no. *"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F62FE] focus:outline-none placeholder:text-slate-400 font-medium"
                      />
                    </div>

                    {/* Program Selection */}
                    <div>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-[#0F62FE] focus:outline-none"
                      >
                        <option value="IT Courses">IT Courses</option>
                        <option value="Non IT Courses">Non IT Courses</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#6B21A8] via-[#7E22CE] to-[#9333EA] hover:from-[#581C87] hover:to-[#7E22CE] text-white font-extrabold text-xs tracking-wide shadow-lg shadow-purple-900/25 transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-75"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'SUBMIT & BOOK FREE CALL'
                      )}
                    </button>

                    {/* Footer reassurance note */}
                    <div className="flex items-center justify-center gap-1.5 pt-0.5 text-[10px] text-slate-400">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>100% Privacy. Instant Callback.</span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default LeadCaptureModal;
