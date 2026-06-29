const prisma = require('../config/prisma');
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

  // Nested create in Prisma for orderItems
  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      schoolId,
      totalAmount,
      shippingAddress: shippingAddress,
      orderItems: {
        create: products.map(p => ({
          productId: p.product,
          name: p.name,
          quantity: p.quantity,
          price: p.price
        }))
      }
    },
    include: {
      orderItems: true
    }
  });

  const formattedOrder = {
    ...order,
    _id: order.id,
    products: order.orderItems.map(item => ({
      product: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      _id: item.id
    }))
  };

  res.status(201).json({ success: true, data: formattedOrder });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  let query = {};
  
  if (req.user.role === 'PARENT' || req.user.role === 'STUDENT') {
    query.userId = req.user.id;
  } else if (req.user.role === 'SCHOOL_ADMIN') {
    query.schoolId = req.user.schoolId;
  }

  const orders = await prisma.order.findMany({
    where: query,
    include: {
      user: { select: { id: true, name: true, email: true } },
      school: { select: { id: true, name: true, code: true } },
      orderItems: true
    }
  });

  const formattedOrders = orders.map(order => ({
    ...order,
    _id: order.id,
    userId: order.user ? { _id: order.user.id, name: order.user.name, email: order.user.email } : null,
    schoolId: order.school ? { _id: order.school.id, name: order.school.name, code: order.school.code } : null,
    products: order.orderItems.map(item => ({
      product: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      _id: item.id
    }))
  }));

  res.json({ success: true, count: formattedOrders.length, data: formattedOrders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      school: { select: { id: true, name: true, code: true } },
      orderItems: true
    }
  });

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  
  if (req.user.role === 'PARENT' || req.user.role === 'STUDENT') {
    if (order.userId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
  }

  const formattedOrder = {
    ...order,
    _id: order.id,
    userId: order.user ? { _id: order.user.id, name: order.user.name, email: order.user.email } : null,
    schoolId: order.school ? { _id: order.school.id, name: order.school.name, code: order.school.code } : null,
    products: order.orderItems.map(item => ({
      product: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      _id: item.id
    }))
  };

  res.json({ success: true, data: formattedOrder });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const orderExists = await prisma.order.findUnique({ where: { id: req.params.id } });

  if (!orderExists) {
    res.status(404);
    throw new Error('Order not found');
  }

  const updatedOrder = await prisma.order.update({
    where: { id: req.params.id },
    data: { orderStatus }
  });

  res.json({ success: true, data: { ...updatedOrder, _id: updatedOrder.id } });
});

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
