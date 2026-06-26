const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a school name'],
    },
    code: {
      type: String,
      required: [true, 'Please add a school access code'],
      unique: true,
      uppercase: true,
    },
    logo: {
      type: String,
      default: 'school', // icon identifier or image URL
    },
    address: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
    principalName: {
      type: String,
    },
    announcement: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'deactivated', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('School', schoolSchema);
