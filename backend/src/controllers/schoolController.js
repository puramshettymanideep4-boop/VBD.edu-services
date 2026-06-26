const School = require('../models/School');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all schools
// @route   GET /api/schools
// @access  Public (or specific roles)
const getSchools = asyncHandler(async (req, res) => {
  const schools = await School.find({});
  res.json({ success: true, data: schools });
});

// @desc    Get single school
// @route   GET /api/schools/:id
// @access  Public
const getSchoolById = asyncHandler(async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school) {
    res.status(404);
    throw new Error('School not found');
  }
  res.json({ success: true, data: school });
});

// @desc    Create a school
// @route   POST /api/schools
// @access  Private/SuperAdmin
const createSchool = asyncHandler(async (req, res) => {
  const school = await School.create(req.body);
  res.status(201).json({ success: true, data: school });
});

// @desc    Update a school
// @route   PUT /api/schools/:id
// @access  Private/SuperAdmin
const updateSchool = asyncHandler(async (req, res) => {
  let school = await School.findById(req.params.id);
  if (!school) {
    res.status(404);
    throw new Error('School not found');
  }
  school = await School.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: school });
});

// @desc    Delete a school
// @route   DELETE /api/schools/:id
// @access  Private/SuperAdmin
const deleteSchool = asyncHandler(async (req, res) => {
  const school = await School.findById(req.params.id);
  if (!school) {
    res.status(404);
    throw new Error('School not found');
  }
  await school.deleteOne();
  res.json({ success: true, data: {} });
});

module.exports = { getSchools, getSchoolById, createSchool, updateSchool, deleteSchool };
