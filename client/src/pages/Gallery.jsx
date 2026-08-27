import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Filter,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Layers,
  Code2,
  Cpu,
  ShieldCheck,
  BarChart3,
  Boxes,
  Database,
  Palette,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Box,
  Terminal,
  Eye
} from 'lucide-react';

import {
  project1AnsysBracket,
  project2BiSalesAnalytics,
  project3CyberSecurity,
  project4AiChurn,
  project5Ecommerce,
  project6SapS4Hana,
  project7EcoFutureDesign,
  project8ClaudeAi,
  project9DigitalMarketing,
  project10PythonSales,
  project11SolidworksGearbox,
  project12Ecosystem3D,
  project13ScadaAutomation
} from '../assets/gallery';

export const projectsGalleryData = [
  {
    id: 'p1-solidworks-gearbox',
    title: 'Gearbox Assembly with 28+ Precision Parts',
    category: 'Mechanical & CAD',
    domain: 'Mechanical Design & CAD',
    software: 'SOLIDWORKS 2023',
    timeTaken: '18 Hours',
    rating: '4.8/5',
    image: project11SolidworksGearbox,
    relatedCourseSlug: 'solidworks-3d-cad-mechanical-design-certified-course',
    tags: ['SolidWorks', 'Mechanical Design', 'Exploded View', 'Technical Drafting'],
    highlights: [
      'High load transmission capacity modeling',
      'Exploded and sectional views with tolerance stack-up',
      'Full technical drafting and manufacturing blueprints'
    ],
    description: 'Designed a high-performance industrial gearbox assembly with 28+ custom gears, shafts, bearings, and casing parts in SOLIDWORKS 2023.'
  },
  {
    id: 'p2-ansys-bracket',
    title: 'Structural Analysis of Bracket Using ANSYS',
    category: 'Mechanical & CAD',
    domain: 'CAE & Simulation',
    software: 'ANSYS Workbench & Mechanical',
    timeTaken: '2 Weeks',
    rating: '4.9/5',
    image: project1AnsysBracket,
    relatedCourseSlug: 'ansys-fea-cfd-simulation-engineering-certified-course',
    tags: ['ANSYS', 'Static Structural', 'FEA', 'Von-Mises Stress', 'Meshing'],
    highlights: [
      'Tetrahedral meshing with 1,25,814 nodes & 68,432 elements',
      'Max Equivalent Stress: 248.7 MPa (Safe Design)',
      'Factor of Safety (Min): 2.15 under 1000 N load'
    ],
    description: 'Finite element analysis (FEA) of a mechanical bracket to evaluate structural safety, deformation, stress concentration, and material optimization.'
  },
  {
    id: 'p3-powerbi-sales',
    title: 'Business Intelligence & Sales Analytics Dashboard',
    category: 'Data Science & Python',
    domain: 'Data Analytics & BI',
    software: 'Power BI, SQL, Python, DAX',
    timeTaken: '150K+ Rows Analyzed',
    rating: '4.9/5',
    image: project2BiSalesAnalytics,
    relatedCourseSlug: 'data-science-ai-masterclass-certified-course',
    tags: ['Power BI', 'SQL Server', 'DAX', 'Sales Analytics', 'ETL'],
    highlights: [
      '$2.45M Total Revenue analyzed across 18,742 orders',
      '24.6% Profit Margin tracking across 5 global regions',
      'Real-time automated data refresh pipeline with SQL & DAX'
    ],
    description: 'End-to-end interactive enterprise sales dashboard with regional geographic heatmaps, monthly profit trends, and payment mode breakdowns.'
  },
  {
    id: 'p4-cyber-threat',
    title: 'Cyber Security Threat Detection & Monitoring System',
    category: 'Cybersecurity',
    domain: 'Network & Cloud Security',
    software: 'Python, ELK Stack, Wireshark, Splunk, Snort',
    timeTaken: '6 Months',
    rating: '5.0/5',
    image: project3CyberSecurity,
    relatedCourseSlug: 'cybersecurity-ethical-hacking-certified-course',
    tags: ['Cybersecurity', 'ELK Stack', 'Splunk', 'Wireshark', 'Intrusion Detection'],
    highlights: [
      '1.2M+ Network events monitored with 98.6% threat detection',
      '10TB+ Log data analyzed with 2.3s avg response time',
      'Automated DDoS, Port Scan, and Malware intrusion blocking'
    ],
    description: 'Intelligent security incident response system that monitors enterprise network traffic, system logs, and anomalies in real-time.'
  },
  {
    id: 'p5-ai-churn',
    title: 'AI-Powered Customer Churn Prediction & Retention',
    category: 'AI & Machine Learning',
    domain: 'Machine Learning & Predictive AI',
    software: 'Python, Scikit-learn, Random Forest, Pandas',
    timeTaken: '10,000 Customers',
    rating: '4.8/5',
    image: project4AiChurn,
    relatedCourseSlug: 'ai-machine-learning-masterclass',
    tags: ['Machine Learning', 'Random Forest', 'Predictive AI', 'Customer Churn'],
    highlights: [
      '73% Model accuracy in predicting at-risk customer churn',
      '25% Reduction in customer churn for subscription business',
      'Automated feature engineering pipeline with Flask deployment'
    ],
    description: 'Predictive machine learning pipeline that identifies churn probability, flags at-risk accounts, and triggers automated retention incentives.'
  },
  {
    id: 'p6-ecommerce-shopease',
    title: 'Smart E-Commerce Web Application (ShopEase)',
    category: 'Full Stack & Cloud',
    domain: 'Full Stack Web Development',
    software: 'React.js, Node.js, Express.js, MongoDB Atlas',
    timeTaken: '4 Months',
    rating: '4.9/5',
    image: project5Ecommerce,
    relatedCourseSlug: 'full-stack-web-development-mern-certified-course',
    tags: ['MERN Stack', 'React', 'Node.js', 'MongoDB', 'Razorpay', 'JWT'],
    highlights: [
      'Complete shopping cart, checkout, and Razorpay gateway',
      'Role-based JWT authentication for customers and admins',
      'Microservice REST API architecture deployed on cloud'
    ],
    description: 'Full-featured modern e-commerce platform with product filtering, customer reviews, order tracking, and dynamic admin inventory management.'
  },
  {
    id: 'p7-sap-s4hana',
    title: 'SAP S/4HANA Enterprise Implementation',
    category: 'SAP ERP',
    domain: 'Enterprise Resource Planning (ERP)',
    software: 'SAP S/4HANA, SAP Fiori, SAP GUI, Solution Manager',
    timeTaken: '6 Months',
    rating: '5.0/5',
    image: project6SapS4Hana,
    relatedCourseSlug: 'sap-pm-plant-maintenance-certified-course',
    tags: ['SAP S/4HANA', 'SAP FI/CO', 'SAP MM', 'SAP SD', 'SAP PP', 'Fiori'],
    highlights: [
      'End-to-end integration of FI/CO, SD, MM, PP, PM, QM modules',
      '30% Improvement in global manufacturing operational efficiency',
      '100% Data migration accuracy to in-memory HANA database'
    ],
    description: 'Enterprise ERP deployment streamlining core finance, supply chain, plant maintenance, and quality management on SAP S/4HANA.'
  },
  {
    id: 'p8-ecofuture-design',
    title: 'EcoFuture Environmental Awareness Campaign',
    category: 'Digital Marketing & Design',
    domain: 'Graphic Design & Branding',
    software: 'Photoshop, Illustrator, InDesign (Adobe CC)',
    timeTaken: '2 Weeks',
    rating: '4.9/5',
    image: project7EcoFutureDesign,
    relatedCourseSlug: 'graphic-design-masterclass',
    tags: ['UI/UX', 'Photoshop', 'Illustrator', 'Branding', 'Advertising'],
    highlights: [
      '250K+ Impressions & 18K+ Social Media Engagements',
      'Complete billboard mockups, merchandise & digital creatives',
      'Consistent Poppins typography and eco-friendly color palette'
    ],
    description: 'Comprehensive sustainability visual branding campaign including key visuals, outdoor billboards, eco merchandise, and social media carousels.'
  },
  {
    id: 'p9-claude-ai',
    title: 'Claude AI Intelligent Assistant & Workflow Generator',
    category: 'AI & Machine Learning',
    domain: 'Generative AI & LLMs',
    software: 'Claude 3 Opus API, Python, FastAPI, LangChain, Pinecone',
    timeTaken: '10K+ Active Users',
    rating: '5.0/5',
    image: project8ClaudeAi,
    relatedCourseSlug: 'ai-machine-learning-masterclass',
    tags: ['GenAI', 'LLM', 'Claude API', 'LangChain', 'Pinecone', 'FastAPI'],
    highlights: [
      'Natural language document analysis for PDFs, CSVs, and DOCX',
      'Code generation and automated multi-language debugging',
      '70% Increase in knowledge worker productivity with 90% satisfaction'
    ],
    description: 'Next-generation AI copilot combining RAG vector search, multi-document synthesis, and conversational code generation via Claude API.'
  },
  {
    id: 'p10-digital-marketing',
    title: 'Omnichannel Digital Marketing & Growth Campaign',
    category: 'Digital Marketing & Design',
    domain: 'Digital Marketing & Performance Ads',
    software: 'Meta Ads, Google Ads, LinkedIn Ads, Email Automation',
    timeTaken: '92 Days Campaign',
    rating: '4.9/5',
    image: project9DigitalMarketing,
    relatedCourseSlug: 'digital-marketing-growth-mastery-certified-course',
    tags: ['Meta Ads', 'Google Ads', 'ROAS', 'Conversion Funnel', 'SEO'],
    highlights: [
      '1.2M Impressions, 45.8K Clicks, and 2,349 Direct Conversions',
      '4.67 ROAS achieved with optimized Facebook & Google ad creatives',
      '5.12% Funnel conversion rate from landing page visits'
    ],
    description: 'Data-driven performance marketing campaign driving qualified leads and sales with precise demographic targeting and A/B tested ad copy.'
  },
  {
    id: 'p11-python-sales',
    title: 'Python Interactive Sales Analysis & 3D Profit Model',
    category: 'Data Science & Python',
    domain: 'Python Analytics & Visualization',
    software: 'Python, Pandas, NumPy, Matplotlib, Seaborn, Plotly, Streamlit',
    timeTaken: '22 Hours',
    rating: '4.8/5',
    image: project10PythonSales,
    relatedCourseSlug: 'python-programming-data-analytics-certified-course',
    tags: ['Python', 'Pandas', 'Matplotlib', 'Plotly', '3D Surface Plot', 'EDA'],
    highlights: [
      'Interactive 3D roadmap bridging practical labs to corporate placement',
      'Unified continuum covering CAD, FEA, Web, Data, AI & Automation',
      'Certified portfolio projects built under direct expert guidance'
    ],
    description: 'Immersive visual representation of Course Divine’s industry progression continuum from foundational learning to production capstones and corporate hiring.'
  },
  {
    id: 'p13-scada-industrial-automation',
    title: 'Industrial PLC & SCADA Water Treatment Automation Dashboard',
    category: 'Automation & Robotics',
    domain: 'PLC, SCADA & IIoT Systems',
    software: 'Siemens WinCC, TIA Portal, Modbus TCP, Node-RED',
    timeTaken: '28 Hours',
    rating: '4.9/5',
    image: project13ScadaAutomation,
    relatedCourseSlug: 'embedded-systems-iot-robotics-certified-course',
    tags: ['Siemens PLC', 'WinCC SCADA', 'Modbus TCP', 'Node-RED', 'P&ID Telemetry', 'IIoT'],
    highlights: [
      'Real-time industrial water treatment HMI dashboard with live tank level gauges',
      'Automated chemical dosing and backwash valve control logic via Siemens PLC',
      'Modbus TCP/IP telemetry streaming flow rate, pressure, temperature, and TDS metrics'
    ],
    description: 'Complete industrial automation & telemetry system providing remote HMI monitoring, trend telemetry, and automated alarm management.'
  },
  {
    id: 'p12-course-divine-ecosystem',
    title: 'Course Divine 3D Future Career Ecosystem Visual',
    category: 'Career Ecosystem',
    domain: 'Future of Learning & Career Progression',
    software: 'Course Divine Learning Architecture',
    timeTaken: 'Integrated Platform',
    rating: '5.0/5',
    image: project12Ecosystem3D,
    relatedCourseSlug: 'our-programme',
    tags: ['Live Classes', 'Real Projects', 'Internships', '1:1 Mentorship', 'Placement'],
    highlights: [
      'Complete career bridge: Live Classes -> Capstone Projects -> Guaranteed Internships',
      '1-on-1 personalized mentorship and technical interview coaching',
      'Verified placement pathways with leading global tech leaders'
    ],
    description: 'The holistic Course Divine career accelerator blueprint: transforming passionate students into highly sought-after industry engineers and professionals.'
  }
];

