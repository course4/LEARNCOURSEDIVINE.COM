const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.route('/')
  .get(getCourses)
  .post(createCourse);

router.post('/bulk', bulkCreateCourses);
router.delete('/clear-all', clearAllCourses);

router.get('/slug/:slug', getCourseBySlug);

router.route('/:id')
  .get(getCourseById)
  .put(updateCourse)
  .delete(deleteCourse);

router.patch('/:id/status', toggleCourseStatus);

router.post('/:id/reviews', protect, addCourseReview);

module.exports = router;


