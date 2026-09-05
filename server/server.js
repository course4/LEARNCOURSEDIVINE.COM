const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const placementRoutes = require('./routes/placementRoutes');
const blogRoutes = require('./routes/blogRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const referralRoutes = require('./routes/referralRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const adminRoutes = require('./routes/adminRoutes');
const initAdminCredentials = require('./config/initAdmin');

// Connect to Database & Sync Admin Credentials
connectDB().then(() => {
  initAdminCredentials();
});

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// URL Normalizer for Phusion Passenger on Bluehost (~/server)
app.use((req, res, next) => {
  if (req.url.startsWith('/server/api')) {
    req.url = req.url.replace('/server/api', '/api');
  } else if (req.url.startsWith('/server')) {
    req.url = req.url.replace('/server', '');
  }
  next();
});

// Universal Permissive CORS for cross-domain API calls
app.use(cors({
  origin: true,
  credentials: true
}));

// Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body Parsers (allow large high-res thumbnails and PDF syllabus)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global Rate Limiter (Public GET course requests are exempted to prevent mobile IP throttling)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'GET' && (req.path.includes('/courses')),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again in a few minutes.'
  }
});
app.use('/api', generalLimiter);

// Health Check API
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'online',
    platform: 'Course Divine API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/courses', '/courses'], courseRoutes);
app.use(['/api/categories', '/categories'], categoryRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/payments', '/payments'], paymentRoutes);
app.use(['/api/enrollments', '/enrollments'], enrollmentRoutes);
app.use(['/api/internships', '/internships'], internshipRoutes);
app.use(['/api/placements', '/placements'], placementRoutes);
app.use(['/api/blogs', '/blogs'], blogRoutes);
app.use(['/api/certificates', '/certificates'], certificateRoutes);
app.use(['/api/enquiries', '/enquiries'], enquiryRoutes);
app.use(['/api/referrals', '/referrals'], referralRoutes);
app.use(['/api/testimonials', '/testimonials'], testimonialRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Course Divine Production API Server running on port ${PORT}`);
    console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
