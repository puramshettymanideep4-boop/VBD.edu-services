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
  const { name, email, password, role, phone } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'PARENT',
      phone,
      // schoolId intentionally omitted — linked at first login via school code
    },
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
//
// School code is validated dynamically against the School table — NO hardcoding.
// The selected school is returned as `selectedSchool` in the response.
// This allows ANY user to enter ANY active school portal simply by providing
// the correct school code — the user is NOT permanently locked to one school.
const login = asyncHandler(async (req, res) => {
  const { email: identifier, password, schoolCode } = req.body;
  const trimmedIdentifier = identifier ? identifier.trim() : '';

  // 1. Find user (check both email and name columns dynamically to support Username/Email login)
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: trimmedIdentifier, mode: 'insensitive' } },
        { name: { equals: trimmedIdentifier, mode: 'insensitive' } },
      ],
    },
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

  // 2. Super admins bypass school code requirement
  if (user.role === 'VBT_SUPER_ADMIN' || user.role === 'SUPER_ADMIN') {
    return res.json({
      success: true,
      data: {
        _id: user.id, id: user.id,
        name: user.name, email: user.email, role: user.role,
        schoolId: null,
        selectedSchool: null,
        token: generateToken(user.id),
      },
    });
  }

  // 3. All other roles require a school code
  if (!schoolCode || !schoolCode.trim()) {
    res.status(400);
    throw new Error('School Access Code is required');
  }

  // 4. Look up the school dynamically from the database — no hardcoding
  const school = await prisma.school.findUnique({
    where: { code: schoolCode.trim().toUpperCase() },
  });

  if (!school) {
    res.status(401);
    throw new Error('Invalid School Code. Please check and try again.');
  }

  // 5. Only allow access to ACTIVE schools
  if (school.status !== 'ACTIVE') {
    res.status(403);
    throw new Error('This school portal is inactive. Please contact your school administration.');
  }

  // 6. Return user + the dynamically selected school
  res.json({
    success: true,
    data: {
      _id: user.id, id: user.id,
      name: user.name, email: user.email, role: user.role,
      // selectedSchool is the school the user chose at login time.
      // It is NOT stored permanently on the user record — it is a session-time selection.
      selectedSchool: {
        id: school.id,
        name: school.name,
        code: school.code,
        logo: school.logo,
        status: school.status.toLowerCase(),
        announcement: school.announcement || null,
      },
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
      id: true, name: true, email: true, role: true,
      schoolId: true, phone: true, status: true,
      createdAt: true, updatedAt: true,
    },
  });

  // NOTE: selectedSchool is NOT returned here — it is stored in localStorage
  // on the frontend and restored from there on page refresh.
  res.json({
    success: true,
    data: { ...user, _id: user.id },
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
        _id: updatedUser.id, id: updatedUser.id,
        name: updatedUser.name, email: updatedUser.email, role: updatedUser.role,
        token: generateToken(updatedUser.id),
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { register, login, getMe, updateProfile };
