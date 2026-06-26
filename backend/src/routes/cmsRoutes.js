const express = require('express');
const { getCMS, updateCMS } = require('../controllers/cmsController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .get(getCMS)
  .put(protect, restrictTo('SUPER_ADMIN', 'VBT_SUPER_ADMIN'), updateCMS);

module.exports = router;
