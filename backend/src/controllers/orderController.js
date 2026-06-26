const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { schoolId, products, totalAmount, shippingAddress } = req.body;

  if (products && products.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = new Order({
    userId: req.user._id,
    schoolId,
    products,
    totalAmount,
    shippingAddress,
  });

  const createdOrder = await order.save();
  res.status(201).json({ success: true, data: createdOrder });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  let query = {};
  
  // If not super admin, restrict view
  if (req.user.role === 'PARENT' || req.user.role === 'STUDENT') {
    query.userId = req.user._id;
  } else if (req.user.role === 'SCHOOL_ADMIN') {
    query.schoolId = req.user.schoolId;
  }

  const orders = await Order.find(query).populate('userId', 'name email').populate('schoolId', 'name code');
  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('userId', 'name email').populate('schoolId', 'name code');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  // Auth check
  if (req.user.role === 'PARENT' || req.user.role === 'STUDENT') {
    if (order.userId._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
  }

  res.json({ success: true, data: order });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.orderStatus = orderStatus;
  const updatedOrder = await order.save();

  res.json({ success: true, data: updatedOrder });
});

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
