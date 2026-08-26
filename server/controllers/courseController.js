const mongoose = require('mongoose');
const Course = require('../models/Course');
const Category = require('../models/Category');

// Helper to generate slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all courses with search, filtering, sorting, pagination
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 1000,
      featured,
      popular,
      all
    } = req.query;

    const query = all === 'true' ? {} : { isPublished: { $ne: false } };

    // Search by title, description, category, or subtitle
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { subtitle: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Level filter
    if (level && level !== 'All') {
      query.level = level;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.discountPrice = {};
      if (minPrice) query.discountPrice.$gte = Number(minPrice);
      if (maxPrice) query.discountPrice.$lte = Number(maxPrice);
    }

    // Featured / Popular filter
    if (featured === 'true') query.isFeatured = true;
    if (popular === 'true') query.isPopular = true;

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') sortOptions = { discountPrice: 1 };
    else if (sort === 'price-high') sortOptions = { discountPrice: -1 };
    else if (sort === 'popular') sortOptions = { enrolledCount: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 1000;
    const skip = (pageNum - 1) * limitNum;

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: courses,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by slug or ID
// @route   GET /api/courses/slug/:slug
// @access  Public
const getCourseBySlug = async (req, res, next) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.slug);
    const query = isObjectId
      ? { $or: [{ slug: req.params.slug }, { _id: req.params.slug }] }
      : { slug: req.params.slug };

    const course = await Course.findOne(query);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Fetch related courses in same category
    const relatedCourses = await Course.find({
      category: course.category,
      _id: { $ne: course._id },
      isPublished: true
    })
      .limit(3)
      .select('title slug thumbnail price discountPrice rating level duration category');

    res.json({
      success: true,
      data: course,
      relatedCourses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { _id: req.params.id } : { slug: req.params.id };
    const course = await Course.findOne(query);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course (Admin)
// @route   POST /api/courses
// @access  Public / Admin
const createCourse = async (req, res, next) => {
  try {
    const courseData = { ...req.body };
    
    // Clean temporary or non-ObjectId client strings
    if (courseData._id && (!mongoose.Types.ObjectId.isValid(courseData._id) || String(courseData._id).startsWith('c_'))) {
      delete courseData._id;
    }

    const { title, category } = courseData;
    let slug = courseData.slug ? slugify(courseData.slug) : slugify(title || 'course');

    // Auto-populate description and category if omitted
    courseData.description = (courseData.description && courseData.description.trim()) || courseData.overview || `Comprehensive masterclass and industry certification in ${title || 'Technology'} with live mentorship and practical labs.`;
    courseData.category = category || 'Software & Web Development';

    // Check duplicate slug and make unique
    const existingSlug = await Course.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    courseData.slug = slug;
    courseData.price = Number(courseData.price) || 499;
    courseData.discountPrice = Number(courseData.discountPrice) || courseData.price || 399;
    if (courseData.level === 'Beginner to Advanced') {
      // Keep compatible with both strict enum and relaxed schemas
      courseData.level = 'Beginner';
    }
    if (courseData.isPublished === undefined) {
      courseData.isPublished = true;
    }

    const course = await Course.create(courseData);

    // Increment or upsert category count
    if (category) {
      const catSlug = slugify(category);
      await Category.findOneAndUpdate(
        { name: category },
        { 
          $inc: { courseCount: 1 }, 
          $setOnInsert: { slug: catSlug, description: `${category} Courses & Certification`, icon: 'Code' } 
        },
        { upsert: true }
      ).catch(() => {});
    }

    res.status(201).json({
      success: true,
      message: 'Course created successfully and stored in MongoDB',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk Create Courses (Admin)
// @route   POST /api/courses/bulk
// @access  Public / Admin
const bulkCreateCourses = async (req, res, next) => {
  try {
    const { courses } = req.body;
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No courses array provided'
      });
    }

    const savedCourses = [];
    for (const c of courses) {
      if (!c.title) continue;
      const cData = { ...c };
      if (cData._id && (!mongoose.Types.ObjectId.isValid(cData._id) || String(cData._id).startsWith('c_'))) {
        delete cData._id;
      }
      let slug = cData.slug ? slugify(cData.slug) : slugify(cData.title);
      const existing = await Course.findOne({ slug });
      if (existing) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      cData.slug = slug;
      cData.price = Number(cData.price) || 499;
      cData.discountPrice = Number(cData.discountPrice) || (Number(cData.price) ? Math.round(Number(cData.price) * 0.8) : 399);
      if (cData.isPublished === undefined) cData.isPublished = true;

      const created = await Course.create(cData);
      savedCourses.push(created);

      if (cData.category) {
        await Category.findOneAndUpdate(
          { name: cData.category },
          { 
            $inc: { courseCount: 1 }, 
            $setOnInsert: { slug: slugify(cData.category), description: `${cData.category} Track`, icon: 'Code' } 
          },
          { upsert: true }
        ).catch(() => {});
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully imported ${savedCourses.length} courses into MongoDB`,
      data: savedCourses,
      count: savedCourses.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course (Admin)
// @route   PUT /api/courses/:id
// @access  Public / Admin
const updateCourse = async (req, res, next) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    let course = isObjectId 
      ? await Course.findById(req.params.id) 
      : await Course.findOne({ slug: req.params.id });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const updateData = { ...req.body };
    if (updateData._id && (!mongoose.Types.ObjectId.isValid(updateData._id) || String(updateData._id).startsWith('c_'))) {
      delete updateData._id;
    }

    if (updateData.title && updateData.title !== course.title && !updateData.slug) {
      updateData.slug = slugify(updateData.title);
    }

    const updated = await Course.findByIdAndUpdate(course._id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Course updated successfully in MongoDB',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course (Admin)
// @route   DELETE /api/courses/:id
// @access  Public / Admin
const deleteCourse = async (req, res, next) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId
      ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] }
      : { slug: req.params.id };

    const course = await Course.findOne(query);

    if (!course) {
      await Course.deleteOne({ slug: req.params.id }).catch(() => {});
      return res.json({
        success: true,
        message: 'Course removed successfully'
      });
    }

    const categoryName = course.category;
    await course.deleteOne();

    if (categoryName) {
      await Category.findOneAndUpdate(
        { name: categoryName },
        { $inc: { courseCount: -1 } }
      ).catch(() => {});
    }

    res.json({
      success: true,
      message: 'Course removed successfully from MongoDB'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all courses from database
// @route   DELETE /api/courses/clear-all
// @access  Public / Admin
const clearAllCourses = async (req, res, next) => {
  try {
    await Course.deleteMany({});
    await Category.updateMany({}, { courseCount: 0 });
    res.json({
      success: true,
      message: 'All courses cleared from MongoDB database'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a review to course
// @route   POST /api/courses/:id/reviews
// @access  Private
const addCourseReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      avatar: req.user.avatar || '',
      rating: Number(rating),
      comment
    };

    course.reviews.push(review);
    course.numReviews = course.reviews.length;
    course.rating =
      course.reviews.reduce((acc, item) => item.rating + acc, 0) /
      course.reviews.length;

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle course status (Active/Inactive) (Admin)
// @route   PATCH /api/courses/:id/status
// @access  Public / Admin
const toggleCourseStatus = async (req, res, next) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

    let course = await Course.findOne(query);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (req.body.isPublished !== undefined) {
      course.isPublished = Boolean(req.body.isPublished);
    } else {
      course.isPublished = !course.isPublished;
    }

    await course.save();

    res.json({
      success: true,
      message: `Course ${course.isPublished ? 'published & live' : 'unpublished & hidden'}`,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseBySlug,
  getCourseById,
  createCourse,
  bulkCreateCourses,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  clearAllCourses,
  addCourseReview
};

