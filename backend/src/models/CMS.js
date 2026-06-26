const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema(
  {
    homepageTitle: { type: String, required: true },
    homepageDescription: { type: String, required: true },
    bannerImage: { type: String, default: 'default-banner.jpg' },
    aboutContent: { type: String },
    missionContent: { type: String },
    visionContent: { type: String },
    contactContent: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CMS', cmsSchema);
