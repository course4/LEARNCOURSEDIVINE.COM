import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import {
  GraduationCap,
  BookOpen,
  Laptop,
  Briefcase,
  Award,
  Rocket,
  CheckCircle2,
  Star,
  ArrowRight,
  ArrowUp,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Send,
  ShieldCheck,
  Compass,
  Terminal,
  Cpu,
  Target,
  UserCheck,
  Layers,
  PlayCircle,
  Play,
  BarChart3,
  Code2,
  Users,
  Bot,
  MessageCircle,
  X,
  Check,
  HelpCircle,
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  Building2,
  CreditCard,
  Lock,
  ExternalLink,
  Quote,
  Eye,
  Activity,
  Box,
  Sliders,
  Workflow,
  PhoneCall
} from 'lucide-react';
import api, { fallbackStore, getLiveCourses, fetchLiveCoursesFromApi } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import CourseCard from '../components/CourseCard';
import EnrollmentModal from '../components/EnrollmentModal';
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

const AnimatedCounter = ({ target, duration = 6500, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = parseFloat(target);
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Very smooth, luxurious cubic ease-out
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = easeProgress * end;

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [target, duration]);

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString('en-IN');

  return <span>{formatted}{suffix}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [courses, setCourses] = useState(() => getLiveCourses());
  const { showToast } = useNotification();

  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);
  const [projectModalTab, setProjectModalTab] = useState('overview');
  const [heroVisualTab, setHeroVisualTab] = useState('cad');

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Hi there! 👋 Welcome to Course Divine. Ask us anything 🎉' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const [finderOpen, setFinderOpen] = useState(false);
  const [finderStep, setFinderStep] = useState(1);
  const [finderAnswers, setFinderAnswers] = useState({
    background: 'Student',
    domain: 'Data Science & AI',
    goal: 'Get a Job'
  });

  const [selectedCourseTab, setSelectedCourseTab] = useState('All');
  const [pathRole, setPathRole] = useState('Student');
  const [pathGoal, setPathGoal] = useState('Get a Job');
  const [activeCareerTrack, setActiveCareerTrack] = useState('data-ai');
  const [projectCategory, setProjectCategory] = useState('All');
  const [lmsTab, setLmsTab] = useState('dashboard');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const syncCourses = () => {
      setCourses(getLiveCourses().filter((c) => c.isPublished !== false));
    };

    syncCourses();

    fetchLiveCoursesFromApi()
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data.filter((c) => c.isPublished !== false));
        }
      })
      .catch(() => {
        setCourses(getLiveCourses().filter((c) => c.isPublished !== false));
      });

    window.addEventListener('cd_courses_updated', syncCourses);
    return () => window.removeEventListener('cd_courses_updated', syncCourses);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { from: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let reply = "Thanks for contacting Course Divine! Our career counselors will assist you immediately. You can also call us directly at +91-9100348679.";
      const lower = userMsg.toLowerCase();
      if (lower.includes('course') || lower.includes('fee') || lower.includes('price')) {
        reply = "We offer certified courses in Data Science, SolidWorks, ANSYS, Python, Digital Marketing & UI/UX with guaranteed internship opportunities. Check out our Learning Lounge!";
      } else if (lower.includes('internship')) {
        reply = "Every course includes an assured, verified corporate internship with live capstone projects and mentor feedback!";
      }
      setChatMessages((prev) => [...prev, { from: 'bot', text: reply }]);
    }, 700);
  };

  const topCourseCategories = [
    { label: 'All Top Courses', value: 'All' },
    { label: 'Data Science', value: 'Data Science & AI' },
    { label: 'Digital Marketing', value: 'Digital Marketing' },
    { label: 'SolidWorks', value: 'SolidWorks' },
    { label: 'ANSYS', value: 'ANSYS' },
    { label: 'Python', value: 'Python' },
    { label: 'UI/UX Design', value: 'UI/UX' }
  ];

  const filteredTopCourses = courses.filter((c) => {
    if (selectedCourseTab === 'All') return true;
    if (selectedCourseTab === 'SolidWorks') return c.title.toLowerCase().includes('solidworks');
    if (selectedCourseTab === 'ANSYS') return c.title.toLowerCase().includes('ansys');
    if (selectedCourseTab === 'Python') return c.title.toLowerCase().includes('python');
    if (selectedCourseTab === 'Digital Marketing') return c.title.toLowerCase().includes('marketing');
    if (selectedCourseTab === 'UI/UX') return c.title.toLowerCase().includes('ui/ux') || c.title.toLowerCase().includes('design');
    if (selectedCourseTab === 'Data Science & AI') return c.category.includes('Data Science') || c.title.toLowerCase().includes('data science') || c.title.toLowerCase().includes('machine learning');
    return c.category.includes(selectedCourseTab);
  });

  const pathProfiles = {
    'Student_Get a Job': {
      track: 'Accelerated Placement Pathway',
      coreCourse: 'Full Stack Python & AI or Data Science Masterclass',
      projects: '2 Production-grade Web/AI Capstones with CI/CD',
      internship: '3-Month Guaranteed Industry Internship with Live Mentor Review',
      career: 'Junior Software Engineer / Data Analyst ($75,000 / ₹6-10 LPA)',
      tag: '🔥 Highest Placement Demand'
    },
    'Student_Build Skills': {
      track: 'Hands-on Technology Foundation',
      coreCourse: 'Core Python, SolidWorks 3D CAD & Modern UI/UX',
      projects: 'Interactive Portfolio Projects & GitHub Lab Repositories',
      internship: 'Remote Research & Development Lab Apprenticeship',
      career: 'College Project Excellence & High-Stakes Hackathon Finalist',
      tag: '⚡ Fast-Track Skill Booster'
    },
    'Student_Internship': {
      track: 'Industry Internship Accelerator',
      coreCourse: 'Hands-on Domain Mastery (ANSYS / Python / Digital Marketing)',
      projects: 'Real Client Briefs & Structured Code Submissions',
      internship: 'Guaranteed 4 to 8-Week Verified Corporate Internship',
      career: 'Verified Experience Letter, APSCHE Credits & Recommendation',
      tag: '💼 100% Internship Guarantee'
    },
    'Student_Career Change': {
      track: 'Zero-to-Hero Tech Immersion',
      coreCourse: 'Data Science & AI or Cloud DevOps Certification',
      projects: 'End-to-End Enterprise Architecture Deployments',
      internship: 'Corporate Project Shadowing with Senior Engineers',
      career: 'Smooth Transition into In-Demand Tech Roles',
      tag: '🚀 Complete Career Pivot'
    },
    'Student_Build Portfolio': {
      track: 'Showcase-First Creator Track',
      coreCourse: 'UI/UX Design Masterclass & Product Strategy',
      projects: '3 Case Studies (Mobile App, SaaS Dashboard, Design System)',
      internship: 'Design Studio Live Project with Real User Testing',
      career: 'Stunning Behance/Dribbble Portfolio Ready for Interviews',
      tag: '🎨 Portfolio Ready'
    },
    default: {
      track: 'Custom Professional Career Track',
      coreCourse: 'Industry-Standard Masterclass in Selected Domain',
      projects: 'Production-ready Capstones with Real-time Data',
      internship: 'Corporate Internship with Verified Experience Credential',
      career: 'Senior Specialist / Fast-track Career Growth',
      tag: '⭐ Recommended Pathway'
    }
  };

  const currentPath = pathProfiles[`${pathRole}_${pathGoal}`] || pathProfiles.default;

  const careerTracks = [
    {
      id: 'data-ai',
      name: 'Data & AI',
      badge: 'Highest Starting Salary',
      headline: 'Master the full modern data stack from exploratory analytics to generative AI.',
      steps: [
        { label: '01. Fundamentals', desc: 'Python & Advanced SQL' },
        { label: '02. BI & Analytics', desc: 'Power BI & Tableau' },
        { label: '03. Advanced Modeling', desc: 'Machine Learning & NLP' },
        { label: '04. Real Capstone', desc: 'Predictive Churn & LLM Apps' },
        { label: '05. Internship', desc: 'Corporate Data Science Internship' }
      ],
      targetRole: 'Data Scientist / AI Engineer',
      salary: '₹8 - 18 LPA',
      skills: ['Python', 'SQL', 'Pandas', 'Power BI', 'Scikit-Learn', 'PyTorch', 'Prompt Engineering']
    },
    {
      id: 'eng-design',
      name: 'Engineering & Design',
      badge: 'Core Engineering',
      headline: 'Transform mechanical concepts into industrial-grade parametric models and simulations.',
      steps: [
        { label: '01. 2D Drafting', desc: 'AutoCAD Drafting & GD&T' },
        { label: '02. 3D Modeling', desc: 'SolidWorks Part & Sheet Metal' },
        { label: '03. Simulation', desc: 'ANSYS FEA & CFD Fluent' },
        { label: '04. Prototyping', desc: 'Industrial Drone & Chassis' },
        { label: '05. Internship', desc: 'Automotive/Aerospace Internship' }
      ],
      targetRole: 'CAD Engineer / CAE Analyst',
      salary: '₹6 - 14 LPA',
      skills: ['SolidWorks', 'ANSYS Workbench', 'AutoCAD', 'FEA', 'CFD', 'CSWA/CSWP', 'Sheet Metal']
    },
    {
      id: 'digital-marketing',
      name: 'Digital Marketing',
      badge: 'Fastest Career Entry',
      headline: 'Drive profitable customer acquisition and scaling across all digital channels.',
      steps: [
        { label: '01. Discovery', desc: 'SEO Mastery & Keyword Strategy' },
        { label: '02. Paid Ads', desc: 'Google Ads & Search Marketing' },
        { label: '03. Social Ads', desc: 'Meta & Instagram Paid Funnels' },
        { label: '04. Analytics', desc: 'GA4, Looker & Conversion Rate' },
        { label: '05. Live Portfolio', desc: 'Manage Real $ Ad Budgets' }
      ],
      targetRole: 'Growth Marketing Lead',
      salary: '₹5 - 12 LPA',
      skills: ['SEO', 'Google Ads', 'Meta Ads', 'GA4 Analytics', 'Copywriting', 'Conversion Optimization']
    },
    {
      id: 'fullstack-cloud',
      name: 'Full Stack & Cloud',
      badge: 'Maximum Remote Jobs',
      headline: 'Build robust, cloud-native web applications with scalable microservices.',
      steps: [
        { label: '01. Frontend', desc: 'Modern React, TypeScript & Tailwind' },
        { label: '02. Backend', desc: 'Node.js, Express & PostgreSQL' },
        { label: '03. Cloud & DevOps', desc: 'AWS, Docker & CI/CD Pipelines' },
        { label: '04. Enterprise App', desc: 'Full Stack SaaS with Auth & Stripe' },
        { label: '05. Internship', desc: 'Software Engineering Internship' }
      ],
      targetRole: 'Full Stack Software Engineer',
      salary: '₹7 - 16 LPA',
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'REST APIs', 'Git/GitHub']
    }
  ];

  const activeTrackData = careerTracks.find((t) => t.id === activeCareerTrack) || careerTracks[0];

  const showcaseProjects = [
    {
      id: 'p1',
      title: 'Industrial Gearbox Assembly with 28+ Precision Parts',
      shortTitle: 'SolidWorks Gearbox CAD & Exploded Assembly',
      domain: 'Mechanical Design & CAD',
      category: 'SolidWorks Project',
      image: project11SolidworksGearbox,
      description: 'Parametric CAD modeling and assembly of a high-performance industrial gearbox with 28+ custom gears, shafts, bearings, and casing parts in SOLIDWORKS 2023.',
      detailedDescription: 'In this production-grade capstone, you will architect a complete industrial gearbox assembly from initial 2D schematics to 3D parametric modeling, exploded view tolerances, GD&T production drawings, and sectional analysis.',
      challenge: 'Minimizing backlash and ensuring high load transmission capacity with optimized gear ratios and precise mechanical mates.',
      tools: ['SOLIDWORKS 2023', 'Mechanical Design', 'Exploded View', 'Technical Drafting', 'Sectional Views', 'GD&T Standards'],
      workflow: [
        { step: '01', title: 'Parametric 3D Wireframing', desc: 'Constructing robust base sketches and primary reference planes with parametric dimension constraints.' },
        { step: '02', title: 'Sub-Assembly & Mates', desc: 'Assembling 28+ custom components with concentric, coincident, and mechanical gear mates in SolidWorks.' },
        { step: '03', title: 'Exploded & Sectional Views', desc: 'Modeling exploded views and internal section slices to verify gear alignment and bearing tolerances.' },
        { step: '04', title: 'Production 2D Drafting & BOM', desc: 'Exporting industry-ready multi-view fabrication drawings with bill of materials and geometric tolerances.' }
      ],
      keyDeliverables: [
        'Complete 3D Parametric CAD Assembly (.SLDASM)',
        'Exploded & Sectional Views with 28+ Parts',
        'Fabrication-ready 2D Blueprints with GD&T',
        'Full Bill of Materials (BOM) for Manufacturing'
      ],
      courseLink: '/courses/solidworks-3d-cad-mechanical-design-certified-course',
      courseName: 'SolidWorks 3D CAD Certified Course',
      metrics: '28+ Parts, 4.8/5 Rating, 18 Hours Benchmark',
      previewBadge: 'SolidWorks 2023 • 28+ Parts'
    },
    {
      id: 'p2',
      title: 'Structural Analysis of Bracket Using ANSYS Workbench',
      shortTitle: 'ANSYS Bracket FEA & Stress Simulation',
      domain: 'CAE & Simulation',
      category: 'ANSYS Project',
      image: project1AnsysBracket,
      description: 'Finite Element Analysis (FEA) of a mechanical bracket to evaluate static structural safety, von Mises stresses, deformation, and optimize for minimum weight.',
      detailedDescription: 'Simulate high-load mechanical stresses and deformation on a structural bracket using ANSYS Workbench. Learn tetrahedral meshing with 1.25L+ nodes, boundary load constraints, stress convergence, and factor of safety validation.',
      challenge: 'Identifying stress concentration points and ensuring minimum Factor of Safety (2.15) under 1000 N static force.',
      tools: ['ANSYS Workbench', 'Static Structural FEA', 'DesignModeler', 'SpaceClaim', 'Meshing Engine'],
      workflow: [
        { step: '01', title: 'Geometry Import & Setup', desc: 'Importing clean 3D CAD model and defining fixed support and 1000 N directional force.' },
        { step: '02', title: 'Tetrahedral Meshing', desc: 'Generating 68,432 tetrahedral elements and 1,25,814 nodes with high mesh quality.' },
        { step: '03', title: 'Solver Convergence Plot', desc: 'Running FEA solver to monitor total deformation convergence across element iterations.' },
        { step: '04', title: 'Results & Factor of Safety', desc: 'Validating Max Von-Mises Stress (248.7 MPa) and Minimum Factor of Safety (2.15).' }
      ],
      keyDeliverables: [
        'Total Deformation (0.412 mm) Heatmaps',
        'Von-Mises Stress (248.7 MPa) Distribution Plot',
        'Mesh Quality & Convergence Report',
        'Design Safety Validation Certificate'
      ],
      courseLink: '/courses/ansys-fea-cfd-simulation-engineering-certified-course',
      courseName: 'ANSYS FEA & CFD Certified Course',
      metrics: 'Factor of Safety 2.15, Max Stress 248.7 MPa',
      previewBadge: 'ANSYS Workbench • 1.25L Nodes'
    },
    {
      id: 'p3',
      title: 'Business Intelligence & Sales Analytics Dashboard',
      shortTitle: 'Power BI Enterprise Sales Analytics',
      domain: 'Data & AI',
      category: 'Data Dashboard',
      image: project2BiSalesAnalytics,
      description: 'End-to-end data analytics project analyzing sales performance, customer segments, regional revenues, and profit trends in Power BI.',
      detailedDescription: 'Build an enterprise BI hub connecting SQL, Excel, and CSV data sources into an interactive Power BI dashboard with DAX calculations, geospatial regional maps, and monthly profit growth simulators.',
      challenge: 'Handling 150K+ rows across 5 data sources to identify top-performing product categories and optimize marketing spend.',
      tools: ['Power BI', 'SQL Server', 'Python', 'DAX', 'Power Query', 'Google Analytics'],
      workflow: [
        { step: '01', title: 'Data Ingestion & Cleaning', desc: 'Extracting 150K+ rows from SQL Server and handling missing values with Power Query.' },
        { step: '02', title: 'Data Modeling & DAX', desc: 'Creating star schema relationship models and writing custom DAX measures for profit margins.' },
        { step: '03', title: 'Geospatial Regional Heatmaps', desc: 'Mapping global revenue across North America, Europe, Asia Pacific, and South America.' },
        { step: '04', title: 'Executive BI Dashboard', desc: 'Deploying interactive visuals with dynamic slicers, KPI cards ($2.45M Revenue), and payment mode trends.' }
      ],
      keyDeliverables: [
        'Interactive Multi-Page Power BI Dashboard (.PBIX)',
        'Custom DAX Revenue & Profit Margin Formulas',
        'Regional Sales & Product Category Breakdowns',
        'Executive Actionable Insights Presentation'
      ],
      courseLink: '/courses/data-science-ai-masterclass-certified-course',
      courseName: 'Data Science & AI Masterclass',
      metrics: '$2.45M Revenue, 150K+ Rows, 24.6% Margin',
      previewBadge: 'Power BI + SQL • 150K+ Rows'
    },
    {
      id: 'p4',
      title: 'Omnichannel Digital Marketing & ROAS Growth Campaign',
      shortTitle: 'Omnichannel 4.67 ROAS Performance Marketing',
      domain: 'Digital Marketing',
      category: 'Marketing Campaign',
      image: project9DigitalMarketing,
      description: 'Data-driven digital marketing campaign to increase brand awareness, drive qualified leads, and boost sales across Meta, Google, and LinkedIn Ads.',
      detailedDescription: 'Design and deploy a full-funnel digital marketing engine. From audience demographic targeting and ad creative A/B testing to Google Ads, Meta Ads Manager, email automations, and ROAS attribution.',
      challenge: 'Achieving a high 4.67 ROAS and 5.12% conversion rate while scaling 1.2M impressions and 45.8K clicks.',
      tools: ['Meta Ads Manager', 'Google Ads', 'LinkedIn Ads', 'Email Automation', 'Looker Studio', 'A/B Testing'],
      workflow: [
        { step: '01', title: 'Audience Targeting', desc: 'Defining high-converting young professional personas (22-35 yrs) with tech interests.' },
        { step: '02', title: 'Ad Creatives & Copy', desc: 'Designing A/B tested multi-format video and carousel creatives reducing CPC by 18%.' },
        { step: '03', title: 'Channel Optimization', desc: 'Deploying Meta ($1,050) and Google Ads ($850) with automated smart bidding.' },
        { step: '04', title: 'Funnel Attribution', desc: 'Tracking 2,349 conversions, 12.5K landing page views, and 4.67 overall ROAS.' }
      ],
      keyDeliverables: [
        'Complete Multi-Channel Ad Campaign Structure',
        'A/B Creative Testing Matrix & ROAS Reports',
        'Conversion Funnel Optimization Deck',
        'Real-Time Attribution Dashboard'
      ],
      courseLink: '/courses/digital-marketing-growth-mastery-certified-course',
      courseName: 'Digital Marketing & Growth Mastery',
      metrics: '4.67 ROAS, 1.2M Impressions, 2,349 Sales',
      previewBadge: 'Meta & Google Ads • 4.67 ROAS'
    },
    {
      id: 'p5',
      title: 'Python Interactive Sales Analysis & 3D Profit Model',
      shortTitle: 'Python EDA & 3D Profit Optimization',
      domain: 'Software & Data',
      category: 'Python Project',
      image: project10PythonSales,
      description: 'Interactive Python data analysis dashboard to visualize sales performance, correlation matrices, and extract 3D profit optimization insights.',
      detailedDescription: 'Develop a high-performance Python analytics application using Pandas, NumPy, Matplotlib, Seaborn, and Streamlit. Build multi-variable correlation heatmaps, geospatial sales maps, and 3D surface visualizations.',
      challenge: 'Visualizing non-linear discount vs quantity relationships and generating actionable regional business recommendations.',
      tools: ['Python 3.12', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly', 'Streamlit', 'Kaggle Dataset'],
      workflow: [
        { step: '01', title: 'Data Cleaning & Prep', desc: 'Loading Kaggle sales dataset, handling nulls, and standardizing categorical columns.' },
        { step: '02', title: 'Correlation Heatmaps', desc: 'Computing Seaborn Pearson correlation matrix across sales, profit, quantity, and discount.' },
        { step: '03', title: '3D Profit Surface Plot', desc: 'Rendering interactive 3D Matplotlib surface mesh showing optimal discount thresholds.' },
        { step: '04', title: 'Streamlit Deployment', desc: 'Packaging the EDA workflow into a responsive Streamlit dashboard with real-time filters.' }
      ],
      keyDeliverables: [
        'Full Python Jupyter Notebook & Streamlit App',
        'Interactive 3D Surface Plots & Correlation Heatmaps',
        'Global Sales Geospatial Choropleth Visual',
        'Statistical Executive Findings Report'
      ],
      courseLink: '/courses/python-programming-data-analytics-certified-course',
      courseName: 'Python Programming & Data Analytics',
      metrics: '$2.45M Sales Analyzed, 3D Plot, 22h Build',
      previewBadge: 'Python 3.12 + Streamlit + 3D'
    },
    {
      id: 'p6',
      title: 'Industrial PLC & SCADA Water Treatment Automation Dashboard',
      shortTitle: 'PLC & SCADA Water Treatment Automation',
      domain: 'Automation & Robotics',
      category: 'SCADA Project',
      image: project13ScadaAutomation,
      description: 'Real-time industrial SCADA monitoring dashboard for automated water filtration, chemical dosing, flow telemetry, and remote pump control.',
      detailedDescription: 'Build a complete industrial SCADA monitoring & telemetry system using Siemens WinCC, TIA Portal, Modbus TCP/IP, and Node-RED. Features live raw water tank monitoring, chemical dosing control, automated backwash valves, trend graphing, and real-time alarm management.',
      challenge: 'Integrating multi-sensor Modbus TCP telemetry into a zero-latency responsive HMI dashboard with automated alarm triggers.',
      tools: ['Siemens S7-1200 PLC', 'WinCC SCADA', 'TIA Portal', 'Modbus TCP', 'Node-RED', 'P&ID Telemetry'],
      workflow: [
        { step: '01', title: 'P&ID Architecture', desc: 'Designing water treatment process instrumentation and flow pipeline schema.' },
        { step: '02', title: 'PLC Logic Programming', desc: 'Writing Ladder Logic for automatic pump control, backwash sequence, and dosing pumps.' },
        { step: '03', title: 'SCADA HMI Dashboard', desc: 'Developing high-resolution WinCC SCADA interactive panel with real-time gauges.' },
        { step: '04', title: 'Modbus Telemetry', desc: 'Deploying Modbus TCP/IP protocol to stream live tank levels and active alarms.' }
      ],
      keyDeliverables: [
        'Complete WinCC SCADA HMI Interface & PLC Ladder Code',
        'Real-Time Water Filtration Flow & Pressure Telemetry',
        'Automated Backwash & Dosing Control Logic',
        'Interactive Alarm Panel & Historical Data Logs'
      ],
      courseLink: '/courses/embedded-systems-iot-robotics-certified-course',
      courseName: 'PLC, SCADA & Industrial Automation',
      metrics: '45.6 m³/h Flow Rate, 100% Remote, Live SCADA',
      previewBadge: 'Siemens PLC + WinCC SCADA + IIoT'
    }
  ];

  const projectCategoryTabs = [
    { label: 'All Projects', value: 'All' },
    { label: 'SolidWorks Project', value: 'SolidWorks Project' },
    { label: 'ANSYS Project', value: 'ANSYS Project' },
    { label: 'Data Dashboard', value: 'Data Dashboard' },
    { label: 'Marketing Campaign', value: 'Marketing Campaign' },
    { label: 'Python Project', value: 'Python Project' },
    { label: 'SCADA Project', value: 'SCADA Project' }
  ];

  const filteredProjects = showcaseProjects.filter((p) => {
    if (projectCategory === 'All') return true;
    return p.category === projectCategory;
  });

  return (
    <div className="space-y-24 pb-16 font-sans bg-[#F8FAFD] text-slate-800 selection:bg-brand-500 selection:text-white">
      
      {/* 1. HERO SECTION: Custom Course Divine Animated Hero with Real Background Image */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden bg-white border-b border-slate-200">
        
        {/* Real Classroom & Student High-Res Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat bg-[center_right] sm:bg-right opacity-85 contrast-105 brightness-105 scale-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2560&q=95')`
          }}
        />
        
        {/* Dynamic Smooth Fade Gradient: Solid White/Glass on Left for crisp text, soft fade on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/40 lg:to-white/20 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-full sm:w-1/2 bg-white/50 pointer-events-none" />

        {/* Subtle Ambient Background Mesh Grids & Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#0F62FE_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.06] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-gradient-to-br from-blue-400/20 to-sky-300/10 rounded-full blur-3xl pointer-events-none animate-subtle-pulse" />
        <div className="absolute top-1/2 -left-32 w-[450px] h-[450px] bg-gradient-to-tr from-[#0F62FE]/15 to-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: High-Impact Typography & Fast Track CTA */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Top Sub-tag with Live Beacon */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-black tracking-widest text-[#0F62FE] uppercase shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#0F62FE] animate-ping" />
                <span className="w-2 h-2 rounded-full bg-[#0F62FE] -ml-4" />
                IT'S YOUR TIME • COURSE DIVINE PLATFORM
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-[58px] font-black tracking-tight text-slate-900 leading-[1.08]">
                  ADVANCE YOUR SKILLS. <br />
                  <span className="text-[#0F62FE] bg-gradient-to-r from-[#0F62FE] via-[#0052CC] to-[#0F62FE] bg-clip-text text-transparent">
                    BUILD REAL CAREERS.
                  </span>
                </h1>
                <div className="w-24 h-1.5 bg-[#0F62FE] rounded-full" />
              </div>

              {/* Subheading */}
              <p className="text-base sm:text-lg font-semibold text-slate-600 leading-relaxed max-w-xl">
                Master industrial tech skills through hands-on capstone projects, verified simulations, and guaranteed corporate internships designed to get you hired.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/courses"
                  className="px-7 py-3.5 rounded-xl bg-[#0F62FE] hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <BookOpen className="w-4 h-4" />
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/internships"
                  className="px-7 py-3.5 rounded-xl bg-[#071F3F] hover:bg-slate-800 text-white font-extrabold text-sm shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  Explore Internships
                </Link>
              </div>

              {/* Call Us Today Pill Badge */}
              <div className="pt-1">
                <a
                  href="tel:+919100348679"
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0F62FE] text-slate-800 font-black text-xs sm:text-sm shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#0F62FE] flex items-center justify-center text-sm">📞</span>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Have Questions? Call Us</div>
                    <div className="font-extrabold text-xs sm:text-sm text-[#0F62FE] tracking-wide">+91-9100348679</div>
                  </div>
                </a>
              </div>

              {/* Visual Progression Continuum */}
              <div className="pt-4 border-t border-slate-200">
                <div className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#0F62FE]" /> 4-Stage Industry Progression Continuum
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                    <div className="text-xs font-black text-slate-800 flex items-center justify-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#0F62FE]" /> 01. Course
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Masterclass</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                    <div className="text-xs font-black text-slate-800 flex items-center justify-center gap-1">
                      <Code2 className="w-3.5 h-3.5 text-emerald-600" /> 02. Project
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Production Capstone</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                    <div className="text-xs font-black text-slate-800 flex items-center justify-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-amber-600" /> 03. Internship
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Corporate Verified</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
                    <div className="text-xs font-black text-slate-800 flex items-center justify-center gap-1">
                      <Rocket className="w-3.5 h-3.5 text-purple-600" /> 04. Career
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">Top Placement</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Custom Course Divine Animated Visual (Learner + Digital Interface + Projects/Career Progression) */}
            <div className="lg:col-span-6 relative">
              
              {/* Outer Decorative Ring */}
              <div className="relative mx-auto max-w-[540px]">
                
                {/* Main Glassmorphic Workstation Container */}
                <div className="relative bg-[#071F3F] text-white rounded-3xl p-5 sm:p-6 border border-[#0F3C75] shadow-2xl shadow-blue-900/25 overflow-hidden">
                  
                  {/* Glowing Ambient Mesh Inside */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F62FE]/25 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

                  {/* Window Title Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3.5 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400/80" />
                      <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                      <span className="text-[11px] font-mono text-slate-300 ml-2">coursedivine://lms.workspace</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        LIVE LAB
                      </span>
                    </div>
                  </div>

                  {/* Learner & Mentor Presence Bar */}
                  <div className="pt-3 pb-4 flex items-center justify-between gap-3 border-b border-white/10 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                          alt="Learner"
                          className="w-11 h-11 rounded-2xl object-cover border-2 border-[#0F62FE] shadow-md"
                        />
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#071F3F]" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-1.5">
                          Rohan S. <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/30 text-sky-300 font-normal">Active Learner</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">Session: SolidWorks & AI Machine Learning</div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-right">
                      <div>
                        <div className="text-[10px] font-bold text-sky-300">1-on-1 Mentor Connected</div>
                        <div className="text-[9px] text-slate-400">Dr. Rajesh V. (Ex-Amazon)</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Digital Interface Interactive Workspace Simulator */}
                  <div className="pt-4 space-y-3 relative z-10">
                    
                    {/* Workspace Mode Switcher Tabs */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10">
                      <button
                        onClick={() => setHeroVisualTab('cad')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          heroVisualTab === 'cad'
                            ? 'bg-[#0F62FE] text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Box className="w-3.5 h-3.5 text-sky-300" />
                        SolidWorks / ANSYS
                      </button>

                      <button
                        onClick={() => setHeroVisualTab('code')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          heroVisualTab === 'code'
                            ? 'bg-[#0F62FE] text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        Python & AI Agent
                      </button>

                      <button
                        onClick={() => setHeroVisualTab('analytics')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          heroVisualTab === 'analytics'
                            ? 'bg-[#0F62FE] text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
                        BI Dashboard
                      </button>
                    </div>

                    {/* Interactive Telemetry Canvas Display */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-white/10 font-mono text-[11px] space-y-2.5">
                      {heroVisualTab === 'cad' && (
                        <div className="space-y-2 text-slate-300">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                            <span className="text-sky-300 font-bold">PROJECT: UAV-Quad-Chassis.SLDASM</span>
                            <span className="text-emerald-400 font-semibold">Mesh Orthogonal Quality: 0.92</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-slate-400 block">FEA Max Stress:</span>
                              <span className="text-white font-bold text-xs">42.8 MPa (Safe &lt; 120 MPa)</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-slate-400 block">Weight Reduction:</span>
                              <span className="text-emerald-400 font-bold text-xs">-35.4% Optimized</span>
                            </div>
                          </div>
                          <div className="text-[10px] text-sky-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Parametric Mates Verified • Ready for 3D Print / FEA Run
                          </div>
                        </div>
                      )}

                      {heroVisualTab === 'code' && (
                        <div className="space-y-2 text-slate-300">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                            <span className="text-emerald-400 font-bold">app/routes/ml_pipeline.py</span>
                            <span className="text-sky-300 font-semibold">FastAPI + LangChain</span>
                          </div>
                          <div className="text-[10px] text-slate-300 space-y-1">
                            <p><span className="text-purple-400">@app.post</span>(<span className="text-emerald-300">"/api/v1/score-ats"</span>)</p>
                            <p><span className="text-blue-400">async def</span> <span className="text-amber-300">evaluate_resume</span>(resume: <span className="text-sky-300">UploadFile</span>):</p>
                            <p className="pl-4 text-slate-400">vector = <span className="text-purple-400">await</span> embeddings.create(resume)</p>
                            <p className="pl-4 text-emerald-400">return {"{"} "matchScore": 0.942, "status": "APPROVED" {"}"}</p>
                          </div>
                          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Automated Tests: 18/18 Passed (Latency: 142ms)
                          </div>
                        </div>
                      )}

                      {heroVisualTab === 'analytics' && (
                        <div className="space-y-2 text-slate-300">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                            <span className="text-amber-300 font-bold">DAX KPI: Customer Retention Matrix</span>
                            <span className="text-emerald-400 font-semibold">Live GA4 + SQL Feed</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-slate-400 block">ROAS Multiplier:</span>
                              <span className="text-emerald-400 font-bold text-xs">12.4x Target Hit</span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-slate-400 block">Churn Risk Detected:</span>
                              <span className="text-sky-300 font-bold text-xs">60 Days Early Alert</span>
                            </div>
                          </div>
                          <div className="text-[10px] text-amber-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Power BI Executive Report Published & Synced
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                </div>

                {/* Floating Animated Career Progression Milestone Card */}
                <div className="hidden sm:block absolute -bottom-7 -left-6 z-20 p-3.5 rounded-2xl bg-white text-slate-900 border border-slate-200/90 shadow-2xl shadow-blue-900/20 max-w-[270px] animate-float-slow">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-black">
                      🚀
                    </span>
                    <div>
                      <div className="text-[11px] font-black text-slate-900 leading-tight">Career Milestone Unlocked</div>
                      <div className="text-[9px] text-slate-500 font-semibold">Placed at Microsoft • ₹24.5 LPA</div>
                    </div>
                  </div>
                  
                  {/* Mini Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0F62FE] to-emerald-400 h-full rounded-full w-[92%]" />
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold pt-1">
                    <span>Course + Project + Internship</span>
                    <span className="text-emerald-600">100% Ready</span>
                  </div>
                </div>

                {/* Floating Animated Project Metric Badge */}
                <div className="hidden sm:block absolute -top-5 -right-5 z-20 px-3.5 py-2.5 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 shadow-xl animate-float-reverse">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#0F62FE] text-white flex items-center justify-center font-black text-xs">
                      ⚡
                    </div>
                    <div>
                      <div className="text-[10px] text-sky-300 font-bold uppercase">Verified Capstone Project</div>
                      <div className="text-xs font-extrabold text-white">CSWA CAD & 35% Weight Drop</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* Premium Navy & Electric Blue Performance Strip */}
      <section className="bg-gradient-to-r from-[#061833] via-[#0C2A52] to-[#061833] text-white py-12 border-y border-[#0E3466] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0F62FE_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="space-y-1 p-3">
              <div className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center gap-1">
                <AnimatedCounter target={12500} suffix="+" />
              </div>
              <p className="text-xs font-bold text-sky-300 uppercase tracking-wider">Active Students Trained</p>
              <p className="text-[11px] text-slate-300">Across 45+ universities & corporate batches</p>
            </div>

            <div className="space-y-1 p-3 pt-6 sm:pt-3">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 flex items-center justify-center gap-1">
                <AnimatedCounter target={94.8} decimals={1} suffix="%" />
              </div>
              <p className="text-xs font-bold text-sky-300 uppercase tracking-wider">Placement Success Rate</p>
              <p className="text-[11px] text-slate-300">In MNCs, product firms & unicorns</p>
            </div>

            <div className="space-y-1 p-3 pt-6 sm:pt-3">
              <div className="text-3xl sm:text-4xl font-black text-amber-300 flex items-center justify-center gap-1">
                <AnimatedCounter target={180} suffix="+" />
              </div>
              <p className="text-xs font-bold text-sky-300 uppercase tracking-wider">Corporate Hiring Partners</p>
              <p className="text-[11px] text-slate-300">Direct hiring drives & internships</p>
            </div>

            <div className="space-y-1 p-3 pt-6 sm:pt-3">
              <div className="text-3xl sm:text-4xl font-black text-[#3395FF] flex items-center justify-center gap-1">
                <Star className="w-7 h-7 fill-amber-400 text-amber-400 inline -mt-1" />
                <AnimatedCounter target={4.95} decimals={2} suffix="/5.0" />
              </div>
              <p className="text-xs font-bold text-sky-300 uppercase tracking-wider">Student Satisfaction</p>
              <p className="text-[11px] text-slate-300">Based on 3,400+ verified reviews</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pick-your-course" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-[#0F62FE] uppercase">
              ⚡ Instant Skill Discovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Pick Your Course
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
              Explore expert-led courses designed around real-world skills.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition self-start md:self-auto shrink-0"
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {topCourseCategories.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedCourseTab(tab.value)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCourseTab === tab.value
                  ? 'bg-[#0F62FE] text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTopCourses.slice(0, 6).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#071F3F] text-white rounded-3xl p-6 sm:p-12 border border-[#0D2F5D] shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#0F62FE]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-black text-brand-300 uppercase tracking-widest">
                🧭 Guided Curriculum Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Not Sure What to Learn? We’ll Help You Find Your Path.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-medium">
                Select your profile and primary ambition to reveal your personalized roadmap.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  1. I am a:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {['Student', 'Graduate', 'Working Professional', 'Career Switcher'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setPathRole(item)}
                      className={`p-3.5 rounded-xl text-xs font-bold text-left transition border ${
                        pathRole === item
                          ? 'bg-[#0F62FE] text-white border-blue-400 shadow-md'
                          : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {item === 'Student' && '🎓 '}
                      {item === 'Graduate' && '📜 '}
                      {item === 'Working Professional' && '💼 '}
                      {item === 'Career Switcher' && '🔄 '}
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  2. My goal is:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {['Get a Job', 'Build Skills', 'Internship', 'Career Change', 'Build Portfolio'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setPathGoal(item)}
                      className={`p-3.5 rounded-xl text-xs font-bold text-left transition border ${
                        pathGoal === item
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {item === 'Get a Job' && '🎯 '}
                      {item === 'Build Skills' && '⚡ '}
                      {item === 'Internship' && '💼 '}
                      {item === 'Career Change' && '🚀 '}
                      {item === 'Build Portfolio' && '📁 '}
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-900 border border-brand-500/30 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    {currentPath.tag}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Tailored for <strong className="text-white">{pathRole}</strong> aiming to <strong className="text-white">{pathGoal}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-black text-[#0F62FE] uppercase">Step 1 • Master Course</div>
                  <div className="font-bold text-white text-sm">{currentPath.coreCourse}</div>
                  <div className="text-[11px] text-slate-400">Live instruction & code reviews</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-black text-emerald-400 uppercase">Step 2 • Build Projects</div>
                  <div className="font-bold text-white text-sm">{currentPath.projects}</div>
                  <div className="text-[11px] text-slate-400">Real production portfolio</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-black text-amber-400 uppercase">Step 3 • Internship</div>
                  <div className="font-bold text-white text-sm">{currentPath.internship}</div>
                  <div className="text-[11px] text-slate-400">Verified corporate experience</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-black text-purple-400 uppercase">Step 4 • Placement</div>
                  <div className="font-bold text-white text-sm">{currentPath.career}</div>
                  <div className="text-[11px] text-slate-400">Direct referral assistance</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-300">
                  Ready to enroll in this career pathway? Receive a 1-on-1 counselor audit for free.
                </div>
                <Link
                  to="/courses"
                  className="px-6 py-3 rounded-xl bg-[#0F62FE] hover:bg-blue-700 text-white font-extrabold text-xs transition shadow-lg shrink-0 flex items-center gap-2"
                >
                  Start This Path Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold tracking-widest text-[#0F62FE] uppercase">
            🚀 End-to-End Skill Journeys
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Where Do You Want Your Skills to Take You?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            We provide a complete career journey—not just isolated courses.
          </p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-4 overflow-x-auto pb-2">
          {careerTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => setActiveCareerTrack(track.id)}
              className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeCareerTrack === track.id
                  ? 'bg-[#071F3F] text-white shadow-xl shadow-slate-900/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {track.name}
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#071F3F] via-[#09274E] to-[#071F3F] text-white rounded-3xl p-6 sm:p-10 border border-[#0D366D] shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F62FE]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
            <div>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 font-black text-xs">
                {activeTrackData.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
                {activeTrackData.name} Career Roadmap
              </h3>
              <p className="text-sm text-slate-300 mt-1">{activeTrackData.headline}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-left sm:text-right shrink-0">
              <div className="text-[11px] font-bold text-sky-300 uppercase">Target Role & Package</div>
              <div className="text-base font-black text-white">{activeTrackData.targetRole}</div>
              <div className="text-xs font-bold text-emerald-400">{activeTrackData.salary} Average Salary</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
            {activeTrackData.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-[#0F62FE] transition space-y-2 relative group"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F62FE] text-white font-black text-xs flex items-center justify-center shadow-md">
                  0{idx + 1}
                </div>
                <div className="font-extrabold text-white text-xs">{step.label}</div>
                <div className="text-xs text-slate-300 font-medium">{step.desc}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 border-t border-white/10">
            <p className="text-xs text-slate-300">
              Includes comprehensive industry modules, real-world portfolio projects, and corporate internship placement.
            </p>
            <Link
              to="/courses"
              className="px-6 py-3 rounded-xl bg-[#0F62FE] hover:bg-blue-600 text-white font-black text-xs shadow-lg transition flex items-center gap-2 shrink-0"
            >
              Explore {activeTrackData.name} Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 border-t border-white/10 relative z-10">
            <div className="space-y-2">
              <div className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                Industry Tools & Competencies Mastered
              </div>
              <div className="flex flex-wrap gap-2">
                {activeTrackData.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-slate-900/90 text-slate-200 text-xs font-bold border border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <Link
              to="/courses"
              className="px-6 py-3.5 rounded-2xl bg-[#0F62FE] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 shrink-0"
            >
              Enroll in {activeTrackData.name} Track <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* 2. MAJOR USP: WHAT WILL YOU BUILD? Interactive Project Gallery */}
      <section id="what-will-you-build" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-black tracking-widest text-[#0F62FE] uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0F62FE]" />
              COURSE DIVINE CORE DIFFERENTIATOR & MAJOR USP
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              WHAT WILL YOU BUILD?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed">
              Generic courses teach syntax. Course Divine equips you with verified industrial capstones, engineering simulations, and AI pipelines that prove your capability directly to hiring managers.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden lg:inline text-xs font-bold text-slate-400">
              💡 Hover to preview • Click to inspect blueprints
            </span>
            <Link
              to="/courses"
              className="px-5 py-3 rounded-xl bg-[#0F62FE] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
            >
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Project Gallery Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {projectCategoryTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setProjectCategory(tab.value)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                projectCategory === tab.value
                  ? 'bg-[#071F3F] text-white shadow-xl shadow-slate-900/20 scale-102 border border-slate-700'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.value === 'SolidWorks Project' && <Box className="w-3.5 h-3.5 text-sky-400" />}
              {tab.value === 'ANSYS Project' && <Cpu className="w-3.5 h-3.5 text-blue-400" />}
              {tab.value === 'Data Dashboard' && <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />}
              {tab.value === 'Marketing Campaign' && <TrendingUp className="w-3.5 h-3.5 text-amber-400" />}
              {tab.value === 'Python Project' && <Terminal className="w-3.5 h-3.5 text-purple-400" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Large Project Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredProjectId(project.id)}
              onMouseLeave={() => setHoveredProjectId(null)}
              onClick={() => {
                setSelectedProject(project);
                setProjectModalTab('overview');
              }}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col group cursor-pointer hover:-translate-y-1.5 relative"
            >
              {/* Media Container with Interactive Hover Preview Overlay */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-75"
                />

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3 bg-[#071F3F]/90 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-xl border border-slate-700 shadow-md">
                  {project.category}
                </div>

                {/* Difficulty / Tag Pill */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {project.previewBadge}
                </div>

                {/* Interactive Hover HUD Overlay (Active on Hover) */}
                <div className={`absolute inset-0 bg-slate-950/85 backdrop-blur-xs p-5 flex flex-col justify-between transition-opacity duration-300 ${
                  hoveredProjectId === project.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-widest font-black text-sky-400">
                      ⚡ LIVE CAPSTONE PREVIEW
                    </span>
                    <p className="text-xs text-slate-200 font-medium line-clamp-3 leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">
                      🏆 {project.metrics}
                    </div>
                    <div className="w-full py-2 rounded-xl bg-[#0F62FE] text-white text-xs font-black text-center flex items-center justify-center gap-1.5 shadow-md">
                      <Eye className="w-3.5 h-3.5" /> Inspect Full Architecture Blueprint →
                    </div>
                  </div>
                </div>

                {/* Default Bottom Benchmark Bar (Hidden on Hover) */}
                <div className={`absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur-sm px-3 py-2 rounded-xl text-white text-[11px] font-bold border border-slate-800 flex items-center justify-between transition-opacity duration-300 ${
                  hoveredProjectId === project.id ? 'opacity-0' : 'opacity-100'
                }`}>
                  <span className="truncate pr-2">📊 {project.metrics}</span>
                  <span className="text-sky-300 font-bold shrink-0">Details →</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F62FE]">
                    {project.domain}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-[#0F62FE] transition line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {/* Tool Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tools.slice(0, 3).map((tool, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0F62FE] text-[10px] font-extrabold border border-blue-100">
                        {tool}
                      </span>
                    ))}
                    {project.tools.length > 3 && (
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
                        +{project.tools.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Associated Course Link */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400 font-medium">Taught in:</span>
                    <span className="font-bold text-[#0F62FE] group-hover:underline truncate max-w-[200px]">
                      {project.courseName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Projects Gallery CTA */}
        <div className="pt-4 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#071F3F] to-[#0F62FE] hover:from-[#05162D] hover:to-[#0043CE] text-white text-sm font-extrabold shadow-xl hover:shadow-2xl hover:scale-102 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Explore All 12 Industrial Capstones in Projects Gallery →</span>
          </Link>
        </div>

        {/* Interactive Project Details & Blueprint Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-6 sm:p-8 bg-[#071F3F] text-white flex items-start justify-between gap-4 relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F62FE]/20 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-sky-300 text-[10px] font-black uppercase">
                    <span>{selectedProject.domain}</span>
                    <span>•</span>
                    <span>{selectedProject.category}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {selectedProject.title}
                  </h3>
                  <div className="text-xs font-mono text-emerald-400 font-semibold pt-1">
                    🏆 Verified Industry Benchmark: {selectedProject.metrics}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition shrink-0 relative z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-6 sm:px-8 text-xs font-bold shrink-0">
                <button
                  onClick={() => setProjectModalTab('overview')}
                  className={`py-3.5 px-4 border-b-2 transition ${
                    projectModalTab === 'overview'
                      ? 'border-[#0F62FE] text-[#0F62FE] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Overview & Challenge
                </button>
                <button
                  onClick={() => setProjectModalTab('blueprint')}
                  className={`py-3.5 px-4 border-b-2 transition ${
                    projectModalTab === 'blueprint'
                      ? 'border-[#0F62FE] text-[#0F62FE] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  4-Step Build Workflow
                </button>
                <button
                  onClick={() => setProjectModalTab('deliverables')}
                  className={`py-3.5 px-4 border-b-2 transition ${
                    projectModalTab === 'deliverables'
                      ? 'border-[#0F62FE] text-[#0F62FE] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Deliverables & Stack
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                
                {projectModalTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 max-h-[260px]">
                      <img
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Project Synopsis</h4>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {selectedProject.detailedDescription || selectedProject.description}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-1.5">
                      <div className="text-xs font-black text-[#0F62FE] uppercase flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-[#0F62FE]" /> Core Engineering Challenge
                      </div>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                        {selectedProject.challenge}
                      </p>
                    </div>
                  </div>
                )}

                {projectModalTab === 'blueprint' && (
                  <div className="space-y-4">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                      Step-by-Step Production Architecture
                    </div>

                    <div className="space-y-3">
                      {selectedProject.workflow?.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-xl bg-[#0F62FE] text-white font-black text-xs flex items-center justify-center shrink-0">
                            {item.step}
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-black text-slate-900">{item.title}</div>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {projectModalTab === 'deliverables' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        Key Portfolio Deliverables
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedProject.keyDeliverables?.map((item, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-xs font-bold text-emerald-950 flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        Technologies & Tools Mastered
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tools.map((tool, i) => (
                          <span key={i} className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  Included with 1-on-1 mentor guidance in <strong className="text-slate-900">{selectedProject.courseName}</strong>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-white transition"
                  >
                    Close
                  </button>
                  <Link
                    to={selectedProject.courseLink}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#0F62FE] hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-1.5"
                  >
                    Learn to Build This →
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#071F3F] rounded-3xl p-6 sm:p-12 text-white border border-[#0D2F5D] shadow-2xl space-y-8">
          
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-black text-brand-300 uppercase tracking-widest">
              🖥️ Technology-Enabled LMS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              A Modern, Technology-Enabled Learning Experience
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              From live interactive classrooms to automated code evaluation and progress tracking.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-950/95 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-400 font-mono text-[11px] ml-2">portal.coursedivine.com/learn</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-brand-400" /> Batch: 2026 Live Track</span>
                <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Student</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-brand-500/30 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                    TODAY 7:00 PM
                  </span>
                  <PlayCircle className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase">Upcoming Live Session</div>
                  <div className="text-sm font-extrabold text-white mt-1">Deep Neural Networks & PyTorch</div>
                </div>
                <div className="text-[10px] text-slate-400">Instructor: Dr. Rajesh Varma</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase">Your Progress</span>
                  <span className="text-base font-black text-brand-400">80%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full w-4/5 rounded-full" />
                </div>
                <div className="text-[10px] text-slate-400">16 of 20 Modules Mastered</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase">Projects Completed</span>
                  <span className="text-base font-black text-emerald-400">3 / 4</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-full h-2 rounded-full bg-emerald-500" />
                  <span className="w-full h-2 rounded-full bg-emerald-500" />
                  <span className="w-full h-2 rounded-full bg-emerald-500" />
                  <span className="w-full h-2 rounded-full bg-slate-800" />
                </div>
                <div className="text-[10px] text-slate-400">Final Capstone Pending Review</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase">Certificate Progress</span>
                  <span className="text-base font-black text-amber-400">85%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-[85%] rounded-full" />
                </div>
                <div className="text-[10px] text-slate-400">APSCHE & IAF Verified Badge</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Next Milestone: Submit Final Capstone to Unlock Guaranteed Corporate Internship.</span>
              </div>
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-[#0F62FE] hover:bg-blue-700 text-white font-extrabold transition shrink-0"
              >
                Open Student LMS Demo →
              </Link>
            </div>

          </div>

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold tracking-widest text-[#0F62FE] uppercase">
            🏆 The Complete Progression
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Your Course Isn’t the End. It’s the Beginning.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            01 Learn → 02 Practice → 03 Build → 04 Intern → 05 Showcase → 06 Grow
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { num: '01', title: 'Learn', icon: BookOpen, desc: 'Live sessions with industry lead mentors and structured theory.' },
            { num: '02', title: 'Practice', icon: Code2, desc: 'Hands-on guided labs, problem sets, and cloud development sandboxes.' },
            { num: '03', title: 'Build', icon: Laptop, desc: 'Production-ready capstones simulating real-world company challenges.' },
            { num: '04', title: 'Intern', icon: Briefcase, desc: 'Guaranteed corporate internships with real project deliverables.' },
            { num: '05', title: 'Showcase', icon: Award, desc: 'Verified ISO/IAF certificates & GitHub portfolios for recruiters.' },
            { num: '06', title: 'Grow', icon: Rocket, desc: 'Placement support, mock technical rounds, and career acceleration.' }
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-200 group-hover:text-[#0F62FE] transition">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0F62FE] flex items-center justify-center group-hover:bg-[#0F62FE] group-hover:text-white transition">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{step.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-gradient-to-r from-[#061833] via-[#0A274E] to-[#061833] text-white rounded-3xl p-8 sm:p-12 border border-[#0D366D] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0F62FE]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10 relative z-10">
            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-sky-400 font-mono">
                <AnimatedCounter target={98.4} decimals={1} suffix="%" duration={2000} />
              </div>
              <div className="text-xs font-bold text-slate-200">Verified Placement Rate</div>
              <div className="text-[10px] text-slate-400">Across 2025-2026 batches</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-emerald-400 font-mono">
                <AnimatedCounter target={140} suffix="%" duration={2200} />
              </div>
              <div className="text-xs font-bold text-slate-200">Average Salary Hike</div>
              <div className="text-[10px] text-slate-400">For career transformers</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-amber-300 font-mono">
                <AnimatedCounter target={180} suffix="+" duration={2400} />
              </div>
              <div className="text-xs font-bold text-slate-200">Corporate Hiring Partners</div>
              <div className="text-[10px] text-slate-400">Direct university & corporate drives</div>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-purple-300 font-mono">
                <AnimatedCounter target={25000} suffix="+" duration={2000} />
              </div>
              <div className="text-xs font-bold text-slate-200">Community Learners</div>
              <div className="text-[10px] text-slate-400">Across India & global cohorts</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#071F3F] via-[#0F62FE] to-[#071F3F] rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl space-y-6 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Admissions Open For 2026 Batches
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Turn Your Skills into Your Next High-Growth Opportunity?
            </h2>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-medium max-w-2xl mx-auto">
              Join over 25,000+ ambitious developers and engineers. Master in-demand tools, build verified portfolios, and land guaranteed corporate internships.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/courses"
                className="px-8 py-4 rounded-2xl bg-white text-[#071F3F] hover:bg-slate-100 font-black text-sm sm:text-base shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                Browse All 50+ Courses <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setFinderOpen(true)}
                className="px-8 py-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-white font-extrabold text-sm sm:text-base border border-white/30 backdrop-blur-md shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-emerald-400" /> 🎯 Find My Course
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="bg-[#071F3F] text-white py-3 text-center border-y border-[#0D2F5D]">
          <h2 className="text-sm sm:text-base font-black tracking-widest uppercase text-brand-300">
            Govt Recognized & Globally Accredited Platform
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center justify-items-center py-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 shadow-sm bg-white w-full max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800 font-bold text-xs p-1 text-center shrink-0">
                🏛️ APSCHE
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-slate-900">Andhra Pradesh State Council</div>
                <div className="text-slate-500 text-[10px]">Of Higher Education (APSCHE)</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 shadow-sm bg-white w-full max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-xs p-1 text-center shrink-0">
                🌐 IAF
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-slate-900">International Accreditation</div>
                <div className="text-slate-500 text-[10px]">Forum (IAF Recognized)</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 shadow-sm bg-white w-full max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs p-1 text-center shrink-0">
                ISO
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-slate-900">CERTIFIED ISO 9001:2015</div>
                <div className="text-slate-500 text-[10px]">Quality Management Company</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnrollmentModal
        isOpen={!!enrollingCourse}
        onClose={() => setEnrollingCourse(null)}
        course={enrollingCourse}
        onEnrollmentSuccess={() => {}}
      />

      {finderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-extrabold text-[#0F62FE] uppercase tracking-wider">
                  Course Divine AI Matcher • Step {finderStep} of 3
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {finderStep === 1 && "What's your current profile?"}
                  {finderStep === 2 && "Which domain interests you?"}
                  {finderStep === 3 && "What is your primary goal?"}
                </h3>
              </div>
              <button
                onClick={() => setFinderOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {finderStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">Select the option that best describes you today:</p>
                <div className="grid grid-cols-1 gap-2.5">
                  {['College Student (1st-4th Year)', 'Recent Graduate', 'Working Professional (Tech/Non-Tech)', 'Career Switcher / Career Break'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setFinderAnswers({ ...finderAnswers, background: opt });
                        setFinderStep(2);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-[#0F62FE] transition text-left flex items-center justify-between"
                    >
                      <span>{opt}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {finderStep === 2 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">Which career track or field excites you most?</p>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    'Data Science & Generative AI',
                    'Mechanical & Engineering CAD/CAE (SolidWorks/ANSYS)',
                    'Digital Marketing & Growth',
                    'Full Stack Python & Software Engineering',
                    'UI/UX Design & Product Strategy'
                  ].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setFinderAnswers({ ...finderAnswers, domain: opt });
                        setFinderStep(3);
                      }}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-[#0F62FE] transition text-left flex items-center justify-between"
                    >
                      <span>{opt}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {finderStep === 3 && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">What is your immediate milestone?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Land a High-Paying Job', 'Get a Guaranteed Internship', 'Build Industry Portfolio', 'Upskill with Certification'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFinderAnswers({ ...finderAnswers, goal: opt })}
                      className={`p-3 rounded-xl text-xs font-bold text-left transition border ${
                        finderAnswers.goal === opt
                          ? 'bg-[#0F62FE] text-white border-blue-400'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="text-[11px] font-black text-emerald-800 uppercase flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 98% Match Recommended Track
                  </div>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {finderAnswers.domain}
                  </div>
                  <div className="text-xs text-slate-600">
                    Includes live instruction, 2 production capstones, guaranteed internship, and placement prep.
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setFinderStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                  >
                    Back
                  </button>
                  <Link
                    to="/courses"
                    onClick={() => setFinderOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-[#0F62FE] hover:bg-blue-700 text-white font-bold text-xs text-center transition shadow-md"
                  >
                    View Recommended Courses →
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* FLOATING ACTION: COURSE FINDER TRIGGER BUTTON */}
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40">
        <button
          onClick={() => {
            setFinderStep(1);
            setFinderOpen(true);
          }}
          className="px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-[#0F62FE] to-emerald-500 text-white font-black text-xs sm:text-sm shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 border-2 border-white/40 animate-bounce"
          title="Find the right course for your career"
        >
          <Compass className="w-4 h-4" />
          <span>🎯 Find My Course</span>
        </button>
      </div>

      {/* FLOATING ACTION: CALL NOW & WHATSAPP BUTTONS (Bottom Left) */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 flex flex-col items-start gap-3">
        {/* Floating Call Now Button (Placed on top of WhatsApp button) */}
        <a
          href="tel:+919100348679"
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 text-white font-extrabold text-xs shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 border-2 border-white/40 cursor-pointer"
          title="Call Course Divine Admissions"
          aria-label="Call Now"
        >
          <PhoneCall className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Call Now</span>
        </a>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/919100348679?text=Hello%20Course%20Divine,%20I%20am%20interested%20in%20courses%20and%20internships!"
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 relative group cursor-pointer"
          title="Chat with us on WhatsApp"
          aria-label="WhatsApp Chat"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-200 rounded-full animate-ping" />
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
        </a>
      </div>

      {/* FLOATING ACTION: LIVE CHAT ASSISTANT WIDGET (Bottom Right) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
        {chatOpen && (
          <div className="bg-white w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-[#071F3F] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm flex items-center gap-1">
                    Hi there <span className="animate-wiggle">👋</span>
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-white/80">Welcome to Course Divine. Ask us anything 🎉</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 h-60 sm:h-64 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.from === 'user'
                        ? 'bg-[#0F62FE] text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2 bg-brand-50 border-t border-brand-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-semibold">Immediate Support:</span>
              <a href="tel:+919100348679" className="text-brand-700 font-bold hover:underline">
                +91-9100348679
              </a>
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-[#0F62FE] hover:bg-blue-700 text-white transition flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center gap-2">
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#071F3F] hover:bg-slate-800 text-white flex items-center justify-center shadow-lg transition"
              title="Scroll to Top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0F62FE] hover:bg-blue-700 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-200"
            aria-label="Toggle Live Chat"
          >
            {chatOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Bot className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Home;
