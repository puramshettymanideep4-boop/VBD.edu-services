const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all schools
// @route   GET /api/schools
// @access  Public (or specific roles)
const getSchools = asyncHandler(async (req, res) => {
  const schools = await prisma.school.findMany();
  res.json({ success: true, data: schools.map(s => ({ ...s, _id: s.id })) });
});

// @desc    Get single school
// @route   GET /api/schools/:id
// @access  Public
const getSchoolById = asyncHandler(async (req, res) => {
  const school = await prisma.school.findUnique({ where: { id: req.params.id } });
  if (!school) {
    res.status(404);
    throw new Error('School not found');
  }
  res.json({ success: true, data: { ...school, _id: school.id } });
});

// @desc    Create a school
// @route   POST /api/schools
// @access  Private/SuperAdmin
const createSchool = asyncHandler(async (req, res) => {
  const school = await prisma.school.create({ data: req.body });
  res.status(201).json({ success: true, data: { ...school, _id: school.id } });
});

// @desc    Update a school
// @route   PUT /api/schools/:id
// @access  Private/SuperAdmin
const updateSchool = asyncHandler(async (req, res) => {
  const schoolExists = await prisma.school.findUnique({ where: { id: req.params.id } });
  if (!schoolExists) {
    res.status(404);
    throw new Error('School not found');
  }
  
  const school = await prisma.school.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ success: true, data: { ...school, _id: school.id } });
});

// @desc    Delete a school
// @route   DELETE /api/schools/:id
// @access  Private/SuperAdmin
const deleteSchool = asyncHandler(async (req, res) => {
  const schoolExists = await prisma.school.findUnique({ where: { id: req.params.id } });
  if (!schoolExists) {
    res.status(404);
    throw new Error('School not found');
  }
  
  await prisma.school.delete({ where: { id: req.params.id } });
  res.json({ success: true, data: {} });
});

module.exports = { getSchools, getSchoolById, createSchool, updateSchool, deleteSchool };
