const express = require('express');
const { getSchools, getSchoolById, createSchool, updateSchool, deleteSchool } = require('../controllers/schoolController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .get(getSchools)
  .post(protect, restrictTo('SUPER_ADMIN', 'VBT_SUPER_ADMIN'), createSchool);

router.route('/:id')
  .get(getSchoolById)
  .put(protect, restrictTo('SUPER_ADMIN', 'VBT_SUPER_ADMIN'), updateSchool)
  .delete(protect, restrictTo('SUPER_ADMIN', 'VBT_SUPER_ADMIN'), deleteSchool);

module.exports = router;
