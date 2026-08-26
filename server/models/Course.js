const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, default: '15 mins' },
  isFreePreview: { type: Boolean, default: false },
  videoUrl: { type: String, default: '' }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  duration: { type: String, default: '2 hours' },
  topics: [topicSchema]
});

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  { timestamps: true }
);

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: 'Comprehensive masterclass and industry certification program with live interactive mentorship and practical labs.'
    },
    overview: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'Software & Web Development',
      trim: true
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
    },
    previewVideo: {
      type: String,
      default: ''
    },
    level: {
      type: String,
      default: 'Beginner to Advanced'
    },
    language: {
      type: String,
      default: 'English / Hindi'
    },
    duration: {
      type: String,
      default: '80 Hours (10 Weeks)'
    },
    totalLectures: {
      type: Number,
      default: 45
    },
    price: {
      type: Number,
      required: true,
      default: 499
    },
    discountPrice: {
      type: Number,
      default: 399
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 120
    },
    syllabusPdf: {
      type: String,
      default: ''
    },
    pdfFileName: {
      type: String,
      default: ''
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPopular: {
      type: Boolean,
      default: true
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    instructor: {
      name: { type: String, default: 'Course Divine Senior Mentor' },
      title: { type: String, default: 'Lead Industry Architect' },
      bio: { type: String, default: '10+ years of enterprise experience building scalable architectures.' },
      avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    },
    highlights: [{ type: String }],
    prerequisites: [{ type: String }],
    learningOutcomes: [{ type: String }],
    curriculum: [moduleSchema],
    faqs: [faqSchema],
    reviews: [reviewSchema],
    enrolledCount: {
      type: Number,
      default: 350
    },
    certificateAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, strict: false }
);

// Indexes for fast searching
courseSchema.index({ title: 'text', description: 'text', category: 'text' }, { default_language: 'none', language_override: 'none' });

module.exports = mongoose.model('Course', courseSchema);
