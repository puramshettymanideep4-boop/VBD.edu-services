const User = require('../models/User');
const School = require('../models/School');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');

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
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  let schoolId = null;

  // Validate school code if provided
  if (schoolCode && role !== 'SUPER_ADMIN') {
    const school = await School.findOne({ code: schoolCode.toUpperCase() });
    if (!school) {
      res.status(400);
      throw new Error('Invalid school code');
    }
    schoolId = school._id;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'PARENT',
    schoolId,
    phone,
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        token: generateToken(user._id),
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

  const user = await User.findOne({ email }).select('+password').populate('schoolId');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password);

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
    
    // user.schoolId might be populated
    const userSchoolCode = user.schoolId ? user.schoolId.code : null;
    
    if (schoolCode.toUpperCase() !== userSchoolCode) {
      res.status(401);
      throw new Error('Invalid School Access Code for this account');
    }
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      school: user.schoolId,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('schoolId');

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
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
