const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { userId: req.user.id },
        { userId: null }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  res.json({ success: true, count: notifications.length, data: notifications.map(n => ({ ...n, _id: n.id })) });
});

// @desc    Create a notification
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
  const notification = await prisma.notification.create({ data: req.body });
  res.status(201).json({ success: true, data: { ...notification, _id: notification.id } });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notificationExists = await prisma.notification.findUnique({ where: { id: req.params.id } });

  if (!notificationExists) {
    res.status(404);
    throw new Error('Notification not found');
  }

  // Ensure user owns notification or it's global
  if (notificationExists.userId && notificationExists.userId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this notification');
  }

  const notification = await prisma.notification.update({
    where: { id: req.params.id },
    data: { isRead: true }
  });

  res.json({ success: true, data: { ...notification, _id: notification.id } });
});

module.exports = { getNotifications, createNotification, markAsRead };
