const CMS = require('../models/CMS');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get CMS content
// @route   GET /api/cms
// @access  Public
const getCMS = asyncHandler(async (req, res) => {
  let cms = await CMS.findOne();
  if (!cms) {
    cms = await CMS.create({
      homepageTitle: 'VBD Education Services',
      homepageDescription: 'Premium Multi-School E-Commerce Portal',
    });
  }
  res.json({ success: true, data: cms });
});

// @desc    Update CMS content
// @route   PUT /api/cms
// @access  Private/SuperAdmin
const updateCMS = asyncHandler(async (req, res) => {
  let cms = await CMS.findOne();
  if (!cms) {
    cms = await CMS.create(req.body);
  } else {
    cms = await CMS.findByIdAndUpdate(cms._id, req.body, {
      new: true,
      runValidators: true,
    });
  }
  res.json({ success: true, data: cms });
});

module.exports = { getCMS, updateCMS };
