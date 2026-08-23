import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  X,
  Search,
  ArrowLeft,
  Loader2,
  DollarSign,
  FileText,
  Upload,
  Download,
  Sparkles,
  FileSpreadsheet,
  AlertCircle,
  Eye
} from 'lucide-react';
import api, {
  fallbackStore,
  getLiveCourses,
  fetchLiveCoursesFromApi,
  saveCourseLive,
  deleteCourseLive,
  clearAllCoursesLive,
  bulkImportCoursesLive
} from '../services/api';
import { useNotification } from '../context/NotificationContext';

const AdminCourses = () => {
  const { showToast } = useNotification();
  const [courses, setCourses] = useState(() => getLiveCourses());
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkDataText, setBulkDataText] = useState('');

  // Course Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: 'Software & Web Development',
    level: 'Beginner to Advanced',
    duration: '80 Hours (10 Weeks)',
    price: 499,
    discountPrice: 399,
    description: '',
    overview: '',
    highlights: '',
    thumbnail: '',
    badge: 'Popular',
    syllabusPdf: '',
    pdfFileName: ''
  });

  const loadCourses = () => {
    setCourses(getLiveCourses());
  };

  useEffect(() => {
    fetchLiveCoursesFromApi().then(() => {
      loadCourses();
    });

    const handleCoursesUpdated = () => {
      loadCourses();
    };

    window.addEventListener('cd_courses_updated', handleCoursesUpdated);
    return () => window.removeEventListener('cd_courses_updated', handleCoursesUpdated);
  }, []);

  // Handle PDF upload from Admin's computer
  const handlePdfFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      showToast('Please upload a valid PDF document (.pdf)', 'error');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('PDF file size should be less than 15MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        syllabusPdf: event.target?.result,
        pdfFileName: file.name
      }));
      showToast(`PDF "${file.name}" attached successfully!`, 'success');
    };
    reader.onerror = () => {
      showToast('Error reading PDF file. Try again.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Handle Course Image File Upload from Computer
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPG, PNG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        thumbnail: event.target?.result
      }));
      showToast('Course image attached successfully!', 'success');
    };
    reader.onerror = () => {
      showToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${courseTitle}"? It will be removed immediately from the entire website.`)) {
      return;
    }

    try {
      await deleteCourseLive(courseId);
      loadCourses();
      showToast(`"${courseTitle}" has been deleted from the website`, 'info');
    } catch (err) {
      showToast('Failed to delete course', 'error');
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast('Please fill in Course Title and Description', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const highlightsArray = formData.highlights
        ? formData.highlights.split('\n').map((h) => h.trim()).filter(Boolean)
        : [
            'Live interactive mentorship & doubt clearance',
            'Assured Internship with industry-ready projects',
            'ISO & APSCHE recognized certificate upon completion'
          ];

      const coursePayload = {
        ...formData,
        title: formData.title.trim(),
        price: Number(formData.price) || 499,
        discountPrice: Number(formData.discountPrice) || Number(formData.price) || 399,
        highlights: highlightsArray,
        overview: formData.overview || formData.description
      };

      if (editingCourse) {
        coursePayload._id = editingCourse._id;
        coursePayload.slug = editingCourse.slug;
      }

      await saveCourseLive(coursePayload);
      loadCourses();

      showToast(
        editingCourse
          ? `"${coursePayload.title}" updated successfully!`
          : `"${coursePayload.title}" published live to the Learning Lounge!`,
        'success'
      );

      setShowAddModal(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        subtitle: '',
        category: 'Software & Web Development',
        level: 'Beginner to Advanced',
        duration: '80 Hours (10 Weeks)',
        price: 499,
        discountPrice: 399,
        description: '',
        overview: '',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        syllabusPdf: '',
        pdfFileName: '',
        highlights: '',
        isPublished: true,
        isFeatured: false
      });
    } catch (err) {
      showToast('Failed to save course. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk Import Handler
  const handleBulkImport = async () => {
    if (!bulkDataText.trim()) {
      showToast('Please paste course data or JSON/CSV content', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      let parsedCourses = [];

      // Check if JSON
      if (bulkDataText.trim().startsWith('[') || bulkDataText.trim().startsWith('{')) {
        const parsed = JSON.parse(bulkDataText);
        parsedCourses = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        // Parse CSV or newline formatted text: Title, Category, Price, DiscountPrice, Duration
        const lines = bulkDataText.split('\n').filter((l) => l.trim());
        for (const line of lines) {
          const parts = line.split(/[,;\t|]/).map((p) => p.trim());
          if (parts[0]) {
            parsedCourses.push({
              title: parts[0],
              category: parts[1] || 'Software & Web Development',
              price: Number(parts[2]) || 499,
              discountPrice: Number(parts[3]) || 399,
              duration: parts[4] || '60 Hours (8 Weeks)',
              description: parts[5] || `Complete industry certified program in ${parts[0]} with live projects & internship.`
            });
          }
        }
      }

      if (parsedCourses.length === 0) {
        showToast('No valid course rows found to import', 'error');
        setIsProcessing(false);
        return;
      }

      const count = await bulkImportCoursesLive(parsedCourses);
      loadCourses();
      showToast(`Successfully imported ${count} courses to the website!`, 'success');
      setShowBulkModal(false);
      setBulkDataText('');
    } catch (err) {
      showToast('Invalid format. Please check JSON or CSV formatting.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearAllCourses = async () => {
    if (!window.confirm('Are you sure you want to delete ALL courses from the website and database? This cannot be undone.')) {
      return;
    }

    try {
      await clearAllCoursesLive();
      loadCourses();
      showToast('All courses removed. Database and catalog are clean.', 'info');
    } catch (err) {
      showToast('Failed to clear courses', 'error');
    }
  };

  const filteredCourses = courses.filter((c) =>
    (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Admin Operations Hub
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-slate-900">Course Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
              {courses.length} Live Courses
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Add new courses, upload PDF syllabus/brochures, edit pricing, or bulk-import 600+ courses.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {courses.length > 0 && (
            <button
              onClick={handleClearAllCourses}
              className="px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All Courses
            </button>
          )}

          <button
            onClick={() => setShowBulkModal(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Bulk Import (CSV / JSON)
          </button>

          <button
            onClick={() => {
              setEditingCourse(null);
              setFormData({
                title: '',
                subtitle: '',
                category: 'Software & Web Development',
                level: 'Beginner to Advanced',
                duration: '80 Hours (10 Weeks)',
                price: 499,
                discountPrice: 399,
                description: '',
                overview: '',
                thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
                syllabusPdf: '',
                pdfFileName: '',
                highlights: '',
                isPublished: true,
                isFeatured: false
              });
              setShowAddModal(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Course
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search across all courses by title or category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-900">{filteredCourses.length}</strong> of {courses.length} courses
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Course Program</th>
                <th className="p-4">Category</th>
                <th className="p-4">Duration & Level</th>
                <th className="p-4">Price / Discount</th>
                <th className="p-4">Syllabus PDF</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/60 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
                        alt={c.title}
                        className="w-12 h-9 rounded-lg object-cover border border-slate-200 shadow-sm flex-shrink-0"
                      />
                      <div>
                        <Link
                          to={`/courses/${c.slug}`}
                          target="_blank"
                          className="font-bold text-slate-900 hover:text-brand-600 transition line-clamp-1 max-w-xs"
                        >
                          {c.title}
                        </Link>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{c.subtitle || c.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-brand-700 bg-brand-50/80 px-2.5 py-1 rounded-lg border border-brand-100">
                      {c.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{c.duration}</div>
                    <span className="text-[10px] text-slate-400">{c.level}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-mono font-bold text-slate-900 text-sm">
                      ${(c.discountPrice || c.price).toLocaleString('en-US')}
                    </div>
                    {c.discountPrice && c.discountPrice < c.price && (
                      <span className="text-slate-400 line-through text-[10px]">
                        ${c.price.toLocaleString('en-US')}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {c.syllabusPdf ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <FileText className="w-3.5 h-3.5" /> PDF Attached
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Auto-generated</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Live
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/courses/${c.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition"
                        title="View Live Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setEditingCourse(c);
                          setFormData({
                            title: c.title || '',
                            subtitle: c.subtitle || '',
                            category: c.category || 'Software & Web Development',
                            level: c.level || 'Beginner to Advanced',
                            duration: c.duration || '80 Hours (10 Weeks)',
                            price: c.price || 499,
                            discountPrice: c.discountPrice || 399,
                            description: c.description || c.overview || '',
                            overview: c.overview || c.description || '',
                            thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
                            syllabusPdf: c.syllabusPdf || '',
                            pdfFileName: c.syllabusPdf ? 'Current Attached PDF' : '',
                            highlights: Array.isArray(c.highlights) ? c.highlights.join('\n') : (c.highlights || ''),
                            isPublished: c.isPublished !== undefined ? c.isPublished : true,
                            isFeatured: !!c.isFeatured
                          });
                          setShowAddModal(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition"
                        title="Edit Course"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id, c.title)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Permanently Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingCourse ? '✏️ Edit Course Program' : '✨ Add New Course Program'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Changes will update immediately across the entire website and Learning Lounge.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-5 text-xs">
              {/* Course Title */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full Stack Cloud & Microservices Engineering Masterclass"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Subtitle / Short Summary</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. React 19, Node.js, Kubernetes, AWS & Microservices Deployment."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Category & Skill Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  >
                    <option>Software & Web Development</option>
                    <option>Data Science & AI</option>
                    <option>Cloud & DevOps</option>
                    <option>Enterprise ERP & SAP</option>
                    <option>Engineering & Industrial Tech</option>
                    <option>Design & Management</option>
                    <option>Specialized Certifications</option>
                    <option>Cyber Security</option>
                    <option>VLSI & Embedded Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Skill Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Beginner to Advanced</option>
                    <option>All Levels</option>
                  </select>
                </div>
              </div>

              {/* Duration, Price & Discount Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 100 Hours (12 Weeks)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Regular Price ($ / ₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Offer / Discount Price</label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* PDF Syllabus / Brochure Upload */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-900 text-xs flex items-center justify-between">
                  <span>📄 Course Syllabus & Brochure PDF</span>
                  {formData.syllabusPdf && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> PDF Ready
                    </span>
                  )}
                </label>
                <p className="text-[11px] text-slate-500">
                  Upload the official PDF syllabus for this course. Students will be able to download it directly on the course page.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-sm transition">
                    <Upload className="w-4 h-4 text-brand-600" />
                    <span>{formData.pdfFileName ? 'Replace PDF File' : 'Upload PDF File'}</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handlePdfFileUpload}
                      className="hidden"
                    />
                  </label>

                  {formData.syllabusPdf && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700 max-w-xs truncate">
                        {formData.pdfFileName || 'Custom Syllabus.pdf'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, syllabusPdf: '', pdfFileName: '' })}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remove PDF"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <label className="block text-[10px] text-slate-500 mb-1">Or paste external PDF URL (Google Drive / Cloud link):</label>
                  <input
                    type="url"
                    value={formData.syllabusPdf && !formData.syllabusPdf.startsWith('data:') ? formData.syllabusPdf : ''}
                    onChange={(e) => setFormData({ ...formData, syllabusPdf: e.target.value, pdfFileName: 'Online PDF Link' })}
                    placeholder="https://example.com/syllabus.pdf"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Course Description & Overview *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide comprehensive details about what students will master, capstones, and curriculum..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Highlights (One per line) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Course Highlights (One point per line)</label>
                <textarea
                  rows={3}
                  value={formData.highlights}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                  placeholder="Guaranteed Internship Assistance&#10;Live 1-on-1 Mentor Code Reviews&#10;Capstone Deployment on AWS/Cloud"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Course Thumbnail Image (Google Images URL / Upload File + Live Preview) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-900 text-xs">
                    🖼️ Course Thumbnail Image
                  </label>
                  {formData.thumbnail && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Image Attached
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  Search on Google for this course, right-click the image and select <strong>"Copy image address"</strong>, then paste it below. Or upload an image from your computer.
                </p>

                <div className="space-y-2">
                  <input
                    type="url"
                    value={formData.thumbnail && !formData.thumbnail.startsWith('data:') ? formData.thumbnail : ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="Paste Google Image address / URL here (e.g. https://...)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                  />

                  <div className="flex items-center gap-3 pt-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-sm transition">
                      <Upload className="w-4 h-4 text-brand-600" />
                      <span>{formData.thumbnail ? 'Change Image File' : 'Upload Image from Computer'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    {formData.thumbnail && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, thumbnail: '' })}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Image Preview Card */}
                {formData.thumbnail && (
                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-slate-600 mb-1.5">Live Image Preview:</div>
                    <div className="w-48 h-28 rounded-xl overflow-hidden border-2 border-brand-500/40 shadow-sm bg-slate-900 relative">
                      <img
                        src={formData.thumbnail}
                        alt="Course Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingCourse ? 'Save Changes' : 'Publish Course Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal (For 600+ Courses) */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Bulk Import 600+ Courses</h3>
              </div>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Paste your course data below in **JSON** format or **CSV** (Comma-separated lines).
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 font-mono space-y-1">
                <div className="font-bold text-slate-700">CSV Format Example (1 course per line):</div>
                <div>Python Full Stack, Software & Web Development, 499, 399, 80 Hours, Comprehensive course...</div>
                <div>AWS Cloud Architect, Cloud & DevOps, 599, 499, 100 Hours, Industry certified cloud...</div>
              </div>

              <div>
                <textarea
                  rows={8}
                  value={bulkDataText}
                  onChange={(e) => setBulkDataText(e.target.value)}
                  placeholder="Paste your courses here..."
                  className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleBulkImport}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-md flex items-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Import All Courses Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
