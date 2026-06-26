const express = require('express');
const { getNotifications, createNotification, markAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getNotifications)
  .post(protect, restrictTo('SUPER_ADMIN', 'VBT_SUPER_ADMIN'), createNotification);

router.route('/:id/read')
  .put(protect, markAsRead);

module.exports = router;
