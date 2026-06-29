const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, schoolCode, phone } = req.body;

  // Check if user exists
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  let schoolId = null;

  // Validate school code if provided
  if (schoolCode && role !== 'SUPER_ADMIN' && role !== 'VBT_SUPER_ADMIN') {
    const school = await prisma.school.findUnique({ where: { code: schoolCode.toUpperCase() } });
    if (!school) {
      res.status(400);
      throw new Error('Invalid school code');
    }
    schoolId = school.id;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'PARENT',
      schoolId,
      phone,
    },
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user.id, // Keeping _id for frontend compatibility
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        token: generateToken(user.id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, schoolCode } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { school: true },
  });

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Cross-check school code for non-super-admins
  if (user.role !== 'VBT_SUPER_ADMIN' && user.role !== 'SUPER_ADMIN') {
    if (!schoolCode) {
      res.status(400);
      throw new Error('School Access Code is required');
    }
    
    const userSchoolCode = user.school ? user.school.code : null;
    
    if (schoolCode.toUpperCase() !== userSchoolCode) {
      res.status(401);
      throw new Error('Invalid School Access Code for this account');
    }
  }

  res.json({
    success: true,
    data: {
      _id: user.id, // Keeping _id for frontend compatibility
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school: user.school,
      token: generateToken(user.id),
    },
  });
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      schoolId: true,
      phone: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      school: true,
    },
  });

  res.json({
    success: true,
    data: {
        ...user,
        _id: user.id
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (user) {
    const dataToUpdate = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
    };

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
    });

    res.json({
      success: true,
      data: {
        _id: updatedUser.id,
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser.id),
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
