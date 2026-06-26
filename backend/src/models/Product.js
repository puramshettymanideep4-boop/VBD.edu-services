const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'Please assign the product to a school'],
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Books', 'School Bags', 'Uniforms', 'Stationery', 'Educational Kits', 'Learning Materials', 'Other Educational Materials', 'Support'],
    },
    image: {
      type: String,
      default: 'book-open', // generic icon or file path
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add inventory stock'],
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
