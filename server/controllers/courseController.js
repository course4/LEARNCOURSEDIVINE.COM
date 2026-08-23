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
      limit = 12,
      featured,
      popular
    } = req.query;

    const query = { isPublished: true };

    // Search by title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
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
    const limitNum = parseInt(limit, 10) || 12;
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
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
const getCourseBySlug = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });

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
      .select('title slug thumbnail price discountPrice rating level duration');

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
    const course = await Course.findById(req.params.id);

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
// @access  Private/Admin
const createCourse = async (req, res, next) => {
  try {
    const { title, category } = req.body;
    let slug = req.body.slug ? slugify(req.body.slug) : slugify(title);

    // Check duplicate slug
    const existingSlug = await Course.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const course = await Course.create({
      ...req.body,
      slug
    });

    // Increment category count
    await Category.findOneAndUpdate(
      { name: category },
      { $inc: { courseCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course (Admin)
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (req.body.title && req.body.title !== course.title && !req.body.slug) {
      req.body.slug = slugify(req.body.title);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course (Admin)
// @route   DELETE /api/courses/:id
// @access  Private/Admin
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
      message: 'Course removed successfully'
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

module.exports = {
  getCourses,
  getCourseBySlug,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseReview
};