const categories = [
  'All Projects',
  'Mechanical & CAD',
  'Data Science & Python',
  'AI & Machine Learning',
  'Full Stack & Cloud',
  'Cybersecurity',
  'SAP ERP',
  'Digital Marketing & Design',
  'Career Ecosystem'
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const filteredProjects = projectsGalleryData.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Projects' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.software.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) =>
      prev === 0 ? filteredProjects.length - 1 : prev - 1
    );
  };

  const currentProject = lightboxIndex !== null ? filteredProjects[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-[#F8FAFD] space-y-12 pb-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#071F3F] via-[#0D2F5D] to-[#0A192F] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>WHAT WILL YOU BUILD? • CAPSTONE PORTFOLIO</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Industry Projects & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
              Capstone Portfolio Gallery
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Explore 12 real-world industry projects designed, built, simulated, and deployed by Course Divine learners across Mechanical CAD, Data Science, AI, Full Stack, Cybersecurity, and SAP ERP.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-amber-400">12+</span>
              <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">Industry Infographics</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-sky-400">8</span>
              <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">Tech Domains</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">100%</span>
              <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">Live & Hands-on</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
              <span className="block text-2xl sm:text-3xl font-black text-purple-400">1:1</span>
              <span className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">Mentor Guided</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
          {/* Search Box */}
          <div className="relative max-w-md mx-auto sm:mx-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by keyword, software (ANSYS, Power BI, Python, SolidWorks, SAP)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
                  selectedCategory === cat
                    ? 'bg-[#0F62FE] text-white shadow-[#0F62FE]/30 ring-2 ring-[#0F62FE]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Boxes className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Projects Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search terms or filter category.</p>
            <button
              onClick={() => {
                setSelectedCategory('All Projects');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#0F62FE] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Image Container with Hover Overlay */}
                <div
                  onClick={() => handleOpenLightbox(idx)}
                  className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-4 py-2 rounded-xl bg-white/95 text-slate-900 text-xs font-extrabold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5 text-[#0F62FE]" />
                      Expand Full Infographic
                    </span>
                  </div>

                  {/* Domain Tag */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                    {project.category}
                  </span>

                  {/* Software Badge */}
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    {project.software.split(',')[0]}
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0F62FE] transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Key Highlights Bullet Points */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    {project.highlights.slice(0, 2).map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenLightbox(idx)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                      View Infographic
                    </button>

                    <Link
                      to={`/courses`}
                      className="px-3.5 py-2 rounded-xl bg-[#0F62FE] hover:bg-[#0043CE] text-white text-xs font-bold flex items-center gap-1 transition shadow-sm"
                    >
                      <span>Build This</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Full CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-brand-900 via-[#071F3F] to-navy-950 rounded-3xl p-8 sm:p-12 text-white border border-brand-700/50 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-400/30">
              Transform Your Career Portfolio
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Build Production-Grade Capstones Like These?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Join Course Divine masterclasses with 1-on-1 industry mentorship, guaranteed internship exposure, live codebase reviews, and 100% verified placement support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <Link
              to="/courses"
              className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Browse All Courses
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-extrabold text-xs sm:text-sm transition-all text-center"
            >
              Talk to Career Counselor
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Full-Screen Infographic Viewing */}
      {currentProject && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0B1528] text-white rounded-3xl border border-slate-800 shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden relative"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#08101E]">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                  {currentProject.category} • {currentProject.software}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                  {currentProject.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={currentProject.image}
                  download={`${currentProject.id}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Download High-Res Infographic"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Image Preview */}
            <div className="flex-grow overflow-y-auto p-4 bg-slate-950 flex items-center justify-center relative">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-brand-600 text-white border border-slate-700 transition z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 hover:bg-brand-600 text-white border border-slate-700 transition z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <img
                src={currentProject.image}
                alt={currentProject.title}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Footer: Project Summary & Actions */}
            <div className="p-5 border-t border-slate-800 bg-[#08101E] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300 space-y-1 text-center sm:text-left">
                <p className="font-medium max-w-xl text-slate-400 line-clamp-2">
                  {currentProject.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <span className="text-[11px] font-bold text-amber-400">★ Rating: {currentProject.rating}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] font-bold text-sky-400">Domain: {currentProject.domain}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/courses"
                  onClick={() => setLightboxIndex(null)}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
                >
                  <Sparkles className="w-4 h-4" />
                  Enroll in This Course
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;