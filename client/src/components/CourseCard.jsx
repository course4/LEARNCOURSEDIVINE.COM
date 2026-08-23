import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Check,
  ShoppingCart,
  GraduationCap,
  Code,
  Brain,
  Cloud,
  Shield,
  Cpu,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import EnrollmentModal from './EnrollmentModal';

const CourseCard = ({ course }) => {
  const { addToCart, isInCart } = useCart();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [showEnroll, setShowEnroll] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart(course._id)) {
      navigate('/cart');
    } else {
      addToCart(course);
      showToast(`Added "${course.title}" to cart!`, 'success');
    }
  };

  const getCategoryTheme = (category = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('cloud') || cat.includes('devops') || cat.includes('azure') || cat.includes('aws')) {
      return {
        bg: 'from-sky-700 via-blue-800 to-indigo-950',
        accent: 'bg-sky-400/20 text-sky-200 border-sky-400/30',
        icon: Cloud
      };
    }
    if (cat.includes('data') || cat.includes('ai') || cat.includes('machine') || cat.includes('python')) {
      return {
        bg: 'from-indigo-800 via-purple-900 to-slate-950',
        accent: 'bg-purple-400/20 text-purple-200 border-purple-400/30',
        icon: Brain
      };
    }
    if (cat.includes('security') || cat.includes('privacy') || cat.includes('anti-terrorist')) {
      return {
        bg: 'from-slate-800 via-zinc-900 to-black',
        accent: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30',
        icon: Shield
      };
    }
    if (cat.includes('vlsi') || cat.includes('embedded') || cat.includes('iot') || cat.includes('plc') || cat.includes('industry')) {
      return {
        bg: 'from-cyan-800 via-teal-900 to-slate-950',
        accent: 'bg-teal-400/20 text-teal-200 border-teal-400/30',
        icon: Cpu
      };
    }
    if (cat.includes('sap') || cat.includes('oracle') || cat.includes('erp')) {
      return {
        bg: 'from-blue-900 via-indigo-950 to-slate-950',
        accent: 'bg-blue-400/20 text-blue-200 border-blue-400/30',
        icon: Database
      };
    }
    if (cat.includes('civil') || cat.includes('cad') || cat.includes('bim') || cat.includes('etabs') || cat.includes('catia') || cat.includes('tekla')) {
      return {
        bg: 'from-amber-800 via-orange-950 to-slate-950',
        accent: 'bg-amber-400/20 text-amber-200 border-amber-400/30',
        icon: Layers
      };
    }
    return {
      bg: 'from-[#071F3F] via-blue-950 to-slate-950',
      accent: 'bg-brand-400/20 text-brand-200 border-brand-400/30',
      icon: Code
    };
  };

  const theme = getCategoryTheme(course.category);
  const IconComponent = theme.icon;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col h-full overflow-hidden text-center justify-between p-3 sm:p-4">
      
      {/* Course Neat Branded Poster */}
      <Link
        to={`/courses/${course.slug}`}
        className="relative block aspect-square max-h-48 sm:max-h-56 overflow-hidden rounded-xl bg-slate-900 mb-2.5 sm:mb-3 select-none"
      >
        {course.thumbnail && !imgError ? (
          <div className="w-full h-full relative overflow-hidden group">
            <img
              src={course.thumbnail}
              alt={course.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Gradient Overlay for badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Row: Brand pill + verified accreditation */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
              <span className="text-[10px] font-black tracking-widest uppercase bg-slate-900/80 text-white px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
                COURSE DIVINE
              </span>
              <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 backdrop-blur-md">
                <span>APSCHE</span>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
              </div>
            </div>

            {/* Bottom Category Badge */}
            <div className="absolute bottom-2.5 left-2.5 z-10 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-brand-600/90 text-white backdrop-blur-md shadow-sm">
              {course.category}
            </div>
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${theme.bg} p-4 flex flex-col justify-between relative overflow-hidden text-white group-hover:scale-105 transition-transform duration-300`}>
            {/* Background glowing sphere */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Row: Brand pill + verified accreditation */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                COURSE DIVINE
              </span>
              <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                <span>APSCHE</span>
                <Check className="w-2.5 h-2.5 text-emerald-400" />
              </div>
            </div>

            {/* Center Icon & Title Abbreviation */}
            <div className="flex flex-col items-center justify-center my-auto z-10 space-y-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/20">
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-brand-200" />
              </div>
              <div className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white line-clamp-2 px-2 text-center drop-shadow-md">
                {course.title.replace('Certified Course', '').replace('Training', '').trim()}
              </div>
            </div>

            {/* Bottom Category Badge */}
            <div className={`z-10 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${theme.accent}`}>
              {course.category}
            </div>
          </div>
        )}

        {/* Black "Sale!" Badge */}
        <div className="absolute top-2 right-2 bg-[#222222] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded shadow-sm z-20">
          Sale!
        </div>
      </Link>

      {/* Course Title */}
      <div className="space-y-1.5 mb-2.5 sm:mb-3">
        <Link to={`/courses/${course.slug}`}>
          <h3 className="text-xs sm:text-base font-bold text-slate-800 hover:text-brand-600 transition-colors uppercase leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {course.title}
          </h3>
        </Link>

        {/* Pricing with Strike-through in US Dollars ($) */}
        <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-center gap-1.5 sm:gap-2">
          {Number(course.price || 0) > Number(course.discountPrice || course.price || 0) && (
            <span className="text-[11px] sm:text-xs text-slate-400 line-through font-normal">
              ${Number(course.price || 0).toLocaleString('en-US')}.00
            </span>
          )}
          <span className="text-slate-900 font-extrabold text-xs sm:text-base text-brand-600">
            ${Number(course.discountPrice || course.price || 499).toLocaleString('en-US')}.00
          </span>
        </div>
      </div>

      {/* Action Buttons: Add to Cart & Quick Enroll */}
      <div className="pt-1.5 sm:pt-2 flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-white font-bold text-[11px] sm:text-xs shadow-md transition-all duration-200 ${
            isInCart(course._id)
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-[#FF5555] hover:bg-[#E64444]'
          }`}
        >
          {isInCart(course._id) ? 'In Cart' : 'Add to Cart'}
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isInCart(course._id)) {
              addToCart(course);
            }
            navigate('/checkout');
          }}
          className="flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl bg-[#0F62FE] hover:bg-blue-700 text-white font-bold text-[11px] sm:text-xs shadow-md transition-all duration-200"
        >
          Enroll Now
        </button>
      </div>

    </div>
  );
};

export default CourseCard;
