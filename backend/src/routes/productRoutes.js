const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
  .get(optionalProtect, getProducts)
  .post(protect, restrictTo('SUPER_ADMIN', 'VBT_SUPER_ADMIN', 'SCHOOL_ADMIN'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, restrictTo('SUPER_ADMIN', 'VBT_SUPER_ADMIN', 'SCHOOL_ADMIN'), updateProduct)
  .delete(protect, restrictTo('SUPER_ADMIN', 'VBT_SUPER_ADMIN', 'SCHOOL_ADMIN'), deleteProduct);

module.exports = router;
