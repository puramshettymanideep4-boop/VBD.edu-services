const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get CMS content
// @route   GET /api/cms
// @access  Public
const getCMS = asyncHandler(async (req, res) => {
  let cms = await prisma.cMS.findFirst();
  if (!cms) {
    cms = await prisma.cMS.create({
      data: {
        homepageTitle: 'VBD Education Services',
        homepageDescription: 'Premium Multi-School E-Commerce Portal',
      }
    });
  }
  res.json({ success: true, data: { ...cms, _id: cms.id } });
});

// @desc    Update CMS content
// @route   PUT /api/cms
// @access  Private/SuperAdmin
const updateCMS = asyncHandler(async (req, res) => {
  let cms = await prisma.cMS.findFirst();
  if (!cms) {
    cms = await prisma.cMS.create({ data: req.body });
  } else {
    cms = await prisma.cMS.update({
      where: { id: cms.id },
      data: req.body,
    });
  }
  res.json({ success: true, data: { ...cms, _id: cms.id } });
});

module.exports = { getCMS, updateCMS };
