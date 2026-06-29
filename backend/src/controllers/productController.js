const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { schoolId, category, search } = req.query;
  const query = {};

  if (schoolId) query.schoolId = schoolId;
  if (category) query.category = category;
  if (search) query.name = { contains: search, mode: 'insensitive' };

  const products = await prisma.product.findMany({
    where: query,
    include: {
      school: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });
  
  // Add _id alias for frontend compatibility
  const formattedProducts = products.map(p => ({
    ...p,
    _id: p.id,
    schoolId: p.school ? { _id: p.school.id, name: p.school.name, code: p.school.code } : null
  }));

  res.json({ success: true, count: formattedProducts.length, data: formattedProducts });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      school: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const formattedProduct = {
    ...product,
    _id: product.id,
    schoolId: product.school ? { _id: product.school.id, name: product.school.name, code: product.school.code } : null
  };

  res.json({ success: true, data: formattedProduct });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json({ success: true, data: { ...product, _id: product.id } });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const productExists = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!productExists) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ success: true, data: { ...product, _id: product.id } });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const productExists = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!productExists) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: {} });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
